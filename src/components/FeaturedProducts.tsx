"use client";
import Reveal from "@/components/Reveal";

import Link from "next/link";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import { HOME_FEATURED, figmaCardProps } from "@/data/figma-cards";


export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section id="products">
      {/* -mt at every width: the bar starts 10 Figma px down, so the hero must overlap that strip or it shows as a white line */}
      <div className="relative [container-type:inline-size] -mt-[1.0156cqw]">
        <Reveal variant="wipe" duration={1}>
          {/* Figma "headline" 1280x95: purple bar y10 h75, 600 20/90 text at x97 y4.
              max(): exact Figma on desktop; on phones the bar is >=44px and the text >=15px, text stays centred in the bar */}
          <div className="relative" style={{ height: "max(7.422cqw, calc(44px + 1.563cqw))" }}>
            <div className="absolute inset-x-0 bg-[var(--color-purple)]" style={{ top: "0.781cqw", height: "max(5.859cqw, 44px)" }} />
            <h2 className="absolute font-semibold uppercase text-white whitespace-nowrap" style={{ left: "7.578cqw", top: "0.312cqw", fontSize: "max(15px, 1.5625cqw)", lineHeight: "max(7.031cqw, calc(44px + 0.938cqw))", letterSpacing: "-0.0625cqw" }}>
              Chú ý! Sản phẩm đáng chú ý!
            </h2>
          </div>
        </Reveal>
        <Link
          href="/san-pham"
          className="hidden lg:block absolute lg:left-[78.828cqw] lg:top-[6.641cqw] lg:text-[1.5625cqw] font-semibold uppercase text-[var(--color-purple)] hover:underline"
        >
          Tất cả sản phẩm &gt;
        </Link>
      </div>

      <div className=" [container-type:inline-size] px-6 lg:px-0 pt-10 lg:pt-[5.078cqw] pb-12 lg:pb-[2.578cqw]">
        <div className="lg:w-[84.844cqw] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-[6.406cqw] gap-y-[22px] lg:gap-y-[1.719cqw]">
          {HOME_FEATURED.map((card, i) => (
            <ProductCard key={card.id} {...figmaCardProps(card, products)} index={i} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
