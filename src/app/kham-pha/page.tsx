import type { Metadata } from "next";
import { projects } from "@/data/content";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Khám phá — Tíc Cơ",
  description: "Các dự án hợp tác, sự kiện và dự án riêng của Tíc Cơ.",
};

export default function KhamPhaPage() {
  const hopTac = projects.filter((p) => p.group === "hop-tac");
  const event = projects.filter((p) => p.group === "event");
  const rieng = projects.filter((p) => p.group === "rieng");

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)] uppercase mb-10">
          Dự án chung tay hợp tác
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hopTac.map((p, i) => (
            <ProjectCard key={p.id} title={p.title} productHref={p.productHref} articleHref={p.articleHref} image={p.image} index={i} />
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-orange)] px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white uppercase mb-10">
            Event
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {event.map((p, i) => (
              <ProjectCard key={p.id} title={p.title} productHref={p.productHref} articleHref={p.articleHref} image={p.image} index={i} onOrange />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)] uppercase mb-10">
          Dự án riêng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rieng.map((p, i) => (
            <ProjectCard key={p.id} title={p.title} productHref={p.productHref} articleHref={p.articleHref} image={p.image} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
