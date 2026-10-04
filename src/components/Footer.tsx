import { brand } from "@/data/content";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { policies } from "@/data/legal";
import { getLang } from "@/lib/lang";
import { localize } from "@/lib/i18n";
import { t } from "@/lib/t";

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

export default async function Footer() {
  const lang = await getLang();
  const T = (s: string) => t(s, lang);
  const abs = (l: readonly number[], right = false) =>
    ({ position: "absolute", top: cq(l[1]), [right ? "right" : "left"]: cq(l[0]), whiteSpace: "nowrap" }) as const;

  const contact = (
    <>
      {T("Liên hệ trao đổi công việc:")}
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
      {T("khai sinh từ 2024")}
    </>
  );
  const links = (
    <>
      <p className="mb-[calc(8*var(--m))] md:mb-[1.484cqw]">{T("Gặp Tíc Cơ nhiều hơn tại:")}</p>
      {social.map(([name, handle, href]) => (
        <p key={name}>
          {name}:{" "}
          <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {T(handle)}
          </a>
        </p>
      ))}
    </>
  );

  return (
    <footer id="contact" className="relative text-white" style={{ background: "var(--color-purple)" }}>
      {/* phones: the 390 mobile Figma footer (316 tall), scaled with the screen width via --m */}
      <div className="md:hidden relative h-[calc(316*var(--m))]">
        <p className="absolute left-[calc(27*var(--m))] top-[calc(54*var(--m))] text-[calc(20*var(--m))] leading-[calc(22*var(--m))] font-medium uppercase">
          Tíc Cơ
          <br />
          {T("hân hoan")}
          <br />
          {T("chào bạn!")}
        </p>
        <div className="absolute right-[calc(29*var(--m))] top-[calc(118*var(--m))] text-right text-[calc(8*var(--m))] leading-[calc(8*var(--m))] space-y-[calc(24*var(--m))] [&_p]:whitespace-nowrap">
          <p>{contact}</p>
          <p>{since}</p>
          <div>{links}</div>
        </div>
      </div>

      {/* md+: Figma layout, scaled with width */}
      <div className="hidden md:block [container-type:inline-size]">
        <div className="relative" style={{ height: cq(v.h), fontSize: cq(16), lineHeight: cq(19), letterSpacing: cq(-0.8) }}>
          <Reveal at="edge" variant="mask" duration={1.1} style={abs(v.title)}>
            <p className="font-medium uppercase" style={{ fontSize: cq(35), lineHeight: cq(35), letterSpacing: cq(-1.8) }}>
              Tíc Cơ
              <br />
              {T("hân hoan")}
              <br />
              {T("chào bạn!")}
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
      {/* Policy links (seller-info page stays reachable by URL but isn't listed, per client). */}
      <div className="bg-[#3a0c70] text-[12.5px] text-white/80">
        <div className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-[6.5%]">
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
            {policies.filter((p) => p.slug !== "thong-tin-nguoi-ban").map((p) => (
              <li key={p.slug}>
                <Link href={localize(`/chinh-sach/${p.slug}`, lang)} className="text-white underline-offset-2 hover:underline">{T(p.title)}</Link>
              </li>
            ))}
          </ul>
          <span className="text-white/60">© Tíc Cơ Studios</span>
        </div>
      </div>
    </footer>
  );
}
