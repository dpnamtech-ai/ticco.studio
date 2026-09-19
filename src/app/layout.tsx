import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import DanCursor from "@/components/DanCursor";
import PromoBar from "@/components/PromoBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";
import { CartProvider } from "@/context/CartContext";

// Figma specifies "Be Vietnam" (the original family), not "Be Vietnam Pro" —
// different letterforms/metrics, not a version alias. Not in next/font/google's
// bundled list (deprecated upstream), so self-hosted here from Google Fonts' own
// files (latin + vietnamese subsets, weights 300-800 per the design).
const beVietnam = localFont({
  variable: "--font-be-vietnam",
  src: [
    { path: "../fonts/be-vietnam/be-vietnam-latin-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/be-vietnam/be-vietnam-vietnamese-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/be-vietnam/be-vietnam-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/be-vietnam/be-vietnam-vietnamese-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/be-vietnam/be-vietnam-latin-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/be-vietnam/be-vietnam-vietnamese-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/be-vietnam/be-vietnam-latin-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/be-vietnam/be-vietnam-vietnamese-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/be-vietnam/be-vietnam-latin-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/be-vietnam/be-vietnam-vietnamese-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/be-vietnam/be-vietnam-latin-800.woff2", weight: "800", style: "normal" },
    { path: "../fonts/be-vietnam/be-vietnam-vietnamese-800.woff2", weight: "800", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ticcostudio.vercel.app"),
  title: {
    default: "Tíc Cơ — Đời dễ ợt, vợt Tíc Cơ",
    template: "%s",
  },
  description:
    "Tíc Cơ — thương hiệu Việt bán sổ tay, túi, in ấn và quà tặng nhỏ đầy cá tính, lấy cảm hứng từ chất liệu đời thường.",
  keywords: ["sổ tay", "quà sinh nhật", "văn phòng phẩm", "túi tote", "quà tặng", "Tíc Cơ"],
  openGraph: {
    title: "Tíc Cơ — Đời dễ ợt, vợt Tíc Cơ",
    description: "Sổ tay, túi, in ấn và những món đồ nhỏ đầy cá tính.",
    type: "website",
    images: ["/images/hero-basket.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tíc Cơ",
    url: "https://ticcostudio.vercel.app",
    logo: "https://ticcostudio.vercel.app/images/mascot-dan.png",
    sameAs: ["https://www.instagram.com/ticco.studios"],
  };

  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <CartProvider>
          <ScrollProgress />
          <DanCursor />
          <PromoBar />
          <Navbar />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
