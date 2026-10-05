// Tiny blurred previews of the Figma photos (src/data/blur.json: "/images/figma/<ref>.webp" -> data URL, ~300 bytes each).
// Product pages paint them under the full-size photo so a heavy image fades in over its own colours instead of a grey box.
//   node scripts/gen-blur.mjs        (re-run after adding images to public/images/figma)
import { readdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const dir = "public/images/figma";
const out = {};
for (const f of readdirSync(dir).filter((f) => f.endsWith(".webp")).sort()) {
  const buf = await sharp(`${dir}/${f}`).resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  out[`/images/figma/${f}`] = `data:image/webp;base64,${buf.toString("base64")}`;
}
writeFileSync("src/data/blur.json", JSON.stringify(out) + "\n");
console.log(`${Object.keys(out).length} previews -> src/data/blur.json (${Math.round(JSON.stringify(out).length / 1024)} KB, server-side only)`);
