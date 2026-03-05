import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/cartContext";

function NavButton({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [ "ui-navbtn", isActive ? "ui-navbtn-active" : "" ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function Header() {
  const { count } = useCart();

  return (
    <header className="p-4 border-b-4 border-[color:var(--color-primary)] bg-[#FFD166] sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span style={{ fontSize: "50px" }}>☻</span>
          <span className="font-bold text-lg md:text-xl tracking-wide uppercase">
            INDEX_BY_ZAKA
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 flex-wrap">
          <NavButton to="/">Home</NavButton>
          <NavButton to="/archive">Archive</NavButton>
          <NavButton to="/shop">Shop</NavButton>
          <NavButton to="/about">About</NavButton>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              [
                "ui-navbtn flex items-center gap-2",
                isActive ? "ui-navbtn-active" : "bg-[#FFD166] text-[color:var(--color-primary)]",
              ].join(" ")
            }
          >
            <span className="material-symbols-outlined text-base">
              shopping_cart
            </span>
            Cart ({count})
          </NavLink>
        </nav>
      </div>
    </header>
  );
}