import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "retro_cart_v1";

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function loadInitialState() {
  if (typeof window === "undefined") return { items: [] };
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const data = raw ? safeParse(raw, { items: [] }) : { items: [] };

  if (!data || !Array.isArray(data.items)) return { items: [] };

  const items = data.items
    .filter((x) => x && typeof x.id === "string")
    .map((x) => ({
      ...x,
      quantity: Number.isFinite(x.quantity) ? x.quantity : 1,
      price: Number.isFinite(x.price) ? x.price : Number(x.price) || 0,
    }));

  return { items };
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const item = action.payload;
      const existing = state.items.find((x) => x.id === item.id);

      if (existing) {
        return {
          ...state,
          items: state.items.map((x) =>
            x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...item, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((x) => x.id !== action.payload) };

    case "SET_QTY": {
      const { id, quantity } = action.payload;
      const q = Number(quantity);

      if (!Number.isFinite(q) || q <= 0) {
        return { ...state, items: state.items.filter((x) => x.id !== id) };
      }

      return {
        ...state,
        items: state.items.map((x) => (x.id === id ? { ...x, quantity: q } : x)),
      };
    }

    case "CLEAR":
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
    } catch {
    }
  }, [state.items]);

  const addItem = useCallback((payload) => dispatch({ type: "ADD_ITEM", payload }), []);
  const removeItem = useCallback((id) => dispatch({ type: "REMOVE_ITEM", payload: id }), []);
  const setQty = useCallback((id, quantity) => dispatch({ type: "SET_QTY", payload: { id, quantity } }), []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const subtotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const count = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({
      items: state.items,
      count,
      subtotal,
      addItem,
      removeItem,
      setQty,
      clear,
    }),
    [state.items, count, subtotal, addItem, removeItem, setQty, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
