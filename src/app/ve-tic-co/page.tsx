import type { Metadata } from "next";
import Image from "next/image";
import { aboutPage, brand } from "@/data/content";

export const metadata: Metadata = {
  title: "Về Tíc Cơ",
  description: "Tíc Cơ là thương hiệu Việt với các sản phẩm tiêu dùng sáng tạo, lấy cảm hứng từ chất liệu đời thường, do người trẻ Việt thiết kế.",
};

export default function VeTicCoPage() {
  return (
    <>
      <section className="bg-[var(--color-orange)] text-white px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1fr_auto] gap-10 md:gap-16">
          <div className="space-y-8 leading-relaxed">
            {aboutPage.intro.map((p, i) => (
              <p key={i} className={i === 0 ? "text-lg md:text-xl" : "text-white/90"}>
                {p}
              </p>
            ))}
          </div>

          <div className="space-y-8">
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-extrabold leading-none md:hidden">
              Về Tíc Cơ
            </h1>
            {aboutPage.mission.map((p, i) => (
              <p key={i} className="text-white/90 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <h1 className="hidden md:block font-[family-name:var(--font-heading)] text-6xl font-extrabold leading-none border-b-2 border-white pb-4 self-start">
            Về
            <br />
            Tíc
            <br />
            Cơ
          </h1>
        </div>
      </section>

      <section className="relative text-white">
        <div className="relative aspect-[4/5] md:aspect-[21/9]">
          <Image src="/images/ve-tic-co-statement.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 flex items-center justify-between px-6 md:px-16">
          <div className="font-[family-name:var(--font-heading)] text-3xl md:text-6xl font-extrabold leading-[0.95]">
            {aboutPage.statement.left.map((word) => (
              <p key={word}>{word}</p>
            ))}
          </div>
          <div className="font-[family-name:var(--font-heading)] text-3xl md:text-6xl font-extrabold leading-[0.95] text-right">
            {aboutPage.statement.right.map((word) => (
              <p key={word}>{word}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-orange)] text-white px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-extrabold leading-tight">
            {aboutPage.closing.heading}
          </h2>
          <div className="text-sm text-white/90 space-y-1">
            <p>Liên hệ trao đổi công việc:</p>
            <p>{brand.email}</p>
          </div>
          <div className="text-sm text-white/90 space-y-1">
            <p>@ Tíc Cơ Studios</p>
            <p>{aboutPage.closing.born}</p>
          </div>
          <div className="text-sm text-white/90 space-y-1">
            <p>Gặp Tíc Cơ nhiều hơn tại:</p>
            <a href={brand.facebook} target="_blank" rel="noopener noreferrer" className="block hover:underline">
              Facebook: Tíc Cơ Studios
            </a>
            <a href={brand.instagram} target="_blank" rel="noopener noreferrer" className="block hover:underline">
              Instagram: ticco.studios
            </a>
            <a href={brand.threads} target="_blank" rel="noopener noreferrer" className="block hover:underline">
              Threads: ticco.studios
            </a>
            <a href={brand.tiktok} target="_blank" rel="noopener noreferrer" className="block hover:underline">
              TikTok: Tíc Cơ trong đời
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
