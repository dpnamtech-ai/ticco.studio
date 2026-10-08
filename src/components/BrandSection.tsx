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


// The desktop art is the designer's PNG export with the Vietnamese baked in. In English those images would stay
// Vietnamese (client 08/10), so English draws the same pieces as live text in the art's colours and sizes:
// link = yellow caps "> …", badge = purple caps on a yellow bar (right-aligned, bleeding off the edge), caption = white.
// The font size is in cqw of the 1283-wide section on desktop; the phone block passes its own size.
type ArtKind = "link" | "badge" | "caption";
function BrandArt({ name, alt, kind, size }: { name: string; alt: string; kind: ArtKind; size?: string }) {
  const lang = useLang();
  const t = useT();
  if (lang === "vi")
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/images/brand/${name}.png`} alt={alt} className="w-full h-auto" loading="lazy" decoding="async" />;
  const text = t(alt);
  if (kind === "link")
    return <span className="block whitespace-nowrap text-center font-medium uppercase leading-none tracking-[-0.03em] text-[var(--color-yellow)]" style={{ fontSize: size ?? "1.56cqw" }}>{`> ${text}`}</span>;
  if (kind === "badge")
    // flex-end: a translation longer than the Vietnamese art grows to the left, the bar stays flush with the right edge
    return (
      <span className="flex justify-end">
        <span className="w-max min-w-full whitespace-nowrap bg-[var(--color-yellow)] px-[0.4em] text-right font-semibold uppercase leading-[1.25] tracking-[-0.03em] text-[var(--color-purple)]" style={{ fontSize: size ?? "2.2cqw" }}>{text}</span>
      </span>
    );
  return <span className="block font-medium leading-[1.05] tracking-[-0.04em] text-white" style={{ fontSize: size ?? "1.95cqw" }}>{text}</span>;
}

export default function BrandSection() {
  const lang = useLang();
  const t = useT();
  return (
    <>
    <section className="relative w-full bg-[var(--color-orange)] text-white">
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
          <BrandArt name="link-hieu-hon" alt={t("Hiểu hơn về Tíc Cơ!")} kind="link" />
        </Reveal>
      </a>

      {/* Stagger-stacked pillar badges — widest/lowest at back, narrowest/highest in front. Real
          Figma exports (pill+text baked in), sized/positioned from each badge group's
          absoluteRenderBounds (NOT absoluteBoundingBox — Figma's bbox for these pill rectangles
          includes extra invisible geometry ~15-19% wider than what's actually painted, which was
          pushing badge-phong-khoang past the section's right edge and clipping the final "G"). */}
      <Reveal variant="right" delay={0} duration={0.9} className="absolute" style={{ left: "74.77%", top: "63.14%", width: "25.23%" }}>
        <BrandArt name="badge-niem-vui-gian-don" alt={t("Niềm vui giản đơn")} kind="badge" />
      </Reveal>
      <Reveal variant="right" delay={0.15} duration={0.9} className="absolute" style={{ left: "78.59%", top: "58.29%", width: "21.41%" }}>
        <BrandArt name="badge-cham-chu-voi-doi" alt={t("Chăm chú với đời")} kind="badge" />
      </Reveal>
      <Reveal variant="right" delay={0.3} duration={0.9} className="absolute" style={{ left: "82.27%", top: "53.41%", width: "17.73%" }}>
        <BrandArt name="badge-phong-khoang" alt={t("Phóng khoáng")} kind="badge" />
      </Reveal>

      {/* Meet-Đần block: static yellow ellipse (Figma "Ellipse 1"), only the Đần-with-basket art
          (Figma layer 521,1621 241x255) rotates, slowly and evenly, clockwise */}
      <div
        className="absolute rounded-[50%] bg-[var(--color-yellow)]"
        style={{ left: "40.53%", top: "53.9%", width: "19.25%", height: "33.54%" }}
      />
      <motion.img
        src="/images/meet-dan-photo.webp"
        alt="Mascot Đần"
        className="absolute"
        style={{ left: "40.84%", top: "55.24%", width: "18.78%", height: "31.1%", objectFit: "contain" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <Reveal variant="left" delay={0.1} duration={0.9} className="absolute" style={{ left: "30.16%", top: "60.49%", width: "8.18%" }}>
        <BrandArt name="caption-dan" alt={t("sống đời sống cùng Đần")} kind="caption" />
      </Reveal>
      <Reveal variant="left" delay={0.3} duration={0.9} className="absolute" style={{ left: "30.16%", top: "72.56%", width: "8.03%" }}>
        <BrandArt name="caption-tic-co" alt={t("chủ nhà tiếp quản Tíc Cơ")} kind="caption" />
      </Reveal>
      <a
        href={localize("/mascot-dan", lang)}
        className="absolute flex items-center"
        style={{ left: "42.78%", top: "91.22%", width: "14.42%", height: "2.8%" }}
      >
        <Reveal variant="up" delay={0.2} className="w-full">
          <BrandArt name="link-lam-quen" alt={t("Làm quen với Đần!")} kind="link" />
        </Reveal>
      </a>
    </div>
    </section>

    </>
  );
}
