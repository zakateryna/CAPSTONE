import { useState } from "react";
import ModalShell from "./ModalShell";

export default function ArtworkModal({ photo, onClose }) {
  const [liked, setLiked] = useState(false);

  return (
    <ModalShell title="Gallery_View.mode" onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
        <div className="border-4 border-[#5D172E] bg-white shadow-[6px_6px_0px_0px_#5D172E] overflow-hidden">
          <div className="border-b-4 border-[#5D172E] p-3 bg-[#93D5B3] text-[#5D172E] flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined">image</span>
              <span className="text-sm uppercase tracking-tighter">Exhibit</span>
            </div>
          </div>

          <div className="p-4">
            <div className="relative aspect-square border-4 border-[#5D172E] bg-[#f8f8f8] overflow-hidden">
              <img
                src={photo?.src}
                alt={photo?.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <p className="mt-2 text-[10px] opacity-70">
              Showing: <span className="font-bold">{photo?.title}</span>
            </p>
          </div>
        </div>

        <div className="border-4 border-[#5D172E] bg-white shadow-[6px_6px_0px_0px_#5D172E] overflow-hidden">
          <div className={`${photo?.color || "bg-[#FFD166]"} border-b-4 border-[#5D172E] p-3 text-[#5D172E]`}>
            <h2 className="text-sm font-bold uppercase tracking-tighter">
              Monthly_Artwork
            </h2>
          </div>

          <div className="p-4 text-sm space-y-3 text-[#5D172E]">
            <p className="font-bold uppercase opacity-80">Hello, Palermo was a good trip.</p>

            <p>
              This slot is reserved for people I’ve met — fragments of the journey,
              moments that stayed.
            </p>

            <p>
              No commerce. No trade. No ownership.
              Only observation.
            </p>

      

            <div className="mt-4 border-4 border-[#5D172E] bg-[#F2E8DA] p-3 text-[10px] shadow-[3px_3px_0px_0px_#5D172E] flex items-center justify-between">
              <span className="font-bold uppercase">
                Leave_Your_Star
              </span>

              <button
                type="button"
                onClick={() => setLiked((v) => !v)}
                aria-pressed={liked}
                className="border-4 border-[#5D172E] px-2 py-1 bg-white shadow-[3px_3px_0px_0px_#5D172E] active:translate-y-0.5 active:shadow-none"
                title={liked ? "Star recorded" : "Leave a star"}
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${liked ? "text-[#FFD166]" : "text-[#5D172E]"
                    }`}
                >
                  star
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </ModalShell>
  );
}
