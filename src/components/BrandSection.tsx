"use client";

import { motion } from "framer-motion";
import { brand } from "@/data/content";
import Reveal from "@/components/Reveal";

/*
  One absolute-position composition matching the "trang-chu" Figma frame's
  orange brand section 1:1 (X-3 Y1168 W1283 H820 on the 1280-wide frame).
  Percentages below are each element's box relative to that section's own
  origin, from the Figma file JSON. The mission paragraph and the 3 pillar
  badges render the user's own Figma-exported PNGs (baked-in layout/
  typography) instead of hand-typed text, per their own design.
*/
export default function BrandSection() {
  return (
    <section className="relative w-full bg-[var(--color-orange)] text-white aspect-[1283/820] overflow-hidden">
      <Reveal variant="mask" duration={1.2} className="absolute" style={{ left: "17.69%", top: "11.22%", width: "64.77%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/mission-text.png" alt={brand.mission} className="w-full h-auto" />
      </Reveal>

      <a
        href="/ve-tic-co"
        className="absolute flex items-center"
        style={{ left: "42.56%", top: "46.34%", width: "14.89%", height: "2.8%" }}
      >
        <Reveal variant="up" delay={0.2} className="w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/link-hieu-hon.png" alt="Hiểu hơn về Tíc Cơ!" className="w-full h-auto" />
        </Reveal>
      </a>

      {/* Stagger-stacked pillar badges — widest/lowest at back, narrowest/highest in front. Real
          Figma exports (pill+text baked in), sized/positioned from each badge group's
          absoluteRenderBounds (NOT absoluteBoundingBox — Figma's bbox for these pill rectangles
          includes extra invisible geometry ~15-19% wider than what's actually painted, which was
          pushing badge-phong-khoang past the section's right edge and clipping the final "G"). */}
      <Reveal variant="right" delay={0} duration={0.9} className="absolute" style={{ left: "74.77%", top: "63.14%", width: "25.23%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/badge-niem-vui-gian-don.png" alt="Niềm vui giản đơn" className="w-full h-auto" />
      </Reveal>
      <Reveal variant="right" delay={0.15} duration={0.9} className="absolute" style={{ left: "78.59%", top: "58.29%", width: "21.41%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/badge-cham-chu-voi-doi.png" alt="Chăm chú với đời" className="w-full h-auto" />
      </Reveal>
      <Reveal variant="right" delay={0.3} duration={0.9} className="absolute" style={{ left: "82.27%", top: "53.41%", width: "17.73%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/badge-phong-khoang.png" alt="Phóng khoáng" className="w-full h-auto" />
      </Reveal>

      {/* Meet-Đần block: static yellow ellipse (Figma "Ellipse 1"), only the Đần-with-basket art
          (Figma layer 521,1621 241x255) rotates, slowly and evenly, clockwise */}
      <div
        className="absolute rounded-[50%] bg-[var(--color-yellow)]"
        style={{ left: "40.53%", top: "53.9%", width: "19.25%", height: "33.54%" }}
      />
      <motion.img
        src="/images/meet-dan-photo.png"
        alt="Mascot Đần"
        className="absolute"
        style={{ left: "40.84%", top: "55.24%", width: "18.78%", height: "31.1%", objectFit: "contain" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <Reveal variant="left" delay={0.1} duration={0.9} className="absolute" style={{ left: "30.16%", top: "60.49%", width: "8.18%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/caption-dan.png" alt="sống đời sống cùng Đần" className="w-full h-auto" />
      </Reveal>
      <Reveal variant="left" delay={0.3} duration={0.9} className="absolute" style={{ left: "30.16%", top: "72.56%", width: "8.03%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/caption-tic-co.png" alt="chủ nhà tiếp quản Tíc Cơ" className="w-full h-auto" />
      </Reveal>
      <a
        href="/mascot-dan"
        className="absolute flex items-center"
        style={{ left: "42.78%", top: "91.22%", width: "14.42%", height: "2.8%" }}
      >
        <Reveal variant="up" delay={0.2} className="w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/link-lam-quen.png" alt="Làm quen với Đần!" className="w-full h-auto" />
        </Reveal>
      </a>
    </section>
  );
}
