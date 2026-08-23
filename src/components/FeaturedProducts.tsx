"use client";

import { productLines } from "@/data/content";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
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
          {productLines.map((product, i) => (
            <ProductCard key={product.id} {...product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
