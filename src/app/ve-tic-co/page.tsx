import type { Metadata } from "next";
import Image from "next/image";
import { aboutPage } from "@/data/content";

export const metadata: Metadata = {
  title: "Về Tíc Cơ",
  description: "Tíc Cơ là thương hiệu Việt với các sản phẩm tiêu dùng sáng tạo, lấy cảm hứng từ chất liệu đời thường, do người trẻ Việt thiết kế.",
};

export default function VeTicCoPage() {
  return (
    <>
      {/* Figma: 3 group (blob + chữ) export nguyên ảnh 4x, canh đáy chung Y=899, rộng 397/420/463.
          Tiêu đề "VỀ TÍC CƠ!" là ảnh riêng ở X490 (chữ Figma không có font sẵn). Hero đè lên banner 76px. */}
      <section className="relative z-10 md:overflow-x-clip bg-gradient-to-b from-[#e66107] to-[#803604] text-white px-6 md:px-0 pt-10 md:pt-[68px]">
        <div className="relative max-w-[1280px] mx-auto flex flex-col gap-8 md:block md:h-[780px]">
          <h1 className="sr-only">Về Tíc Cơ!</h1>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ve-tic-co/heading-ve-tic-co.png" alt="Về Tíc Cơ!" width={221} height={145} className="md:absolute md:left-[490px] md:top-0" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ve-tic-co/gioi-thieu-1.png" alt={aboutPage.intro[0]} className="w-full h-auto md:absolute md:left-0 md:bottom-0 md:w-[397px]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ve-tic-co/gioi-thieu-2.png" alt={aboutPage.intro[1]} className="w-full h-auto md:absolute md:left-[397px] md:bottom-0 md:w-[420px]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ve-tic-co/gioi-thieu-3.png" alt={aboutPage.mission.join(" ")} className="w-full h-auto md:absolute md:left-[817px] md:bottom-0 md:w-[463px]" />
        </div>
      </section>

      <section className="relative text-white md:-mt-[76px] md:-mb-[56px]">
        <div className="relative aspect-[1280/902]">
          <Image src="/images/ve-tic-co-statement.png" alt="Nghệ một cách đời thường, ai cũng có gu" fill quality={90} sizes="100vw" className="object-cover" priority />
        </div>
      </section>
    </>
  );
}
