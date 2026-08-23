"use client";

import { motion } from "framer-motion";

const items = [
  "Miễn phí vận chuyển với đơn hàng trên 500k!  ✦",
  "Giao nhanh trong ngày tại HCM  ✦",
  "Combo quà tuỳ chỉnh  ✦",
  "Miễn phí vận chuyển với đơn hàng trên 500k!  ✦",
  "Giao nhanh trong ngày tại HCM  ✦",
  "Combo quà tuỳ chỉnh  ✦",
];

export default function PromoBar() {
  return (
    <div className="bg-[var(--color-ink)] text-[var(--color-cream)] py-2.5 overflow-hidden text-sm font-medium tracking-wide">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="whitespace-nowrap px-4">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
