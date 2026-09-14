"use client";

import { brand } from "@/data/content";

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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/mission-text.png"
        alt={brand.mission}
        className="absolute w-full"
        style={{ left: "17.69%", top: "11.22%", width: "64.77%" }}
      />

      <a
        href="/ve-tic-co"
        className="absolute flex items-center"
        style={{ left: "41.47%", top: "46.34%", width: "17.07%", height: "2.8%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/link-hieu-hon.png" alt="Hiểu hơn về Tíc Cơ!" className="w-full h-auto" />
      </a>

      {/* Stagger-stacked pillar badges — widest/lowest at back, narrowest/highest in front. Real
          Figma exports (pill+text baked in), sized/positioned from each badge group's
          absoluteRenderBounds (NOT absoluteBoundingBox — Figma's bbox for these pill rectangles
          includes extra invisible geometry ~15-19% wider than what's actually painted, which was
          pushing badge-phong-khoang past the section's right edge and clipping the final "G"). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/badge-niem-vui-gian-don.png"
        alt="Niềm vui giản đơn"
        className="absolute w-full"
        style={{ left: "74.77%", top: "63.14%", width: "25.23%" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/badge-cham-chu-voi-doi.png"
        alt="Chăm chú với đời"
        className="absolute w-full"
        style={{ left: "78.59%", top: "58.29%", width: "21.41%" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/badge-phong-khoang.png"
        alt="Phóng khoáng"
        className="absolute w-full"
        style={{ left: "82.27%", top: "53.41%", width: "17.73%" }}
      />

      {/* Meet-Đần block */}
      <div
        className="absolute rounded-full bg-[var(--color-yellow)] overflow-hidden"
        style={{ left: "40.53%", top: "53.9%", width: "19.25%", height: "33.54%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/meet-dan-photo.png" alt="Mascot Đần" className="w-full h-full object-cover" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/caption-dan.png"
        alt="sống đời sống cùng Đần"
        className="absolute w-full"
        style={{ left: "30.16%", top: "60.49%", width: "9.98%" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/caption-tic-co.png"
        alt="chủ nhà tiếp quản Tíc Cơ"
        className="absolute w-full"
        style={{ left: "30.16%", top: "72.56%", width: "9.98%" }}
      />
      <a
        href="/mascot-dan"
        className="absolute flex items-center"
        style={{ left: "41.47%", top: "91.22%", width: "17.07%", height: "2.8%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/link-lam-quen.png" alt="Làm quen với Đần!" className="w-full h-auto" />
      </a>
    </section>
  );
}
