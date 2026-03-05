import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-[color:var(--color-primary)] bg-[#FFD166] text-[color:var(--color-primary)]">
      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm md:text-base font-bold uppercase tracking-wide">
        {/* Column 1 — Archive Identity */}
        <div>
          <p className="mb-2">INDEX_BY_ZAKA</p>

          <p className="opacity-60 font-normal normal-case text-xs md:text-sm mt-2">
            Between capture and creation.
          </p>
        </div>

        {/* Column 2 — Navigation */}
        <div className="space-y-2">
          <Link to="/about" className="block hover:underline">
            About
          </Link>
          <Link to="/archive" className="block hover:underline">
            Archive
          </Link>
          <Link to="/shop" className="block hover:underline">
            Shop
          </Link>
          <Link to="/terms" className="block hover:underline">
            Terms_And_Conditions
          </Link>
          <Link to="/privacy" className="block hover:underline">
            Privacy_Policy
          </Link>
        </div>

        {/* Column 3 — Contact Node */}
        <div className="space-y-2">
          <p className="normal-case font-normal text-sm md:text-base">
            hello@indexbyzaka.it
          </p>

          <p className="opacity-60 text-xs md:text-sm normal-case font-normal mt-2">
            © {new Date().getFullYear()} INDEX_BY_ZAKA All rights reserved.
          </p>
        </div>
      </div>

      {/* admin link */}
      <div className="max-w-5xl mx-auto px-6 pb-4">
        <div className="ui-panel flex items-center justify-between px-3 py-2">
          <span className="text-[10px] md:text-[11px] opacity-70 uppercase tracking-widest">
            Orders_System
          </span>

          <Link
            to="/admin/orders"
            className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:underline transition"
            title="Orders admin"
          >
            Admin.console
          </Link>
        </div>
      </div>

      <div className="border-t-4 border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-[#FFD166] text-xs md:text-sm font-bold px-4 py-2 tracking-widest uppercase">
        ARCHIVE.STATUS: ONLINE <span className="cursor-blink">▌</span>
      </div>
    </footer>
  );
}