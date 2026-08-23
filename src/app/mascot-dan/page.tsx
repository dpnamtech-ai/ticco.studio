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
              {i === 0 && (
                <Image src="/images/dan-laptop.png" alt="" width={160} height={152} />
              )}
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
        {/*
          The whole block is one absolute-position composition, not a stacked list of rows:
          in Figma the 3 rows overlap vertically (row1 image bottom Y1980 overlaps row2 image
          top Y1920) and the ribbons bleed to the frame's own edges (clipped there by the
          frame's "Clip content"), so a flex/space-y stack can't reproduce it. Every box below
          is copied 1:1 (as % of the 1280×607 bounding area, origin at frame X0/Y1757) from
          Dev Mode on the mascot-Dan frame:
            row0 (dan-cheer):  image X657 Y1757 W180 H223 · ribbon X-57 Y1844 W747 H38 · text X843 Y1828 W344 H131
            row1 (dan-lift):   image X350 Y1920 W316 H228 · ribbon X571 Y2040 W781 H38 · text X101 Y2004 W298 H85
            row2 (dan-phone):  image X420 Y2148 W223 H216 · ribbon X603 Y2274 W764 H38 · text X101 Y2185 W334 H131
        */}
        <div className="relative w-full max-w-5xl mx-auto aspect-[1280/607] overflow-hidden">
          {mascotPage.bio.map((row, i) => {
            const box = [
              {
                image: { x: 51.33, y: 0, w: 14.06, h: 36.74 },
                ribbon: { x: -4.45, y: 14.33, w: 58.36, h: 6.26 },
                text: { x: 65.86, y: 11.7, w: 26.88, h: 21.58 },
              },
              {
                image: { x: 27.34, y: 26.85, w: 24.69, h: 37.56 },
                ribbon: { x: 44.61, y: 46.62, w: 61.02, h: 6.26 },
                text: { x: 7.89, y: 40.69, w: 23.28, h: 14.0 },
              },
              {
                image: { x: 32.81, y: 64.42, w: 17.42, h: 35.58 },
                ribbon: { x: 47.11, y: 85.17, w: 59.69, h: 6.26 },
                text: { x: 7.89, y: 70.51, w: 26.09, h: 21.58 },
              },
            ][i];
            const pct = (b: { x: number; y: number; w: number; h: number }) => ({
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
            });
            return (
              <div key={i}>
                <div className="absolute bg-[var(--color-purple)] rounded-sm" style={pct(box.ribbon)} />
                <div className="absolute" style={pct(box.image)}>
                  <Image src={row.image} alt="" fill className="object-contain" />
                </div>
                <p
                  className="absolute text-[var(--color-purple)] font-medium text-xs sm:text-sm md:text-base leading-snug"
                  style={{ ...pct(box.text), whiteSpace: "pre-line" }}
                >
                  {row.text}
                </p>
              </div>
            );
          })}
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
