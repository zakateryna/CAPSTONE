import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function makeIdempotencyKey(amountCents, items) {
  const base = JSON.stringify({ amountCents, items: items?.map(i => i.id) || [] });
  let hash = 0;
  for (let i = 0; i < base.length; i++) hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
  return `zaka_${hash}`;
}

export default function CheckoutPanel({ amountCents, items }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [clientSecret, setClientSecret] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [error, setError] = useState("");

  const idempotencyKey = useMemo(
    () => makeIdempotencyKey(amountCents, items),
    [amountCents, items]
  );

  const payload = useMemo(() => {
    return {
      amount: amountCents,
      currency: "eur",
      idempotencyKey,
      items: (items || []).map((it) => ({
        id: it.id,
        label: it.productLabel,
        qty: it.quantity,
        price: it.price,
      })),
    };
  }, [amountCents, idempotencyKey, items]);

  const createIntent = async () => {
    setStatus("loading");
    setError("");
    setClientSecret("");

    try {
      const res = await fetch(`${apiUrl}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Impossibile inizializzare il pagamento.");
      }

      setClientSecret(data.clientSecret);
      setStatus("ready");
    } catch (e) {
      setError(e?.message || "Connessione instabile. Riprova.");
      setStatus("error");
    }
  };

  useEffect(() => {
    if (amountCents >= 50) createIntent();
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
          {status === "loading" && <p>INITIALISING_SECURE_CHANNEL ▌</p>}
          {status === "ready" && <p>READY — Insert details below.</p>}
          {status === "error" && <p>INTERRUPTED — No charge has been made.</p>}
          {status === "idle" && <p>STANDBY ▌</p>}
        </div>

        {status === "error" && (
          <div className="border-4 border-[#5D172E] bg-[#FFD166] p-3 text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#5D172E]">
            {error}
            <div className="mt-3">
              <button
                type="button"
                onClick={createIntent}
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
            <CheckoutForm />
          </Elements>
        )}

        <p className="text-[10px] opacity-70">
          Your card details are processed securely by Stripe.
        </p>
      </div>
    </div>
  );
}
