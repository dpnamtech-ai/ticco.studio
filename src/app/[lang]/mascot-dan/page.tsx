import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { mascotPage } from "@/data/content";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import MarchingDan from "@/components/MarchingDan";
import ScrollFillText from "@/components/ScrollFillText";
import { ScatterGroup } from "@/components/Scatter";
import { ScatterWords, scatterVars } from "@/components/scatterWords";
import { getProducts } from "@/lib/products";
import { cropFillStyle } from "@/lib/figmaCrop";
import { MASCOT_GRID, figmaCardProps } from "@/data/figma-cards";
import { getLang } from "@/lib/lang";
import { alternatesFor, localize } from "@/lib/i18n";
import { t } from "@/lib/t";

// Figma hero callouts [x, y, w, text] (desktop positions in Figma px)
const HERO_CALLOUTS = [
  [367, 213, 142, "Chẳng phải\nđến cuối cùng"],
  [372, 407, 312, "Chẳng lo nghĩ\ngì nhiều và cười\nngốc nghếch thôi sao?"],
  [848, 261, 112, "Mình cũng chỉ muốn sống vui khoẻ"],
] as const;

// The 3 Đần of "gioi-thieu-Dan": [src, alt, w, h, mirrored] — nâng tạ is mirrored to match Figma (see desktop layer).
const BIO_ART = [
  ["/images/mascot-dan/bio/dan-1.png", "Mascot Đần nhảy", 682, 845, false],
  ["/images/mascot-dan/bio/dan-2.png", "Mascot Đần nâng tạ", 1391, 1002, true],
  ["/images/mascot-dan/bio/dan-3.png", "Mascot Đần cầm laptop", 730, 708, false],
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("Mascot Đần — nhân vật quản gia của Tíc Cơ", lang),
    description: `${t("Đần — quản gia của Tíc Cơ:", lang)} ${t(mascotPage.tagline, lang)} ${t("Móc khoá Đần Sinh Tồn, sticker Đần Nói, postcard Triết Lý Sống Đần.", lang)}`,
    alternates: alternatesFor("/mascot-dan", lang),
  };
}

