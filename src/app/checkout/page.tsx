import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Thanh toán — Tíc Cơ",
  description: "Nhập thông tin nhận hàng và chuyển khoản qua mã VietQR.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
