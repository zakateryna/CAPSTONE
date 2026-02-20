export default function ArchiveIntro({ title, channel, children }) {
  return (
    <section className="mb-6">
      <div className="border-4 border-[#5D172E] bg-white shadow-[4px_4px_0px_0px_#5D172E] overflow-hidden">
        <div className="border-b-4 border-[#5D172E] p-3 bg-[#FFD166] flex items-center justify-between">
          <span className="text-sm
           font-bold uppercase tracking-tighter">
            {title}
          </span>

          <span className="text-[10px] font-bold uppercase opacity-80">
            {channel}
          </span>
        </div>

        <div className="p-4 text-sm
         space-y-1">{children}</div>
      </div>
    </section>
  );
}
