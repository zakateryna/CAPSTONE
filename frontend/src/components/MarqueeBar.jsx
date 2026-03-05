export default function MarqueeBar({ text }) {
  return (
    <div className="mb-4 overflow-hidden ui-card-sm bg-[color:var(--color-retro-yellow)]">
      <div className="whitespace-nowrap animate-marquee py-2 ui-label text-[color:var(--color-primary)]">
        <span className="mx-8">{text}</span>
        <span className="mx-8">{text}</span>
      </div>
    </div>
  );
}