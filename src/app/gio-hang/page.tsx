import type { Metadata } from "next";
import GioHangClient from "./GioHangClient";

export const metadata: Metadata = {
  title: "Giỏ hàng — Tíc Cơ",
  description: "Xem lại sản phẩm trong giỏ hàng trước khi thanh toán.",
  robots: { index: false, follow: true },
};

export default function GioHangPage() {
  return <GioHangClient />;
}
