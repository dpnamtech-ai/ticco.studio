"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/*
  Matches the "trang-chu" Figma frame's hero-section (X0 Y51 W1283 H592):
  asymmetric 43.7/56.3 split (not 50/50), headline + quote-marked subtext
  block on the left, full-bleed photo on the right, no CTA button (Figma
  has none here). Percentages are each element's box relative to this
  section, from the Figma file JSON.
*/
export default function HeroSection() {
  return (
    <section className="relative w-full bg-[var(--color-orange)] text-white aspect-[1283/592] overflow-hidden [container-type:inline-size]">
      <div className="absolute inset-y-0 right-0" style={{ width: "56.27%" }}>
        <Image
          src="/images/hero-basket.png"
          alt="Giỏ đồ Tíc Cơ"
          fill
          priority
          quality={90}
          sizes="(max-width: 768px) 100vw, 56vw"
          className="object-cover"
        />
      </div>

      <Image
        src="/images/hero-caption.png"
        alt="Nghề một cách đời thường"
        width={684}
        height={546}
        className="absolute"
        style={{ left: "88.15%", top: "74.05%", width: "19.4%", transform: "translate(-50%, -50%) rotate(5.22deg)" }}
      />

      <motion.h1
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute font-[family-name:var(--font-heading)] font-bold uppercase leading-[1.05] tracking-[-0.04em] whitespace-nowrap"
        style={{ left: "4.68%", top: "22.13%", width: "33.12%", fontSize: "max(26px, 6.625cqw)" }}
      >
        Đời dễ ợt
        <br />
        Vợt Tíc Cơ
      </motion.h1>

      {/* Figma "Frame 6": bracketed subtext incl. Big Caslon ( ), exported as art */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="absolute"
        style={{ left: "4.365%", top: "60.98%", width: "25.25%" }}
      >
        <Image
          src="/images/hero-subtext.png"
          alt="Chúng tôi có bán sản phẩm để bạn tìm thấy niềm vui trong mọi điều đời thường!"
          width={2592}
          height={816}
          quality={90}
          sizes="26vw"
          className="w-full h-auto"
        />
      </motion.div>
    </section>
  );
}
