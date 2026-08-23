import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandSection from "@/components/BrandSection";
import ProductCategoryGrid from "@/components/ProductCategoryGrid";
import CollectionsSection from "@/components/CollectionsSection";
import GiftGuide from "@/components/GiftGuide";
import UGCSection from "@/components/UGCSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <BrandSection />
      <ProductCategoryGrid />
      <CollectionsSection />
      <GiftGuide />
      <UGCSection />
    </>
  );
}
