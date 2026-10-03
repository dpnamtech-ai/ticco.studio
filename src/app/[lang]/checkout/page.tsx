import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";
import { getLang } from "@/lib/lang";
import { t } from "@/lib/t";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("Thanh toán — Tíc Cơ", lang),
    description: t("Nhập thông tin nhận hàng và chuyển khoản qua mã VietQR.", lang),
    robots: { index: false, follow: false },
  };
}

export default function CheckoutPage() {
  return <CheckoutClient />;
}
