import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import DanCursor from "@/components/DanCursor";
import PromoBar from "@/components/PromoBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
    images: ["/images/hero-basket.jpg"],
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
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <CartProvider>
          <DanCursor />
          <PromoBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
