import InfoGridTop from "../components/InfoGridTop";
import InfoGridBottom from "../components/InfoGridBottom";
import ArchiveIntro from "../components/ArchiveIntro";
import { asset } from "../lib/api";

export default function AboutPage({ photos = [] }) {
  const palermo = photos.find(
    (p) =>
      p.file === "palermo.png" ||
      p.title === "palermo.png" ||
      p.title === "palermo"
  );

  const golden = photos.find(
    (p) =>
      p.file === "goldenticket.png" ||
      p.title === "goldenticket.png" ||
      p.title === "goldenticket"
  );

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <ArchiveIntro title="INDEX_BY_ZAKA">
        <p className="text-xl md:text-2xl font-bold uppercase opacity-80 tracking-wide">
          A living visual archive.
        </p>

        <p className="mt-4 text-base md:text-lg">
          An evolving system of fragments.
        </p>

        <p className="text-base md:text-lg">
          Images shift between observation and object.
        </p>
      </ArchiveIntro>

      <InfoGridTop />

      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Palermo */}
        {palermo && (
          <div className="border-4 border-[#5D172E] bg-white shadow-[4px_4px_0px_0px_#5D172E] overflow-hidden">
            <div className="border-b-4 border-[#5D172E] p-3 bg-[#FFD166] flex items-center justify-between">
              <span className="text-sm md:text-base font-bold uppercase tracking-wide">
                Monthly Dedication
              </span>
              <span className="text-xs md:text-sm font-bold uppercase opacity-80 tracking-wide">
                PALERMO
              </span>
            </div>

            <img
              src={asset(palermo.src)}
              alt={palermo.title}
              className="block w-full h-64 object-cover"
              loading="lazy"
            />

            <div className="p-4 text-sm md:text-base space-y-2">
              <p className="font-bold uppercase opacity-80 tracking-wide">
                {palermo.note || "Featured Fragment"}
              </p>
              <p>Selected piece — exhibited inside the archive system.</p>
            </div>
          </div>
        )}

        {/* Golden Ticket */}
        {golden && (
          <div className="border-4 border-[#5D172E] bg-white shadow-[4px_4px_0px_0px_#5D172E] overflow-hidden">
            <div className="border-b-4 border-[#5D172E] p-3 bg-[#FF8E72] flex items-center justify-between">
              <span className="text-sm md:text-base font-bold uppercase tracking-wide">
                Golden Ticket
              </span>
            </div>

            <img
              src={asset(golden.src)}
              alt={golden.title}
              className="block w-full h-64 object-cover"
              loading="lazy"
            />

            <div className="p-4 text-sm md:text-base space-y-2">
              <p className="font-bold uppercase opacity-80 tracking-wide">
                External Node
              </p>
              <p className="opacity-80">
                Opens a destination outside the archive environment.
              </p>

              {golden.href && (
                <a
                  href={golden.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 border-4 border-[#5D172E] bg-white px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-wide shadow-[3px_3px_0px_0px_#5D172E] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#5D172E] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#5D172E]"
                >
                  Open Link →
                </a>
              )}
            </div>
          </div>
        )}
      </section>

      <InfoGridBottom />
    </main>
  );
}