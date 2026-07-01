import DanCursor from "@/components/DanCursor";
import PromoBar from "@/components/PromoBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandSection from "@/components/BrandSection";
import CollectionsSection from "@/components/CollectionsSection";
import GiftGuide from "@/components/GiftGuide";
import UGCSection from "@/components/UGCSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <DanCursor />
      <PromoBar />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <BrandSection />
        <CollectionsSection />
        <GiftGuide />
        <UGCSection />
      </main>
      <Footer />
    </>
  );
}
