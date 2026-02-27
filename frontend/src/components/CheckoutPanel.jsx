import { useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function makeIdempotencyKey(items) {
  const base = JSON.stringify({
    items: (items || []).map((i) => ({
      baseName: i?.baseName ?? null,
      productKey: i?.productKey ?? null,
      qty: i?.quantity ?? 1,
    })),
  });

  let hash = 0;
  for (let i = 0; i < base.length; i++) hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
  return `zaka_order_${hash}`;
}

function getBaseNameFromSrc(srcOrPath) {
  if (!srcOrPath || typeof srcOrPath !== "string") return "";
  const file = srcOrPath.split("/").pop() || "";
  return (file.split(".")[0] || "").trim();
}

export default function CheckoutPanel({ amountCents, items }) {
  const baseApi = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
  const api = (p) => (baseApi ? `${baseApi}${p}` : p);

  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [error, setError] = useState("");

  const idempotencyKey = useMemo(() => makeIdempotencyKey(items), [items]);

  const orderPayload = useMemo(() => {
    return {
      items: (items || []).map((it) => {
        const baseName =
          it?.baseName ||
          getBaseNameFromSrc(it?.originalSrc) ||
          getBaseNameFromSrc(it?.mockupSrc) ||
          (typeof it?.title === "string" ? it.title : "");

        return {
          baseName,
          productKey: it?.productKey,
          qty: Number(it?.quantity ?? 1),
          title: it?.title,
          mockupUrl: it?.mockupSrc || null,
        };
      }),
    };
  }, [items]);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const createOrderAndIntent = async () => {
    setStatus("loading");
    setError("");
    setClientSecret("");
    setOrderId("");

    try {
      if (!Array.isArray(orderPayload.items) || orderPayload.items.length === 0) {
        throw new Error("Carrello vuoto.");
      }

      // 1) CREATE ORDER
      const orderRes = await fetch(api("/api/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey, 
        },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json().catch(() => ({}));

      if (!orderRes.ok || !orderData?.ok || !orderData?.order?._id) {
        throw new Error(orderData?.message || "Impossibile creare l’ordine.");
      }

      const oid = orderData.order._id;

      // 2) CREATE PAYMENT INTENT FOR THAT ORDER
      const piRes = await fetch(api(`/api/orders/${oid}/payment-intent`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const piData = await piRes.json().catch(() => ({}));

      if (!piRes.ok || !piData?.ok || !piData?.clientSecret) {
        throw new Error(piData?.message || "Impossibile inizializzare il pagamento.");
      }

      if (!mountedRef.current) return;

      setOrderId(oid);
      setClientSecret(piData.clientSecret);
      setStatus("ready");
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e?.message || "Connessione instabile. Riprova.");
      setStatus("error");
    }
  };

  useEffect(() => {
    if (amountCents >= 50) createOrderAndIntent();
  }, [amountCents, idempotencyKey]);

  const options = useMemo(() => ({ clientSecret }), [clientSecret]);

  return (
    <div className="border-4 border-[#5D172E] bg-white shadow-[4px_4px_0px_0px_#5D172E] overflow-hidden">
      <div className="border-b-4 border-[#5D172E] p-3 bg-[#FFD166] flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold">
          <span className="material-symbols-outlined text-sm">credit_card</span>
          <h3 className="text-xs font-bold uppercase tracking-tighter">Checkout</h3>
        </div>

        <span className="text-[10px] font-bold uppercase opacity-80">
          Total €{(amountCents / 100).toFixed(2)}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="border-4 border-[#5D172E] bg-[#F2E8DA] p-3 text-[10px] shadow-[3px_3px_0px_0px_#5D172E]">
          <p className="font-bold uppercase mb-1">Payment_Status</p>
          {status === "loading" && <p>CREATING_ORDER_AND_SECURE_CHANNEL ▌</p>}
          {status === "ready" && orderId && (
            <p>
              READY — Order <span className="font-bold">#{orderId.slice(-6)}</span>
            </p>
          )}
          {status === "error" && <p>INTERRUPTED — No charge has been made.</p>}
          {status === "idle" && <p>STANDBY ▌</p>}
        </div>

        {status === "error" && (
          <div className="border-4 border-[#5D172E] bg-[#FFD166] p-3 text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#5D172E]">
            {error}
            <div className="mt-3">
              <button
                type="button"
                onClick={createOrderAndIntent}
                className="border-4 border-[#5D172E] bg-white px-3 py-2 text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#5D172E] active:translate-y-0.5 active:shadow-none"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {status === "loading" && (
          <div className="border-4 border-[#5D172E] bg-white p-4 text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#5D172E]">
            Connecting_to_Stripe ▌
          </div>
        )}

        {status === "ready" && clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm orderId={orderId} />
          </Elements>
        )}

        <p className="text-[10px] opacity-70">
          Your card details are processed securely by Stripe.
        </p>
      </div>
    </div>
  );
}