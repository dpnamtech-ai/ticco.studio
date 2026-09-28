// Like figma-summarize.mjs but addresses a frame by node id (the DEMO page reuses
// frame names from CODING-PROD, so name lookup is ambiguous). Adds image refs,
// strokes, corner radius, effects and prototype interactions.
// Usage: node scripts/figma-outline.mjs 671:11 [--no-ids]
import { readFileSync } from "node:fs";
import path from "node:path";

const [id, flag] = process.argv.slice(2);
const noIds = flag === "--no-ids";
const data = JSON.parse(readFileSync(path.resolve(import.meta.dirname, "..", ".figma-cache", "file.json"), "utf8"));

function find(n) {
  if (n.id === id) return n;
  for (const c of n.children || []) { const f = find(c); if (f) return f; }
}
const frame = find(data.document);
if (!frame) { console.error(`Node ${id} not found`); process.exit(1); }
const o = frame.absoluteBoundingBox;
const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("") + (c.a < 1 ? `/${c.a.toFixed(2)}` : "");
const fills = (n) => (n.fills || []).filter((f) => f.visible !== false).map((f) =>
  f.type === "SOLID" ? hex({ ...f.color, a: (f.opacity ?? 1) * f.color.a }) : f.type === "IMAGE" ? `img:${f.imageRef?.slice(0, 8)}/${f.scaleMode}` : f.type).join(",");

function walk(n, d) {
  if (n.visible === false) return;
  const b = n.absoluteBoundingBox;
  const pad = "  ".repeat(d);
  const pos = b ? `X${Math.round(b.x - o.x)} Y${Math.round(b.y - o.y)} W${Math.round(b.width)} H${Math.round(b.height)}` : "";
  const extra = [];
  const f = fills(n); if (f) extra.push(`fill=${f}`);
  if (n.strokes?.length && n.strokeWeight) extra.push(`stroke=${fills({ fills: n.strokes })}@${n.strokeWeight}`);
  if (n.cornerRadius) extra.push(`r=${n.cornerRadius}`);
  if (n.opacity != null && n.opacity < 1) extra.push(`op=${n.opacity.toFixed(2)}`);
  if (n.rotation) extra.push(`rot=${(n.rotation * 180 / Math.PI).toFixed(1)}`);
  if (n.effects?.length) extra.push(`fx=${n.effects.filter(e=>e.visible!==false).map((e) => e.type).join("+")}`);
  if (n.layoutMode && n.layoutMode !== "NONE") extra.push(`auto=${n.layoutMode} gap=${n.itemSpacing} pad=${[n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft].map(v=>v||0).join("/")}`);
  if (n.interactions?.length) extra.push(`proto=${JSON.stringify(n.interactions.map((i) => [i.trigger?.type, ...(i.actions || []).map((a) => [a.type, a.navigation, a.destinationId, a.transition?.type, a.transition?.duration].filter(Boolean).join(":"))]))}`);
  const idp = noIds ? "" : ` {${n.id}}`;
  if (n.type === "TEXT") {
    const s = n.style || {};
    console.log(`${pad}TEXT ${pos} ${s.fontFamily} ${s.fontWeight} ${s.fontSize}/${Math.round(s.lineHeightPx || 0)} ls=${(s.letterSpacing||0).toFixed(1)} ${s.textAlignHorizontal} ${extra.join(" ")} "${(n.characters || "").replace(/\n/g, "\n").slice(0, 160)}"${idp}`);
  } else {
    console.log(`${pad}${n.type} ${pos} "${n.name}" ${extra.join(" ")}${idp}`);
  }
  for (const c of n.children || []) walk(c, d + 1);
}
walk(frame, 0);
