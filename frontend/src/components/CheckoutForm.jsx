import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMsg("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/cart?paid=1",
      },
    });

    if (error) {
      setMsg(error.message || "Pagamento non completato. Riprova.");
      setLoading(false);
      return;
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="border-4 border-[#5D172E] bg-white p-3 shadow-[3px_3px_0px_0px_#5D172E]">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full border-4 border-[#5D172E] bg-[#5D172E] text-[#FFD166] px-4 py-3 text-[10px] font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none disabled:opacity-60"
      >
        {loading ? "PROCESSING ▌" : "Confirm_Payment"}
      </button>

      {msg && (
        <div className="border-4 border-[#5D172E] bg-[#FFD166] p-3 text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#5D172E]">
          {msg}
        </div>
      )}

      <p className="text-[10px] opacity-70">
        No panic: if something fails, you won’t be charged.
      </p>
    </form>
  );
}
