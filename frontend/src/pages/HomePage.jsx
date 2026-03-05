import { Link } from "react-router-dom";
import { useMemo } from "react";
import ArchiveIntro from "../components/ArchiveIntro";

export default function HomePage({ photos }) {

  const availablePhotos = useMemo(
    () => photos.filter(p => p.mode !== "COMING_SOON"),
    [photos]
  );

  const previewPhotos = useMemo(() => {
    const shuffled = [...availablePhotos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [availablePhotos]);

  return (
    <main className="p-4 max-w-5xl mx-auto">

      {/* Window 1 — Identity */}
      <ArchiveIntro
        title="INDEX_BY_ZAKA"
      >
        <p className="text-lg md:text-xl font-bold uppercase opacity-80 tracking-wide">
          A living visual archive.
        </p>

        <p className="text-base md:text-lg mt-2">
          An evolving system of fragments.
        </p>

        <p className="text-base md:text-lg">
          Images shift between observation and object.
        </p>
      </ArchiveIntro>


      {/* Window 2 — Travel Manifesto */}
      <ArchiveIntro
        title="Travel_Manifesto"
        channel="Channel_01 — Travel"
      >
        <p className="text-xl md:text-2xl font-bold uppercase opacity-80 tracking-wide">
          Between capture and creation.
        </p>

        <p className="mt-4 text-base md:text-lg">
          A temporary archive dedicated to movement.
        </p>

        <p className="text-base md:text-lg">
          Real places filtered through perception.
        </p>

        <p className="mt-3 text-sm md:text-base uppercase tracking-wider opacity-70">
          Some untouched.
        </p>

        <p className="text-sm md:text-base uppercase tracking-wider opacity-70">
          Some reworked.
        </p>

        <p className="mt-4 text-base md:text-lg">
          Every image exists between geography and imagination.
        </p>
      </ArchiveIntro>


      {/* Window 3 — Preview */}
      <ArchiveIntro
        title="Archive_Preview"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {previewPhotos.map(photo => (
            <div
              key={photo.id}
              className="border-4 border-[#5D172E] overflow-hidden shadow-[4px_4px_0px_0px_#5D172E]"
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-40 object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Link
            to="/archive"
            className="inline-block border-4 border-[#5D172E] bg-white px-3 py-2 text-xs md:text-sm font-bold uppercase shadow-[3px_3px_0px_0px_#5D172E] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#5D172E] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#5D172E]"          >
            Explore_Full_Archive →
          </Link>
        </div>
      </ArchiveIntro>

    </main>
  );
}
