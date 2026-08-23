"use client";

import { useCart } from "@/context/CartContext";

export default function GioHangPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)] mb-4">
          Giỏ hàng trống
        </h1>
        <a href="/san-pham" className="text-[var(--color-orange)] font-semibold hover:underline">
          Xem sản phẩm →
        </a>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)] mb-8">
        Giỏ hàng
      </h1>

      <div className="divide-y divide-[var(--color-ink)]/10">
        {items.map((item) => (
          <div key={`${item.id}-${item.variant}`} className="flex items-center gap-4 py-5">
            <div className="w-20 h-20 bg-[#D9D9D9] shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-[var(--color-ink)]">{item.name}</p>
              <p className="text-sm text-[var(--color-ink)]/50">{item.variant}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.id, item.variant, item.qty - 1)}
                className="w-8 h-8 rounded-full border border-[var(--color-ink)]/20 hover:bg-[var(--color-ink)]/5"
                aria-label="Giảm số lượng"
              >
                −
              </button>
              <span className="w-6 text-center">{item.qty}</span>
              <button
                onClick={() => updateQty(item.id, item.variant, item.qty + 1)}
                className="w-8 h-8 rounded-full border border-[var(--color-ink)]/20 hover:bg-[var(--color-ink)]/5"
                aria-label="Tăng số lượng"
              >
                +
              </button>
            </div>
            <p className="w-28 text-right font-semibold text-[var(--color-ink)]">
              {(item.price * item.qty).toLocaleString("vi-VN")} VNĐ
            </p>
            <button
              onClick={() => removeItem(item.id, item.variant)}
              aria-label="Xoá"
              className="text-[var(--color-ink)]/40 hover:text-[var(--color-orange)] text-sm"
            >
              Xoá
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-[var(--color-ink)]/15">
        <p className="text-lg font-semibold text-[var(--color-ink)]">Tạm tính</p>
        <p className="text-2xl font-bold text-[var(--color-purple)]">
          {subtotal.toLocaleString("vi-VN")} VNĐ
        </p>
      </div>

      <a
        href="/checkout"
        className="block text-center w-full bg-[var(--color-purple)] text-white font-semibold py-4 rounded-lg uppercase text-sm tracking-wide mt-6 hover:bg-[var(--color-ink)] transition-colors"
      >
        Thanh toán
      </a>
    </section>
  );
}
