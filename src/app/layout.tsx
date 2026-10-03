import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import DanCursor from "@/components/DanCursor";
import DanRain from "@/components/DanRain";
import PromoBar from "@/components/PromoBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";
import { CartProvider } from "@/context/CartContext";
import { SITE_URL, SOCIALS } from "@/lib/site";
import { getProducts } from "@/lib/products";
import { brand } from "@/data/content";

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
  metadataBase: new URL(SITE_URL),
  applicationName: "Tíc Cơ",
  // Search Console / Bing Webmaster ownership: paste each tool's verification code into these Vercel env vars.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  twitter: { card: "summary_large_image" },
  title: {
    default: "Tíc Cơ — Đời dễ ợt, vợt Tíc Cơ",
    template: "%s",
  },
  description:
    "Tíc Cơ — thương hiệu Việt bán sổ tay, túi, in ấn và quà tặng nhỏ đầy cá tính, lấy cảm hứng từ chất liệu đời thường.",
  keywords: ["Tíc Cơ", "ticco studio", "sổ tay", "văn phòng phẩm", "túi tote", "sticker", "postcard", "quà tặng", "quà sinh nhật", "móc khoá", "mascot Đần", "thương hiệu Việt"],
  openGraph: {
    siteName: "Tíc Cơ",
    locale: "vi_VN",
    title: "Tíc Cơ — Đời dễ ợt, vợt Tíc Cơ",
    description: "Sổ tay, túi, in ấn và những món đồ nhỏ đầy cá tính.",
    type: "website",
    images: ["/images/hero-basket.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // product id -> photo, so carts saved before the cart stored photos (grey boxes) get one back
  const cartImages = Object.fromEntries((await getProducts()).flatMap((p) => (p.image ? [[p.id, p.image]] : [])));
  // Brand + site entities for search engines and AI answers (GEO): who Tíc Cơ is, where it lives, how to search it.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "OnlineStore"],
        "@id": `${SITE_URL}/#org`,
        name: "Tíc Cơ",
        alternateName: ["Tíc Cơ Studios", "ticco.studios"],
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo-tic-co.png`,
        description: brand.mission.split("\n")[0],
        foundingDate: "2024",
        email: brand.email,
        sameAs: SOCIALS,
        contactPoint: { "@type": "ContactPoint", contactType: "customer service", email: brand.email, availableLanguage: ["vi"] },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Tíc Cơ",
        inLanguage: "vi-VN",
        publisher: { "@id": `${SITE_URL}/#org` },
        potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/tim-kiem?q={search_term_string}`, "query-input": "required name=search_term_string" },
      },
    ],
  };

  return (
    <html lang="vi" className={beVietnam.variable} suppressHydrationWarning>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <CartProvider images={cartImages}>
          <ScrollProgress />
          <DanCursor />
          <DanRain />
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