export default async function MascotDanPage() {
  const lang = await getLang();
  const T = (s: string) => t(s, lang);
  const products = await getProducts();
  return (
    <>
      {/* Figma "hero section" (visible 1280x532 from Y51), rebuilt from its layers; Figma px -> cqw */}
      {/* headline + callouts fly in word by word and assemble (client's reference video), see Scatter.tsx */}
      <section className="relative w-full bg-[#f2f1f1]">
      <ScatterGroup>
      {/* phones: the headline on its own strip (same art, shifted up)… */}
      <div className="lg:hidden relative aspect-[1280/170] overflow-hidden [container-type:inline-size]" aria-hidden>
        <Headline dy={-30} tag="p" text={T(HEADLINE)} />
      </div>
      {/* …then the middle of the art (Figma x350-975, y200-500) zoomed in: callouts, lines and photo stay as designed but
          the callouts read at ~14px instead of ~7px. Desktop: the whole 1280x532 art as in Figma. */}
      <div className="relative max-lg:mx-auto max-lg:max-w-[560px] max-lg:aspect-[625/300] max-lg:overflow-hidden">
      <div className="relative aspect-[1280/532] overflow-hidden [container-type:inline-size] max-lg:w-[204.8%] max-lg:ml-[-56%] max-lg:-mt-[32%]">
        <div className="max-lg:hidden">
          <Headline dy={0} tag="h1" text={T(HEADLINE)} />
        </div>
        <svg className="absolute inset-0 size-full" viewBox="0 0 1280 532" aria-hidden>
          <line x1="484" y1="236" x2="843" y2="309" stroke="#000" />
        </svg>
        <div className="absolute bg-[#d9d9d9]" style={{ left: cq(535), top: cq(219), width: cq(235), height: cq(235) }} />
        <div className="absolute overflow-hidden" style={{ left: cq(554), top: cq(218), width: cq(216), height: cq(236) }}>
          <Image
            src="/images/figma/6c19fe1ca52de81ca702ec6b411839c062508cf8.webp"
            alt="Mascot Đần"
            fill
            priority
           
            sizes="45vw"
            style={cropFillStyle([[0.357902, 0, 0.321581], [0, 0.390978, 0.359367]])}
          />
        </div>
        {HERO_CALLOUTS.map(([x, y, w, c], i) => (
          <p key={x} className="absolute whitespace-pre-line text-black" style={{ left: cq(x), top: cq(y), width: cq(w), fontSize: cq(22), lineHeight: cq(25), letterSpacing: cq(-1.1) }}>
            <ScatterWords text={T(c)} seed={10 + i} />
          </p>
        ))}
        <svg className="absolute inset-0 size-full" viewBox="0 0 1280 532" aria-hidden>
          <line x1="843" y1="309" x2="592" y2="469" stroke="#000" />
        </svg>
      </div>
      </div>
      <div className="lg:hidden h-6" />
      </ScatterGroup>
      </section>

      {/* Figma "sub text" (1280x120): purple band, #e5ff00 600 36/55 uppercase */}
      <section className="[container-type:inline-size] bg-[var(--color-purple)]">
        <div className="relative" style={{ height: cq(120) }}>
          <ScrollFillText
            text={T(mascotPage.tagline)}
            className="absolute text-center font-semibold uppercase text-[#e5ff00]"
            style={{ left: cq(60), top: cq(28), width: cq(1158), fontSize: cq(36), lineHeight: cq(55), letterSpacing: cq(-2.88) }}
          />
        </div>
      </section>

      <section>
        {/* the three Đần pop in on their own (.dan-float), so no Reveal around the scene */}
        <MarchingDan
          alt={`${mascotPage.traits.captions.map(T).join(" ").replaceAll("\n", " ")} ${T(mascotPage.traits.tagline)}`}
        />
      </section>

      {/* Figma "text" (1280x284): gradient #e66107 -> #c54e08, 600 37/44 uppercase text box at y75 */}
      <Banner h={284} y={75} from="#e66107" to="#c54e08" lines={["Đần là quản gia của Tíc Cơ,", "đại diện thay mặt chúng tôi truyền tải", "thông tin đến bạn!"].map(T)} />

      {/* Figma "gioi-thieu-Dan" (1280x782): bars/Đần in % of the frame, copy as live text in cqw */}
      <section className="relative w-full bg-[#f2f1f1]">
      <div className="relative aspect-[1280/782] overflow-hidden [container-type:inline-size] max-lg:hidden">
        <div className="absolute bg-[var(--color-purple)]" style={{ left: 0, top: "13.68%", width: "53.83%", height: "4.86%" }} />
        <div className="absolute bg-[var(--color-purple)]" style={{ left: "44.53%", right: 0, top: "38.75%", height: "4.86%" }} />
        <div className="absolute bg-[var(--color-purple)]" style={{ left: "47.03%", right: 0, top: "68.67%", height: "4.86%" }} />

        <Reveal variant="left" delay={0} className="absolute" style={{ left: "51.25%", top: "2.56%", width: "14.06%" }}>
          <Image src="/images/mascot-dan/bio/dan-1.png" alt={T("Mascot Đần nhảy")} width={682} height={845} sizes="15vw" className="w-full h-auto" />
        </Reveal>
        <Reveal variant="right" delay={0.1} className="absolute" style={{ left: "27.27%", top: "23.4%", width: "24.69%" }}>
          {/* Figma rotates this layer 180°; the exported PNG is only flipped vertically, so mirror it back (big plate on the left, body over the bar) */}
          <Image src="/images/mascot-dan/bio/dan-2.png" alt={T("Mascot Đần nâng tạ")} width={1391} height={1002} sizes="25vw" className="w-full h-auto -scale-x-100" />
        </Reveal>
        <Reveal variant="left" delay={0.2} className="absolute" style={{ left: "32.73%", top: "52.56%", width: "17.42%" }}>
          <Image src="/images/mascot-dan/bio/dan-3.png" alt={T("Mascot Đần cầm laptop")} width={730} height={708} sizes="18vw" className="w-full h-auto" />
        </Reveal>

        {/* bio copy: live text, Be Vietnam 400 22/26 ls -1.1 purple (Figma px -> cqw, relative to Y1652) */}
        {([[842, 91, 344], [100, 267, 298], [100, 448, 334]] as const).map(([x, y, w], i) => (
          <Reveal key={i} variant="mask" delay={0.2 + i * 0.1} className="absolute max-lg:hidden" style={{ left: cq(x), top: cq(y), width: cq(w) }}>
            <p className="whitespace-pre-line text-[var(--color-purple)]" style={{ fontSize: cq(22), lineHeight: cq(26), letterSpacing: cq(-1.1) }}>
              {T(mascotPage.bio[i].text)}
            </p>
          </Reveal>
        ))}
        <Reveal variant="scale" delay={0.1} className="absolute max-lg:hidden" style={{ left: cq(142), top: cq(697), width: cq(998) }}>
          <h2 className="text-center font-medium uppercase text-[var(--color-purple)]" style={{ fontSize: cq(30), lineHeight: cq(56), letterSpacing: cq(-1.5) }}>
            {T(mascotPage.closingHeading)}
          </h2>
        </Reveal>
      </div>
      {/* phones: the desktop "staircase" as 3 rows — each Đần next to its own copy, with the purple bar running in from
          the screen edge behind Đần (left edge for row 1, right edge for rows 2-3, as on desktop) */}
      <div className="lg:hidden space-y-6 overflow-x-clip py-8 text-[15px] leading-snug text-[var(--color-purple)]">
        {BIO_ART.map(([src, alt, w, h, mirror], i) => {
          const left = i === 0;
          return (
            // Reveal wraps its children in its own div, so the row layout lives on an inner element.
            <Reveal key={src} variant={left ? "left" : "right"}>
              <div className={`relative flex items-center gap-4 px-6 ${left ? "" : "flex-row-reverse"}`}>
                <div className={`absolute top-1/2 h-4 -translate-y-1/2 bg-[var(--color-purple)] ${left ? "left-0" : "right-0"}`} style={{ width: "calc(24px + 22%)" }} />
                <Image src={src} alt={T(alt)} width={w} height={h} sizes="40vw" className={`relative h-auto w-[38%] max-w-[200px] shrink-0 ${mirror ? "-scale-x-100" : ""}`} />
                <p className="flex-1 whitespace-pre-line">{T(mascotPage.bio[i]?.text ?? "")}</p>
              </div>
            </Reveal>
          );
        })}
        {mascotPage.bio.slice(3).map((b, i) => <p key={i} className="px-6 whitespace-pre-line">{T(b.text)}</p>)}
        <h2 className="px-6 pt-2 text-center text-[17px] font-medium uppercase">{T(mascotPage.closingHeading)}</h2>
      </div>
      </section>

      {/* Figma "sub text" (1280x217): gradient #53129e -> #2b0458, text box at y62 */}
      <Banner h={217} y={62} from="#53129e" to="#2b0458" lines={["Lan toả lối sống Đần", "qua các sản phẩm Tíc Cơ:"].map(T)} />

      {/* Figma "san-pham-Dan" (1280x906): cards at x94/386/678/970, rows y62 / y422, link box (lh 90) y778 */}
      <section className="bg-[#f2f1f1] [container-type:inline-size]">
        <div className="px-6 py-16 lg:px-0 lg:pt-[4.844cqw] lg:pb-[2.969cqw]">
        <div className="max-w-[1086px] mx-auto lg:max-w-none lg:w-[84.766cqw] lg:ml-[7.344cqw] grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-[6.406cqw] gap-y-[22px] lg:gap-y-[1.172cqw] mb-10 lg:mb-[0.859cqw]">
          {MASCOT_GRID.map((card, i) => (
            <ProductCard key={card.id} {...figmaCardProps(card, products)} index={i} compact />
          ))}
        </div>
        <div className="text-center">
          <Link
            href={localize("/san-pham", lang)}
            className="inline-block text-[20px] lg:text-[1.5625cqw] lg:leading-[7.031cqw] lg:tracking-[-0.0625cqw] font-semibold uppercase text-[var(--color-purple)] hover:underline"
          >
            {T("Xem thêm sản phẩm Tíc Cơ! >")}
          </Link>
        </div>
        </div>
      </section>
    </>
  );
}

