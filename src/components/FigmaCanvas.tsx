import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import Reveal from "@/components/Reveal";
import { ScatterGroup } from "@/components/Scatter";
import { ScatterWords } from "@/components/scatterWords";
import ScrollFillText from "@/components/ScrollFillText";
import ScatterText from "@/components/ScatterText";
import { cropFillStyle, zoomSizes, type ImageTransform } from "@/lib/figmaCrop";
import { DEFAULT_LANG, localize, type Lang } from "@/lib/i18n";
import { t, tx } from "@/lib/t";

/*
  Renders a Figma frame laid out by src/data/project-pages.ts (generated from the DEMO file).
  Desktop (lg+): every layer absolutely positioned at its Figma box, 1280px frame = 100cqw, painted in Figma order.
  Below lg: sections become padded, wrapping flex columns (section colour as background), layers flow in reading
  order (y, then x); small photos/cards go two per row, background rectangles and decorative shapes are dropped.
*/
// Motion on a layer (phone frames, see gen-project-pages FX/FLY): scatter = scroll fly-through, fly = words fly in and
// assemble, spin, pop (pop in + float), bob (marching), fill (letters light up on scroll), slide-l / slide-r; n = stagger.
type Fx = "scatter" | "fly" | "spin" | "pop" | "bob" | "fill" | "slide-l" | "slide-r";
type Box = { id: string; x: number; y: number; w: number; h: number; fx?: Fx; n?: number };
export type FigText = Box & {
  k: "text"; text: string; size: number; lh: number; ls: number; wt: number; align: "l" | "c" | "r" | "j";
  color: string; tag: "h1" | "h2" | "p"; nowrap?: boolean; op?: number; bubble?: string;
  /** highlight colour drawn behind each line (Figma highlight vector); markParts = only these runs */
  mark?: string; markParts?: string[];
  /** id to jump to (e.g. /kham-pha/x#le-hoi-doc-lap); fx "scatter" = words fly in on scroll (ScatterText) */
  anchor?: string;
};
export type FigImg = Box & { k: "img"; src: string; alt: string; crop?: ImageTransform; rot?: number };
export type FigBox = Box & { k: "box"; bg: string; radius?: string | number; kind?: "line" | "dot" };
export type FigLeaf = FigText | FigImg | FigBox;
export type FigCard = { k: "card"; id: string; href?: string; items: FigLeaf[] };
export type FigSection = { id: string; y: number; bg?: string; anchor?: string; items: (FigLeaf | FigCard)[] };
export type FigPage = { h: number; sections: FigSection[]; /** the client's phone frame (390 wide), drawn below lg */ mobile?: FigPage };

const cq = (px: number) => `${+(px / 12.8).toFixed(4)}cqw`;
type Vars = CSSProperties & Record<`--${string}`, string | number>;

const POS = "lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:w-[var(--w)] max-lg:order-[var(--o)]";
const pos = (l: Box, o: number): Vars => ({ "--x": cq(l.x), "--y": cq(l.y), "--w": cq(l.w), "--o": o });
// mobile: photos narrower than ~a third of the frame sit two per row
const mw = (w: number) => (w <= 320 ? "max-lg:w-[calc(50%-12px)]" : "max-lg:w-full");
const top = (i: FigLeaf | FigCard) => (i.k === "card" ? Math.min(...i.items.map((c) => c.y)) : i.y);
const left = (i: FigLeaf | FigCard) => (i.k === "card" ? Math.min(...i.items.map((c) => c.x)) : i.x);
// reading order for mobile: rows (20px tolerance) then left-to-right
const orderOf = (items: (FigLeaf | FigCard)[]) => {
  const sorted = [...items].sort((a, b) => Math.abs(top(a) - top(b)) > 20 ? top(a) - top(b) : left(a) - left(b));
  return (i: FigLeaf | FigCard) => sorted.indexOf(i);
};
const mSize = (s: number) => (s >= 100 ? 52 : s >= 60 ? 40 : s >= 40 ? 30 : s >= 30 ? 24 : s >= 22 ? 19 : s);
const ITEMS = { l: "lg:items-start", c: "lg:items-center", r: "lg:items-end", j: "lg:items-stretch" };
const TA = { l: "text-left", c: "text-center", r: "text-left lg:text-right", j: "text-justify" };

