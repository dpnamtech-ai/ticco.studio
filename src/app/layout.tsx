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
  title: "Tíc Cơ — Đời dễ ợt, vợt Tíc Cơ",
  description:
    "Tíc Cơ là thương hiệu Việt bán sổ tay, túi, in ấn và những món đồ nhỏ đầy cá tính lấy cảm hứng từ chất liệu đời thường. Tìm quà sinh nhật, quà valentine, quà đồng nghiệp ý nghĩa tại đây.",
  keywords: ["sổ tay", "quà sinh nhật", "văn phòng phẩm", "túi tote", "quà tặng", "Tíc Cơ"],
  openGraph: {
    title: "Tíc Cơ — Đời dễ ợt, vợt Tíc Cơ",
    description: "Sổ tay, túi, in ấn và những món đồ nhỏ đầy cá tính.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="grain">
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
