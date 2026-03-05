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
      `Every page extends the archive.`,
      `Where ideas refuse to stay still.`,
      `This is where things begin to take shape.`,
      `Document the process, not just the outcome.`,
    ],
    poster: [
      `This wall is about to change identity.`,
      `An image that reshapes the room.`,
      `It doesn’t decorate. It defines.`,
      `The archive now lives on your wall.`,
    ],
    tote: [
      `Carry a fragment of the archive.`,
      `Every step becomes part of the narrative.`,
      `Everyday object, visual presence.`,
      `Movement, with memory.`,
    ],
    mug: [
      `A daily ritual, redefined.`,
      `Where mornings begin with intention.`,
      `The image enters your routine.`,
      `Small object, strong presence.`,
    ],
  };

  if (kind.isNotebook) return randomFrom(messages.notebook);
  if (kind.isPoster) return randomFrom(messages.poster);
  if (kind.isTote) return randomFrom(messages.tote);
  if (kind.isMug) return randomFrom(messages.mug);

  return "Impeccable taste.";
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

        <div className="ui-card flex flex-col">
          <div className={`ui-bar ${activeProduct.color}`}>
            <div className="flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-base">
                {activeProduct.icon}
              </span>
              <h2 className="ui-label">{activeProduct.label}</h2>
            </div>

            <span className="ui-price">
              €{(activeProduct.priceCents / 100).toFixed(2)}
            </span>
          </div>

          <div className="p-4 flex-1">
            <ProductPicker
              products={products}
              activeKey={activeKey}
              onPick={setActiveKey}
              baseName={baseName}
            />

            <button
              type="button"
              onClick={handleAddToCart}
              className="ui-btn-primary"
            >
              <span className="material-symbols-outlined text-base">
                shopping_cart
              </span>
              <span>Add_To_Cart</span>
            </button>

            {showMessage && (
              <div className="mt-4 ui-panel ui-panel-warn">
                <p className="ui-label">{toastMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}