import { useState, useEffect, useMemo, useRef } from "react";
import { useCart } from "../context/cartContext";
import CheckoutPanel from "../components/CheckoutPanel";
import { useSearchParams, Link } from "react-router-dom";

export default function CartPage() {
  const { items, subtotal, removeItem, setQty, clear } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const isPaid = searchParams.get("paid") === "1";
  const orderId = searchParams.get("order");
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderMsg, setOrderMsg] = useState("");
  const subtotalCents = Math.round(subtotal * 100);
  const cleanupTimerRef = useRef(null);

  const banner = useMemo(() => {
    if (!isPaid) return null;

    if (!orderId) {
      return {
        kind: "warn",
        title: "Payment_Return",
        text: "Redirect received, but no order reference found. (Check return_url params.)",
      };
    }

    if (!orderStatus) {
      return {
        kind: "info",
        title: "Verifying_Order",
        text: "Checking order status…",
      };
    }

    if (orderStatus === "PAID") {
      return {
        kind: "ok",
        title: "Payment_Confirmed",
        text: "Transaction complete. Your order is registered in the system.",
      };
    }

    if (orderStatus === "PENDING") {
      return {
        kind: "warn",
        title: "Payment_Pending",
        text: "Payment not confirmed yet. If you completed 3DS/auth, refresh in a moment.",
      };
    }

    return {
      kind: "warn",
      title: `Payment_${orderStatus}`,
      text: orderMsg || "Payment not confirmed.",
    };
  }, [isPaid, orderId, orderStatus, orderMsg]);

  useEffect(() => {
    const controller = new AbortController();

    if (cleanupTimerRef.current) {
      window.clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }

    async function verify() {
      if (!isPaid || !orderId) return;

      setOrderMsg("");
      setOrderStatus(null);

      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data?.ok || !data?.order) {
          throw new Error(data?.message || "ORDER_FETCH_FAILED");
        }

        const status = data.order.status;
        setOrderStatus(status);

        if (status === "PAID") {
          clear();
          setShowCheckout(false);

          cleanupTimerRef.current = window.setTimeout(() => {
            const next = new URLSearchParams(searchParams);
            next.delete("paid");
            next.delete("order");
            setSearchParams(next, { replace: true });
            cleanupTimerRef.current = null;
          }, 2500);
        }
      } catch (e) {
        if (e?.name === "AbortError") return;

        setOrderStatus("PENDING");
        setOrderMsg(e?.message || "Unable to verify order. Try refresh.");
      }
    }

    verify();

    return () => {
      controller.abort();
      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
        cleanupTimerRef.current = null;
      }
    };
  }, [isPaid, orderId, clear, setSearchParams, searchParams]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {banner && (
        <div
          className={[
            "mb-4 ui-card p-4 text-[color:var(--color-primary)]",
            banner.kind === "ok"
              ? "bg-[#93D5B3]"
              : "bg-[color:var(--color-retro-yellow)]",
          ].join(" ")}
        >
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-base">
              {banner.kind === "ok" ? "verified" : "info"}
            </span>
            <div>
              <p className="ui-label">{banner.title}</p>
              <p className="ui-body opacity-80 mt-1">{banner.text}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-base md:text-lg font-bold uppercase tracking-wide flex items-center gap-2">
          <span className="material-symbols-outlined text-base">shopping_cart</span>
          Cart.sys
        </h1>

        <button type="button" onClick={clear} className="ui-btn">
          Clear_All
        </button>
      </div>

      {items.length === 0 ? (
        <div className="ui-card p-6 text-center">
          <p className="ui-label opacity-70">Cart_Empty</p>
          <p className="text-xs md:text-sm opacity-70 mt-2">
            Add something from the gallery.
          </p>

          <Link
            to="/"
            className="inline-block mt-4 ui-btn bg-[color:var(--color-retro-yellow)]"
          >
            Return_To_Archive.exe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div key={item.id} className="ui-card">
              <div className="ui-bar bg-[color:var(--color-retro-yellow)]">
                <div className="text-xs md:text-sm font-bold uppercase tracking-wide">
                  {item.productLabel} <span className="opacity-60">/</span>{" "}
                  {item.title}
                </div>

                <button type="button" onClick={() => removeItem(item.id)} className="ui-btn">
                  Remove
                </button>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-[120px_1fr_160px] gap-4 items-center">
                <div className="aspect-square border-4 border-[color:var(--color-primary)] bg-[#f8f8f8] overflow-hidden">
                  <img
                    src={item.mockupSrc || item.originalSrc}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="ui-label">Price</p>
                  <p className="text-sm md:text-base font-bold">
                    €{item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2 justify-start md:justify-end">
                  <button
                    type="button"
                    onClick={() => setQty(item.id, item.quantity - 1)}
                    className="ui-btn w-10 h-10 px-0 py-0 flex items-center justify-center text-base"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => setQty(item.id, Number(e.target.value))}
                    className="w-16 h-10 border-4 border-[color:var(--color-primary)] text-center font-bold text-base bg-white"
                    aria-label="Quantity"
                  />

                  <button
                    type="button"
                    onClick={() => setQty(item.id, item.quantity + 1)}
                    className="ui-btn w-10 h-10 px-0 py-0 flex items-center justify-center text-base"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t-4 border-[color:var(--color-primary)] p-3 flex justify-between text-xs md:text-sm font-bold uppercase tracking-wide">
                <span>Line_Total</span>
                <span>€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}

          <div className="ui-card p-4 flex justify-between items-center">
            <span className="text-sm md:text-base font-bold uppercase tracking-wide">
              Subtotal
            </span>
            <span className="text-base md:text-lg font-bold">
              €{subtotal.toFixed(2)}
            </span>
          </div>

          {!showCheckout && (
            <button
              type="button"
              onClick={() => setShowCheckout(true)}
              className="ui-btn-primary"
            >
              Checkout.exe
            </button>
          )}

          {showCheckout && subtotalCents < 50 && (
            <div className="ui-card p-4">
              <div className="ui-label">PAYMENT_GATE — Minimum not reached</div>
              <div className="mt-2 ui-body opacity-80 normal-case font-normal">
                Add a small item to continue. No charges will happen until you confirm.
              </div>
            </div>
          )}

          {showCheckout && subtotalCents >= 50 && (
            <CheckoutPanel amountCents={subtotalCents} items={items} />
          )}
        </div>
      )}
    </div>
  );
}