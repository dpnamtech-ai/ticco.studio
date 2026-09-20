import type { Metadata } from "next";
import Image from "next/image";
import { aboutPage } from "@/data/content";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Về Tíc Cơ",
  description: "Tíc Cơ là thương hiệu Việt với các sản phẩm tiêu dùng sáng tạo, lấy cảm hứng từ chất liệu đời thường, do người trẻ Việt thiết kế.",
};

export default function VeTicCoPage() {
  return (
    <>
      {/* Figma: 3 group (blob + chữ) export nguyên ảnh 4x, canh đáy chung Y=899, rộng 397/420/463.
          Tiêu đề "VỀ TÍC CƠ!" là ảnh riêng ở X490 (chữ Figma không có font sẵn). Hero đè lên banner 76px. */}
      <section className="relative z-10 bg-gradient-to-b from-[#e66107] to-[#803604] text-white px-6 md:px-0 pt-10 md:pt-[68px]">
        <div className="relative max-w-[1280px] mx-auto flex flex-col gap-8 md:block md:aspect-[1280/780]">
          <h1 className="sr-only">Về Tíc Cơ!</h1>
          <Reveal variant="mask" duration={1.1} className="md:absolute md:left-[38.281%] md:top-0 md:w-[17.266%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ve-tic-co/heading-ve-tic-co.png" alt="Về Tíc Cơ!" width={221} height={145} className="w-full h-auto" />
          </Reveal>
          <Reveal variant="left" delay={0.15} className="md:absolute md:left-0 md:bottom-0 md:w-[31.016%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ve-tic-co/gioi-thieu-1.png" alt={aboutPage.intro[0]} className="w-full h-auto" />
          </Reveal>
          <Reveal variant="up" delay={0.3} className="md:absolute md:left-[31.016%] md:bottom-0 md:w-[32.813%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ve-tic-co/gioi-thieu-2.png" alt={aboutPage.intro[1]} className="w-full h-auto" />
          </Reveal>
          <Reveal variant="right" delay={0.45} className="md:absolute md:left-[63.828%] md:bottom-0 md:w-[36.172%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ve-tic-co/gioi-thieu-3.png" alt={aboutPage.mission.join(" ")} className="w-full h-auto" />
          </Reveal>
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
