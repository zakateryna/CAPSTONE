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
          <div className="border-4 border-[#5D172E] bg-[#F2E8DA] shadow-[8px_8px_0px_0px_#5D172E] overflow-hidden">
            <div className="p-3 border-b-4 border-[#5D172E] bg-[#FFD166] flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[#5D172E]">
                <span className="material-symbols-outlined">terminal</span>
                <h2 className="text-xs uppercase">{title}</h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="border-4 border-[#5D172E] bg-white px-2 py-1 text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#5D172E] active:translate-y-0.5 active:shadow-none"
              >
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
