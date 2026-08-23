"use client";

import { useState } from "react";
import { productLines, productCategories } from "@/data/content";
import ProductCard from "./ProductCard";

const categories = ["Tất cả sản phẩm", ...productCategories];

export default function ProductCategoryGrid() {
  const [active, setActive] = useState(categories[0]);
  const visible =
    active === categories[0]
      ? productLines
      : productLines.filter((p) => p.category === active);

  return (
    <section id="danh-muc">
      <div className="bg-[var(--color-purple)] text-white py-3 px-6 text-center text-sm font-bold tracking-wide uppercase">
        Danh mục sản phẩm
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-wrap gap-8 pb-4 mb-10 border-b border-[var(--color-ink)]/15 text-sm font-semibold uppercase tracking-wide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={
                active === cat
                  ? "text-[var(--color-ink)]"
                  : "text-[var(--color-ink)]/35 hover:text-[var(--color-ink)]/70 transition-colors"
              }
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {visible.map((product, i) => (
            <ProductCard key={product.id} {...product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
