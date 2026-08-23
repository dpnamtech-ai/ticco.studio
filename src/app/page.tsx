import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandSection from "@/components/BrandSection";
import ProductCategoryGrid from "@/components/ProductCategoryGrid";
import CollectionsSection from "@/components/CollectionsSection";
import GiftGuide from "@/components/GiftGuide";
import UGCSection from "@/components/UGCSection";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      <HeroSection />
      <FeaturedProducts products={products} />
      <BrandSection />
      <ProductCategoryGrid products={products} />
      <CollectionsSection />
      <GiftGuide />
      <UGCSection />
    </>
  );
}