// Figma's hard line breaks are tuned for the 1280 canvas: keep them on desktop, but on mobile
// turn a single break into a space (blank lines = paragraph breaks stay everywhere).
function figmaLines(text: string, mark: (line: string) => ReactNode = (l) => l) {
  const lines = text.split("\n");
  const lead = lines.findIndex((l) => l.trim());
  return lines.map((raw, i) => {
    const line = mark(raw);
    if (i === lines.length - 1) return <Fragment key={i}>{line}</Fragment>;
    const hard = i >= lead && (!raw.trim() || !lines[i + 1].trim());
    return hard ? (
      <Fragment key={i}>{line}<br /></Fragment>
    ) : (
      <Fragment key={i}>{line}<br className="max-lg:hidden" /><span className="lg:hidden"> </span></Fragment>
    );
  });
}

// Figma highlight: flat colour behind the text, hugging each line. The paint is trimmed to one line pitch (--mk em,
// centred) so the rows meet edge to edge; padding + negative margin (cloned per line) pad it sideways without moving
// the text.
const Mark = ({ c, children }: { c: string; children: ReactNode }) => (
  <span
    style={{
      background: `linear-gradient(transparent calc(50% - var(--mk) * 0.5em), ${c} 0, ${c} calc(50% + var(--mk) * 0.5em), transparent 0)`,
      padding: "0 0.2em", margin: "0 -0.2em", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone",
    }}
  >
    {children}
  </span>
);

function markLine(t: FigText) {
  const c = t.mark;
  if (!c) return undefined;
  return function marked(line: string): ReactNode {
    if (!line.trim()) return line;
    if (!t.markParts) return <Mark c={c}>{line}</Mark>;
    const part = t.markParts.find((p) => line.includes(p));
    if (!part) return line;
    const at = line.indexOf(part);
    return <>{line.slice(0, at)}<Mark c={c}>{part}</Mark>{line.slice(at + part.length)}</>;
  };
}

function Text({ t, o, hover }: { t: FigText; o: number; hover?: boolean }) {
  const Tag = t.tag;
  const style: Vars = {
    color: t.color, opacity: t.op, fontWeight: t.wt, letterSpacing: `${t.ls}em`,
    "--fs": cq(t.size), "--fsm": `${mSize(t.size)}px`, "--lh": t.lh, "--lhm": Math.min(Math.max(t.lh, 1.2), 1.6), "--bub": t.bubble ?? "transparent",
  };
  return (
    <>
    {t.anchor && (
      // jump target: at the text's own spot on desktop, in its place in the flow on phones (the navbar is sticky)
      <div id={t.anchor} aria-hidden className={`${POS} max-lg:w-full scroll-mt-[calc(90*var(--u))] max-lg:scroll-mt-20`} style={pos(t, o)} />
    )}
    <Reveal variant={t.fx ? "up" : "blur"} duration={t.fx ? 0.01 : 1.1} className={`${POS} max-lg:w-full`} style={pos(t, o)}>
      <Tag
        style={style}
        className={`flex flex-col ${ITEMS[t.align]} m-0 [--mk:var(--lhm)] lg:[--mk:var(--lh)] text-[length:var(--fsm)] leading-[var(--lhm)] lg:text-[length:var(--fs)] lg:leading-[var(--lh)] ${
          t.bubble ? `max-lg:w-fit max-lg:bg-[var(--bub)] max-lg:px-4 max-lg:py-3 max-lg:rounded-2xl ${t.align === "c" ? "max-lg:mx-auto" : ""}` : ""
        } ${hover ? "transition-transform duration-500 ease-out lg:group-hover:translate-x-[0.9cqw]" : ""}`}
      >
        <span className={`${t.nowrap ? "lg:whitespace-pre" : ""} ${TA[t.align]} ${t.mark ? "relative" : ""}`}>
          {t.fx === "scatter" ? (
            <ScatterText text={t.text} />
          ) : t.mark ? (
            // two identical layouts stacked: highlights only (text transparent) underneath, the text on top, so no
            // row's highlight ever paints over the descenders/diacritics of the row above
            <>
              <span aria-hidden className="select-none text-transparent">{figmaLines(t.text, markLine(t))}</span>
              <span className="absolute inset-0">{figmaLines(t.text)}</span>
            </>
          ) : (
            figmaLines(t.text)
          )}
        </span>
      </Tag>
    </Reveal>
    </>
  );
}

