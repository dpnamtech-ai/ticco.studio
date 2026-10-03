"use client";
import Link from "next/link";
import Reveal from "@/components/Reveal";

import { projects } from "@/data/content";
import ProjectCard from "./ProjectCard";
import type { ImageTransform } from "@/lib/figmaCrop";
import { useLang, useT } from "@/components/LangSwitch";
import { localize } from "@/lib/i18n";

// Exact 3 items + order shown in the Figma "trang-chu" frame's "du-an-collab" row.
const HOMEPAGE_IDS = ["freezedom-thu-roi-nghi-di", "neenee-dau-doi-mu-chan-vao-doi", "le-hoi-doc-lap"];

// Figma caption copy (own line breaks / casing) for the 3 homepage collab cards.
const FIGMA_TITLES: Record<string, string> = {
  "freezedom-thu-roi-nghi-di": "FREEZEDOM X TÍC CƠ:\nTHU RỒI NGHỈ ĐI",
  "neenee-dau-doi-mu-chan-vao-doi": "NEE NEE X TÍC CƠ:\nBST MŨ - ĐẦU ĐỘI TRỜI, CHÂN ĐẠP ĐẤT",
  "le-hoi-doc-lap": "Tíc Cơ tại Khu vực trải nghiệm LỄ HỘI ĐỘC LẬP",
};

// DEMO Figma swapped the 3 photos (DSC02985 2, the NeeNee mũ shot, IMG_5860 1); each keeps its Figma crop.
const FIGMA_IMAGES: Record<string, { src: string; crop: ImageTransform }> = {
  "freezedom-thu-roi-nghi-di": {
    src: "/images/figma/68b96ea928c76397848ee071722f4a1e8b4218f5.webp",
    crop: [[0.68453, 0, 0.137814], [0, 0.661255, 0.273814]],
  },
  "neenee-dau-doi-mu-chan-vao-doi": {
    src: "/images/figma/f2cf54a35f7450b5c8064f681e3305bf3ab43488.webp",
    crop: [[0.414938, 0, 0.291371], [0, 0.451194, 0.286401]],
  },
  "le-hoi-doc-lap": {
    src: "/images/figma/ee4d09678fea0a86f17881541f07849441b481a9.webp",
    crop: [[0.919737, 0, 0.008994], [0, 1, 0]],
  },
};

export default function CollabSection() {
  const lang = useLang();
  const t = useT();
  const featured = HOMEPAGE_IDS.map((id) => projects.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <section className="bg-[var(--color-orange)] [container-type:inline-size]">
      <div className="bg-[var(--color-purple)] text-white h-[80px] lg:h-[6.25cqw] flex items-center pl-6 lg:pl-[6.328cqw] text-[20px] lg:text-[1.5625cqw] font-semibold tracking-[-0.8px] uppercase">
        <Reveal variant="mask" duration={0.9} className="lg:leading-[7.031cqw]">{t("Dự án chung tay hợp tác")}</Reveal>
      </div>

      <div className=" [container-type:inline-size]">
      {/* Figma (orange part, 730 tall): "XEM CHI TIẾT >" box y26 (lh 90), photos y120, captions y589 */}
      <div className="lg:w-[84.766cqw] mx-auto lg:ml-[7.188cqw] px-6 lg:px-0 pt-[26px] lg:pt-[2.031cqw] pb-[108px] lg:pb-[8.047cqw]">
        <div className="flex justify-end mb-[10px] lg:mb-0">
          <Link
            href={localize("/kham-pha", lang)}
            className="text-[20px] lg:text-[1.5625cqw] lg:leading-[7.031cqw] lg:tracking-[-0.0625cqw] font-semibold uppercase text-white hover:underline"
          >
            {t("Xem chi tiết >")}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-x-[6.172cqw] lg:mt-[0.313cqw]">
          {featured.map((project, i) => (
            <ProjectCard key={project.id} title={t(FIGMA_TITLES[project.id] ?? project.title)} image={FIGMA_IMAGES[project.id]?.src ?? project.image} crop={FIGMA_IMAGES[project.id]?.crop} index={i} href={localize(project.articleHref, lang)} compact onOrange />
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