const cq = (px: number) => `${(px / 12.8).toFixed(3)}cqw`;

// Full-width gradient band with centred live text (Be Vietnam 600 37/44, ls -1.85, uppercase), Figma px -> cqw.
function Banner({ h, y, from, to, lines }: { h: number; y: number; from: string; to: string; lines: string[] }) {
  return (
    // cq units on the container element itself would resolve against the viewport, so size an inner box
    <section className="[container-type:inline-size] text-white">
      <div className="relative" style={{ height: cq(h), background: `linear-gradient(180deg, ${from}, ${to})` }}>
      <ScrollFillText
        text={lines.join("\n")}
        className="absolute inset-x-0 whitespace-pre-line text-center font-semibold uppercase"
        style={{ top: cq(y), fontSize: cq(37), lineHeight: cq(44), letterSpacing: cq(-1.85) }}
      />
      </div>
    </section>
  );
}

// "“SỐNG — ĐẦN — LÊN!”": 125px text with the two dashes drawn as bars between the words (Figma px -> cqw).
// dy shifts it up for the phone-only strip that shows it apart from the rest of the hero art.
// The headline keeps its 5-space gaps in both languages: the two bars are drawn into them.
const HEADLINE = "“SỐNG     ĐẦN     LÊN!”";
function Headline({ dy, tag: Tag, text }: { dy: number; tag: "h1" | "p"; text: string }) {
  return (
    <>
      <Tag
        className="absolute text-center font-semibold whitespace-pre text-[var(--color-purple)]"
        style={{ left: cq(140), top: cq(112 + dy), width: cq(1001), fontSize: cq(125), lineHeight: cq(19), letterSpacing: cq(-13.75) }}
      >
        <ScatterWords text={text} seed={1} />
      </Tag>
      {[512, 803].map((x) => (
        <div key={x} className="sw-word absolute bg-[var(--color-purple)]" style={{ ...scatterVars(x), left: cq(x), top: cq(137 + dy), width: cq(45), height: cq(6) }} />
      ))}
    </>
  );
}
