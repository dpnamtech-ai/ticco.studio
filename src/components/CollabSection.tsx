"use client";

import { projects } from "@/data/content";
import ProjectCard from "./ProjectCard";

// Exact 3 items + order shown in the Figma "trang-chu" frame's "du-an-collab" row.
const HOMEPAGE_IDS = ["freezedom-thu-roi-nghi-di", "neenee-dau-doi-mu-chan-vao-doi", "le-hoi-doc-lap"];

export default function CollabSection() {
  const featured = HOMEPAGE_IDS.map((id) => projects.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <section>
      <div className="bg-[var(--color-purple)] text-white py-3 px-6 text-left text-sm font-bold tracking-wide uppercase">
        Dự án chung tay hợp tác
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-end mb-10">
          <a
            href="/kham-pha"
            className="text-sm font-semibold uppercase tracking-wide text-[var(--color-purple)] hover:underline"
          >
            Xem chi tiết →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {featured.map((project, i) => (
            <ProjectCard key={project.id} title={project.title} image={project.image} index={i} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
