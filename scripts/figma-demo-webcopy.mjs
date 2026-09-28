// Make web-sized COPIES of the original Figma images (design/demo-images, untouched) into
// public/images/figma/<imageRef>.webp — no cropping, just re-encode + downscale. Client wants the
// sharpest images possible: 3.5x the largest size any layer shows it at (pages scale up to 1920 = 1.5x the
// Figma frame, on DPR-2 screens, plus hover/crop headroom), at least 1600px for full-width mobile/tablet, never above the original.
// Rewrites every file; OUT env var picks another output dir (to compare sizes before replacing).
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import sharp from "sharp";
const need = {};
for (const f of readdirSync(".figma-cache/demo").filter((f) => f !== "_index.json")) {
  for (const l of JSON.parse(readFileSync(`.figma-cache/demo/${f}`)).layers) {
    if (!l.image) continue;
    const ref = l.image.file.split("/").pop().split(".")[0];
    const sx = l.image.imageTransform?.[0]?.[0] || 1;
    need[ref] = Math.max(need[ref] || 1600, Math.ceil((3.5 * l.w) / sx));
  }
}
const dir = process.env.OUT || "public/images/figma";
mkdirSync(dir, { recursive: true });
let n = 0;
for (const f of readdirSync("design/demo-images")) {
  const ref = f.split(".")[0], out = `${dir}/${ref}.webp`;
  const img = sharp(`design/demo-images/${f}`, { limitInputPixels: false });
  const { width } = await img.metadata();
  await img.resize({ width: Math.min(width, need[ref] || 2560), withoutEnlargement: true }).webp({ quality: 95, alphaQuality: 100, smartSubsample: true }).toFile(out);
  n++;
}
console.log("wrote", n);
