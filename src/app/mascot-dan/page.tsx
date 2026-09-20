import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { mascotPage } from "@/data/content";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import MarchingDan from "@/components/MarchingDan";
import { getProducts } from "@/lib/products";

// Same 8 items (first 2 rows) as the homepage's "danh-muc-san-pham" preview grid —
// the Figma "mascot-Dan" frame's own "LAN TOẢ LỐI SỐNG ĐẦN..." grid repeats the same
// 4 placeholder products across both rows, so we reuse the real catalog subset instead.
const PRODUCT_GRID_IDS = [
  "bst-dan-sinh-ton",
  "tui-song-cu-khoi",
  "so-can-ban",
  "gile-yen-tam",
  "sticker-07-dan-noi",
  "tui-vung-vang",
  "sticker-05-ban-lam-duoc-ma",
  "khan-bandana-van-su-tuy-minh",
];

export const metadata: Metadata = {
  title: "Mascot Đần — Tíc Cơ",
  description: mascotPage.tagline,
};

export default async function MascotDanPage() {
  const products = await getProducts();
  const productGrid = PRODUCT_GRID_IDS.map((id) => products.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <>
      {/* Figma hero (1280x532): art is 1080x460 at (100, 44) inside the frame */}
      <section className="relative w-full bg-[#f2f1f1]">
      <div className="relative max-w-[1280px] mx-auto aspect-[1280/532] overflow-hidden">
        <h1 className="sr-only">{mascotPage.headline}</h1>
        <Image
          src="/images/mascot-dan/hero-art.png"
          alt={`${mascotPage.headline} ${mascotPage.quote.join(" ")}`}
          width={2160}
          height={920}
          priority
          quality={90}
          sizes="85vw"
          className="absolute h-auto"
          style={{ left: "7.8125%", top: "8.27%", width: "84.375%" }}
        />
      </div>
      </section>

      <section>
        <Reveal variant="wipe" duration={1.1}>
        <Image
          src="/images/mascot-dan/tagline-bar.png"
          alt={mascotPage.tagline}
          width={2560}
          height={240}
          quality={90}
          sizes="100vw"
          className="w-full h-auto"
        />
        </Reveal>
      </section>

      <section>
        <Reveal variant="scale" duration={1.1}>
        <MarchingDan
          alt={`${mascotPage.traits.captions.join(" ").replaceAll("\n", " ")} ${mascotPage.traits.tagline}`}
        />
        </Reveal>
      </section>

      <section>
        <Reveal variant="up" duration={1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mascot-dan/intro-banner.png" alt={mascotPage.introBanner} className="w-full h-auto" />
        </Reveal>
      </section>

      {/* Figma "gioi-thieu-Dan" (1280x782): positions in % of the frame; text is the exported art */}
      <section className="relative w-full bg-[#f2f1f1]">
      <div className="relative max-w-[1280px] mx-auto aspect-[1280/782] overflow-hidden">
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

        <Reveal variant="mask" delay={0.2} className="absolute" style={{ left: "65.78%", top: "11.64%", width: "24.77%" }}>
          <Image src="/images/mascot-dan/bio/text-1.png" alt={mascotPage.bio[0].text} width={1269} height={403} sizes="25vw" className="w-full h-auto" />
        </Reveal>
        <Reveal variant="mask" delay={0.3} className="absolute" style={{ left: "7.81%", top: "34.14%", width: "19.55%" }}>
          <Image src="/images/mascot-dan/bio/text-2.png" alt={mascotPage.bio[1].text} width={1001} height={306} sizes="20vw" className="w-full h-auto" />
        </Reveal>
        <Reveal variant="mask" delay={0.4} className="absolute" style={{ left: "7.81%", top: "57.29%", width: "24.08%" }}>
          <Image src="/images/mascot-dan/bio/text-3.png" alt={mascotPage.bio[2].text} width={1233} height={505} sizes="25vw" className="w-full h-auto" />
        </Reveal>
        <Reveal variant="scale" delay={0.1} className="absolute" style={{ left: "11.09%", top: "89.13%", width: "77.97%" }}>
          <Image src="/images/mascot-dan/bio/heading.png" alt={mascotPage.closingHeading} width={2215} height={157} sizes="80vw" className="w-full h-auto" />
        </Reveal>
      </div>
      </section>

      <section>
        <Reveal variant="up" duration={1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mascot-dan/closing-banner.png" alt={mascotPage.closingBanner} className="w-full h-auto" />
        </Reveal>
      </section>

      <section className="bg-[#f2f1f1] px-6 py-16">
        <div>
          <div className="max-w-[1086px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-[82px] gap-y-[22px] mb-10">
            {productGrid.map((product, i) => (
              <ProductCard key={product.id} {...product} index={i} compact />
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/san-pham"
              className="text-[20px] font-semibold uppercase text-[var(--color-purple)] hover:underline"
            >
              Xem thêm sản phẩm Tíc Cơ! &gt;
            </Link>
            <br />
            <Link href="/san-pham" className="text-[20px] font-semibold uppercase text-[var(--color-purple)] hover:underline">
              Tất cả sản phẩm &gt;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
