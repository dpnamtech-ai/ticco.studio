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
// QA hook (scripts/ui-audit.mjs): each Figma text carries its design box "frame,x,y,w,h,lineHeightPx,nowrap", so the
// audit can measure the rendered text against the design at any screen width.
const figAttr = (t: FigText, frame: number) => `${frame},${t.x},${t.y},${t.w},${t.h},${+(t.size * t.lh).toFixed(2)},${t.nowrap ? 1 : 0}`;

type Fx = "scatter" | "fly" | "spin" | "pop" | "bob" | "fill" | "slide-l" | "slide-r";
type Box = { id: string; x: number; y: number; w: number; h: number; fx?: Fx; n?: number };
export type FigText = Box & {
  k: "text"; text: string; size: number; lh: number; ls: number; wt: number; align: "l" | "c" | "r" | "j";
  color: string; tag: "h1" | "h2" | "p"; nowrap?: boolean; op?: number; bubble?: string;
  /** highlight colour drawn behind each line (Figma highlight vector); markParts = only these runs */
  mark?: string; markParts?: string[];
  /** id to jump to (e.g. /kham-pha/x#le-hoi-doc-lap); fx "scatter" = words fly in on scroll (ScatterText) */
  anchor?: string;
  /** set in Be Vietnam Pro in Figma (wider than the site's Be Vietnam) */
  pro?: boolean;
};
export type FigImg = Box & { k: "img"; src: string; alt: string; crop?: ImageTransform; rot?: number; mirror?: boolean };
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

