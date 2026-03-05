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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountCents, idempotencyKey]);

  const options = useMemo(() => ({ clientSecret }), [clientSecret]);

  return (
    <div className="ui-card-sm">
      <div className="ui-bar bg-[color:var(--color-retro-yellow)]">
        <div className="flex items-center gap-2 font-bold">
          <span className="material-symbols-outlined text-base">credit_card</span>
          <h3 className="ui-label">Checkout</h3>
        </div>

        <span className="text-xs md:text-sm font-bold uppercase tracking-wide opacity-80">
          Total €{(amountCents / 100).toFixed(2)}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="ui-panel ui-panel-soft text-xs md:text-sm">
          <p className="ui-label mb-1">Payment_Status</p>
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
          <div className="ui-panel ui-panel-warn text-xs md:text-sm">
            <div className="ui-label">{error}</div>
            <div className="mt-3">
              <button type="button" onClick={createOrderAndIntent} className="ui-btn">
                Retry
              </button>
            </div>
          </div>
        )}

        {status === "loading" && (
          <div className="ui-panel bg-white text-xs md:text-sm ui-label">
            Connecting_to_Stripe ▌
          </div>
        )}

        {status === "ready" && clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm orderId={orderId} />
          </Elements>
        )}

        <p className="text-xs md:text-sm opacity-70">
          Your card details are processed securely by Stripe.
        </p>
      </div>
    </div>
  );
}