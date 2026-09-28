// Compare a DOM dump (qa/demo/dom-extract.js output) against a DEMO frame manifest.
// Usage: node scripts/qa-figma-diff.mjs <frame-name> <dom.json> [--tol 4]
// Prints each Figma TEXT layer: found/missing in DOM, position/size/font deltas; and image layers whose src is missing.
import { readFileSync } from "node:fs";
const [frame, domPath] = process.argv.slice(2);
const tol = process.argv.includes("--tol") ? +process.argv[process.argv.indexOf("--tol") + 1] : 4;
const raw = readFileSync(domPath, "utf8");
const dom = JSON.parse(raw.slice(raw.indexOf("{")));
const fig = JSON.parse(readFileSync(`.figma-cache/demo/${frame}.json`, "utf8"));
const k = dom.vw / fig.w; // DOM px per Figma px
const norm = (s) => s.normalize("NFC").replace(/\s+/g, " ").trim().toLowerCase();
const rgb = (hex) => hex && `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`;
let ok = 0, bad = 0, missing = 0;
const rows = [];
for (const t of fig.layers.filter((l) => l.type === "TEXT" && l.text?.trim())) {
  const want = norm(t.text);
  const cands = dom.texts.filter((d) => norm(d.text) === want || norm(d.text).startsWith(want.slice(0, 40)) || want.startsWith(norm(d.text)) && norm(d.text).length > 8);
  if (!cands.length) { missing++; rows.push(`MISSING  "${t.text.replace(/\n/g, " ").slice(0, 60)}" @${t.x},${t.y}`); continue; }
  const d = cands.sort((a, b) => Math.hypot(a.x / k - t.x, a.y / k - t.y) - Math.hypot(b.x / k - t.x, b.y / k - t.y))[0];
  const lead = (t.text.match(/^\s*\n/) || [""])[0].split("\n").length - 1; if (lead) t.y += lead * (t.font.lineHeight || t.font.size * 1.2);
  const al = t.font.align, anchor = (b, w) => al === "RIGHT" ? b + w : al === "CENTER" ? b + w / 2 : b;
  const dx = Math.round(anchor(d.x, d.w) / k - anchor(t.x, t.w)), dy = Math.round(d.y / k - t.y), fs = +(d.fs / k).toFixed(1);
  const issues = [];
  if (Math.abs(dx) > tol || Math.abs(dy) > tol) issues.push(`pos Δ${dx},${Δy(dy)}`);
  if (Math.abs(fs - t.font.size) > 0.6) issues.push(`font ${fs}≠${t.font.size}`);
  if (String(t.font.weight) !== String(d.fw)) issues.push(`weight ${d.fw}≠${t.font.weight}`);
  if (t.color && rgb(t.color.slice(0, 7)) !== d.color.replace(/rgba\((\d+), (\d+), (\d+), 1\)/, "rgb($1, $2, $3)")) issues.push(`color ${d.color}≠${t.color}`);
  if (issues.length) { bad++; rows.push(`DIFF     "${t.text.replace(/\n/g, " ").slice(0, 50)}" ${issues.join("; ")}`); } else ok++;
}
function Δy(v) { return v; }
const imgMissing = fig.layers.filter((l) => l.image && l.w > 30 && l.h > 30).flatMap((l) => {
  const hit = dom.imgs.find((i) => Math.abs(i.x / k - l.x) <= tol * 2 && Math.abs(i.y / k - l.y) <= tol * 2 && Math.abs(i.w / k - l.w) <= tol * 2 && Math.abs(i.h / k - l.h) <= tol * 2)
    || dom.imgs.find((i) => i.src.includes(l.image.src.split("/").pop().split(".")[0]));
  if (!hit) return [`IMG-MISS "${l.name}" ${l.w}x${l.h} @${l.x},${l.y} (${l.id})`];
  const d = [Math.round(hit.x / k - l.x), Math.round(hit.y / k - l.y), Math.round(hit.w / k - l.w), Math.round(hit.h / k - l.h)];
  return d.some((v) => Math.abs(v) > tol * 2) ? [`IMG-DIFF "${l.name}" Δx${d[0]} Δy${d[1]} Δw${d[2]} Δh${d[3]} (${l.id})`] : [];
});
console.log(rows.join("\n"));
console.log(imgMissing.join("\n"));
console.log(`\n${frame}: text ok ${ok}, diff ${bad}, missing ${missing}; image issues ${imgMissing.length}`);
