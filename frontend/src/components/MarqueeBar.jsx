export default function MarqueeBar({ text }) {
  return (
    <div className="mb-4 overflow-hidden border-4 border-[#5D172E] bg-[#FFD166] shadow-[4px_4px_0px_0px_#5D172E]">
      <div className="whitespace-nowrap animate-marquee py-2 text-[10px] font-bold uppercase text-[#5D172E]">
        <span className="mx-8">{text}</span>
        <span className="mx-8">{text}</span>
      </div>
    </div>
  );
}
