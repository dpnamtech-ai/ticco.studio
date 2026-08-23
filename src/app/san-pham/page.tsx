import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import ProductCategoryGrid from "@/components/ProductCategoryGrid";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Sản phẩm — Tíc Cơ",
  description: "Toàn bộ sản phẩm Tíc Cơ: văn phòng phẩm, in ấn, túi xách, thời trang, phụ kiện đời sống.",
};

export default async function SanPhamPage() {
  const products = await getProducts();
  const newArrivals = products.slice(0, 4);

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-4">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-[var(--color-purple)] mb-10">
          Hàng mới về
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {newArrivals.map((product, i) => (
            <ProductCard key={product.id} {...product} index={i} />
          ))}
        </div>
      </section>

      <ProductCategoryGrid products={products} />
    </>
  );
}
