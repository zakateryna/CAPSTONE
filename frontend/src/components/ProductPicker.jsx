export default function ProductPicker({
  products,
  activeKey,
  onPick,
  baseName, // lo teniamo anche se qui non serve (compatibilità)
  onSelectSize,
  onSelectVariant,
}) {
  const entries = Object.entries(products || {});
  if (!entries.length) return null;

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-2">
        {entries.map(([key, value]) => {
          const isActive = activeKey === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                onSelectSize?.(null);
                onSelectVariant?.(null);
                onPick(key);
              }}
              aria-pressed={isActive}
              className={[
                "flex items-center gap-2 p-2 border-4 transition-all duration-150",
                "font-bold uppercase tracking-wide text-xs md:text-sm",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--color-primary)]/30",
                "border-[color:var(--color-primary)]",
                isActive
                  ? `${value.color} translate-y-[1px] shadow-[0px_0px_0px_0px_var(--color-primary)]`
                  : "bg-white shadow-[3px_3px_0px_0px_var(--color-primary)]",
                !isActive
                  ? "hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_var(--color-primary)]"
                  : "",
                "active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_var(--color-primary)]",
              ].join(" ")}
            >
              <span className="material-symbols-outlined text-base md:text-lg">
                {value.icon}
              </span>

              <span className="leading-none">{value.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}