function Img({ i, o, inCard }: { i: FigImg; o: number; inCard?: boolean }) {
  const img = (
    // next/image serves a resized copy per screen width instead of the full Figma export
    <Image
      src={i.src}
      alt={i.alt}
      fill
      loading={i.y < 700 ? "eager" : "lazy"}
      sizes={zoomSizes(`(max-width: 1023px) ${i.w <= 320 ? 50 : 100}vw, ${Math.ceil((i.w / 1280) * 100)}vw`, i.crop)}
      style={i.crop ? { objectFit: "fill", ...cropFillStyle(i.crop) } : { objectFit: "cover" }}
    />
  );
  return (
    <Reveal variant="curtain" duration={1.3} className={`${POS} ${inCard ? "max-lg:w-full" : mw(i.w)}`} style={pos(i, o)}>
      <div className="relative overflow-hidden" style={{ aspectRatio: `${i.w}/${i.h}` }}>
        {i.rot ? (
          // Figma rotates the whole image layer; the layer's own box is the bounding box turned back
          <div
            className="absolute left-1/2 top-1/2 overflow-hidden"
            style={{ width: `${(i.h / i.w) * 100}%`, aspectRatio: `${i.h}/${i.w}`, transform: `translate(-50%,-50%) rotate(${-i.rot}deg)` }}
          >
            {img}
          </div>
        ) : (
          img
        )}
      </div>
    </Reveal>
  );
}

function Shape({ b, o }: { b: FigBox; o: number }) {
  const style: Vars = { ...pos(b, o), "--h": cq(b.h), background: b.bg, borderRadius: typeof b.radius === "number" ? cq(b.radius) : b.radius };
  if (b.kind === "line")
    return (
      <Reveal variant="wipe" duration={1.6} className={`${POS} max-lg:w-full`} style={pos(b, o)}>
        <div className="h-px lg:h-[var(--h)]" style={{ "--h": cq(b.h), background: b.bg } as Vars} />
      </Reveal>
    );
  return <div aria-hidden className={`${POS} lg:h-[var(--h)] max-lg:hidden`} style={style} />;
}

function Leaf({ l, o, hover, inCard }: { l: FigLeaf; o: number; hover?: boolean; inCard?: boolean }) {
  if (l.k === "text") return <Text t={l} o={o} hover={hover} />;
  if (l.k === "img") return <Img i={l} o={o} inCard={inCard} />;
  return <Shape b={l} o={o} />;
}

// Figma texts are sized for the Vietnamese copy (fixed boxes, many set line by line). For a translation:
// - the Vietnamese line breaks are kept: an unbroken translation is split into as many balanced lines;
// - set lines (nowrap, a box exactly that many lines tall, or a short title) shrink by the longest-line ratio, so
//   they keep their width; wrapping paragraphs shrink by the square root of the length ratio (same area).
// ponytail: character count stands in for rendered width; fine for Latin copy of similar weight.
const len = (s: string) => s.replace(/\s+/g, " ").trim().length;
const longest = (s: string) => Math.max(...s.split("\n").map(len));

// "a b c d" into n lines of about equal length (word boundaries only)
function balance(s: string, n: number) {
  const words = s.split(/\s+/);
  const target = len(s) / n;
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (cur && lines.length < n - 1 && len(`${cur} ${w}`) > target + w.length / 2) {
      lines.push(cur);
      cur = w;
    } else cur = cur ? `${cur} ${w}` : w;
  }
  return [...lines, cur].join("\n");
}

function fitText(page: FigPage, lang: Lang): FigPage {
  const fit = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(fit);
    if (!v || typeof v !== "object") return v;
    const o = v as Record<string, unknown>;
    if (o.k === "text") {
      const l = o as FigText;
      const n = l.text.split("\n").length;
      let text = t(l.text, lang);
      if (text === l.text) return l;
      // (not paragraphs: a blank line in the Vietnamese means paragraphs, which the translation keeps its own way)
      if (n > 1 && !text.includes("\n") && !l.text.includes("\n\n")) text = balance(text, n);
      const setLines = l.nowrap || l.h <= l.size * l.lh * (n + 0.5) || (n === 1 && len(l.text) < 60);
      const r = setLines ? longest(l.text) / longest(text) : Math.sqrt(len(l.text) / len(text));
      return { ...l, text, size: l.size * Math.min(1, r) };
    }
    return Object.fromEntries(Object.entries(o).map(([k, x]) => [k, fit(x)]));
  };
  return fit(page) as FigPage;
}

