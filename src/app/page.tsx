import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandSection from "@/components/BrandSection";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      <HeroSection />
      <FeaturedProducts products={products} />
      <BrandSection />

      <section>
        <div className="bg-[var(--color-purple)] text-white py-3 px-6 text-center text-sm font-bold tracking-wide uppercase">
          Danh mục sản phẩm
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <Link
            href="/san-pham"
            className="inline-block bg-[var(--color-orange)] text-white font-semibold uppercase tracking-wide px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
          >
            Xem tất cả sản phẩm →
          </Link>
        </div>
      </section>
    </>
  );
}
