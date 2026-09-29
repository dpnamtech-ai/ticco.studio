import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FigmaCanvas from "@/components/FigmaCanvas";
import { figmaPages } from "@/data/project-pages";
import { projects } from "@/data/content";

// One page per project, each laid out from its own Figma DEMO frame "du-an-*" (see scripts/gen-project-pages.mjs).
const DESCRIPTIONS: Record<string, string> = {
  "nguoi-viet-van-dong": "Dự án chung vui Lễ Quốc khánh 2025 của Tíc Cơ: vận động không ngừng là vươn lên không dừng.",
  "chuc-tet-nhau-that-su": "Dự án Tết Bính Ngọ 2026 của Tíc Cơ: vì lời chúc là đầu câu chuyện.",
  "lam-moi-doi-di": "Dự án ảnh ọt vui vui chẳng nhân dịp gì của Tíc Cơ.",
  "minh-trong-nha-nha-trong-nuoc": "Dự án chung vui kỷ niệm Ngày Giải phóng miền Nam Thống nhất đất nước 30/04/2024 của Tíc Cơ.",
  "freezedom-thu-roi-nghi-di": "Tíc Cơ và Freezedom cùng bắt tay nghỉ ngơi vào những ngày thu 2025: hộp quà Nghỉ Đi và pop-up event Thu Rồi Nghỉ Đi.",
  "neenee-dau-doi-mu-chan-vao-doi": "Dự án hợp tác sản phẩm mũ giữa Neenee và Tíc Cơ: Đầu đội mũ, Chân vào đời.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(DESCRIPTIONS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = projects.find((p) => p.id === slug)?.title;
  return title ? { title: `${title} — Tíc Cơ`, description: DESCRIPTIONS[slug], alternates: { canonical: `/kham-pha/${slug}` } } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = DESCRIPTIONS[slug] && figmaPages[slug];
  if (!page) notFound();
  return <FigmaCanvas page={page} />;
}
