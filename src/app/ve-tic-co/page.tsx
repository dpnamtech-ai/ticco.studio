import type { Metadata } from "next";
import Image from "next/image";
import { aboutPage } from "@/data/content";
import Reveal from "@/components/Reveal";
import { cropFillStyle } from "@/lib/figmaCrop";

export const metadata: Metadata = {
  title: "Về Tíc Cơ",
  description: "Tíc Cơ là thương hiệu Việt với các sản phẩm tiêu dùng sáng tạo, lấy cảm hứng từ chất liệu đời thường, do người trẻ Việt thiết kế.",
};

// Figma DEMO "ve-Tic-Co" (671:162). Figma px -> cqw of the full-width section (1280px = 100cqw); both sections
// run edge to edge (blobs touch X0 / X1280, photo bleeds), so the container is the viewport, not a 1280 cap.
const cq = (px: number) => `${(px / 12.8).toFixed(3)}cqw`;
const box = (x: number, y: number, w: number, h?: number) =>
  ({ position: "absolute", left: cq(x), top: cq(y), width: cq(w), height: h == null ? undefined : cq(h) }) as const;

// "gioi-thieu" groups, relative to the section top (Figma Y48). Each: group box, text x/w, ellipse y/h, rect y/h
// (all relative to the group). Rect gradient #6625b1 -> #1f0938, ellipse #53129e, text 20/25 ls -1 justified.
const GROUPS = [
  { x: 0, y: 71, w: 397, h: 587, tx: 49, tw: 300, ey: 61, eh: 118, ry: 120, rh: 467, paras: [aboutPage.intro[0]], reveal: "left" },
  { x: 397, y: 225, w: 420, h: 433, tx: 40, tw: 340, ey: 82, eh: 122, ry: 144, rh: 289, paras: [aboutPage.intro[1], aboutPage.intro[2]], reveal: "up" },
  { x: 817, y: 260, w: 463, h: 398, tx: 62, tw: 340, ey: 122, eh: 138, ry: 189, rh: 209, paras: aboutPage.mission, reveal: "right" },
] as const;

// "banner" words (600 100/58 ls -6), relative to the banner top (Figma Y706). `r` = right-aligned box, stored as
// distance from the right edge (1280 - (x + w)).
const WORDS = [
  { t: "nghệ", l: 26, y: 34 },
  { t: "một", l: 26, y: 119 },
  { t: "cách", l: 26, y: 201 },
  { t: "đời", r: 936, y: 384 },
  { t: "thường", r: 936, y: 453 },
  { t: "ai", r: 46, y: 207 },
  { t: "cũng", r: 46, y: 269 },
  { t: "có", r: 46, y: 383 },
  { t: "gu", r: 46, y: 449 },
];

const BLOB_BG = "linear-gradient(180deg, #6625b1 0%, #1f0938 100%)";

export default function VeTicCoPage() {
  return (
    <>
      <section className="relative overflow-hidden text-white bg-gradient-to-b from-[#e66107] to-[#c15106] [container-type:inline-size]">
        {/* < md: stacked cards (the Figma geometry needs a desktop width to be readable) */}
        <div className="md:hidden px-6 py-10 flex flex-col gap-6">
          <h1 className="text-right text-[56px] leading-[52px] font-bold tracking-[-0.06em] uppercase">
            Về
            <br />
            Tíc Cơ!
          </h1>
          {GROUPS.map((g, i) => (
            <div key={i} className="rounded-t-[50%_40px] p-6 pt-10 text-[18px] leading-[23px] tracking-[-0.05em] text-justify space-y-[23px]" style={{ background: BLOB_BG }}>
              {g.paras.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          ))}
        </div>

        {/* md+: Figma "gioi-thieu" 1280x658 */}
        <div className="hidden md:block relative" style={{ height: cq(658) }}>
          <Reveal variant="mask" duration={1.1} style={box(490, 71, 300)}>
            <h1 className="text-right font-bold uppercase" style={{ fontSize: cq(72), lineHeight: cq(66), letterSpacing: cq(-4.32) }}>
              Về
              <br />
              Tíc Cơ!
            </h1>
          </Reveal>
          {GROUPS.map((g, i) => (
            <Reveal key={i} variant={g.reveal} delay={0.15 * (i + 1)} style={box(g.x, g.y, g.w, g.h)}>
              <div style={{ ...box(0, g.ry, g.w, g.rh), background: BLOB_BG }} />
              <div className="rounded-[50%] bg-[var(--color-purple)]" style={box(0, g.ey, g.w, g.eh)} />
              <div className="text-justify" style={{ ...box(g.tx, 0, g.tw), fontSize: cq(20), lineHeight: cq(25), letterSpacing: cq(-1) }}>
                {g.paras.map((p, j) => (
                  <p key={p} style={{ marginTop: j ? cq(25) : 0 }}>
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Figma "banner" 1280x817: photo box X-29 W1520, Figma crop reproduced in CSS; words are live text */}
      <section className="text-white [container-type:inline-size]">
        <div className="relative overflow-hidden" style={{ height: cq(817) }}>
        <div className="absolute overflow-hidden" style={box(-29, 0, 1520, 817)}>
          <Image
            src="/images/figma/d140ef85b2f46e31deb3dbfc61f9e592a510b83b.webp"
            alt=""
            fill
            quality={90}
            sizes="120vw"
            style={cropFillStyle([[0.999348, 0, 0.015726], [0, 0.810594, 0.143101]])}
          />
        </div>
        <Reveal variant="up" duration={1.1} className="absolute inset-0">
          <p className="font-semibold" style={{ fontSize: cq(100), lineHeight: cq(58), letterSpacing: cq(-6) }}>
            {WORDS.map((w) => (
              <span
                key={w.t}
                className="absolute whitespace-nowrap"
                style={{ top: cq(w.y), ...(w.r == null ? { left: cq(w.l) } : { right: cq(w.r) }) }}
              >
                {w.t}{" "}
              </span>
            ))}
          </p>
        </Reveal>
        </div>
      </section>
    </>
  );
}
