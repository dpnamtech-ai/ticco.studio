import type { Metadata } from "next";
import Image from "next/image";
import { aboutPage, brand } from "@/data/content";

export const metadata: Metadata = {
  title: "Về Tíc Cơ",
  description: "Tíc Cơ là thương hiệu Việt với các sản phẩm tiêu dùng sáng tạo, lấy cảm hứng từ chất liệu đời thường, do người trẻ Việt thiết kế.",
};

// Purple speech-bubble blobs behind the 3 intro/mission paragraphs, positioned
// as % of the section (X0 Y48 W1280 H1044 in the Figma frame) from the
// Rectangle+Ellipse pairs in the "ve-Tic-Co" frame.
const BUBBLES = [
  { left: "0%", top: "14.56%", width: "31.02%", height: "66.95%" },
  { left: "29.45%", top: "34.2%", width: "34.38%", height: "47.32%" },
  { left: "61.72%", top: "51.44%", width: "38.28%", height: "30.08%" },
];

export default function VeTicCoPage() {
  return (
    <>
      <section className="relative bg-[var(--color-orange)] text-white px-6 py-16 md:py-24 overflow-hidden">
        {BUBBLES.map((b, i) => (
          <div key={i} className="absolute rounded-[15%] bg-[#35165a]" style={b} />
        ))}

        <div className="relative max-w-7xl mx-auto grid md:grid-cols-3 gap-10 md:gap-16">
          <p className="text-lg md:text-xl leading-relaxed">{aboutPage.intro[0]}</p>

          <div className="space-y-8 leading-relaxed">
            <p className="text-white/90">{aboutPage.intro[1]}</p>
            <p className="text-white/90">{aboutPage.intro[2]}</p>
          </div>

          <div className="space-y-8">
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-extrabold uppercase leading-none border-b-2 border-white pb-4 text-right w-fit md:ml-auto">
              Về
              <br />
              Tíc
              <br />
              Cơ
            </h1>
            {aboutPage.mission.map((p, i) => (
              <p key={i} className="text-white/90 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="relative text-white">
        <div className="relative aspect-[1280/902]">
          <Image src="/images/ve-tic-co-statement.png" alt="Nghệ một cách đời thường, ai cũng có gu" fill className="object-cover" priority />
        </div>
      </section>

      <section className="bg-[var(--color-orange)] text-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-extrabold leading-tight mb-10">
            {aboutPage.closing.heading}
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
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
        </div>
      </section>
    </>
  );
}
