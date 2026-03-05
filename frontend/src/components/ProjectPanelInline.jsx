export default function ProjectPanelInline({ photo, onClose }) {
  return (
    <div className="ui-card-sm h-full flex flex-col">
      <div className={`ui-bar ${photo?.color || "bg-[color:var(--color-retro-yellow)]"}`}>
        <div className="flex items-center gap-2 font-bold">
          <span className="material-symbols-outlined text-base">
            confirmation_number
          </span>
          <h3 className="text-sm md:text-base font-bold uppercase tracking-wide">
            GoldenTicket_Project
          </h3>
        </div>

        <button type="button" onClick={onClose} className="ui-btn">
          Close
        </button>
      </div>

      <div className="p-4 ui-body space-y-3 text-[color:var(--color-primary)] flex-1">
        <p className="ui-label opacity-80">Project_Description</p>

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
          className="ui-chip inline-flex items-center justify-center"
        >
          Click_to_See
        </a>
      </div>
    </div>
  );
}