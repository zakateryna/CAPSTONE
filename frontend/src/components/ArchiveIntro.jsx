export default function ArchiveIntro({ title, channel, children }) {
  return (
    <section className="mb-6">
      <div className="ui-card-sm">
        <div className="ui-bar bg-[color:var(--color-retro-yellow)]">
          <span className="ui-label text-sm md:text-base leading-none">
            {title}
          </span>

          {channel ? (
            <span className="ui-label opacity-80">
              {channel}
            </span>
          ) : null}
        </div>

        <div className="p-4 space-y-1 ui-body">{children}</div>
      </div>
    </section>
  );
}