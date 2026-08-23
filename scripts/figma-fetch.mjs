// Pull the whole website-Ticco Figma file as structured JSON, one request
// instead of clicking through Dev Mode node by node.
//
// Usage:
//   node scripts/figma-fetch.mjs                 -> dumps full file tree to .figma-cache/file.json
//   node scripts/figma-fetch.mjs --node 171:28    -> dumps just that node (and children) to .figma-cache/node-171-28.json
//   node scripts/figma-fetch.mjs --images 171:28,183:52 [--scale 4] -> resolves PNG export URLs for those node ids (default scale 2)
//
// Requires FIGMA_TOKEN and FIGMA_FILE_KEY in .env.local (see .env.local.example).

import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnvLocal();

const TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY || "ityGd0GAM9yAMaz1i16ZFR";

if (!TOKEN) {
  console.error("Missing FIGMA_TOKEN. Add it to .env.local (see .env.local.example).");
  process.exit(1);
}

const cacheDir = path.join(root, ".figma-cache");
mkdirSync(cacheDir, { recursive: true });

async function figmaGet(pathname) {
  const res = await fetch(`https://api.figma.com/v1${pathname}`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  if (!res.ok) {
    throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

const args = process.argv.slice(2);
const nodeArg = args.includes("--node") ? args[args.indexOf("--node") + 1] : null;
const imagesArg = args.includes("--images") ? args[args.indexOf("--images") + 1] : null;
const scaleArg = args.includes("--scale") ? args[args.indexOf("--scale") + 1] : "2";

if (imagesArg) {
  const ids = imagesArg.split(",").join(",");
  const data = await figmaGet(`/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=${scaleArg}`);
  console.log(JSON.stringify(data.images, null, 2));
} else if (nodeArg) {
  const data = await figmaGet(`/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(nodeArg)}`);
  const out = path.join(cacheDir, `node-${nodeArg.replace(":", "-")}.json`);
  writeFileSync(out, JSON.stringify(data, null, 2));
  console.log(`Saved ${out}`);
} else {
  const data = await figmaGet(`/files/${FILE_KEY}`);
  const out = path.join(cacheDir, "file.json");
  writeFileSync(out, JSON.stringify(data, null, 2));
  console.log(`Saved ${out} (${(JSON.stringify(data).length / 1024).toFixed(0)} KB)`);
}
