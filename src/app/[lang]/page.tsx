import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandSection from "@/components/BrandSection";
import CollabSection from "@/components/CollabSection";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import Reveal from "@/components/Reveal";
import { HOME_CATEGORY, figmaCardProps } from "@/data/figma-cards";
import { getLang } from "@/lib/lang";
import { alternatesFor, localize } from "@/lib/i18n";
import { t } from "@/lib/t";
import { FigmaMobile } from "@/components/FigmaCanvas";
import { figmaMobile } from "@/data/project-pages";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("Tíc Cơ — Sổ tay, túi tote, sticker & quà tặng thương hiệu Việt", lang),
    description: t("Sổ tay, túi tote, sticker, postcard, móc khoá Đần và quà tặng đầy cá tính từ thương hiệu Việt Tíc Cơ. Giao toàn quốc, free ship đơn từ 500k.", lang),
    alternates: alternatesFor("/", lang),
  };
}

export default async function Home() {
  const products = await getProducts();
  const lang = await getLang();

  return (
    <>
      {/* phones: the client's mobile Figma frame; this markup is the desktop design */}
      <FigmaMobile page={figmaMobile["trang-chu"]} lang={lang} />
      <div className="max-lg:hidden">
      <HeroSection />
      <FeaturedProducts products={products} />
      <BrandSection />

      <section id="danh-muc">
        {/* -mt at every width so the section above covers the 3 Figma px strip above the bar (else a white line on phones) */}
        <div className="relative [container-type:inline-size] -mt-[0.234cqw]">
          <Reveal variant="wipe" duration={1}>
            {/* Figma "headline - danh muc san pham" 1280x90: purple bar y3 h80, text at x78 y0.
                max(): exact Figma on desktop; phones get a >=44px bar and >=15px text, centred */}
            <div className="relative" style={{ height: "max(7.031cqw, calc(44px + 0.468cqw))" }}>
            <div className="absolute inset-x-0 bg-[var(--color-purple)]" style={{ top: "0.234cqw", height: "max(6.250cqw, 44px)" }} />
            {/* Figma 2026-09-29: "NHỮNG THỨ CHÚNG TÔI CÓ!" at x71, 5px above the old text box */}
            <h2 className="absolute font-semibold uppercase text-white whitespace-nowrap" style={{ left: "5.547cqw", top: "-0.391cqw", fontSize: "max(15px, 1.5625cqw)", lineHeight: "max(7.031cqw, calc(44px + 0.468cqw))", letterSpacing: "-0.0625cqw" }}>
              {t("Những thứ chúng tôi có!", lang)}
            </h2>
          </div>
          </Reveal>
        </div>

        <div className="bg-[#f2f1f1]">
        <div className=" [container-type:inline-size] px-6 lg:px-0 pt-10 lg:pt-[8.516cqw] pb-12 lg:pb-[3.36cqw]">
          <div className="lg:w-[84.844cqw] mx-auto lg:ml-[7.266cqw] grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-[6.406cqw] gap-y-[22px] lg:gap-y-[1.719cqw]">
            {/* Figma rows at y2184 / 2551 / 2935: 22px after row 1, 39px after row 2 */}
            {HOME_CATEGORY.map((card, i) => (
              <div key={`${card.id}-${i}`} className={i >= 8 ? "lg:mt-[1.328cqw]" : undefined}>
                <ProductCard {...figmaCardProps(card, products)} index={i} compact />
              </div>
            ))}
          </div>

          <div className="text-center mt-8 lg:mt-0">
            <Link
              href={localize("/san-pham", lang)}
              className="inline-block lg:text-[2.344cqw] lg:leading-[7.031cqw] lg:tracking-[-0.094cqw] text-[30px] font-medium uppercase text-[var(--color-purple)] underline decoration-2 underline-offset-[1.1cqw] hover:opacity-80"
            >
              {t("Tất cả sản phẩm", lang)}
            </Link>
          </div>
        </div>
        </div>
      </section>

      <CollabSection />
      </div>
    </>
  );
}
