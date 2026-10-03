import type { Metadata } from "next";
import GioHangClient from "./GioHangClient";
import { getLang } from "@/lib/lang";
import { t } from "@/lib/t";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("Giỏ hàng — Tíc Cơ", lang),
    description: t("Xem lại sản phẩm trong giỏ hàng trước khi thanh toán.", lang),
    robots: { index: false, follow: true },
  };
}

export default function GioHangPage() {
  return <GioHangClient />;
}
