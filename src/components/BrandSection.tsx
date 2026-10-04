"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import ScrollFillText from "@/components/ScrollFillText";
import { useLang, useT } from "@/components/LangSwitch";
import { localize } from "@/lib/i18n";

/*
  One absolute-position composition matching the "trang-chu" Figma frame's
  orange brand section 1:1 (X-3 Y1168 W1283 H820 on the 1280-wide frame).
  Percentages below are each element's box relative to that section's own
  origin, from the Figma file JSON. The mission paragraph and the 3 pillar
  badges render the user's own Figma-exported PNGs (baked-in layout/
  typography) instead of hand-typed text, per their own design.
*/
// Mission copy split at the Figma line breaks; "" = paragraph gap. Each line slides up from behind its own
// mask, one after another (was a baked PNG). On phones a long line may wrap and slides as one block.
const MISSION_LINES = [
  "Tíc Cơ là thương hiệu Việt với các sản phẩm tiêu dùng sáng tạo",
  "lấy cảm hứng từ chất liệu đời thường,",
  "do người trẻ Việt thiết kế.",
  "",
  "Chúng tôi hướng tới việc lan toả lối sống phóng khoáng, xởi lởi",
  "và tích cực, bước đi cùng người trẻ trong hành trình phát triển",
  "mình và khám phá cuộc sống hàng ngày",
  "theo những góc nhìn mới.",
];

function MissionText({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const t = useT();
  return (
    // letters light up one by one as the block scrolls up (client's "hiệu ứng trượt chữ" video, as the mascot banners);
    // the Figma line breaks are kept ("" = paragraph gap)
    <ScrollFillText text={MISSION_LINES.map((l) => (l ? t(l) : "")).join("\n")} className={`whitespace-pre-line ${className}`} style={style} />
  );
}

export default function BrandSection() {
  const lang = useLang();
  const t = useT();
  return (
    <>
    <section className="max-md:hidden relative w-full bg-[var(--color-orange)] text-white">
    <div className="relative aspect-[1283/820] overflow-hidden [container-type:inline-size]">
      {/* Figma 671:66: Be Vietnam Medium 30/33, ls -1.2, centred, 831 wide; units = cqw of the 1283-wide section */}
      <MissionText
        className="absolute text-center font-medium"
        style={{ left: "17.69%", top: "11.22%", width: "64.77%", fontSize: "2.338cqw", lineHeight: "2.572cqw", letterSpacing: "-0.0935cqw" }}
      />

      <a
        href={localize("/ve-tic-co", lang)}
        className="absolute flex items-center"
        style={{ left: "42.56%", top: "46.34%", width: "14.89%", height: "2.8%" }}
      >
        <Reveal variant="up" delay={0.2} className="w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/link-hieu-hon.png" alt={t("Hiểu hơn về Tíc Cơ!")} className="w-full h-auto" />
        </Reveal>
      </a>

      {/* Stagger-stacked pillar badges — widest/lowest at back, narrowest/highest in front. Real
          Figma exports (pill+text baked in), sized/positioned from each badge group's
          absoluteRenderBounds (NOT absoluteBoundingBox — Figma's bbox for these pill rectangles
          includes extra invisible geometry ~15-19% wider than what's actually painted, which was
          pushing badge-phong-khoang past the section's right edge and clipping the final "G"). */}
      <Reveal variant="right" delay={0} duration={0.9} className="absolute" style={{ left: "74.77%", top: "63.14%", width: "25.23%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/badge-niem-vui-gian-don.png" alt={t("Niềm vui giản đơn")} className="w-full h-auto" />
      </Reveal>
      <Reveal variant="right" delay={0.15} duration={0.9} className="absolute" style={{ left: "78.59%", top: "58.29%", width: "21.41%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/badge-cham-chu-voi-doi.png" alt={t("Chăm chú với đời")} className="w-full h-auto" />
      </Reveal>
      <Reveal variant="right" delay={0.3} duration={0.9} className="absolute" style={{ left: "82.27%", top: "53.41%", width: "17.73%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/badge-phong-khoang.png" alt={t("Phóng khoáng")} className="w-full h-auto" />
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
        <img src="/images/brand/caption-dan.png" alt={t("sống đời sống cùng Đần")} className="w-full h-auto" />
      </Reveal>
      <Reveal variant="left" delay={0.3} duration={0.9} className="absolute" style={{ left: "30.16%", top: "72.56%", width: "8.03%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/caption-tic-co.png" alt={t("chủ nhà tiếp quản Tíc Cơ")} className="w-full h-auto" />
      </Reveal>
      <a
        href={localize("/mascot-dan", lang)}
        className="absolute flex items-center"
        style={{ left: "42.78%", top: "91.22%", width: "14.42%", height: "2.8%" }}
      >
        <Reveal variant="up" delay={0.2} className="w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/link-lam-quen.png" alt={t("Làm quen với Đần!")} className="w-full h-auto" />
        </Reveal>
      </a>
    </div>
    </section>

    {/* Phones: the same content stacked, at readable sizes (the absolute composition above is desktop only) */}
    <section className="md:hidden bg-[var(--color-orange)] text-white px-5 py-12 flex flex-col items-center gap-9 overflow-hidden">
      <MissionText className="w-full text-center text-[17px] font-medium leading-snug tracking-[-0.03em] [text-wrap:balance]" />
      <a href={localize("/ve-tic-co", lang)} className="w-[62%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/link-hieu-hon.png" alt={t("Hiểu hơn về Tíc Cơ!")} className="w-full h-auto" />
      </a>

      <div className="w-full flex flex-col items-end gap-2 -mr-5">
        {[
          ["badge-phong-khoang", "Phóng khoáng", "w-[72%]"],
          ["badge-cham-chu-voi-doi", "Chăm chú với đời", "w-[84%]"],
          ["badge-niem-vui-gian-don", "Niềm vui giản đơn", "w-[98%]"],
        ].map(([n, alt, w], i) => (
          <Reveal key={n} variant="right" delay={i * 0.1} className={w}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/brand/${n}.png`} alt={t(alt)} className="w-full h-auto" />
          </Reveal>
        ))}
      </div>

      <div className="w-full flex items-center justify-center gap-4">
        <div className="w-[34%] flex flex-col gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/caption-dan.png" alt={t("sống đời sống cùng Đần")} className="w-full h-auto" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/caption-tic-co.png" alt={t("chủ nhà tiếp quản Tíc Cơ")} className="w-full h-auto" />
        </div>
        <div className="relative w-[52%] aspect-[247/275] rounded-[50%] bg-[var(--color-yellow)]">
          <motion.img
            src="/images/meet-dan-photo.png"
            alt="Mascot Đần"
            className="absolute inset-[4%] w-[92%] h-[92%] object-contain"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
      <a href={localize("/mascot-dan", lang)} className="w-[58%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/link-lam-quen.png" alt={t("Làm quen với Đần!")} className="w-full h-auto" />
      </a>
    </section>
    </>
  );
}
