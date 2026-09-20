"use client";

import { usePathname } from "next/navigation";
import { brand } from "@/data/content";
import Reveal from "@/components/Reveal";

const social = [
  ["Facebook", "Tíc Cơ Studios", brand.facebook],
  ["Instagram", "ticco.studios", brand.instagram],
  ["Threads", "ticco.studios", brand.threads],
  ["TikTok", "Tíc Cơ trong đời", brand.tiktok],
] as const;

// Figma "footer" per page: purple 1280x337 (trang-chu, mascot-Dan, kham-pha) or
// orange 1280x361 (ve-Tic-Co, du-an-Nguoi-Viet-Van-Dong). Positions are Figma px
// converted to cqw (1280px = 100cqw) so the band scales with the viewport like the
// other sections at 1920x1080.
const cq = (px: number) => `${(px / 12.8).toFixed(3)}cqw`;
const variants = {
  purple: { bg: "var(--color-purple)", h: 337, title: [81, 61], contact: [572, 149], since: [783, 149], social: [103, 148] },
  orange: { bg: "#e66107", h: 361, title: [45, 66], contact: [633, 136], since: [844, 136], social: [42, 135] },
} as const;
const ORANGE_ROUTES = ["/ve-tic-co", "/kham-pha/nguoi-viet-van-dong"];

export default function Footer() {
  const pathname = usePathname();
  const v = variants[ORANGE_ROUTES.some((r) => pathname?.startsWith(r)) ? "orange" : "purple"];
  const abs = (l: readonly number[], right = false) =>
    ({ position: "absolute", top: cq(l[1]), [right ? "right" : "left"]: cq(l[0]), whiteSpace: "nowrap" }) as const;

  const contact = (
    <>
      Liên hệ trao đổi công việc:
      <br />
      <a href={`mailto:${brand.email}`} className="hover:underline break-all">
        {brand.email}
      </a>
    </>
  );
  const since = (
    <>
      @ Tíc Cơ Studios
      <br />
      khai sinh từ 2024
    </>
  );
  const links = (
    <>
      <p className="mb-5 md:mb-[1.484cqw]">Gặp Tíc Cơ nhiều hơn tại:</p>
      {social.map(([name, handle, href]) => (
        <p key={name}>
          {name}:{" "}
          <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {handle}
          </a>
        </p>
      ))}
    </>
  );

  return (
    <footer id="contact" className="relative text-white" style={{ background: v.bg }}>
      {/* mobile: stacked */}
      <div className="md:hidden px-6 py-12 text-base leading-[19px] space-y-8">
        <p className="text-[35px] leading-[35px] font-medium uppercase">
          Tíc Cơ
          <br />
          hân hoan
          <br />
          chào bạn!
        </p>
        <p>{contact}</p>
        <p>{since}</p>
        <div>{links}</div>
      </div>

      {/* md+: Figma layout, scaled with width */}
      <div className="hidden md:block max-w-[1280px] mx-auto [container-type:inline-size]">
        <div className="relative" style={{ height: cq(v.h), fontSize: cq(16), lineHeight: cq(19) }}>
          <Reveal at="edge" variant="mask" duration={1.1} style={abs(v.title)}>
            <p className="font-medium uppercase" style={{ fontSize: cq(35), lineHeight: cq(35) }}>
              Tíc Cơ
              <br />
              hân hoan
              <br />
              chào bạn!
            </p>
          </Reveal>
          <Reveal at="edge" variant="blur" delay={0.2} style={abs(v.contact)}>
            <p>{contact}</p>
          </Reveal>
          <Reveal at="edge" variant="blur" delay={0.3} style={abs(v.since)}>
            <p>{since}</p>
          </Reveal>
          <Reveal at="edge" variant="up" delay={0.4} style={{ ...abs(v.social, true), textAlign: "right" }}>
            {links}
          </Reveal>
        </div>
      </div>
    </footer>
  );
}
