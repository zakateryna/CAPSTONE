// src/pages/CartPage.jsx
import { useState, useEffect } from "react";
import { useCart } from "../context/cartContext";
import CheckoutPanel from "../components/CheckoutPanel";
import { useSearchParams, Link } from "react-router-dom";

export default function CartPage() {
  const { items, subtotal, removeItem, setQty, clear } = useCart();

  const [searchParams, setSearchParams] = useSearchParams();
  const isPaid = searchParams.get("paid") === "1";

  const [showCheckout, setShowCheckout] = useState(false);

  const subtotalCents = Math.round(subtotal * 100);

  // ✅ se arrivi da Stripe con ?paid=1: mostri banner + svuoti carrello + pulisci query
  useEffect(() => {
    if (!isPaid) return;

    // 🔥 svuota carrello dopo pagamento confermato
    clear();
    // opzionale: richiudi il checkout panel
    setShowCheckout(false);

    // rimuove paid=1 dalla URL dopo un attimo, così non resta “incollato”
    const t = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      next.delete("paid");
      setSearchParams(next, { replace: true });
    }, 2500);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaid]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* ✅ PAYMENT CONFIRM BANNER */}
      {isPaid && (
        <div className="mb-4 border-4 border-[#5D172E] bg-[#93D5B3] text-[#5D172E] shadow-[6px_6px_0px_0px_#5D172E] p-4">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-sm">verified</span>
            <div>
              <p className="text-[10px] font-bold uppercase">
                Payment_Confirmed
              </p>
              <p className="text-[11px] opacity-80 mt-1">
                Transaction complete. Your order is now registered in the system.
              </p>
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
          <p className="text-[10px] opacity-70 mt-2">
            Add something from the gallery.
          </p>

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
                  {item.productLabel} <span className="opacity-60">/</span>{" "}
                  {item.title}
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

          {/* SUBTOTAL */}
          <div className="border-4 border-[#5D172E] bg-white shadow-[6px_6px_0px_0px_#5D172E] p-4 flex justify-between items-center">
            <span className="text-xs font-bold uppercase">Subtotal</span>
            <span className="text-sm font-bold">€{subtotal.toFixed(2)}</span>
          </div>

          {/* CHECKOUT BUTTON */}
          {!showCheckout && (
            <button
              type="button"
              onClick={() => setShowCheckout(true)}
              className="w-full bg-[#5D172E] text-[#FFD166] py-4 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            >
              Checkout.exe
            </button>
          )}

          {/* MINIMUM AMOUNT (rassicurante) */}
          {showCheckout && subtotalCents < 50 && (
            <div className="border-4 border-[#5D172E] bg-white shadow-[6px_6px_0px_0px_#5D172E] p-4 text-[10px] font-bold uppercase">
              PAYMENT_GATE — Minimum not reached
              <div className="mt-2 text-[11px] opacity-80 normal-case font-normal">
                Add a small item to continue. No charges will happen until you
                confirm.
              </div>
            </div>
          )}

          {/* STRIPE CHECKOUT PANEL */}
          {showCheckout && subtotalCents >= 50 && (
            <CheckoutPanel amountCents={subtotalCents} items={items} />
          )}
        </div>
      )}
    </div>
  );
}