function Text({ t, o, hover, flow }: { t: FigText; o: number; hover?: boolean; flow?: Flow }) {
  const Tag = t.tag;
  const style: Vars = {
    fontFamily: t.pro ? "var(--font-be-vietnam-pro)" : undefined, color: t.color, opacity: t.op, fontWeight: t.wt, letterSpacing: `${t.ls}em`,
    "--fs": cq(t.size), "--fsm": `${mSize(t.size)}px`, "--lh": t.lh, "--lhm": Math.min(Math.max(t.lh, 1.2), 1.6), "--bub": t.bubble ?? "transparent",
  };
  return (
    <>
    {t.anchor && (
      // jump target: at the text's own spot on desktop, in its place in the flow on phones (the navbar is sticky)
      <div id={t.anchor} aria-hidden className={`${POS} max-lg:w-full scroll-mt-[calc(90*var(--u))] max-lg:scroll-mt-20`} style={pos(t, o)} />
    )}
    <Reveal
      variant={t.fx ? "up" : "blur"}
      duration={t.fx ? 0.01 : 1.1}
      className={`${flow ? "lg:relative lg:ml-[var(--ml)] lg:mt-[var(--mt)] lg:w-[var(--w)] max-lg:order-[var(--o)]" : POS} max-lg:w-full`}
      style={{ ...pos(t, o), ...(flow && { "--ml": cq(flow.ml), "--mt": cq(flow.mt) }) }}
    >
      <Tag
        style={style}
        data-fig={figAttr(t, 1280)}
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

// Figma gives a rotated layer's bounding box; the image's own box (W×H turned by rot) is solved back from it. The old
// "swap w and h" only held at 90°: at 5.22° (home phone caption) it made a tall box that cut the Ê's hat and the Đ's corner.
function unrotated({ w, h, rot = 0 }: { w: number; h: number; rot?: number }): CSSProperties {
  const c = Math.abs(Math.cos((rot * Math.PI) / 180)), s = Math.abs(Math.sin((rot * Math.PI) / 180));
  const d = c * c - s * s; // ponytail: 0 at 45°, no layer is turned that way
  const w0 = (w * c - h * s) / d, h0 = (h * c - w * s) / d;
  return { width: `${(w0 / w) * 100}%`, aspectRatio: `${w0}/${h0}`, transform: `translate(-50%,-50%) rotate(${-rot}deg)` };
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
      <div className={`relative overflow-hidden ${i.mirror ? "-scale-x-100" : ""}`} style={{ aspectRatio: `${i.w}/${i.h}` }}>
        {i.rot ? (
          // Figma rotates the whole image layer; the layer's own box is the bounding box turned back
          <div
            className="absolute left-1/2 top-1/2 overflow-hidden"
            style={unrotated(i)}
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

// A card's copy (name, price…) stacks from its first line with Figma's gaps between lines, instead of each line at its
// own fixed spot: a name that runs longer than the design (EN, client 08/10) pushes the price down rather than covering it.
type Flow = { ml: number; mt: number };
function stack(items: FigLeaf[]) {
  const texts = items.filter((c): c is FigText => c.k === "text").sort((a, b) => a.y - b.y);
  if (texts.length < 2) return undefined;
  const x = Math.min(...texts.map((t) => t.x));
  const w = Math.max(...texts.map((t) => t.x + t.w)) - x;
  const flow = new Map<FigLeaf, Flow>(texts.map((t, i) => [t, { ml: t.x - x, mt: i ? Math.max(0, t.y - texts[i - 1].y - texts[i - 1].h) : 0 }]));
  return { texts, x, y: texts[0].y, w, flow };
}

function Leaf({ l, o, hover, inCard, flow }: { l: FigLeaf; o: number; hover?: boolean; inCard?: boolean; flow?: Flow }) {
  if (l.k === "text") return <Text t={l} o={o} hover={hover} flow={flow} />;
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
      const setLines = l.nowrap || l.h <= l.size * l.lh * (n + 0.5) || (n === 1 && len(l.text) < 60);
      // only where the typed lines are the rows: a source that also wraps in its box would wrap each balanced line
      // again (EN "Make Life New" left "that" alone on a row)
      if (setLines && n > 1 && !text.includes("\n") && !l.text.includes("\n\n")) text = balance(text, n);
      // BUG-028: a translation set in more lines than the source must also fit the box height (EN mascot callouts
      // overlapped); BUG-029: paragraphs get 5% slack, the area estimate ran one line long
      // rows as shown, not as typed: a one-line Vietnamese source can wrap to 2 rows in its box (EN mascot caption fell to 9px)
      const rows = Math.max(n, Math.round(l.h / (l.size * l.lh)));
      const tall = rows / Math.max(rows, text.split("\n").length);
      const r = Math.min(tall, setLines ? longest(l.text) / longest(text) : Math.sqrt(len(l.text) / len(text)) * 0.95);
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
  const leaf = (l: FigLeaf, hover = false, place?: CSSProperties) => {
    if (l.k === "text") {
      const Tag = l.tag;
      const style = { fontFamily: l.pro ? "var(--font-be-vietnam-pro)" : undefined, color: l.color, opacity: l.op, fontWeight: l.wt, letterSpacing: `${l.ls}em`, fontSize: u(l.size), lineHeight: l.lh, "--mk": l.lh } as Vars; // no l.bubble here: the phone frame draws that rectangle itself (twice = offset bars)
      const align = { l: "text-left", c: "text-center", r: "text-right", j: "text-justify" }[l.align];
      if (l.fx === "fill")
        return (
          <div key={l.id} style={place ?? at(l)}>
            <ScrollFillText data-fig={figAttr(l, 390)} text={l.text} className={`m-0 ${l.nowrap ? "whitespace-pre" : "whitespace-pre-line"} ${align}`} style={style} />
          </div>
        );
      const Wrap = l.fx === "fly" ? ScatterGroup : Reveal;
      return (
        <Wrap key={l.id} {...(l.fx === "scatter" || l.fx === "fly" ? { variant: "up" as const, duration: 0.01 } : enter(l, "blur"))} style={place ?? at(l)}>
          {l.anchor && <div id={l.anchor} aria-hidden className="absolute top-0 scroll-mt-16" />}
          <Tag
            style={style}
            data-fig={figAttr(l, 390)}
            // runs of spaces are the designer's layout (home hero "(CHÚNG TÔI      CÓ BÁN SẢN PHẨM…)" set as 3 spaced rows):
            // keep them and wrap at the box like Figma does; pre-line collapsed them into one run-on paragraph (client 08/10)
            className={`m-0 ${l.nowrap ? "whitespace-pre" : / {3,}/.test(l.text) ? "whitespace-pre-wrap" : "whitespace-pre-line"} ${align} ${hover ? "transition-transform duration-500 group-active:translate-x-1" : ""}`}
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
        <div className={`relative overflow-hidden ${l.mirror ? "-scale-x-100" : ""}`} style={{ aspectRatio: `${l.w}/${l.h}` }}>
          {l.rot ? (
            <div className="absolute left-1/2 top-1/2 overflow-hidden" style={unrotated(l)}>{img}</div>
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
    // full-width bands get 1px extra so rounding never leaves a hairline of page background between them
    const shape = <div aria-hidden style={{ height: l.w >= 380 ? `calc(${u(l.h)} + 1px)` : u(l.h), background: l.bg, borderRadius: typeof l.radius === "number" ? u(l.radius) : l.radius }} />;
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
              const st = stack(it.items);
              const kids = it.items.filter((c) => !st?.flow.has(c)).map((c) => leaf(c, Boolean(it.href) && c.k === "text"));
              if (st)
                kids.push(
                  <div key={`${it.id}-copy`} style={{ position: "absolute", left: u(st.x), top: u(st.y), width: u(st.w) }}>
                    {st.texts.map((t) => {
                      const f = st.flow.get(t)!;
                      return leaf(t, Boolean(it.href), { position: "relative", marginLeft: u(f.ml), marginTop: u(f.mt), width: u(t.w) });
                    })}
                  </div>,
                );
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
                const st = stack(it.items);
                const kids = it.items.filter((c) => !st?.flow.has(c)).map((c) => <Leaf key={c.id} l={c} o={cOrd(c)} hover={Boolean(it.href) && c.k === "text"} inCard />);
                if (st)
                  kids.push(
                    // phones: "contents", the lines stay flex items of the card column in their reading order
                    <div key={`${it.id}-copy`} className="max-lg:contents lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:w-[var(--w)]" style={{ "--x": cq(st.x), "--y": cq(st.y), "--w": cq(st.w) } as Vars}>
                      {st.texts.map((t) => <Leaf key={t.id} l={t} o={cOrd(t)} hover={Boolean(it.href)} inCard flow={st.flow.get(t)} />)}
                    </div>,
                  );
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
