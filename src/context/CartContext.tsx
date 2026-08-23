"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (id: string, variant: string, qty: number) => void;
  removeItem: (id: string, variant: string) => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "ticco-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
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
          i.id === item.id && i.variant === item.variant ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...item, qty }];
    });
  };

  const updateQty: CartContextValue["updateQty"] = (id, variant, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => !(i.id === id && i.variant === variant))
        : prev.map((i) => (i.id === id && i.variant === variant ? { ...i, qty } : i))
    );
  };

  const removeItem: CartContextValue["removeItem"] = (id, variant) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.variant === variant)));
  };

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
