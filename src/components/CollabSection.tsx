"use client";
import Reveal from "@/components/Reveal";

import { projects } from "@/data/content";
import ProjectCard from "./ProjectCard";

// Exact 3 items + order shown in the Figma "trang-chu" frame's "du-an-collab" row.
const HOMEPAGE_IDS = ["freezedom-thu-roi-nghi-di", "neenee-dau-doi-mu-chan-vao-doi", "le-hoi-doc-lap"];

// Figma caption copy (own line breaks / casing) for the 3 homepage collab cards.
const FIGMA_TITLES: Record<string, string> = {
  "freezedom-thu-roi-nghi-di": "FREEZEDOM X TÍC CƠ:\nTHU RỒI NGHỈ ĐI",
  "neenee-dau-doi-mu-chan-vao-doi": "NEE NEE X TÍC CƠ:\nBST MŨ - ĐẦU ĐỘI TRỜI, CHÂN ĐẠP ĐẤT",
  "le-hoi-doc-lap": "Tíc Cơ tại Khu vực trải nghiệm LỄ HỘI ĐỘC LẬP",
};

export default function CollabSection() {
  const featured = HOMEPAGE_IDS.map((id) => projects.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <section className="bg-[var(--color-orange)] [container-type:inline-size]">
      <div className="bg-[var(--color-purple)] text-white h-[80px] lg:h-[6.25cqw] flex items-center pl-6 lg:pl-[6.328cqw] text-[20px] lg:text-[1.5625cqw] font-semibold tracking-[-0.8px] uppercase">
        <Reveal variant="mask" duration={0.9}>Dự án chung tay hợp tác</Reveal>
      </div>

      <div className="max-w-[1280px] mx-auto [container-type:inline-size]">
      <div className="lg:w-[84.844cqw] mx-auto px-6 lg:px-0 pt-[26px] lg:pt-[2.031cqw] pb-[108px] lg:pb-[8.438cqw]">
        <div className="flex justify-end mb-[10px]">
          <a
            href="/kham-pha"
            className="text-[20px] lg:text-[1.5625cqw] font-semibold uppercase text-white/90 hover:text-white hover:underline"
          >
            Xem chi tiết &gt;
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-x-[6.172cqw] lg:mt-[0.781cqw]">
          {featured.map((project, i) => (
            <ProjectCard key={project.id} title={FIGMA_TITLES[project.id] ?? project.title} image={project.id === "freezedom-thu-roi-nghi-di" ? "/images/collab/freezedom-thu-roi-nghi-di.jpg" : project.image} index={i} compact onOrange />
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
