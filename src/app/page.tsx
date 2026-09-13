import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandSection from "@/components/BrandSection";
import CollabSection from "@/components/CollabSection";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

// Exact 12 items + order shown in the Figma "trang-chu" frame's "danh-muc-san-pham" preview grid.
const CATEGORY_PREVIEW_IDS = [
  "box-set-tim-kiem-dieu-ky-dieu",
  "gile-yen-tam",
  "bst-dan-sinh-ton",
  "so-can-ban",
  "tui-song-cu-khoi",
  "sticker-07-dan-noi",
  "tui-vung-vang",
  "sticker-05-ban-lam-duoc-ma",
  "khan-bandana-van-su-tuy-minh",
  "tote-xoi-loi-voi-doi",
  "lot-coc-ra-khoi",
  "bst-postcard-triet-ly-song-dan",
];

export default async function Home() {
  const products = await getProducts();
  const categoryPreview = CATEGORY_PREVIEW_IDS.map((id) => products.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={products} />
      <BrandSection />

      <section id="danh-muc">
        <div className="bg-[var(--color-purple)] text-white py-3 px-6 text-center text-sm font-bold tracking-wide uppercase">
          Danh mục sản phẩm
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {categoryPreview.map((product, i) => (
              <ProductCard key={product.id} {...product} index={i} />
            ))}
          </div>

          <div className="text-center">
            <a
              href="/san-pham"
              className="inline-block bg-[var(--color-orange)] text-white font-semibold uppercase tracking-wide px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Xem tất cả sản phẩm →
            </a>
          </div>
        </div>
      </section>

      <CollabSection />
    </>
  );
}