// The client's own phone design (Figma "*-mobile" frames, 390 wide): every layer at its frame position, scaled with
// the screen width (390px = 100cqw), like the desktop canvas does with 1280.
function FixedCanvas({ page, lang }: { page: FigPage; lang: Lang }) {
  const u = (px: number) => `${+(px / 3.9).toFixed(4)}cqw`;
  const at = (b: Box): CSSProperties => ({ position: "absolute", left: u(b.x), top: u(b.y), width: u(b.w) });
  // entrance of a layer: its slide direction when it has one, else the default for its kind
  const enter = (l: Box, base: "blur" | "curtain") =>
    l.fx === "slide-l" || l.fx === "slide-r"
      ? { variant: l.fx === "slide-l" ? ("left" as const) : ("right" as const), delay: (l.n ?? 0) * 0.15, duration: 0.9 }
      : { variant: base, duration: base === "curtain" ? 1.3 : 1.1 };
  const leaf = (l: FigLeaf, hover = false) => {
    if (l.k === "text") {
      const Tag = l.tag;
      const style = { color: l.color, opacity: l.op, fontWeight: l.wt, letterSpacing: `${l.ls}em`, fontSize: u(l.size), lineHeight: l.lh, background: l.bubble, "--mk": l.lh } as Vars;
      const align = { l: "text-left", c: "text-center", r: "text-right", j: "text-justify" }[l.align];
      if (l.fx === "fill")
        return (
          <div key={l.id} style={at(l)}>
            <ScrollFillText text={l.text} className={`m-0 whitespace-pre-line ${align}`} style={style} />
          </div>
        );
      const Wrap = l.fx === "fly" ? ScatterGroup : Reveal;
      return (
        <Wrap key={l.id} {...(l.fx === "scatter" || l.fx === "fly" ? { variant: "up" as const, duration: 0.01 } : enter(l, "blur"))} style={at(l)}>
          {l.anchor && <div id={l.anchor} aria-hidden className="absolute top-0 scroll-mt-16" />}
          <Tag
            style={style}
            className={`m-0 ${l.nowrap ? "whitespace-pre" : "whitespace-pre-line"} ${align} ${hover ? "transition-transform duration-500 group-active:translate-x-1" : ""}`}
          >
            {l.fx === "scatter" ? (
              <ScatterText text={l.text} />
            ) : l.fx === "fly" ? (
              <ScatterWords text={l.text} seed={l.y} />
            ) : l.mark ? (
              l.text.split("\n").map((line, i, a) => <Fragment key={i}>{markLine(l)?.(line) ?? line}{i < a.length - 1 && <br />}</Fragment>)
            ) : (
              l.text
            )}
          </Tag>
        </Wrap>
      );
    }
    if (l.k === "img") {
      const img = (
        <Image src={l.src} alt={l.alt} fill loading={l.y < 900 ? "eager" : "lazy"} sizes={zoomSizes(`${Math.ceil((l.w / 390) * 100)}vw`, l.crop)}
          style={l.crop ? { objectFit: "fill", ...cropFillStyle(l.crop) } : { objectFit: "cover" }} />
      );
      const pic = (
        <div className="relative overflow-hidden" style={{ aspectRatio: `${l.w}/${l.h}` }}>
          {l.rot ? (
            <div className="absolute left-1/2 top-1/2 overflow-hidden" style={{ width: `${(l.h / l.w) * 100}%`, aspectRatio: `${l.h}/${l.w}`, transform: `translate(-50%,-50%) rotate(${-l.rot}deg)` }}>{img}</div>
          ) : (
            img
          )}
        </div>
      );
      // same CSS animations as the desktop BrandSection (turning Đần) and MarchingDan (.dan-pop/.dan-float, .bob)
      if (l.fx === "spin") return <div key={l.id} style={at(l)}><div className="animate-[spin_3s_linear_infinite]">{pic}</div></div>;
      if (l.fx === "pop")
        return (
          <div key={l.id} className="dan-pop" style={at(l)}>
            <div className="dan-float" style={{ animationDelay: `${-(l.n ?? 0) * 0.9}s` }}>{pic}</div>
          </div>
        );
      if (l.fx === "bob") return <div key={l.id} className="bob" style={{ ...at(l), animationDelay: `${-(l.n ?? 0) * 0.13}s` }}>{pic}</div>;
      return (
        <Reveal key={l.id} {...enter(l, "curtain")} style={at(l)}>
          {pic}
        </Reveal>
      );
    }
    const shape = <div aria-hidden style={{ height: u(l.h), background: l.bg, borderRadius: typeof l.radius === "number" ? u(l.radius) : l.radius }} />;
    return l.fx ? <Reveal key={l.id} {...enter(l, "blur")} style={at(l)}>{shape}</Reveal> : <div key={l.id} style={at(l)}>{shape}</div>;
  };
  return (
    <div className="[container-type:inline-size]">
      <div className="relative overflow-hidden" style={{ height: u(page.h) }}>
        {page.sections.map((s) => (
          <Fragment key={s.id}>
            {s.anchor && <div id={s.anchor} aria-hidden className="absolute scroll-mt-16" style={{ top: u(s.y) }} />}
            {s.items.map((it) => {
              if (it.k !== "card") return leaf(it);
              const kids = it.items.map((c) => leaf(c, Boolean(it.href) && c.k === "text"));
              return it.href ? (
                <Link key={it.id} href={localize(it.href, lang)} className="group contents" {...(/^https?:/.test(it.href) && { target: "_blank", rel: "noopener noreferrer" })}>
                  {kids}
                </Link>
              ) : (
                <Fragment key={it.id}>{kids}</Fragment>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

// Phone layout (Figma frame) of a hand-coded page: drawn below lg, the page's own markup stays for lg+.
export function FigmaMobile({ page, lang = DEFAULT_LANG }: { page: FigPage; lang?: Lang }) {
  return (
    <div className="lg:hidden">
      <FixedCanvas page={lang === DEFAULT_LANG ? page : tx(fitText(page, lang), lang)} lang={lang} />
    </div>
  );
}

// lang: texts/alts come translated (tx keeps image paths, links and #colours), card links stay in the language.
// page.mobile (the client's phone frame) replaces the flowed phone layout below lg when the page has one.
export default function FigmaCanvas({ page: source, lang = DEFAULT_LANG }: { page: FigPage; lang?: Lang }) {
  if (source.mobile) {
    const { mobile, ...desktop } = source;
    return (
      <>
        <div className="lg:hidden">
          <FixedCanvas page={lang === DEFAULT_LANG ? mobile : tx(fitText(mobile, lang), lang)} lang={lang} />
        </div>
        <div className="max-lg:hidden">
          <FigmaCanvas page={desktop} lang={lang} />
        </div>
      </>
    );
  }
  const page = lang === DEFAULT_LANG ? source : tx(fitText(source, lang), lang);
  return (
    <div className="[container-type:inline-size]">
      <div className="relative overflow-hidden lg:h-[var(--H)]" style={{ "--H": cq(page.h) } as Vars}>
        {page.sections.map((s) => {
          const ord = orderOf(s.items);
          const hasText = s.items.some((i) => i.k === "text" || (i.k === "card" && i.items.some((c) => c.k === "text")));
          return (
            <section
              key={s.id}
              style={{ background: s.bg ?? (hasText ? "var(--color-ink)" : undefined) }}
              className={`lg:contents max-lg:relative max-lg:flex max-lg:flex-wrap max-lg:gap-6 ${hasText ? "max-lg:px-6 max-lg:py-12 text-white" : ""}`}
            >
              {s.anchor && (
                <div id={s.anchor} aria-hidden className="absolute top-0 lg:top-[var(--y)] scroll-mt-[calc(27*var(--u))] max-lg:scroll-mt-16" style={{ "--y": cq(s.y) } as Vars} />
              )}
              {s.items.map((it) => {
                if (it.k !== "card") return <Leaf key={it.id} l={it} o={ord(it)} />;
                const cOrd = orderOf(it.items);
                const img = it.items.find((c): c is FigImg => c.k === "img");
                const cls = `lg:contents max-lg:flex max-lg:flex-col max-lg:gap-3 max-lg:order-[var(--o)] ${img ? mw(img.w) : "max-lg:w-full"}`;
                const kids = it.items.map((c) => <Leaf key={c.id} l={c} o={cOrd(c)} hover={Boolean(it.href) && c.k === "text"} inCard />);
                const style = { "--o": ord(it) } as Vars;
                return it.href ? (
                  <Link key={it.id} href={localize(it.href, lang)} className={`${cls} group`} style={style} {...(/^https?:/.test(it.href) && { target: "_blank", rel: "noopener noreferrer" })}>
                    {kids}
                  </Link>
                ) : (
                  <div key={it.id} className={cls} style={style}>
                    {kids}
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </div>
  );
}
