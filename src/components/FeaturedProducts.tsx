"use client";

import { productLines } from "@/data/content";
import ProductCard from "./ProductCard";

// Exact 4 items + order shown in the Figma "trang-chu" frame's featured-products row.
const FEATURED_IDS = ["bst-dan-sinh-ton", "tui-song-cu-khoi", "so-can-ban", "gile-yen-tam"];

export default function FeaturedProducts() {
  const featured = FEATURED_IDS.map((id) => productLines.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <section id="products">
      <div className="bg-[var(--color-purple)] text-white py-3 px-6 text-center text-sm font-bold tracking-wide uppercase">
        Chú ý! Sản phẩm đáng chú ý!
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">
            Hàng mới về
          </h2>
          <a
            href="#danh-muc"
            className="text-sm font-semibold text-[var(--color-purple)] hover:underline"
          >
            Tất cả sản phẩm →
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product, i) => (
            <ProductCard key={product.id} {...product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
