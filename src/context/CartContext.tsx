"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { MAX_QTY } from "@/lib/checkout";

export interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
  /** Photo of the picked option (older carts saved before this field have none -> grey box). */
  image?: string;
}

// The option line under the name, or nothing when it only repeats the name
// ("Móc khoá 03: Đần Vắt Cực Khô…" / "03 - Đần vắt cực khô…") or is the placeholder "Mặc định".
export function variantNote(i: Pick<CartItem, "name" | "variant">) {
  const v = i.variant.replace(/^\d+\s*-\s*/, "").trim().toLowerCase();
  return !v || v === "mặc định" || i.name.toLowerCase().includes(v) ? "" : i.variant;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (id: string, variant: string, qty: number) => void;
  removeItem: (id: string, variant: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "ticco-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // hydrate from localStorage after mount (reading it during render would mismatch SSR)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem: CartContextValue["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.variant === item.variant);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.variant === item.variant ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) } : i
        );
      }
      return [...prev, { ...item, qty: Math.min(qty, MAX_QTY) }];
    });
    setIsDrawerOpen(true);
  };

  const updateQty: CartContextValue["updateQty"] = (id, variant, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => !(i.id === id && i.variant === variant))
        : prev.map((i) => (i.id === id && i.variant === variant ? { ...i, qty: Math.min(qty, MAX_QTY) } : i))
    );
  };

  const removeItem: CartContextValue["removeItem"] = (id, variant) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.variant === variant)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
