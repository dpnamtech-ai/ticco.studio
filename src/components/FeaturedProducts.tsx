"use client";

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
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/headline-featured.png" alt="Chú ý! Sản phẩm đáng chú ý!" className="w-full h-auto" />
        <Link
          href="/san-pham"
          className="hidden lg:block absolute right-[97px] top-[85px] text-[20px] font-semibold uppercase text-[var(--color-purple)] hover:underline"
        >
          Tất cả sản phẩm &gt;
        </Link>
      </div>

      <div className="px-6 pt-10 lg:pt-[65px] pb-12 lg:pb-[46px]">
        <div className="max-w-[1086px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-[82px] gap-y-[22px]">
          {featured.map((product, i) => (
            <ProductCard key={product.id} {...product} index={i} nameClassName="uppercase" compact />
          ))}
        </div>
      </div>
    </section>
  );
}
