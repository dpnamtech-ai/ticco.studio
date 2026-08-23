"use client";

import { motion } from "framer-motion";

/*
  Matches the "trang-chu" Figma frame's hero-section (X0 Y51 W1283 H592):
  asymmetric 43.7/56.3 split (not 50/50), headline + quote-marked subtext
  block on the left, full-bleed photo on the right, no CTA button (Figma
  has none here). Percentages are each element's box relative to this
  section, from the Figma file JSON.
*/
export default function HeroSection() {
  return (
    <section className="relative w-full bg-[var(--color-orange)] text-white aspect-[1283/592] overflow-hidden">
      <div className="absolute inset-y-0 right-0" style={{ width: "56.27%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero-basket.jpg" alt="Giỏ đồ Tíc Cơ" className="w-full h-full object-cover" />
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-floating-illustration.png"
        alt=""
        className="absolute object-contain pointer-events-none"
        style={{ left: "77.79%", top: "64.02%", width: "20.73%", height: "37.33%" }}
      />

      <motion.h1
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute font-[family-name:var(--font-heading)] font-extrabold uppercase leading-[1.05]"
        style={{ left: "4.68%", top: "22.13%", width: "33.12%", fontSize: "clamp(28px, 6vw, 85px)" }}
      >
        Đời dễ ợt
        <br />
        Vợt Tíc Cơ
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="absolute flex items-start gap-1"
        style={{ left: "4.68%", top: "70.61%", width: "24.55%" }}
      >
        <span className="font-serif leading-none shrink-0" style={{ fontSize: "clamp(24px, 5vw, 70px)" }}>
          (
        </span>
        <p className="text-xs sm:text-sm leading-relaxed pt-2">
          Chúng tôi có bán sản phẩm để bạn tìm thấy niềm vui trong mọi điều đời thường!
        </p>
        <span className="font-serif leading-none shrink-0" style={{ fontSize: "clamp(24px, 5vw, 70px)" }}>
          )
        </span>
      </motion.div>
    </section>
  );
}
