"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, updateQty, removeItem, subtotal, isDrawerOpen, closeDrawer } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && [
        <motion.div
          key="cart-drawer-overlay"
          className="fixed inset-0 z-[60] bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDrawer}
        />,
        <motion.aside
          key="cart-drawer-panel"
          className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 300 }}
        >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-ink)]/10">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--color-purple)]">
                Giỏ hàng {items.length > 0 && `(${items.length})`}
              </h2>
              <button onClick={closeDrawer} aria-label="Đóng giỏ hàng" className="text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]">
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <p className="text-[var(--color-ink)]/60 mb-4">Giỏ hàng đang trống</p>
                <Link
                  href="/san-pham"
                  onClick={closeDrawer}
                  className="text-[var(--color-orange)] font-semibold hover:underline"
                >
                  Xem sản phẩm →
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 divide-y divide-[var(--color-ink)]/10">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.variant}`}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-3 py-4"
                      >
                        <div className="w-16 h-16 bg-[#D9D9D9] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[var(--color-ink)] truncate">{item.name}</p>
                          <p className="text-xs text-[var(--color-ink)]/50">{item.variant}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQty(item.id, item.variant, item.qty - 1)}
                              className="w-6 h-6 rounded-full border border-[var(--color-ink)]/20 hover:bg-[var(--color-ink)]/5 text-xs"
                              aria-label="Giảm số lượng"
                            >
                              −
                            </button>
                            <span className="w-5 text-center text-sm">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.variant, item.qty + 1)}
                              className="w-6 h-6 rounded-full border border-[var(--color-ink)]/20 hover:bg-[var(--color-ink)]/5 text-xs"
                              aria-label="Tăng số lượng"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-[var(--color-ink)]">
                            {(item.price * item.qty).toLocaleString("vi-VN")} VNĐ
                          </p>
                          <button
                            onClick={() => removeItem(item.id, item.variant)}
                            className="text-[10px] text-[var(--color-ink)]/40 hover:text-[var(--color-orange)] mt-1"
                          >
                            Xoá
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-[var(--color-ink)]/10 px-6 py-5">
                  <div className="flex justify-between items-center mb-4">
                    <p className="font-semibold text-[var(--color-ink)]">Tạm tính</p>
                    <motion.p
                      key={subtotal}
                      initial={{ scale: 1.15 }}
                      animate={{ scale: 1 }}
                      className="text-xl font-bold text-[var(--color-purple)]"
                    >
                      {subtotal.toLocaleString("vi-VN")} VNĐ
                    </motion.p>
                  </div>
                  <Link
                    href="/gio-hang"
                    onClick={closeDrawer}
                    className="block text-center w-full bg-[var(--color-purple)] text-white font-semibold py-3.5 rounded-lg uppercase text-sm tracking-wide hover:bg-[var(--color-ink)] transition-colors"
                  >
                    Xem giỏ hàng đầy đủ
                  </Link>
                </div>
              </>
            )}
        </motion.aside>,
      ]}
    </AnimatePresence>
  );
}
