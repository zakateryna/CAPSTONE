import { useMemo, useState } from "react";

export default function MockupPreview({ title, originalSrc, mockupSrc }) {
  const [mode, setMode] = useState("mockup");
  const [imgError, setImgError] = useState(false);

  const srcToShow = useMemo(() => {
    return mode === "mockup" ? mockupSrc : originalSrc;
  }, [mode, mockupSrc, originalSrc]);

  const ToggleBtn = ({ isActive, children, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={[
        "ui-btn px-2 py-1",
        isActive ? "bg-[color:var(--color-retro-yellow)]" : "bg-white",
      ].join(" ")}
    >
      {children}
    </button>
  );

  const showFallback = !srcToShow || imgError;

  return (
    <div className="ui-card">
      <div className="ui-bar bg-[#93D5B3]">
        <div className="flex items-center gap-2 font-bold">
          <span className="material-symbols-outlined text-base">image</span>
          <span className="ui-label">Preview</span>
        </div>

        <div className="flex gap-2">
          <ToggleBtn
            isActive={mode === "mockup"}
            onClick={() => {
              setMode("mockup");
              setImgError(false);
            }}
          >
            Mockup
          </ToggleBtn>

          <ToggleBtn
            isActive={mode === "original"}
            onClick={() => {
              setMode("original");
              setImgError(false);
            }}
          >
            Original
          </ToggleBtn>
        </div>
      </div>

      <div className="p-4">
        <div className="relative aspect-square border-4 border-[color:var(--color-primary)] bg-[#f8f8f8] flex items-center justify-center overflow-hidden">
          {!showFallback && (
            <img
              src={srcToShow}
              alt={title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          )}

          {showFallback && (
            <div className="text-center opacity-30">
              <span className="material-symbols-outlined text-4xl">image_search</span>
              <p className="ui-label mt-2">Missing_Source</p>
            </div>
          )}

          <div className="absolute inset-0 z-30 opacity-[0.06] pointer-events-none bg-[linear-gradient(0deg,rgba(0,0,0,0.15)_1px,transparent_1px)] [background-size:4px_4px]" />
        </div>

        <p className="mt-2 text-xs md:text-sm opacity-70">
          Showing: <span className="font-bold">{title}</span>
        </p>
      </div>
    </div>
  );
}