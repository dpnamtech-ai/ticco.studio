import type { Metadata } from "next";
import Image from "next/image";
import { mascotPage } from "@/data/content";

export const metadata: Metadata = {
  title: "Mascot Dần — Tíc Cơ",
  description: mascotPage.tagline,
};

export default function MascotDanPage() {
  return (
    <>
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-bold text-[var(--color-purple)] mb-10">
          {mascotPage.headline}
        </h1>

        <div className="relative w-fit mx-auto">
          <Image
            src="/images/dan-laptop.png"
            alt="Mascot Dần"
            width={240}
            height={228}
            className="mx-auto"
            priority
          />
          <p className="absolute -left-32 top-4 w-28 text-sm text-[var(--color-ink)]/70 text-right hidden md:block">
            {mascotPage.quote[0]}
          </p>
          <p className="absolute -right-36 top-10 w-32 text-sm text-[var(--color-ink)]/70 hidden md:block">
            {mascotPage.quote[1]}
          </p>
          <p className="absolute -left-32 bottom-0 w-28 text-sm text-[var(--color-ink)]/70 text-right hidden md:block">
            {mascotPage.quote[2]}
          </p>
        </div>
        <p className="md:hidden text-sm text-[var(--color-ink)]/70 mt-4">
          {mascotPage.quote.join(" ")}
        </p>

        <p className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold text-[var(--color-purple)] mt-10 uppercase">
          {mascotPage.tagline}
        </p>
      </section>

      <section className="bg-[#E5E5E5] px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <p className="text-[var(--color-purple)] font-semibold mb-6">{mascotPage.traitCaption}</p>
              <Image src="/images/dan-laptop.png" alt="" width={160} height={152} priority />

            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-orange)] text-white px-6 py-10">
        <p className="max-w-3xl mx-auto text-center text-lg md:text-xl font-semibold leading-relaxed">
          {mascotPage.introBanner}
        </p>
      </section>

      <section className="px-6 py-16">
        <div className="w-full overflow-hidden pb-20 space-y-16 md:space-y-10">
          {/* Row 1: Mascot Cheer (Bar from Left) */}
          <div className="relative flex items-center min-h-[220px]">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[60%] md:w-[55%] h-8 md:h-10 bg-[var(--color-purple)] -z-10" />
            <div className="w-full max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-6 md:gap-16">
              <div className="relative w-[150px] md:w-[200px] aspect-square flex-shrink-0 md:ml-[35%]">
                <Image src={mascotPage.bio[0].image} alt="" fill className="object-contain" />
              </div>
              <p className="text-[var(--color-purple)] font-medium text-sm md:text-base leading-snug max-w-xs whitespace-pre-line text-center md:text-left">
                {mascotPage.bio[0].text}
              </p>
            </div>
          </div>

          {/* Row 2: Mascot Lift (Bar from Right) */}
          <div className="relative flex items-center min-h-[220px]">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[70%] md:w-[60%] h-8 md:h-10 bg-[var(--color-purple)] -z-10" />
            <div className="w-full max-w-5xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center md:items-start justify-center md:justify-end gap-6 md:gap-16">
              <p className="text-[var(--color-purple)] font-medium text-sm md:text-base leading-snug max-w-xs whitespace-pre-line text-center md:text-left">
                {mascotPage.bio[1].text}
              </p>
              <div className="relative w-[220px] md:w-[316px] aspect-[316/228] flex-shrink-0 md:mr-[15%]">
                <Image src={mascotPage.bio[1].image} alt="" fill className="object-contain" />
              </div>
            </div>
          </div>

          {/* Row 3: Mascot Phone (Bar from Right) */}
          <div className="relative flex items-center min-h-[220px]">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[70%] md:w-[55%] h-8 md:h-10 bg-[var(--color-purple)] -z-10" />
            <div className="w-full max-w-5xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center md:items-start justify-center md:justify-end gap-6 md:gap-16">
              <p className="text-[var(--color-purple)] font-medium text-sm md:text-base leading-snug max-w-xs whitespace-pre-line text-center md:text-left">
                {mascotPage.bio[2].text}
              </p>
              <div className="relative w-[180px] md:w-[223px] aspect-square flex-shrink-0 md:mr-[30%]">
                <Image src={mascotPage.bio[2].image} alt="" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>

        <p className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold text-[var(--color-purple)] text-center mt-10 uppercase">
          {mascotPage.closingHeading}
        </p>
      </section>

      <section className="bg-[var(--color-purple)] text-white px-6 py-10">
        <p
          className="max-w-2xl mx-auto text-center text-lg md:text-xl font-semibold leading-relaxed"
          style={{ whiteSpace: "pre-line" }}
        >
          {mascotPage.closingBanner}
        </p>
      </section>
    </>
  );
}
