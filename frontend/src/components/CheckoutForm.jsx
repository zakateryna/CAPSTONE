import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

export default function CheckoutForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMsg("");

    const returnUrl = new URL(window.location.origin + "/cart");
    returnUrl.searchParams.set("paid", "1");
    if (orderId) returnUrl.searchParams.set("order", orderId);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl.toString(),
      },
    });

    if (error) {
      setMsg(error.message || "Payment not completed. Please try again.");
      setLoading(false);
      return;
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="ui-panel bg-white">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="ui-btn-primary disabled:opacity-60 disabled:pointer-events-none"
      >
        {loading ? "PROCESSING ▌" : "Confirm_Payment"}
      </button>

      {msg && (
        <div className="ui-panel ui-panel-warn">
          <p className="ui-label">{msg}</p>
        </div>
      )}

      <p className="text-xs md:text-sm opacity-70">
        No panic: if something fails, you won’t be charged.
      </p>
    </form>
  );
}