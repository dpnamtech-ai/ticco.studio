// Walk the full cached Figma file tree, list every IMAGE-fill node and every
// TEXT node with its Figma ancestry path (Page > Frame > Group > ... > Layer),
// then batch-download all images into public/figma-export/<page>/<frame>/<layer>.png
// mirroring the Figma layer names/hierarchy, and dump all text into
// .figma-cache/all-text.json for cross-checking copy against content.ts.
//
// Usage: node scripts/figma-export-all.mjs [--scale 2] [--dry]

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
  console.error("Missing FIGMA_TOKEN in .env.local");
  process.exit(1);
}

const args = process.argv.slice(2);
const scale = args.includes("--scale") ? args[args.indexOf("--scale") + 1] : "2";
const dry = args.includes("--dry");

const cacheDir = path.join(root, ".figma-cache");
const filePath = path.join(cacheDir, "file.json");
if (!existsSync(filePath)) {
  console.error("Run `node scripts/figma-fetch.mjs` first to populate .figma-cache/file.json");
  process.exit(1);
}

const file = JSON.parse(readFileSync(filePath, "utf8"));

function slug(s) {
  return String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, (c) => (c === "đ" ? "d" : "D"))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "layer";
}

const imageNodes = []; // {id, name, pathParts, exportSlug}
const textNodes = []; // {id, name, pathParts, characters}

function walk(node, ancestry) {
  const here = [...ancestry, node.name];

  const hasImageFill =
    Array.isArray(node.fills) && node.fills.some((f) => f.type === "IMAGE" && f.visible !== false);
  // Only treat as an exportable "asset" if it's a leaf-ish visual node (rectangle/frame/vector with
  // image fill, or a component instance standing in for an illustration), not every ancestor frame.
  if (hasImageFill && (node.type === "RECTANGLE" || node.type === "ELLIPSE" || node.type === "VECTOR" || node.type === "FRAME" || node.type === "INSTANCE" || node.type === "COMPONENT")) {
    imageNodes.push({ id: node.id, name: node.name, pathParts: here });
  }

  if (node.type === "TEXT" && typeof node.characters === "string" && node.characters.trim()) {
    textNodes.push({ id: node.id, name: node.name, pathParts: here, characters: node.characters });
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, here);
  }
}

for (const page of file.document.children) {
  walk(page, []);
}

console.log(`Found ${imageNodes.length} image-fill nodes, ${textNodes.length} text nodes.`);

// Dump text manifest (grouped by top page/frame) for copy cross-check.
const textOut = path.join(cacheDir, "all-text.json");
writeFileSync(
  textOut,
  JSON.stringify(
    textNodes.map((n) => ({ path: n.pathParts.join(" > "), characters: n.characters })),
    null,
    2
  )
);
console.log(`Saved ${textOut}`);

// Dump image manifest.
const imgManifestOut = path.join(cacheDir, "all-images.json");
writeFileSync(
  imgManifestOut,
  JSON.stringify(
    imageNodes.map((n) => ({ id: n.id, path: n.pathParts.join(" > ") })),
    null,
    2
  )
);
console.log(`Saved ${imgManifestOut}`);

if (dry) {
  console.log("--dry: skipping downloads.");
  process.exit(0);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function figmaGet(pathname, retries = 8) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(`https://api.figma.com/v1${pathname}`, {
      headers: { "X-Figma-Token": TOKEN },
    });
    if (res.status === 429) {
      const wait = Math.min(30000 * (attempt + 1), 180000);
      console.warn(`Rate limited, waiting ${wait}ms (attempt ${attempt + 1}/${retries})...`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
    return res.json();
  }
  throw new Error("Figma API: gave up after retries (429)");
}

// Batch-resolve export URLs (Figma limits are generous but chunk defensively).
const CHUNK = 20;
const exportDir = path.join(root, "public", "figma-export");
mkdirSync(exportDir, { recursive: true });

const results = [];
for (let i = 0; i < imageNodes.length; i += CHUNK) {
  const chunk = imageNodes.slice(i, i + CHUNK);
  const ids = chunk.map((n) => n.id).join(",");
  console.log(`Resolving export URLs ${i + 1}-${i + chunk.length} / ${imageNodes.length}...`);
  const data = await figmaGet(`/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=${scale}`);
  if (data.err) {
    console.error("Figma export error:", data.err);
    continue;
  }
  for (const node of chunk) {
    const url = data.images[node.id];
    if (!url) {
      console.warn(`No export URL for ${node.id} (${node.pathParts.join(" > ")})`);
      continue;
    }
    results.push({ node, url });
  }
  await sleep(1500);
}

console.log(`Downloading ${results.length} images...`);
let done = 0;
for (const { node, url } of results) {
  const dirParts = node.pathParts.slice(0, -1).map(slug);
  const dir = path.join(exportDir, ...dirParts);
  mkdirSync(dir, { recursive: true });
  const filename = `${slug(node.pathParts.at(-1))}.png`;
  const dest = path.join(dir, filename);
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  done++;
  if (done % 20 === 0 || done === results.length) {
    console.log(`  ${done}/${results.length}`);
  }
}

console.log(`Done. Exported ${done} images into ${exportDir}`);
