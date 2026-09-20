"use client";
import Reveal from "@/components/Reveal";

import Link from "next/link";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

// Exact 4 items + order shown in the Figma "trang-chu" frame's featured-products row.
const FEATURED_IDS = ["bst-dan-sinh-ton", "tui-song-cu-khoi", "so-can-ban", "gile-yen-tam"];

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = FEATURED_IDS.map((id) => products.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <section id="products">
      <div className="relative [container-type:inline-size] lg:-mt-[1.0156cqw]">
        <Reveal variant="wipe" duration={1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/headline-featured.png" alt="Chú ý! Sản phẩm đáng chú ý!" className="w-full h-auto" />
        </Reveal>
        <Link
          href="/san-pham"
          className="hidden lg:block absolute lg:right-[7.578cqw] lg:top-[6.641cqw] lg:text-[1.5625cqw] font-semibold uppercase text-[var(--color-purple)] hover:underline"
        >
          Tất cả sản phẩm &gt;
        </Link>
      </div>

      <div className="max-w-[1280px] mx-auto [container-type:inline-size] px-6 pt-10 lg:pt-[5.078cqw] pb-12 lg:pb-[3.594cqw]">
        <div className="lg:w-[84.844cqw] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-[6.406cqw] gap-y-[22px] lg:gap-y-[1.719cqw]">
          {featured.map((product, i) => (
            <ProductCard key={product.id} {...product} index={i} displayName={product.id === "so-can-ban" ? "BỘ SƯU TẬP SỔ CĂN BẢN" : undefined} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
