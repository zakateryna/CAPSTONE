import ProjectPanelInline from "./ProjectPanelInline";

export default function Gallery({
  photos = [],
  onSelectPhoto,
  projectPhoto,
  onCloseProject,
}) {
  return (
    <section
      id="gallery-section"
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo) => {
          const isComingSoon = photo.mode === "COMING_SOON";
          const isLink = photo.mode === "LINK";
          const isFeature = photo.mode === "FEATURE";
          const isActiveProject = projectPhoto?.id === photo.id;

          if (isComingSoon) console.log("[DISABLED CARD]", photo.title, photo.mode);

          return (
            <div key={photo.id} className="contents">
              <button
                type="button"
                onClick={() => {
                  console.log("[CLICK]", photo.title, photo.mode, "disabled:", isComingSoon);
                  onSelectPhoto?.(photo);
                }}
                disabled={isComingSoon}
                className={[
                  "text-left group border-4 border-[#5D172E] bg-white overflow-hidden",
                  "shadow-[4px_4px_0px_0px_#5D172E] transition-transform",
                  isComingSoon
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer hover:-translate-y-1",
                ].join(" ")}
              >
                <div
                  className={`${photo.color} border-b-4 border-[#5D172E] px-2 py-1 text-[8px] font-bold text-[#5D172E] uppercase flex items-center justify-between`}
                >
                  <span className="truncate">{photo.title}</span>

                  {isLink && (
                    <span className="material-symbols-outlined text-[12px]">
                      open_in_new
                    </span>
                  )}
                  {isFeature && (
                    <span className="material-symbols-outlined text-[12px]">
                      star
                    </span>
                  )}
                  {isComingSoon && (
                    <span className="material-symbols-outlined text-[12px]">
                      construction
                    </span>
                  )}
                </div>

                <div className="relative">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="block w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-300" loading="lazy"
                  />

                  {isComingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-4 border-[#5D172E] bg-[#FFD166] text-[#5D172E] px-3 py-2 text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#5D172E]">
                        In_Construction
                      </div>
                    </div>
                  )}
                </div>
              </button>

              {photo.mode === "LINK" && isActiveProject && (
                <div className="col-span-2 md:col-span-3">
                  <ProjectPanelInline photo={projectPhoto} onClose={onCloseProject} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}