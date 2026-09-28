// For every frame on the Figma "Thiết kế DEMO" page, write .figma-cache/demo/<frame>.json:
// each visible layer with frame-relative box, text style/content, and — for image fills —
// the ORIGINAL downloaded file (design/demo-images/<imageRef>.<ext>) plus scaleMode/imageTransform
// so framing is done in CSS, never by editing the file.
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
const file = JSON.parse(readFileSync(".figma-cache/file.json", "utf8"));
const page = file.document.children.find((p) => p.id === "671:10");
const files = Object.fromEntries(readdirSync("design/demo-images").map((f) => [f.split(".")[0], `design/demo-images/${f}`]));
const hex = (c, o = 1) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("") + (c.a * o < 1 ? Math.round(c.a * o * 255).toString(16).padStart(2, "0") : "");
mkdirSync(".figma-cache/demo", { recursive: true });
const index = [];
for (const frame of page.children.filter((c) => c.type === "FRAME")) {
  const o = frame.absoluteBoundingBox;
  const layers = [];
  (function walk(n, path) {
    if (n.visible === false) return;
    const b = n.absoluteBoundingBox;
    const L = { id: n.id, type: n.type, name: n.name, path: path.join(" > ") };
    if (b) Object.assign(L, { x: Math.round(b.x - o.x), y: Math.round(b.y - o.y), w: Math.round(b.width), h: Math.round(b.height) });
    if (n.rotation) L.rot = +(n.rotation * 180 / Math.PI).toFixed(2);
    if (n.opacity != null && n.opacity < 1) L.opacity = n.opacity;
    if (n.cornerRadius) L.radius = n.cornerRadius;
    for (const f of (n.fills || []).filter((f) => f.visible !== false)) {
      if (f.type === "SOLID") L.color = hex(f.color, f.opacity ?? 1);
      if (f.type === "IMAGE") L.image = { file: files[f.imageRef], src: `/images/figma/${f.imageRef}.webp`, scaleMode: f.scaleMode, imageTransform: f.imageTransform };
      if (f.type.startsWith("GRADIENT")) L.gradient = { type: f.type, stops: f.gradientStops.map((s) => [hex(s.color), +s.position.toFixed(3)]), handles: f.gradientHandlePositions };
    }
    if (n.strokes?.length && n.strokeWeight) L.stroke = { color: n.strokes[0].color && hex(n.strokes[0].color), weight: n.strokeWeight };
    if (n.effects?.some((e) => e.visible !== false)) L.effects = n.effects.filter((e) => e.visible !== false);
    if (n.type === "TEXT") {
      const s = n.style;
      Object.assign(L, { text: n.characters, font: { family: s.fontFamily, weight: s.fontWeight, size: s.fontSize, lineHeight: s.lineHeightPx, letterSpacing: s.letterSpacing, align: s.textAlignHorizontal, case: s.textCase, decoration: s.textDecoration } });
      if (n.characterStyleOverrides?.some(Boolean)) L.styleRuns = { overrides: n.characterStyleOverrides, table: n.styleOverrideTable };
    }
    if (n.interactions?.length) L.interactions = n.interactions;
    if (["VECTOR", "BOOLEAN_OPERATION", "ELLIPSE", "REGULAR_POLYGON", "STAR", "LINE"].includes(n.type)) L.vector = true;
    layers.push(L);
    for (const c of n.children || []) walk(c, [...path, n.name]);
  })(frame, []);
  const out = `.figma-cache/demo/${frame.name}.json`;
  writeFileSync(out, JSON.stringify({ id: frame.id, name: frame.name, w: o.width, h: o.height, layers }, null, 1));
  index.push({ id: frame.id, name: frame.name, h: o.height, layers: layers.length, images: layers.filter((l) => l.image).length });
}
writeFileSync(".figma-cache/demo/_index.json", JSON.stringify(index, null, 1));
console.log(index.length, "frames;", index.reduce((a, b) => a + b.images, 0), "image layers; missing files:", index.length && Object.values(files).length);
