import type { Metadata } from "next";
import localFont from "next/font/local";
import { Be_Vietnam_Pro } from "next/font/google";
import "../globals.css";
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
import { notFound } from "next/navigation";
import { DEFAULT_LANG, LANGS, isLang } from "@/lib/i18n";
import { t } from "@/lib/t";
import { brand } from "@/data/content";

// Figma specifies "Be Vietnam" (the original family), not "Be Vietnam Pro" —
// different letterforms/metrics, not a version alias. Not in next/font/google's
// bundled list (deprecated upstream), so self-hosted here from Google Fonts' own
// files (latin + vietnamese subsets, weights 300-800 per the design).
const beVietnam = localFont({
  variable: "--font-be-vietnam",
  src: [
    { path: "../../fonts/be-vietnam/be-vietnam-latin-300.woff2", weight: "300", style: "normal" },
    { path: "../../fonts/be-vietnam/be-vietnam-vietnamese-300.woff2", weight: "300", style: "normal" },
    { path: "../../fonts/be-vietnam/be-vietnam-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/be-vietnam/be-vietnam-vietnamese-400.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/be-vietnam/be-vietnam-latin-500.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/be-vietnam/be-vietnam-vietnamese-500.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/be-vietnam/be-vietnam-latin-600.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/be-vietnam/be-vietnam-vietnamese-600.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/be-vietnam/be-vietnam-latin-700.woff2", weight: "700", style: "normal" },
    { path: "../../fonts/be-vietnam/be-vietnam-vietnamese-700.woff2", weight: "700", style: "normal" },
    { path: "../../fonts/be-vietnam/be-vietnam-latin-800.woff2", weight: "800", style: "normal" },
    { path: "../../fonts/be-vietnam/be-vietnam-vietnamese-800.woff2", weight: "800", style: "normal" },
  ],
});

// Some Figma texts (project pages, phone frames) are set in Be Vietnam Pro: same name, wider letters. Used where the
// Figma layer says so (FigText.pro), so line breaks and weight match the design.
const beVietnamPro = Be_Vietnam_Pro({ variable: "--font-be-vietnam-pro", subsets: ["latin", "vietnamese"], weight: ["300", "400", "500", "600"], display: "swap" });

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang: l } = await params;
  const lang = isLang(l) ? l : DEFAULT_LANG;
  const T = (s: string) => t(s, lang);
  return {
  metadataBase: new URL(SITE_URL),
  applicationName: "Tíc Cơ Studios",
  // Search Console / Bing Webmaster ownership: paste each tool's verification code into these Vercel env vars.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  twitter: { card: "summary_large_image" },
  // the client's round logo (design/logo-tic-co-tron.png) as tab / home-screen icon
  icons: { icon: [{ url: "/favicon-48.png", sizes: "48x48" }, { url: "/icon-192.png", sizes: "192x192" }, { url: "/icon-512.png", sizes: "512x512" }], apple: "/apple-touch-icon.png" },
  title: {
    default: "Tíc Cơ Studios",
    template: "%s",
  },
  // link previews (Zalo, Messenger, Facebook): client's own wording, 2026-10-05
  description: T("Thương hiệu Việt với các sản phẩm tiêu dùng sáng tạo lấy cảm hứng từ chất liệu đời thường, do người trẻ Việt thiết kế."),
  keywords: ["Tíc Cơ", "ticco studio", "sổ tay", "văn phòng phẩm", "túi tote", "sticker", "postcard", "quà tặng", "quà sinh nhật", "móc khoá", "mascot Đần", "thương hiệu Việt"].map(T),
  openGraph: {
    siteName: "Tíc Cơ Studios",
    locale: lang === "en" ? "en_US" : "vi_VN",
    alternateLocale: lang === "en" ? "vi_VN" : "en_US",
    title: "Tíc Cơ Studios",
    description: T("Thương hiệu Việt với các sản phẩm tiêu dùng sáng tạo lấy cảm hứng từ chất liệu đời thường, do người trẻ Việt thiết kế."),
    type: "website",
    // link-preview card: the client's round logo on brand orange, 1200x630 (2026-10-11)
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Tíc Cơ" }],
  },
  };
}

// Both languages are prerendered; any other /xx/ segment is a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  // product id -> photo, so carts saved before the cart stored photos (grey boxes) get one back
  const cartImages = Object.fromEntries((await getProducts()).flatMap((p) => (p.image ? [[p.id, p.image]] : [])));
  // Brand + site entities for search engines and AI answers (GEO): who Tíc Cơ is, where it lives, how to search it.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "OnlineStore"],
        "@id": `${SITE_URL}/#org`,
        name: "Tíc Cơ Studios",
        alternateName: ["Tíc Cơ", "ticco.studios"],
        url: SITE_URL,
        // square logo (Google needs >= 112px square for the brand logo)
        logo: `${SITE_URL}/icon-512.png`,
        description: t(brand.mission.split("\n")[0], lang),
        foundingDate: "2024",
        email: brand.email,
        sameAs: SOCIALS,
        contactPoint: { "@type": "ContactPoint", contactType: "customer service", email: brand.email, availableLanguage: ["vi"] },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        // Google shows this as the site name above results (client: "Tíc Cơ Studios" only)
        name: "Tíc Cơ Studios",
        alternateName: ["Tíc Cơ", "ticcostudios.com"],
        inLanguage: lang === "en" ? "en" : "vi-VN",
        publisher: { "@id": `${SITE_URL}/#org` },
        potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/tim-kiem?q={search_term_string}`, "query-input": "required name=search_term_string" },
      },
    ],
  };

  return (
    // rem = 16px up to a 1280 viewport, then grows with the page, so the Tailwind-built pages (policies, cart, checkout,
    // search, the drawers) scale on big screens like the Figma pages (client 08/10). Set here, not in globals.css: a
    // Vercel build reused its cached CSS and shipped without it.
    <html lang={lang} className={`${beVietnam.variable} ${beVietnamPro.variable}`} style={{ fontSize: "max(16px, calc(100vw / 80))" }} suppressHydrationWarning>
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
