import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/cartContext";

function NavButton({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "border-4 border-[#5D172E] px-2 py-1 text-[10px] font-bold uppercase",
          "shadow-[3px_3px_0px_0px_#5D172E] transition-all",
          "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#5D172E]",
          "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#5D172E]",
          isActive
            ? "bg-[#5D172E] text-[#FFD166]"
            : "bg-white text-[#5D172E]",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function Header() {
  const { count } = useCart();

  return (
    <header className="p-4 border-b-4 border-[#5D172E] bg-[#FFD166] sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span style={{ fontSize: "50px" }}>☻</span>
          <span className="font-bold text-sm tracking-tighter uppercase">
            INDEX_BY_ZAKA
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 flex-wrap">
          <NavButton to="/">Home</NavButton>
          <NavButton to="/archive">Archive</NavButton>
          <NavButton to="/shop">Shop</NavButton>
          <NavButton to="/about">About</NavButton>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              [
                "border-4 border-[#5D172E] px-2 py-1 text-[10px] font-bold uppercase",
                "shadow-[3px_3px_0px_0px_#5D172E] transition-all flex items-center gap-2",
                "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#5D172E]",
                "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#5D172E]",
                isActive
                  ? "bg-[#5D172E] text-[#FFD166]"
                  : "bg-[#FFD166] text-[#5D172E]",
              ].join(" ")
            }
          >
            <span className="material-symbols-outlined text-sm">
              shopping_cart
            </span>
            Cart ({count})
          </NavLink>

        </nav>

      </div>
    </header>
  );
}
