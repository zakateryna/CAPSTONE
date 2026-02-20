export default function ProjectPanelInline({ photo, onClose }) {
  return (
    <div className="border-4 border-[#5D172E] bg-white shadow-[4px_4px_0px_0px_#5D172E] overflow-hidden h-full">
      <div
        className={`${photo?.color || "bg-[#FFD166]"} border-b-4 border-[#5D172E] p-3 flex items-center justify-between`}
      >
        <div className="flex items-center gap-2 font-bold">
          <span className="material-symbols-outlined text-sm">confirmation_number</span>
          <h3 className="text-xs font-bold uppercase tracking-tighter">
            GoldenTicket_Project
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="border-4 border-[#5D172E] bg-white px-2 py-1 text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#5D172E] active:translate-y-0.5 active:shadow-none"
        >
          Close
        </button>
      </div>

      <div className="p-4 text-xs space-y-3 text-[#5D172E]">
        <p className="font-bold uppercase opacity-80">Project_Description</p>

        <p className="whitespace-pre-line">
          {`GoldenTicket is a research node about value.

The digital has changed how we perceive objects:
what is “material”, what is “immaterial”,
and what becomes collectible.

Here the artwork can extend beyond the surface —
toward systems, access, provenance,
and future tokenized forms (a real project in progress).`}
        </p>

        <p className="opacity-80">
          Open the external page to explore the full project.
        </p>

        <a
          href={photo?.href || "https://behance.net"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border-4 border-[#5D172E] bg-[#FFD166] px-4 py-3 text-[10px] font-bold uppercase shadow-[4px_4px_0px_0px_#5D172E] hover:-translate-y-0.5 transition-transform active:translate-y-0.5 active:shadow-none"
        >
          Click to see
        </a>

      
      </div>
    </div>
  );
}
