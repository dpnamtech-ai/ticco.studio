import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Khám phá — Tíc Cơ",
  description: "Các dự án vui, dự án hợp tác và sự kiện của Tíc Cơ.",
};

// Text is baked as images (Figma font isn't available) — exported at 4x, so CSS size = px / 4.
type Row = { t: string; tSize: [number, number]; d: string; dSize: [number, number]; alt: string; descAlt: string; href?: string };
type Band = { key: string; h: string; hSize: [number, number]; hAlt: string; hBox: number; bg: string; minH: number; rows: Row[] };

const bands: Band[] = [
  {
    key: "rieng", h: "h-rieng", hSize: [602, 124], hAlt: "Dự án riêng", hBox: 187, minH: 637,
    bg: "linear-gradient(180deg,#e66107,#eb7b2e)",
    rows: [
      { t: "t-nguoi-viet-van-dong", tSize: [1762, 205], d: "d-nguoi-viet-van-dong", dSize: [1440, 149], alt: "Người Việt Vận Động", descAlt: "dự án chung vui Lễ Quốc khánh 2025. Vận động không ngừng là vươn lên không dừng!", href: "/kham-pha/nguoi-viet-van-dong" },
      { t: "t-chuc-tet", tSize: [1961, 229], d: "d-chuc-tet", dSize: [899, 148], alt: "Chúc Tết Nhau Thật Sự", descAlt: "dự án Tết Bính Ngọ 2026. Vì lời chúc là đầu câu chuyện!" },
      { t: "t-lam-moi", tSize: [1273, 160], d: "d-lam-moi", dSize: [576, 138], alt: "Làm Mới Đời Đi", descAlt: "dự án ảnh ọt vui vui chẳng nhân dịp gì!" },
      { t: "t-minh-trong-nha", tSize: [2778, 200], d: "d-minh-trong-nha", dSize: [1335, 148], alt: "Mình Trong Nhà, Nhà Trong Nước", descAlt: "dự án chung vui Ngày Giải phòng miền Nam thống nhất đất nước 30/04/2024" },
    ],
  },
  {
    key: "hop-tac", h: "h-hop-tac", hSize: [1305, 124], hAlt: "Dự án chung tay hợp tác", hBox: 348, minH: 549,
    bg: "linear-gradient(180deg,#53129e,#783ebb 60%,#8f4ddb)",
    rows: [
      { t: "t-freezedom", tSize: [1729, 424], d: "d-freezedom", dSize: [1084, 150], alt: "Tíc Cơ x Freezedom: Thu rồi Nghỉ đi!", descAlt: "Tíc Cơ và Freezedom cùng bắt tay nghỉ ngơi vào những ngày thu 2025!" },
      { t: "t-neenee", tSize: [2194, 429], d: "d-neenee", dSize: [734, 150], alt: "Tíc Cơ x Neenee: Đầu đội mũ, Chân vào đời", descAlt: "dự án hợp tác sản phẩm giữa Neenee và Tíc Cơ!" },
    ],
  },
  {
    key: "su-kien", h: "h-su-kien", hSize: [359, 120], hAlt: "Sự kiện", hBox: 115, minH: 536,
    bg: "linear-gradient(180deg,#e66107,#eb7b2e)",
    rows: [
      { t: "t-le-hoi", tSize: [2517, 436], d: "d-le-hoi", dSize: [1945, 221], alt: "Tíc Cơ tại Khu vực trải nghiệm Lễ hội Độc lập", descAlt: "“Lễ Hội Độc Lập - 80 Năm Tự Hào Việt Nam” là sự kiện văn hóa, nghệ thuật do UBND TP Hà Nội, Sở Văn hóa - Thể thao phối hợp cùng Trung ương Hội Sinh viên Việt Nam tổ chức." },
      { t: "t-popup", tSize: [1186, 415], d: "d-popup", dSize: [1492, 150], alt: "Pop-up Event Thu rồi nghỉ đi", descAlt: "Một không gian gặp gỡ, lấy cái cớ để bạn nghỉ đi, hưởng trời thu và chẳng làm gì nhiều" },
    ],
  },
];

const img = (name: string, [w, h]: [number, number], alt: string) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={`/images/kham-pha/${name}.png`} alt={alt} width={w / 4} height={h / 4} className="max-w-full h-auto" />
);

export default function KhamPhaPage() {
  return (
    <>
      <h1 className="sr-only">Dự án vui — về những dự án làm vì niềm vui, làm với niềm vui của Tíc Cơ!</h1>
      {/* Figma: hero photo 1280x514, the bands below overlap its last 47px */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/kham-pha/hero.jpg" alt="Dự án vui — về những dự án làm vì niềm vui, làm với niềm vui của Tíc Cơ!" className="w-full h-[280px] md:h-auto md:aspect-[1280/467] object-cover object-left-top" />

      {bands.map((b) => (
        <section key={b.key} style={{ background: b.bg, ["--mh" as string]: `${b.minH}px` }} className="md:min-h-[var(--mh)] text-white px-6 pt-10 pb-12 md:pt-[47px] md:px-0" >
          <div className="mx-auto max-w-[1160px]">
            <div className="flex justify-center mb-8 md:mb-[35px]">
              <span className="bg-[var(--color-yellow)] h-8 flex items-center justify-center px-3 md:px-0" style={{ minWidth: b.hBox }}>
                {img(b.h, b.hSize, b.hAlt)}
              </span>
            </div>
            {b.rows.map((r, i) => {
              const inner = (
                <>
                  {img(r.t, r.tSize, r.alt)}
                  <span className="md:text-right md:shrink-0 md:max-w-[496px]">{img(r.d, r.dSize, r.descAlt)}</span>
                </>
              );
              const cls = `flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 md:py-[27px] ${i > 0 ? "border-t border-white/50" : ""}`;
              return r.href ? (
                <Link key={r.t} href={r.href} className={`${cls} hover:opacity-80 transition-opacity`}>{inner}</Link>
              ) : (
                <div key={r.t} className={cls}>{inner}</div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
