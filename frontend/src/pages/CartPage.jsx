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
        const res = await fetch(`/api/orders/${orderId}`, { signal: controller.signal });
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
            "mb-4 border-4 border-[#5D172E] text-[#5D172E] shadow-[6px_6px_0px_0px_#5D172E] p-4",
            banner.kind === "ok" ? "bg-[#93D5B3]" : "bg-[#FFD166]",
          ].join(" ")}
        >
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-sm">
              {banner.kind === "ok" ? "verified" : "info"}
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase">{banner.title}</p>
              <p className="text-[11px] opacity-80 mt-1">{banner.text}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-sm font-bold uppercase tracking-tighter flex items-center gap-2">
          <span className="material-symbols-outlined">shopping_cart</span>
          Cart.sys
        </h1>

        <button
          type="button"
          onClick={clear}
          className="border-4 border-[#5D172E] bg-white px-2 py-1 text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#5D172E] active:translate-y-0.5 active:shadow-none"
        >
          Clear_All
        </button>
      </div>

      {items.length === 0 ? (
        <div className="border-4 border-[#5D172E] bg-white shadow-[6px_6px_0px_0px_#5D172E] p-6 text-center">
          <p className="text-xs font-bold uppercase opacity-70">Cart_Empty</p>
          <p className="text-[10px] opacity-70 mt-2">Add something from the gallery.</p>

          <Link
            to="/"
            className="inline-block mt-4 border-4 border-[#5D172E] bg-[#FFD166] px-4 py-2 text-[10px] font-bold uppercase shadow-[4px_4px_0px_0px_#5D172E] active:translate-y-0.5 active:shadow-none"
          >
            Return_To_Archive.exe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border-4 border-[#5D172E] bg-white shadow-[6px_6px_0px_0px_#5D172E] overflow-hidden"
            >
              <div className="border-b-4 border-[#5D172E] p-3 bg-[#FFD166] flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase">
                  {item.productLabel} <span className="opacity-60">/</span> {item.title}
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="border-4 border-[#5D172E] bg-white px-2 py-1 text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#5D172E] active:translate-y-0.5 active:shadow-none"
                >
                  Remove
                </button>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-[120px_1fr_160px] gap-4 items-center">
                <div className="aspect-square border-4 border-[#5D172E] bg-[#f8f8f8] overflow-hidden">
                  <img
                    src={item.mockupSrc || item.originalSrc}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold">Price</p>
                  <p className="text-xs font-bold">€{item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2 justify-start md:justify-end">
                  <button
                    type="button"
                    onClick={() => setQty(item.id, item.quantity - 1)}
                    className="w-10 h-10 border-4 border-[#5D172E] bg-white shadow-[3px_3px_0px_0px_#5D172E] active:translate-y-0.5 active:shadow-none font-bold"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => setQty(item.id, Number(e.target.value))}
                    className="w-16 h-10 border-4 border-[#5D172E] text-center font-bold"
                    aria-label="Quantity"
                  />

                  <button
                    type="button"
                    onClick={() => setQty(item.id, item.quantity + 1)}
                    className="w-10 h-10 border-4 border-[#5D172E] bg-white shadow-[3px_3px_0px_0px_#5D172E] active:translate-y-0.5 active:shadow-none font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t-4 border-[#5D172E] p-3 flex justify-between text-[10px] font-bold uppercase">
                <span>Line_Total</span>
                <span>€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}

          <div className="border-4 border-[#5D172E] bg-white shadow-[6px_6px_0px_0px_#5D172E] p-4 flex justify-between items-center">
            <span className="text-xs font-bold uppercase">Subtotal</span>
            <span className="text-sm font-bold">€{subtotal.toFixed(2)}</span>
          </div>

          {!showCheckout && (
            <button
              type="button"
              onClick={() => setShowCheckout(true)}
              className="w-full bg-[#5D172E] text-[#FFD166] py-4 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            >
              Checkout.exe
            </button>
          )}

          {showCheckout && subtotalCents < 50 && (
            <div className="border-4 border-[#5D172E] bg-white shadow-[6px_6px_0px_0px_#5D172E] p-4 text-[10px] font-bold uppercase">
              PAYMENT_GATE — Minimum not reached
              <div className="mt-2 text-[11px] opacity-80 normal-case font-normal">
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