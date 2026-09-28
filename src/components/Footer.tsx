import { brand } from "@/data/content";
import Reveal from "@/components/Reveal";

const social = [
  ["Facebook", "Tíc Cơ Studios", brand.facebook],
  ["Instagram", "ticco.studios", brand.instagram],
  ["Threads", "ticco.studios", brand.threads],
  ["TikTok", "Tíc Cơ trong đời", brand.tiktok],
] as const;

// Figma DEMO "footer": every frame uses the same purple 1283x337 band (the orange 361 variant is gone).
// Positions are Figma px relative to the band, converted to cqw (1280px = 100cqw) so it scales with the
// viewport like the other sections. Social block is right-aligned, its right edge at X1179 (= 101 from the right).
const cq = (px: number) => `${(px / 12.8).toFixed(3)}cqw`;
const v = { h: 337, title: [83, 61], contact: [574, 149], since: [785, 149], social: [101, 148] } as const;

export default function Footer() {
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
    <footer id="contact" className="relative text-white" style={{ background: "var(--color-purple)" }}>
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
      <div className="hidden md:block [container-type:inline-size]">
        <div className="relative" style={{ height: cq(v.h), fontSize: cq(16), lineHeight: cq(19), letterSpacing: cq(-0.8) }}>
          <Reveal at="edge" variant="mask" duration={1.1} style={abs(v.title)}>
            <p className="font-medium uppercase" style={{ fontSize: cq(35), lineHeight: cq(35), letterSpacing: cq(-1.8) }}>
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
          <Reveal at="edge" variant="blur" delay={0.3} style={{ ...abs(v.since), width: cq(190), textAlign: "center" }}>
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
