export default function ProductPicker({
  products,
  activeKey,
  onPick,
  baseName,
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
              className={[
                "flex items-center gap-2 p-2 border-4 border-[#5D172E]",
                "font-bold uppercase text-xs md:text-[10px]",
                "transition-all duration-150",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5D172E]/30",
                isActive
                  ? `${value.color} shadow-[0px_0px_0px_0px_#5D172E] translate-y-[1px]`
                  : "bg-white shadow-[3px_3px_0px_0px_#5D172E]",
                !isActive ? "hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_#5D172E]" : "",
                "active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#5D172E]",
              ].join(" ")}
              aria-pressed={isActive}
            >
              <span className="material-symbols-outlined text-sm">
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
