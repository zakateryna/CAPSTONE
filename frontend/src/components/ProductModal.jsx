import { useEffect, useMemo, useRef, useState } from "react";
import ModalShell from "./ModalShell";
import ProductPicker from "./ProductPicker";
import MockupPreview from "./MockupPreview";
import { useCart } from "../context/cartContext";

function getBaseFileName(path) {
  if (!path) return "";
  const file = path.split("/").pop() || "";
  return file.split(".")[0] || "";
}

function getProductKind(activeKey) {
  return {
    isNotebook: activeKey === "NOTEBOOK",
    isPoster: activeKey === "POSTER",
    isMug: activeKey === "MUG",
    isTote: activeKey === "TOTE",
  };
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPraiseMessage(kind) {
  const messages = {
    notebook: [
      `Questo notebook è un portale per idee.`,
      `Scelta perfetta per menti in movimento.`,
      `Qui dentro nasceranno cose serie.`,
      `Atmosfera creativa: attivata.`,
    ],
    poster: [
      `Quel muro non è pronto per questo livello.`,
      `Questo poster cambierà la stanza.`,
      `Minimal ma con carattere.`,
      `Arte che respira spazio.`,
    ],
    tote: [
      `Pronta per uscire con stile.`,
      `Questa tote racconta qualcosa.`,
      `Street energy caricata.`,
      `Funzionale ma con anima.`,
    ],
    mug: [
      `Perfetto per le mattine creative ☕`,
      `Questa mug merita un espresso serio.`,
      `Ideale per idee geniali.`,
      `Attenzione: aumenta la produttività.`,
    ],
  };

  if (kind.isNotebook) return randomFrom(messages.notebook);
  if (kind.isPoster) return randomFrom(messages.poster);
  if (kind.isTote) return randomFrom(messages.tote);
  if (kind.isMug) return randomFrom(messages.mug);

  return "Wow, hai un ottimo gusto!";
}

export default function ProductModal({ photo, products, onClose }) {
  const { addItem } = useCart();

  const [activeKey, setActiveKey] = useState(
    () => Object.keys(products || {})[0] ?? null
  );

  const [showMessage, setShowMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toastTimerRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    setActiveKey(Object.keys(products || {})[0] ?? null);
  }, [photo?.src, products]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const baseName = useMemo(() => {
    if (photo?.baseName) return photo.baseName;
    return getBaseFileName(photo?.src);
  }, [photo?.baseName, photo?.src]);

  const kind = useMemo(() => getProductKind(activeKey), [activeKey]);

  const activeProduct = useMemo(() => {
    if (!activeKey) return null;
    return products?.[activeKey] ?? null;
  }, [activeKey, products]);


  const mockupSrc = useMemo(() => {
    if (!baseName || !activeProduct) return null;
    return `/assets/images/mockups/${baseName}${activeProduct.suffix}`;
  }, [baseName, activeProduct]);

  if (!photo || !products || !activeProduct) return null;

  const handleAddToCart = () => {
    const variantPart = "std";
    const cartId = `${baseName}_${activeKey}_${variantPart}`;

    addItem({
      id: cartId,
      title: photo.title,
      originalSrc: photo.src,
      mockupSrc,
      productKey: activeKey,
      productLabel: activeProduct.label,
      price: activeProduct.priceCents / 100,
      variant: { size: null, option: null },
    });

    setToastMessage(getPraiseMessage(kind));
    setShowMessage(true);

    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setShowMessage(false);
      toastTimerRef.current = null;
    }, 2500);
  };

  return (
    <ModalShell title="Customize_Your_Favourite" onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MockupPreview
          title={photo.title}
          originalSrc={photo.src}
          mockupSrc={mockupSrc}
        />

        <div className="border-4 border-[#5D172E] bg-white shadow-[6px_6px_0px_0px_#5D172E] overflow-hidden">
          <div
            className={`${activeProduct.color} border-b-4 border-[#5D172E] p-3 flex justify-between items-center text-[#5D172E]`}
          >
            <div className="flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined">
                {activeProduct.icon}
              </span>
              <h2 className="text-xs uppercase">{activeProduct.label}</h2>
            </div>

            <span className="bg-[#5D172E] text-white px-2 py-0.5 text-[10px] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
              €{(activeProduct.priceCents / 100).toFixed(2)}
            </span>
          </div>

          <div className="p-4">
            <ProductPicker
              products={products}
              activeKey={activeKey}
              onPick={setActiveKey}
              baseName={baseName}
            />

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-4 font-bold uppercase transition-all flex items-center justify-center gap-2 bg-[#5D172E] text-[#FFD166] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
            >
              <span className="material-symbols-outlined text-sm">
                shopping_cart
              </span>
              Add_To_Cart
            </button>

            {showMessage && (
              <div className="mt-4 border-4 border-[#5D172E] bg-[#FFD166] text-[#5D172E] px-4 py-3 text-[11px] font-bold uppercase shadow-[4px_4px_0px_0px_#5D172E] animate-fadeIn">
                {toastMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}