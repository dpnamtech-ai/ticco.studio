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
      <section className="relative bg-gradient-to-b from-[#e66107] to-[#803604] text-white px-6 py-16 md:py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto grid md:grid-cols-3 gap-10 md:gap-16">
          {/* Cột 1 */}
          <div className="relative z-10 pt-10">
            <div
              className="absolute -z-10 bg-gradient-to-b from-[#6625b1] to-[#1f0938] w-[140%] h-[140%] -bottom-10 -left-10"
              style={{ borderRadius: "50% 50% 0 0 / 13% 13% 0 0" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ve-tic-co/intro-0.png" alt={aboutPage.intro[0]} className="relative z-10 w-full h-auto" />
          </div>

          {/* Cột 2: Phải có mt-20 để thụt xuống. Không dùng space-y-* ở đây — nó áp margin-bottom
              lên cả blob absolute (dù blob không tham gia flow), đẩy lệch đáy blob khỏi cột 1/3. */}
          <div className="relative z-10 mt-20">
            <div
              className="absolute -z-10 bg-gradient-to-b from-[#6625b1] to-[#1f0938] w-[120%] h-[140%] -bottom-10 -left-10"
              style={{ borderRadius: "50% 50% 0 0 / 21% 21% 0 0" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ve-tic-co/intro-1.png" alt={aboutPage.intro[1]} className="relative z-10 w-full h-auto" />
          </div>

          {/* Cột 3 — blob neo trực tiếp vào grid-item (không lồng trong div con) để đáy thẳng
              hàng với cột 1/2 (cả 3 blob trong Figma đều kết thúc chung 1 đường đáy). Giãn cách
              giữa heading và text dùng mt-10 trực tiếp thay vì space-y-10 (lý do: xem cột 2). */}
          <div className="relative z-10 flex flex-col">
            <div
              className="absolute -z-10 bg-gradient-to-b from-[#6625b1] to-[#1f0938] w-[140%] h-[140%] -bottom-10 -left-4"
              style={{ borderRadius: "50% 50% 0 0 / 33% 33% 0 0" }}
            />
            <div className="text-right border-b-2 border-white pb-4 self-end">
              <h1 className="font-[family-name:var(--font-heading)] text-6xl font-extrabold leading-none uppercase">
                Về<br />Tíc<br />Cơ
              </h1>
            </div>
            <div className="relative z-10 mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ve-tic-co/mission.png"
                alt={aboutPage.mission.join(" ")}
                className="relative z-10 w-full h-auto"
              />
            </div>
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
