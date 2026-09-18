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
      {/* Ảnh 3 cột export thẳng nguyên "group" (blob + chữ) từ Figma — không dựng lại bằng CSS
          nữa, tránh sai lệch hình dạng/vị trí. `items-end` canh đáy cả 3 ảnh thẳng hàng (đúng
          như Figma: cả 3 group đều kết thúc chung 1 đường đáy Y=899). */}
      <section className="relative bg-gradient-to-b from-[#e66107] to-[#803604] text-white px-6 py-16 md:py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto grid md:grid-cols-3 gap-10 md:gap-16 items-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ve-tic-co/gioi-thieu-1.png" alt={aboutPage.intro[0]} className="w-full h-auto" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ve-tic-co/gioi-thieu-2.png" alt={aboutPage.intro[1]} className="w-full h-auto" />
          <div>
            <div className="text-right border-b-2 border-white pb-4 mb-4">
              <h1 className="font-[family-name:var(--font-heading)] text-6xl font-extrabold leading-none uppercase">
                Về<br />Tíc<br />Cơ
              </h1>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ve-tic-co/gioi-thieu-3.png" alt={aboutPage.mission.join(" ")} className="w-full h-auto" />
          </div>
        </div>
      </section>

      <section className="relative text-white">
        <div className="relative aspect-[1280/902]">
          <Image src="/images/ve-tic-co-statement.png" alt="Nghệ một cách đời thường, ai cũng có gu" fill quality={90} sizes="100vw" className="object-cover" priority />
        </div>
      </section>

      <section className="bg-[var(--color-orange)] text-white px-6 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Cột 1 */}
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-extrabold leading-tight uppercase">
              TÍC CƠ<br />HÂN HOAN<br />CHÀO BẠN!
            </h2>
          </div>

          {/* Cột 2 */}
          <div className="text-sm text-white/90 space-y-1">
            <p>Liên hệ trao đổi công việc:</p>
            <p>{brand.email}</p>
          </div>

          {/* Cột 3 */}
          <div className="text-sm text-white/90 space-y-1">
            <p>@ Tíc Cơ Studios</p>
            <p>{aboutPage.closing.born}</p>
          </div>

          {/* Cột 4 */}
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
