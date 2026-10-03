import type { Metadata } from "next";
import FigmaCanvas from "@/components/FigmaCanvas";
import { figmaPages } from "@/data/project-pages";

export const metadata: Metadata = {
  title: "Khám phá — Dự án, hợp tác & sự kiện của Tíc Cơ",
  description: "Các dự án vui, dự án hợp tác (Freezedom, Neenee) và sự kiện của Tíc Cơ: Người Việt Vận Động, Chúc Tết Nhau Thật Sự, Lễ hội Độc Lập…",
  alternates: { canonical: "/kham-pha" },
};

// Layout = Figma DEMO frame "kham-pha" (671:434); section anchors #du-an-rieng / #du-an-hop-tac / #su-kien
// are used by the navbar's "Khám phá" sub-menu.
export default function KhamPhaPage() {
  return <FigmaCanvas page={figmaPages["kham-pha"]} />;
}
