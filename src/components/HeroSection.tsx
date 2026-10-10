"use client";

import Image from "next/image";
import { ScatterGroup } from "@/components/Scatter";
import { ScatterWords } from "@/components/scatterWords";
import { useLang, useT } from "@/components/LangSwitch";

/*
  Matches the "trang-chu" Figma frame's hero-section (X0 Y51 W1283 H592):
  asymmetric 43.7/56.3 split (not 50/50), headline + quote-marked subtext
  block on the left, full-bleed photo on the right, no CTA button (Figma
  has none here). Percentages are each element's box relative to this
  section, from the Figma file JSON.
*/
const SUB = "Chúng tôi có bán sản phẩm để bạn tìm thấy niềm vui trong mọi điều đời thường!";
// the Figma art's rows and word groups (each group pinned left / centre / right of its row)
const SUB_ROWS = {
  vi: [["Chúng tôi", "có bán sản phẩm"], ["để bạn", "tìm thấy", "niềm vui"], ["trong mọi", "điều đời thường!"]],
  // same 3 spaced rows as the VN art (client 10/10: EN ran as one plain paragraph)
  en: [["We sell", "things so"], ["you can", "find", "joy"], ["in all things", "ordinary!"]],
};
const PAREN = "font-[family-name:Georgia,serif] text-[46px] lg:text-[7.6cqw] font-thin leading-none opacity-90";

export default function HeroSection() {
  const lang = useLang();
  const t = useT();
  return (
    <section className="relative w-full bg-[var(--color-orange)] text-white">
      <div className="relative aspect-[1283/592] overflow-hidden [container-type:inline-size]">
        <div className="absolute inset-y-0 right-0" style={{ width: "56.27%" }}>
          <Image
            src="/images/hero-basket.png"
            alt={t("Giỏ đồ Tíc Cơ")}
            fill
            priority
           
            sizes="(max-width: 768px) 100vw, 56vw"
            className="object-cover"
          />
        </div>

        <Image
          src="/images/hero-caption.png"
          alt={t("Nghề một cách đời thường")}
          width={684}
          height={546}
          className="absolute"
          style={{ left: "88.15%", top: "74.05%", width: "19.4%", transform: "translate(-50%, -50%) rotate(5.22deg)" }}
        />

        {/* headline + bracketed subtext: words fly in scattered and assemble on load (client reference video) */}
        <ScatterGroup className="absolute inset-0">
          <h1
            className="absolute font-[family-name:var(--font-heading)] font-bold uppercase leading-[1.0588] tracking-[-0.04em] whitespace-nowrap"
            // English lines are longer than the Figma copy: smaller so they stay on the orange half
            style={{ left: "4.68%", top: "13.51%", width: "33.12%", fontSize: lang === "en" ? "max(22px, 5.4cqw)" : "max(26px, 6.625cqw)" }}
          >
            <ScatterWords text={t("Đời dễ ợt")} seed={60} />
            <br />
            <ScatterWords text={t("Vợt Tíc Cơ")} seed={61} />
          </h1>

          {/* Figma "Frame 6": bracketed subtext, Big Caslon ( ). Rebuilt as live text (was a baked PNG) so its words can
              scatter too: desktop keeps the art's spaced 3-row layout (VN and EN); phones run as one line. */}
          <div
            className="absolute max-lg:!w-[39%] max-lg:!top-[50%] flex items-center gap-1 lg:gap-[0.6cqw] font-medium uppercase"
            // VN rows: Figma's width is a minimum, the ")" follows the longest row — a browser that sets these words wider
            // (bigger font, minimum font size) pushed "có bán sản phẩm" out past the bracket (client 08/10)
            // EN: no minimum, its shorter rows would spread far apart in the VN-sized box
            style={{ left: "4.365%", top: "60.98%", minWidth: lang === "vi" ? "25.25%" : undefined }}
          >
            <p className="sr-only">{t(SUB)}</p>
            <span aria-hidden className={PAREN}>(</span>
            <span aria-hidden className="max-lg:hidden flex-1 text-[1.17cqw] leading-[1.6] tracking-[-0.02em]">
              {SUB_ROWS[lang].map((row, r) => (
                <span key={r} className="flex justify-between gap-x-[1em] whitespace-nowrap">
                  {row.map((w, i) => (
                    <span key={i}>
                      <ScatterWords text={w} seed={70 + r * 5 + i} />
                    </span>
                  ))}
                </span>
              ))}
            </span>
            <span aria-hidden className="lg:hidden flex-1 text-[11px] leading-[1.3]">
              <ScatterWords text={t(SUB)} seed={90} />
            </span>
            <span aria-hidden className={PAREN}>)</span>
          </div>
        </ScatterGroup>
      </div>
    </section>
  );
}
