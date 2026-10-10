// Pre-renders every raster in public/images/ at the widths in src/lib/image-widths.json, as webp q90, into
// public/_img/<width>/<same path>.webp. src/lib/image-loader.ts points next/image at these static files, so no image
// goes through Vercel's optimizer: the Hobby plan's monthly transformation quota ran out on 2026-10-11 and every
// photo not already cached came back 402 (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED).
// Runs as `prebuild`; skips files whose output is newer than the source, so local re-runs are quick.
import { readdirSync, statSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { cpus } from "node:os";
import sharp from "sharp";

const root = join(import.meta.dirname, "..");
const SRC = join(root, "public/images");
const OUT = join(root, "public/_img");
const WIDTHS = JSON.parse(readFileSync(join(root, "src/lib/image-widths.json"), "utf8"));

const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const files = walk(SRC).filter((f) => /\.(webp|png|jpe?g)$/i.test(f));
const jobs = files.flatMap((f) => WIDTHS.map((w) => ({ f, w, out: join(OUT, String(w), relative(SRC, f).replace(/\.\w+$/, ".webp")) })));

let done = 0, skipped = 0;
const t0 = Date.now();
async function run({ f, w, out }) {
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(f).mtimeMs) return skipped++;
  mkdirSync(dirname(out), { recursive: true });
  await sharp(f).resize({ width: w, withoutEnlargement: true }).webp({ quality: 90 }).toFile(out);
  done++;
}
const queue = [...jobs];
await Promise.all(Array.from({ length: Math.max(2, cpus().length) }, async () => { while (queue.length) await run(queue.shift()); }));
console.log(`[gen-image-sizes] ${files.length} images x ${WIDTHS.length} widths: ${done} written, ${skipped} up to date (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
