import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

const body = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const heading = Syne({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ticco-Vibe — Quà nhỏ, cảm xúc lớn",
  description:
    "Ticco-Vibe là lifestyle brand bán sticker, túi, móc khoá và những món quà nhỏ đầy cá tính. Tìm quà sinh nhật, quà valentine, quà đồng nghiệp ý nghĩa tại đây.",
  keywords: ["mua quà", "quà sinh nhật", "sticker", "móc khoá", "quà tặng", "lifestyle brand"],
  openGraph: {
    title: "Ticco-Vibe — Quà nhỏ, cảm xúc lớn",
    description: "Sticker, túi, móc khoá và những món quà nhỏ đầy cá tính.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${body.variable} ${heading.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
