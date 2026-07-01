"use client";

import { motion } from "framer-motion";

const items = [
  "Mua hàng tại Instagram  ✦",
  "Freeship đơn từ 200k  ✦",
  "Giao nhanh trong ngày tại HCM  ✦",
  "Combo quà tuỳ chỉnh  ✦",
  "Mua hàng tại Instagram  ✦",
  "Freeship đơn từ 200k  ✦",
  "Giao nhanh trong ngày tại HCM  ✦",
  "Combo quà tuỳ chỉnh  ✦",
];

export default function PromoBar() {
  return (
    <div className="bg-[#1A1208] text-[#FFF8F0] py-2.5 overflow-hidden text-sm font-medium tracking-wide">
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
