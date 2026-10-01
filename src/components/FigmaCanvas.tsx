import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import Reveal from "@/components/Reveal";
import ScatterText from "@/components/ScatterText";
import { cropFillStyle, zoomSizes, type ImageTransform } from "@/lib/figmaCrop";

/*
  Renders a Figma frame laid out by src/data/project-pages.ts (generated from the DEMO file).
  Desktop (lg+): every layer absolutely positioned at its Figma box, 1280px frame = 100cqw, painted in Figma order.
  Below lg: sections become padded, wrapping flex columns (section colour as background), layers flow in reading
  order (y, then x); small photos/cards go two per row, background rectangles and decorative shapes are dropped.
*/
type Box = { id: string; x: number; y: number; w: number; h: number };
export type FigText = Box & {
  k: "text"; text: string; size: number; lh: number; ls: number; wt: number; align: "l" | "c" | "r" | "j";
  color: string; tag: "h1" | "h2" | "p"; nowrap?: boolean; op?: number; bubble?: string;
  /** highlight colour drawn behind each line (Figma highlight vector); markParts = only these runs */
  mark?: string; markParts?: string[];
  /** id to jump to (e.g. /kham-pha/x#le-hoi-doc-lap); fx "scatter" = words fly in on scroll (ScatterText) */
  anchor?: string; fx?: "scatter";
};
export type FigImg = Box & { k: "img"; src: string; alt: string; crop?: ImageTransform; rot?: number };
export type FigBox = Box & { k: "box"; bg: string; radius?: string | number; kind?: "line" | "dot" };
export type FigLeaf = FigText | FigImg | FigBox;
export type FigCard = { k: "card"; id: string; href?: string; items: FigLeaf[] };
export type FigSection = { id: string; y: number; bg?: string; anchor?: string; items: (FigLeaf | FigCard)[] };
export type FigPage = { h: number; sections: FigSection[] };

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

export default function FigmaCanvas({ page }: { page: FigPage }) {
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
                  <Link key={it.id} href={it.href} className={`${cls} group`} style={style} {...(/^https?:/.test(it.href) && { target: "_blank", rel: "noopener noreferrer" })}>
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
