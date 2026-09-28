import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { mascotPage } from "@/data/content";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import MarchingDan from "@/components/MarchingDan";
import { getProducts } from "@/lib/products";
import { cropFillStyle } from "@/lib/figmaCrop";
import { MASCOT_GRID, figmaCardProps } from "@/data/figma-cards";

export const metadata: Metadata = {
  title: "Mascot Đần — Tíc Cơ",
  description: mascotPage.tagline,
};

export default async function MascotDanPage() {
  const products = await getProducts();
  return (
    <>
      {/* Figma "hero section" (visible 1280x532 from Y51), rebuilt from its layers; Figma px -> cqw */}
      <section className="relative w-full bg-[#f2f1f1]">
      <div className="relative max-w-[1920px] mx-auto aspect-[1280/532] overflow-hidden [container-type:inline-size]">
        <h1
          className="absolute text-center font-semibold whitespace-pre text-[var(--color-purple)]"
          style={{ left: cq(140), top: cq(112), width: cq(1001), fontSize: cq(125), lineHeight: cq(19), letterSpacing: cq(-13.75) }}
        >
          {"“SỐNG     ĐẦN     LÊN!”"}
        </h1>
        {[512, 803].map((x) => (
          <div key={x} className="absolute bg-[var(--color-purple)]" style={{ left: cq(x), top: cq(137), width: cq(45), height: cq(6) }} />
        ))}
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
            quality={90}
            sizes="45vw"
            style={cropFillStyle([[0.357902, 0, 0.321581], [0, 0.390978, 0.359367]])}
          />
        </div>
        {([
          [367, 213, 142, "Chẳng phải\nđến cuối cùng"],
          [372, 407, 312, "Chẳng lo nghĩ\ngì nhiều và cười\nngốc nghếch thôi sao?"],
          [848, 261, 112, "Mình cũng chỉ muốn sống vui khoẻ"],
        ] as const).map(([x, y, w, t]) => (
          <p key={x} className="absolute whitespace-pre-line text-black" style={{ left: cq(x), top: cq(y), width: cq(w), fontSize: cq(22), lineHeight: cq(25), letterSpacing: cq(-1.1) }}>
            {t}
          </p>
        ))}
        <svg className="absolute inset-0 size-full" viewBox="0 0 1280 532" aria-hidden>
          <line x1="843" y1="309" x2="592" y2="469" stroke="#000" />
        </svg>
      </div>
      </section>

      {/* Figma "sub text" (1280x120): purple band, #e5ff00 600 36/55 uppercase */}
      <section className="[container-type:inline-size] bg-[var(--color-purple)]">
        <div className="relative" style={{ height: cq(120) }}>
          <Reveal variant="wipe" duration={1.1} className="absolute" style={{ left: cq(60), top: cq(28), width: cq(1158) }}>
            <p className="text-center font-semibold uppercase text-[#e5ff00]" style={{ fontSize: cq(36), lineHeight: cq(55), letterSpacing: cq(-2.88) }}>
              {mascotPage.tagline}
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <Reveal variant="scale" duration={1.1}>
        <MarchingDan
          alt={`${mascotPage.traits.captions.join(" ").replaceAll("\n", " ")} ${mascotPage.traits.tagline}`}
        />
        </Reveal>
      </section>

      {/* Figma "text" (1280x284): gradient #e66107 -> #c54e08, 600 37/44 uppercase text box at y75 */}
      <Banner h={284} y={75} from="#e66107" to="#c54e08" lines={["Đần là quản gia của Tíc Cơ,", "đại diện thay mặt chúng tôi truyền tải", "thông tin đến bạn!"]} />

      {/* Figma "gioi-thieu-Dan" (1280x782): bars/Đần in % of the frame, copy as live text in cqw */}
      <section className="relative w-full bg-[#f2f1f1]">
      <div className="relative max-w-[1920px] mx-auto aspect-[1280/782] overflow-hidden [container-type:inline-size]">
        <div className="absolute bg-[var(--color-purple)]" style={{ left: 0, top: "13.68%", width: "53.83%", height: "4.86%" }} />
        <div className="absolute bg-[var(--color-purple)]" style={{ left: "44.53%", right: 0, top: "38.75%", height: "4.86%" }} />
        <div className="absolute bg-[var(--color-purple)]" style={{ left: "47.03%", right: 0, top: "68.67%", height: "4.86%" }} />

        <Reveal variant="left" delay={0} className="absolute" style={{ left: "51.25%", top: "2.56%", width: "14.06%" }}>
          <Image src="/images/mascot-dan/bio/dan-1.png" alt="Mascot Đần nhảy" width={682} height={845} quality={90} sizes="15vw" className="w-full h-auto" />
        </Reveal>
        <Reveal variant="right" delay={0.1} className="absolute" style={{ left: "27.27%", top: "23.4%", width: "24.69%" }}>
          <Image src="/images/mascot-dan/bio/dan-2.png" alt="Mascot Đần nâng tạ" width={1391} height={1002} quality={90} sizes="25vw" className="w-full h-auto" />
        </Reveal>
        <Reveal variant="left" delay={0.2} className="absolute" style={{ left: "32.73%", top: "52.56%", width: "17.42%" }}>
          <Image src="/images/mascot-dan/bio/dan-3.png" alt="Mascot Đần cầm laptop" width={730} height={708} quality={90} sizes="18vw" className="w-full h-auto" />
        </Reveal>

        {/* bio copy: live text, Be Vietnam 400 22/26 ls -1.1 purple (Figma px -> cqw, relative to Y1652) */}
        {([[842, 91, 344], [100, 267, 298], [100, 448, 334]] as const).map(([x, y, w], i) => (
          <Reveal key={i} variant="mask" delay={0.2 + i * 0.1} className="absolute" style={{ left: cq(x), top: cq(y), width: cq(w) }}>
            <p className="whitespace-pre-line text-[var(--color-purple)]" style={{ fontSize: cq(22), lineHeight: cq(26), letterSpacing: cq(-1.1) }}>
              {mascotPage.bio[i].text}
            </p>
          </Reveal>
        ))}
        <Reveal variant="scale" delay={0.1} className="absolute" style={{ left: cq(142), top: cq(697), width: cq(998) }}>
          <h2 className="text-center font-medium uppercase text-[var(--color-purple)]" style={{ fontSize: cq(30), lineHeight: cq(56), letterSpacing: cq(-1.5) }}>
            {mascotPage.closingHeading}
          </h2>
        </Reveal>
      </div>
      </section>

      {/* Figma "sub text" (1280x217): gradient #53129e -> #2b0458, text box at y62 */}
      <Banner h={217} y={62} from="#53129e" to="#2b0458" lines={["Lan toả lối sống Đần", "qua các sản phẩm Tíc Cơ:"]} />

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
            href="/san-pham"
            className="inline-block text-[20px] lg:text-[1.5625cqw] lg:leading-[7.031cqw] lg:tracking-[-0.0625cqw] font-semibold uppercase text-[var(--color-purple)] hover:underline"
          >
            Xem thêm sản phẩm Tíc Cơ! &gt;
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
      <Reveal variant="up" duration={1} className="absolute inset-x-0" style={{ top: cq(y) }}>
        <p className="text-center font-semibold uppercase" style={{ fontSize: cq(37), lineHeight: cq(44), letterSpacing: cq(-1.85) }}>
          {lines.map((l, i) => (
            <span key={i} className="block">
              {l}
            </span>
          ))}
        </p>
      </Reveal>
      </div>
    </section>
  );
}
