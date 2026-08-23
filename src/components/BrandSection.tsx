"use client";

import { motion } from "framer-motion";
import { brand } from "@/data/content";

/*
  One absolute-position composition matching the "trang-chu" Figma frame's
  orange brand section 1:1 (X-3 Y1168 W1283 H820 on the 1280-wide frame).
  Percentages below are each element's box relative to that section's own
  origin — pulled from the Figma file JSON (scripts/figma-fetch.mjs), not
  eyeballed.
*/
export default function BrandSection() {
  return (
    <section className="relative w-full bg-[var(--color-orange)] text-white aspect-[1283/820] overflow-hidden">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="absolute leading-relaxed text-[1.6vw] md:text-[1.3vw] lg:text-lg"
        style={{ left: "17.69%", top: "11.22%", width: "64.77%", whiteSpace: "pre-line" }}
      >
        {brand.mission}
      </motion.p>

      <a
        href="/ve-tic-co"
        className="absolute font-bold uppercase tracking-wide text-[1.4vw] md:text-base hover:underline flex items-center"
        style={{ left: "41.47%", top: "46.34%", width: "17.07%", height: "2.8%" }}
      >
        &gt; Hiểu hơn về Tíc Cơ!
      </a>

      {/* Stagger-stacked pillar badges — widest/lowest at back, narrowest/highest in front */}
      <div
        className="absolute bg-[var(--color-yellow)] rounded-full flex items-center justify-center px-4"
        style={{ left: "75.6%", top: "63.17%", width: "26.58%", height: "3.78%" }}
      >
        <span className="text-[var(--color-ink)] font-bold uppercase text-[1.2vw] md:text-sm">Niềm vui giản đơn</span>
      </div>
      <div
        className="absolute bg-[var(--color-yellow)] rounded-full flex items-center justify-center px-4"
        style={{ left: "78.64%", top: "58.29%", width: "22.76%", height: "3.54%" }}
      >
        <span className="text-[var(--color-ink)] font-bold uppercase text-[1.2vw] md:text-sm">Chăm chú với đời</span>
      </div>
      <div
        className="absolute bg-[var(--color-yellow)] rounded-full flex items-center justify-center px-4"
        style={{ left: "82.31%", top: "53.41%", width: "21.98%", height: "3.41%" }}
      >
        <span className="text-[var(--color-ink)] font-bold uppercase text-[1.2vw] md:text-sm">Phóng khoáng</span>
      </div>

      {/* Meet-Đần block */}
      <div
        className="absolute rounded-full bg-[var(--color-yellow)] overflow-hidden"
        style={{ left: "40.53%", top: "53.9%", width: "19.25%", height: "33.54%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/mascot-dan.png" alt="Mascot Đần" className="w-full h-full object-contain p-4" />
      </div>
      <p
        className="absolute font-[family-name:var(--font-heading)] font-bold leading-tight text-[1.6vw] md:text-xl"
        style={{ left: "30.16%", top: "60.49%", width: "9.98%" }}
      >
        sống đời sống cùng Đần
      </p>
      <p
        className="absolute font-[family-name:var(--font-heading)] font-bold leading-tight text-[1.6vw] md:text-xl"
        style={{ left: "30.16%", top: "72.56%", width: "9.98%" }}
      >
        chủ nhà tiếp quản Tíc Cơ
      </p>
      <a
        href="/mascot-dan"
        className="absolute font-bold uppercase tracking-wide text-[1.4vw] md:text-base hover:underline flex items-center"
        style={{ left: "41.47%", top: "91.22%", width: "17.07%", height: "2.8%" }}
      >
        &gt; Làm quen với Đần!
      </a>
    </section>
  );
}
