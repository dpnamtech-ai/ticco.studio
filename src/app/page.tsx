import Link from "next/link";
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
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/headline-danh-muc.png" alt="Danh mục sản phẩm:" className="w-full h-auto" />
          <Link href="/san-pham" className="hidden lg:block absolute right-[89px] top-[110px] text-[20px] font-semibold uppercase text-[var(--color-purple)] hover:underline">
            Tất cả sản phẩm &gt;
          </Link>
        </div>

        <div className="px-6 pt-10 lg:pt-[109px] pb-12 lg:pb-[48px] bg-[#f2f1f1]">
          <div className="max-w-[1086px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-[82px] gap-y-[22px]">
            {categoryPreview.map((product, i) => (
              <ProductCard key={product.id} {...product} index={i} compact />
            ))}
          </div>

          <div className="text-center mt-8 lg:mt-0">
            <Link
              href="/san-pham"
              className="text-[30px] font-medium uppercase text-[var(--color-purple)] hover:underline"
            >
              Tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      <CollabSection />
    </>
  );
}
