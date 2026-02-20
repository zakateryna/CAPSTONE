import { useState } from "react";

export default function MockupPreview({ title, originalSrc, mockupSrc }) {
  
  const [mode, setMode] = useState("mockup"); 
  const srcToShow = mode === "mockup" ? mockupSrc : originalSrc;

  return (
    <div className="border-4 border-[#5D172E] bg-white shadow-[6px_6px_0px_0px_#5D172E] overflow-hidden">
      <div className="border-b-4 border-[#5D172E] p-3 bg-[#93D5B3] text-[#5D172E] flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold">
          <span className="material-symbols-outlined">image</span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("mockup")}
            className={`border-4 border-[#5D172E] px-2 py-1 text-[10px] font-bold uppercase ${
              mode === "mockup" ? "bg-[#FFD166]" : "bg-white"
            } shadow-[3px_3px_0px_0px_#5D172E] active:translate-y-0.5 active:shadow-none`}
          >
            Mockup
          </button>

          <button
            type="button"
            onClick={() => setMode("original")}
            className={`border-4 border-[#5D172E] px-2 py-1 text-[10px] font-bold uppercase ${
              mode === "original" ? "bg-[#FFD166]" : "bg-white"
            } shadow-[3px_3px_0px_0px_#5D172E] active:translate-y-0.5 active:shadow-none`}
          >
            Original
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="relative aspect-square border-4 border-[#5D172E] bg-[#f8f8f8] flex items-center justify-center overflow-hidden">
          {srcToShow ? (
            <img
              src={srcToShow}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/800?text=Mockup+Missing";
              }}
            />
          ) : (
            <div className="text-center opacity-20">
              <span className="material-symbols-outlined text-4xl">image_search</span>
              <p className="text-[10px] font-bold uppercase mt-2">Missing_Source</p>
            </div>
          )}

          <div className="absolute inset-0 z-30 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>

       <p className="mt-2 text-[10px] opacity-70">
  Showing: <span className="font-bold">{title}</span>
</p>

      </div>
    </div>
  );
}
