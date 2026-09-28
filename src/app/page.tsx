import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandSection from "@/components/BrandSection";
import CollabSection from "@/components/CollabSection";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import Reveal from "@/components/Reveal";
import { HOME_CATEGORY, figmaCardProps } from "@/data/figma-cards";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={products} />
      <BrandSection />

      <section id="danh-muc">
        <div className="relative [container-type:inline-size] lg:-mt-[0.234cqw]">
          <Reveal variant="wipe" duration={1}>
            {/* Figma "headline - danh muc san pham" 1280x90: purple bar y3 h80, text at x78 y0 */}
            <div className="relative" style={{ height: "7.031cqw" }}>
            <div className="absolute inset-x-0 bg-[var(--color-purple)]" style={{ top: "0.234cqw", height: "6.250cqw" }} />
            <h2 className="absolute font-semibold uppercase text-white whitespace-nowrap" style={{ left: "6.094cqw", top: "0.000cqw", fontSize: "1.5625cqw", lineHeight: "7.031cqw", letterSpacing: "-0.0625cqw" }}>
              Danh mục sản phẩm:
            </h2>
          </div>
          </Reveal>
          <Link href="/san-pham" className="hidden lg:block absolute lg:left-[79.453cqw] lg:top-[8.594cqw] lg:text-[1.5625cqw] font-semibold uppercase text-[var(--color-purple)] hover:underline">
            Tất cả sản phẩm &gt;
          </Link>
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
              href="/san-pham"
              className="inline-block lg:text-[2.344cqw] lg:leading-[7.031cqw] lg:tracking-[-0.094cqw] text-[30px] font-medium uppercase text-[var(--color-purple)] underline decoration-2 underline-offset-[1.1cqw] hover:opacity-80"
            >
              Tất cả sản phẩm
            </Link>
          </div>
        </div>
        </div>
      </section>

      <CollabSection />
    </>
  );
}
