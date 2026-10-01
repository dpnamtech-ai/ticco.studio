// Generates src/data/project-pages.ts (the /kham-pha + /kham-pha/<slug> page layouts) from the Figma DEMO
// cache (.figma-cache/demo/<frame>.json + .figma-cache/file.json for the layer tree). Re-run after re-extracting
// Figma:  node scripts/gen-project-pages.mjs
// Per-page extras Figma can't tell us (routes, links, anchors) live in PAGES below.
import { readFileSync, writeFileSync } from "node:fs";

const PAGES = [
  {
    slug: "kham-pha", file: "kham-pha", alt: "Dự án vui — Tíc Cơ",
    anchors: { "671:459": "du-an-rieng", "671:479": "du-an-hop-tac", "671:491": "su-kien" },
    // rows (title + description + rule) link to the project pages
    links: {
      "671:464": "/kham-pha/nguoi-viet-van-dong", "671:468": "/kham-pha/chuc-tet-nhau-that-su",
      "671:472": "/kham-pha/lam-moi-doi-di", "671:476": "/kham-pha/minh-trong-nha-nha-trong-nuoc",
      "671:484": "/kham-pha/freezedom-thu-roi-nghi-di", "671:488": "/kham-pha/neenee-dau-doi-mu-chan-vao-doi",
      // events have no page of their own: jump straight to the event part of the project page that covers it
      "671:496": "/kham-pha/nguoi-viet-van-dong#le-hoi-doc-lap", "671:500": "/kham-pha/freezedom-thu-roi-nghi-di#pop-up-event",
    },
  },
  // anchors may name a section or a single text layer (the event heading sits mid-section)
  { slug: "nguoi-viet-van-dong", file: "du-an-Nguoi-Viet-Van-Dong", alt: "Người Việt Vận Động — Tíc Cơ", anchors: { "671:560": "le-hoi-doc-lap" } },
  {
    slug: "chuc-tet-nhau-that-su", file: "du-an-Chuc-Tet-Nhau-That-Su", alt: "Chúc Tết Nhau Thật Sự — Tíc Cơ",
    links: {
      "863:71": "/san-pham/gile-yen-tam", "863:72": "/san-pham/than-chu-nam-moi-2026",
      "863:76": "/san-pham/sticker-09-chuc-nhau-that-su", "863:80": "/san-pham/li-xi-2026",
    },
  },
  { slug: "lam-moi-doi-di", file: "du-an-Lam-Moi-Doi-Di", alt: "Làm Mới Đời Đi — Tíc Cơ" },
  {
    slug: "minh-trong-nha-nha-trong-nuoc", file: "du-an-Minh-trong-nha-Nha-trong-nuoc", alt: "Mình Trong Nhà, Nhà Trong Nước — Tíc Cơ",
    // "Đọc thêm về ..." cards -> the client's Instagram posts (em bé / phụ nữ giao thời / ông cựu chiến binh)
    links: {
      "735:173": "https://www.instagram.com/p/C_QXPIePuEk/?img_index=1",
      "735:174": "https://www.instagram.com/p/C_Vh3yZPY3L/?img_index=1",
      "735:175": "https://www.instagram.com/p/C_Vh3yZPY3L/?img_index=1", // TODO client: same link as 735:174, waiting for the ông's post
    },
  },
  { slug: "freezedom-thu-roi-nghi-di", file: "du-an-Thu-roi-nghi-di", alt: "Tíc Cơ x Freezedom: Thu Rồi Nghỉ Đi", links: { "735:179": "/san-pham/so-nghi-di" }, anchors: { "735:190": "pop-up-event" } },
  {
    slug: "neenee-dau-doi-mu-chan-vao-doi", file: "du-an-Dau-doi-mu-chan-vao-doi", alt: "Tíc Cơ x Neenee: Đầu đội mũ, Chân vào đời",
    links: { "735:299": "/san-pham/bst-dau-doi-mu-chan-vao-doi", "735:300": "/san-pham/bst-dau-doi-mu-chan-vao-doi" },
  },
];

