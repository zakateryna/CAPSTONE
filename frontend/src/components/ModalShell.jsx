import { useEffect } from "react";

export default function ModalShell({ title, children, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div className="relative h-[100dvh] overflow-y-auto p-3 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="ui-window">
            <div className="ui-bar bg-[#FFD166]">
              <div className="flex items-center gap-2 font-bold text-[#5D172E]">
                <span className="material-symbols-outlined text-base">
                  terminal
                </span>
                <h2 className="ui-label">{title}</h2>
              </div>

              <button type="button" onClick={onClose} className="ui-btn">
                Close
              </button>
            </div>

            <div className="p-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}