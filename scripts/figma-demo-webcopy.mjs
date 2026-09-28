// Make web-sized COPIES of the original Figma images (design/demo-images, untouched) into
// public/images/figma/<imageRef>.webp — no cropping, just re-encode + downscale to 2x the
// largest size any layer shows it at (accounting for imageTransform zoom).
import { readFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import sharp from "sharp";
const need = {};
for (const f of readdirSync(".figma-cache/demo").filter((f) => f !== "_index.json")) {
  for (const l of JSON.parse(readFileSync(`.figma-cache/demo/${f}`)).layers) {
    if (!l.image) continue;
    const ref = l.image.file.split("/").pop().split(".")[0];
    const sx = l.image.imageTransform?.[0]?.[0] || 1;
    need[ref] = Math.max(need[ref] || 0, Math.ceil((2 * l.w) / sx));
  }
}
mkdirSync("public/images/figma", { recursive: true });
let n = 0;
for (const f of readdirSync("design/demo-images")) {
  const ref = f.split(".")[0], out = `public/images/figma/${ref}.webp`;
  if (existsSync(out)) continue;
  const img = sharp(`design/demo-images/${f}`, { limitInputPixels: false });
  const { width } = await img.metadata();
  await img.resize({ width: Math.min(width, need[ref] || 2560), withoutEnlargement: true }).webp({ quality: 85, alphaQuality: 100 }).toFile(out);
  n++;
}
console.log("wrote", n);
