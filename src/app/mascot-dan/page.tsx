import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { mascotPage } from "@/data/content";
import ProductCard from "@/components/ProductCard";
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
      <section className="bg-[#f2f1f1]">
        <h1 className="sr-only">{mascotPage.headline}</h1>
        <Image
          src="/images/mascot-dan/hero-art.png"
          alt={`${mascotPage.headline} ${mascotPage.quote.join(" ")}`}
          width={2160}
          height={920}
          priority
          quality={90}
          sizes="100vw"
          className="w-full h-auto"
        />
      </section>

      <section>
        <Image
          src="/images/mascot-dan/tagline-bar.png"
          alt={mascotPage.tagline}
          width={2560}
          height={240}
          quality={90}
          sizes="100vw"
          className="w-full h-auto"
        />
      </section>

      <section>
        <Image
          src="/images/mascot-dan/tinh-than.png"
          alt={`${mascotPage.traits.captions.join(" ").replaceAll("\n", " ")} ${mascotPage.traits.tagline}`}
          width={2560}
          height={1328}
          quality={90}
          sizes="100vw"
          className="w-full h-auto"
        />
      </section>

      <section>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/mascot-dan/intro-banner.png" alt={mascotPage.introBanner} className="w-full h-auto" />
      </section>

      <section className="px-6 py-16">
        <div className="w-full overflow-hidden pb-20 space-y-16 md:space-y-10">
          {/* Row 1: Mascot Cheer (Bar from Left) */}
          <div className="relative flex items-center min-h-[220px]">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[60%] md:w-[55%] h-8 md:h-10 bg-[var(--color-purple)] -z-10" />
            <div className="w-full max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-6 md:gap-16">
              <div className="relative w-[150px] md:w-[200px] aspect-square flex-shrink-0 md:ml-[35%]">
                <Image src={mascotPage.bio[0].image} alt="Mascot Đần ăn mừng" fill quality={90} sizes="200px" className="object-contain" />
              </div>
              <p className="text-[var(--color-purple)] font-medium text-sm md:text-base leading-snug max-w-xs whitespace-pre-line text-center md:text-left">
                {mascotPage.bio[0].text}
              </p>
            </div>
          </div>

          {/* Row 2: Mascot Lift (Bar from Right) */}
          <div className="relative flex items-center min-h-[220px]">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[70%] md:w-[60%] h-8 md:h-10 bg-[var(--color-purple)] -z-10" />
            <div className="w-full max-w-5xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center md:items-start justify-center md:justify-end gap-6 md:gap-16">
              <p className="text-[var(--color-purple)] font-medium text-sm md:text-base leading-snug max-w-xs whitespace-pre-line text-center md:text-left">
                {mascotPage.bio[1].text}
              </p>
              <div className="relative w-[220px] md:w-[316px] aspect-[316/228] flex-shrink-0 md:mr-[15%]">
                <Image src={mascotPage.bio[1].image} alt="Mascot Đần nâng tạ" fill quality={90} sizes="316px" className="object-contain" />
              </div>
            </div>
          </div>

          {/* Row 3: Mascot Phone (Bar from Right) */}
          <div className="relative flex items-center min-h-[220px]">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[70%] md:w-[55%] h-8 md:h-10 bg-[var(--color-purple)] -z-10" />
            <div className="w-full max-w-5xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center md:items-start justify-center md:justify-end gap-6 md:gap-16">
              <p className="text-[var(--color-purple)] font-medium text-sm md:text-base leading-snug max-w-xs whitespace-pre-line text-center md:text-left">
                {mascotPage.bio[2].text}
              </p>
              <div className="relative w-[180px] md:w-[223px] aspect-square flex-shrink-0 md:mr-[30%]">
                <Image src={mascotPage.bio[2].image} alt="Mascot Đần cầm điện thoại" fill quality={90} sizes="223px" className="object-contain" />
              </div>
            </div>
          </div>
        </div>

        <p className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold text-[var(--color-purple)] text-center mt-10 uppercase">
          {mascotPage.closingHeading}
        </p>
      </section>

      <section>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/mascot-dan/closing-banner.png" alt={mascotPage.closingBanner} className="w-full h-auto" />
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
