import type { Metadata } from "next";
import Image from "next/image";
import { brand } from "@/data/content";

export const metadata: Metadata = {
  title: "Người Việt Vận Động — Tíc Cơ",
  description: "Dự án chung vui Lễ Quốc khánh 2025 của Tíc Cơ: vận động không ngừng là vươn lên không dừng.",
};

export default function NguoiVietVanDongPage() {
  return (
    <>
      <section className="bg-[var(--color-orange)] text-white px-6 pt-16 pb-10 md:pt-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 items-end">
          <div className="relative w-full max-w-md aspect-[2325/1098]">
            <Image src="/images/collab/nguoi-viet-van-dong/heading-hero.png" alt="Người Việt Vận Động" fill quality={90} sizes="(max-width: 768px) 100vw, 500px" className="object-contain object-left" priority />
          </div>
          <p className="md:text-right text-lg">
            Dự án chung vui
            <br />
            Lễ Quốc khánh 2025
          </p>
        </div>
      </section>

      <div className="relative w-full aspect-[2560/964]">
        <Image
          src="/images/collab/nguoi-viet-van-dong/banner.jpg"
          alt="Người Việt Vận Động — Tíc Cơ"
          fill
          quality={90}
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <section className="bg-[var(--color-orange)] text-white px-6 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="relative w-full max-w-md mx-auto aspect-[737/153]">
            <Image src="/images/collab/nguoi-viet-van-dong/heading-mo-ta.png" alt="Vận động không ngừng là vươn lên không dừng!" fill quality={90} sizes="(max-width: 768px) 100vw, 400px" className="object-contain" />
          </div>
          <p className="leading-relaxed">
            Sự sống là nhờ vận động, phát triển là nhờ vận động, người Việt vận động để đất nước không ngừng vươn
            lên! Bởi vận động là chuyện cả đời, người Việt vận động từ lịch sử tới hiện tại, từ thời cha chú đến
            thời người trẻ, những lớp người nối tiếp và kế thừa, những câu chuyện đời sống hình thành để dấu ấn dân
            tộc được thành hình.
          </p>
          <p className="leading-relaxed">
            Tháng Tám cờ và hoa, Tíc Cơ phấn khởi được cùng bạn kể những câu chuyện về đất nước độc lập, về sự
            chuyển động âm thầm trong đời sống, về tinh thần vươn lên sống chất của mọi người dân Việt Nam!
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-orange)] text-white px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-center max-w-2xl mx-auto mb-10">
            Kể bạn nghe về những sự sống đang vận động mỗi ngày, và những người Việt đang không ngừng vận động vì
            một Việt Nam vươn lên.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { image: "/images/collab/nguoi-viet-van-dong/u80.png", label: "Đọc thêm về\nngười Việt U80 vươn lên" },
              { image: "/images/collab/nguoi-viet-van-dong/u30.png", label: "Đọc thêm về\nngười Việt U30 vươn lên" },
              { image: "/images/collab/nguoi-viet-van-dong/u10.png", label: "Đọc thêm về\nngười Việt U10 vươn lên" },
            ].map((item) => (
              <div key={item.image}>
                <div className="relative aspect-[263/325] mb-4">
                  <Image src={item.image} alt={item.label} fill quality={90} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <p className="text-center text-sm whitespace-pre-line">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#2c5242] text-white px-6 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="relative w-full max-w-sm aspect-[441/116] mb-4">
              <Image src="/images/collab/nguoi-viet-van-dong/heading-merchandise.png" alt="Merchandise đặc biệt Lễ Quốc khánh 2025 - Quạt Người Việt Vận Động" fill quality={90} sizes="(max-width: 768px) 100vw, 400px" className="object-contain object-left" />
            </div>
            <p className="leading-relaxed opacity-90">
              Hai mặt quạt một tinh thần bởi vì quạt không dừng là vận động không ngừng, người Việt vận động không
              ngừng là đất nước vươn lên không dừng!
            </p>
          </div>
          <div className="relative aspect-[308/388] max-w-xs mx-auto w-full">
            <Image
              src="/images/collab/nguoi-viet-van-dong/merchandise.png"
              alt="Quạt Người Việt Vận Động"
              fill
              quality={90}
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#2c5242] text-white px-6 pb-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[210/263] max-w-xs mx-auto w-full order-2 md:order-1">
            <Image
              src="/images/collab/nguoi-viet-van-dong/event-1.png"
              alt="Gian hàng trải nghiệm Tíc Cơ tại Lễ hội Độc lập"
              fill
              quality={90}
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="relative w-full max-w-sm aspect-[384/78] mb-4">
              <Image src="/images/collab/nguoi-viet-van-dong/heading-event.png" alt="Gian hàng trải nghiệm Tíc Cơ tại Lễ hội Độc lập" fill quality={90} sizes="(max-width: 768px) 100vw, 400px" className="object-contain object-left" />
            </div>
            <p className="leading-relaxed opacity-90">
              &ldquo;Lễ Hội Độc Lập - 80 Năm Tự Hào Việt Nam&rdquo; là sự kiện văn hóa, nghệ thuật do UBND TP Hà Nội,
              Sở Văn hóa - Thể thao phối hợp cùng Trung ương Hội Sinh viên Việt Nam tổ chức, nhân dịp kỷ niệm 80 năm
              Cách mạng Tháng Tám và Quốc khánh 2/9 (A80).
            </p>
            <p className="leading-relaxed opacity-90 mt-4">
              Tiếp vào dòng chảy vận động của cả đất nước, góp một phần nhỏ vào sắc đỏ của Thủ đô, Tíc Cơ mở gian
              hàng nhỏ, rủ bạn tới chơi tại gian hàng triển lãm Lễ Hội Độc Lập 2025.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-orange)] text-white px-6 py-16 text-center">
        <a
          href="/kham-pha"
          className="inline-block bg-white text-[var(--color-orange)] font-semibold uppercase tracking-wide px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
        >
          ← Xem thêm dự án khác
        </a>
        <p className="mt-6 text-sm opacity-80">{brand.email}</p>
      </section>
    </>
  );
}
