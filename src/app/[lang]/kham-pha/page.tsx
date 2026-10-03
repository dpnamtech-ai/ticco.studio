import type { Metadata } from "next";
import FigmaCanvas from "@/components/FigmaCanvas";
import { figmaPages } from "@/data/project-pages";
import { getLang } from "@/lib/lang";
import { alternatesFor } from "@/lib/i18n";
import { t } from "@/lib/t";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t("Khám phá — Dự án, hợp tác & sự kiện của Tíc Cơ", lang),
    description: t("Các dự án vui, dự án hợp tác (Freezedom, Neenee) và sự kiện của Tíc Cơ: Người Việt Vận Động, Chúc Tết Nhau Thật Sự, Lễ hội Độc Lập…", lang),
    alternates: alternatesFor("/kham-pha", lang),
  };
}

// Layout = Figma DEMO frame "kham-pha" (671:434); section anchors #du-an-rieng / #du-an-hop-tac / #su-kien
// are used by the navbar's "Khám phá" sub-menu.
export default async function KhamPhaPage() {
  return <FigmaCanvas page={figmaPages["kham-pha"]} lang={await getLang()} />;
}