const file = JSON.parse(readFileSync(".figma-cache/file.json", "utf8"));
const find = (n, id) => { if (n.id === id) return n; for (const c of n.children || []) { const f = find(c, id); if (f) return f; } };
const TOP = 51; // promo bar + navbar rows, rendered by the site layout
const r = (v) => Math.round(v * 100) / 100;
const css = (g) => `linear-gradient(180deg,${g.stops[0][0]},${g.stops[1][0]})`; // every DEMO gradient is top→bottom, 2 effective stops
const warn = [];
// Highlight vectors that cover only part of their text: the highlighted runs (the vector outline isn't in the cache).
const MARK_PARTS = {
  "732:34": ["01 sổ tay Nghỉ Đi từ Tíc Cơ", "02 hộp kem trong collection Thu Rồi", "từ Freezedom."],
};
// Event copy that plays the word-scatter effect on scroll (client reference video, see ScatterText)
const SCATTER = new Set([]); // layer ids, e.g. "671:560"
const overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

function build(cfg) {
  const demo = JSON.parse(readFileSync(`.figma-cache/demo/${cfg.file}.json`, "utf8"));
  const L = Object.fromEntries(demo.layers.map((l) => [l.id, l]));
  const frame = find(file.document, demo.id);
  const footer = frame.children.find((c) => c.name === "footer");
  const H = L[footer.id].y - TOP;
  let h1Done = false;
  const skip = (n) => n.visible === false || !L[n.id];
  const leaves = (n) => (skip(n) ? [] : n.children && n.type !== "BOOLEAN_OPERATION" ? n.children.flatMap(leaves) : [n]);

  const leaf = (n, parent) => {
    const l = L[n.id];
    const box = { id: n.id, x: l.x, y: l.y - TOP, w: l.w, h: l.h };
    if (l.type === "TEXT") {
      const f = l.font;
      let text = l.text.replace(/[ \t]+\n/g, "\n");
      let y = box.y, lh = f.lineHeight;
      const lead = text.match(/^\n*/)[0].length;
      y += lead * lh;
      text = text.trim();
      // Figma trick: tiny line-height + blank lines as spacing -> one real line-height
      if (lh < f.size * 0.8 && text.includes("\n\n")) { text = text.replace(/\n\n/g, "\n"); lh *= 2; }
      if (f.case && f.case !== "ORIGINAL") warn.push(`${n.id} textCase ${f.case}`);
      const lines = text.split("\n").length;
      const auto = n.style?.textAutoResize;
      const t = {
        k: "text", ...box, y: r(y), text, size: f.size, lh: r(lh / f.size), ls: r(f.letterSpacing / f.size * 1000) / 1000,
        wt: f.weight, align: { LEFT: "l", CENTER: "c", RIGHT: "r", JUSTIFIED: "j" }[f.align], color: l.color,
        tag: !h1Done && f.size >= 80 ? "h1" : f.size >= 36 ? "h2" : "p",
      };
      if (t.tag === "h1") h1Done = true;
      if (cfg.anchors?.[n.id]) t.anchor = cfg.anchors[n.id];
      if (SCATTER.has(n.id)) t.fx = "scatter";
      if (auto === "WIDTH_AND_HEIGHT" || lines === Math.round(l.h / f.lineHeight) - lead) t.nowrap = true;
      if (l.opacity != null) t.op = r(l.opacity);
      // text sitting on a solid vector (speech bubble / highlight) keeps that colour behind it on mobile
      const bub = (parent?.children || []).map((c) => L[c.id]).find((v) => (v?.type === "VECTOR" || v?.type === "RECTANGLE") && v.color && !v.image && v.w < 1270 && overlaps(v, l));
      // a solid vector behind text is a line-by-line highlight in the design (drawn as text background, see FigmaCanvas)
      if (bub?.type === "VECTOR") {
        t.mark = bub.color;
        if (MARK_PARTS[n.id]) t.markParts = MARK_PARTS[n.id];
      } else if (bub) t.bubble = bub.color;
      return t;
    }
    if (l.image) {
      const tr = l.image.imageTransform;
      const i = { k: "img", ...box, src: l.image.src, alt: cfg.alt };
      if (l.image.scaleMode === "STRETCH" && tr) {
        if (Math.abs(tr[0][1]) > 1e-3 || Math.abs(tr[1][0]) > 1e-3) warn.push(`${n.id} "${n.name}" skewed/rotated crop approximated (off-diagonal ${tr[0][1].toFixed(3)}, ${tr[1][0].toFixed(3)})`);
        i.crop = [[r4(tr[0][0]), 0, r4(tr[0][2])], [0, r4(tr[1][1]), r4(tr[1][2])]];
      } else if (l.image.scaleMode !== "FILL") warn.push(`${n.id} scaleMode ${l.image.scaleMode}`);
      if (l.rot) i.rot = l.rot;
      return i;
    }
    if (l.type === "LINE" && l.stroke) return { k: "box", ...box, h: l.stroke.weight, bg: l.stroke.color, kind: "line" };
    // highlight vector behind a text: the text draws it (t.mark)
    if (l.type === "VECTOR" && l.color && !l.gradient && (parent?.children || []).some((c) => L[c.id]?.type === "TEXT" && overlaps(l, L[c.id]))) return null;
    if (l.color || l.gradient) {
      const b = { k: "box", ...box, bg: l.gradient ? css(l.gradient) : l.color };
      if (l.type === "ELLIPSE") b.radius = "50%";
      else if (l.type === "VECTOR") b.radius = Math.min(l.h / 2, 24); // speech bubble / highlight blob, approximated
      if (l.w <= 30 && l.type === "ELLIPSE") b.kind = "dot";
      if (l.effects) warn.push(`${n.id} "${n.name}" effects (${l.effects.map((e) => e.type).join("+")}) not reproduced`);
      if (l.type === "VECTOR") warn.push(`${n.id} "${n.name}" ${l.w}x${l.h} vector rebuilt as rounded box`);
      return b;
    }
    warn.push(`${n.id} "${n.name}" ${l.type} ${l.w}x${l.h} skipped (stroke-only vector, no geometry in cache)`);
    return null;
  };

  // A nested group with one photo + its caption(s) becomes a "card": kept together (and linkable) on mobile.
  const node = (n, parent) => {
    if (skip(n)) return [];
    const href = cfg.links?.[n.id];
    if (n.type === "GROUP" || n.type === "FRAME") {
      const ls = leaves(n);
      const imgs = ls.filter((c) => L[c.id].image).length;
      const ownImg = n.children.some((c) => L[c.id]?.image);
      if (href || (imgs === 1 && ownImg && ls.some((c) => L[c.id].type === "TEXT"))) {
        const items = n.children.flatMap((c) => leavesWithParent(c, n)).map(([c, p]) => leaf(c, p)).filter(Boolean);
        const cap = items.find((i) => i.k === "text");
        if (cap) for (const i of items) if (i.k === "img") i.alt = cap.text.replace(/\s+/g, " ");
        const card = { k: "card", id: n.id, items };
        if (href) card.href = href;
        return [card];
      }
      return n.children.flatMap((c) => node(c, n));
    }
    const it = leaf(n, parent);
    return it ? [it] : [];
  };
  const leavesWithParent = (n, p) => (skip(n) ? [] : n.children && n.type !== "BOOLEAN_OPERATION" ? n.children.flatMap((c) => leavesWithParent(c, n)) : [[n, p]]);

  const sections = frame.children
    .filter((c) => !skip(c) && !["headline", "thanh-chon", "footer"].includes(c.name))
    .map((s) => {
      const items = s.children ? s.children.flatMap((c) => node(c, s)) : node(s, frame);
      const bgBox = items.find((i) => i.k === "box" && !i.kind && i.w >= 1270);
      const sec = { id: s.id, y: L[s.id].y - TOP, items };
      if (bgBox) sec.bg = bgBox.bg;
      if (cfg.anchors?.[s.id]) sec.anchor = cfg.anchors[s.id];
      return sec;
    });
  return { h: H, sections };
}
const r4 = (v) => Math.round(v * 10000) / 10000;

const out = Object.fromEntries(PAGES.map((p) => [p.slug, build(p)]));
writeFileSync(
  "src/data/project-pages.ts",
  `// GENERATED by scripts/gen-project-pages.mjs from the Figma "Thiết kế DEMO" frames — edit the script, not this file.
// Coordinates are Figma px on the 1280px frame, y measured from below the navbar (frame y - 51).
import type { FigPage } from "@/components/FigmaCanvas";

export const figmaPages: Record<string, FigPage> = ${JSON.stringify(out, null, 1)};
`
);
console.log("wrote src/data/project-pages.ts");
for (const w of warn) console.log("  note:", w);
