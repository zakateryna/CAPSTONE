import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-[#5D172E] bg-[#FFD166] text-[#5D172E]">
      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] font-bold uppercase">

        {/* Column 1 — Archive Identity */}
        <div>
          <p className="mb-2">INDEX_BY_ZAKA</p>
    
          <p className="opacity-60 font-normal normal-case text-[10px] mt-2">
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
          
          <p className="normal-case font-normal">
            hello@indexbyzaka.it
          </p>
      
          <p className="opacity-60 text-[10px] normal-case font-normal mt-2">
            © {new Date().getFullYear()} INDEX BY ZAKA  
            All rights reserved.
          </p>
        </div>
      </div>

 <div className="border-t-4 border-[#5D172E] bg-[#5D172E] text-[#FFD166] text-[10px] font-bold px-4 py-2 tracking-widest">
  ARCHIVE.STATUS: ONLINE{" "}
  <span className="cursor-blink">▌</span>
</div>

    </footer>
  );
}
