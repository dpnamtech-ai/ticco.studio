// Asserts the /kham-pha pages carry every text + image of their Figma DEMO frames.
// Usage: node scripts/check-demo-projects.mjs   (exit 1 on any miss)
// Navbar/promo rows (y < 51) and the "footer" group are owned by the layout components and skipped.
import { readFileSync } from "node:fs";

const FRAMES = [
  "kham-pha", "du-an-Nguoi-Viet-Van-Dong", "du-an-Chuc-Tet-Nhau-That-Su", "du-an-Lam-Moi-Doi-Di",
  "du-an-Minh-trong-nha-Nha-trong-nuoc", "du-an-Thu-roi-nghi-di", "du-an-Dau-doi-mu-chan-vao-doi",
];
const SOURCES = ["src/data/project-pages.ts", "src/app/kham-pha/page.tsx", "src/app/kham-pha/[slug]/page.tsx"];
// JSON-escaped data -> plain text, whitespace collapsed
const norm = (s) => s.replace(/\\n/g, " ").replace(/\\"/g, '"').replace(/\s+/g, " ").trim();
const src = norm(SOURCES.map((f) => readFileSync(f, "utf8")).join("\n"));

let fail = 0;
for (const name of FRAMES) {
  const { layers } = JSON.parse(readFileSync(`.figma-cache/demo/${name}.json`, "utf8"));
  const own = layers.filter((l) => l.y >= 51 && !/(^| > )footer( > |$)/.test(l.path) && l.name !== "footer");
  const miss = [];
  for (const l of own) {
    if (l.text && !src.includes(norm(l.text))) miss.push(`text ${l.id} "${norm(l.text).slice(0, 60)}"`);
    if (l.image && !src.includes(l.image.src)) miss.push(`image ${l.id} ${l.image.src}`);
  }
  const n = own.filter((l) => l.text || l.image).length;
  console.log(`${miss.length ? "FAIL" : "ok  "} ${name}: ${n - miss.length}/${n}`);
  for (const m of miss) console.log("     missing", m);
  fail += miss.length;
}

// every in-page link goes to a route that exists
const slugs = Object.keys(JSON.parse(readFileSync("src/data/project-pages.ts", "utf8").split("= ")[1].replace(/;\s*$/, "")));
for (const [, href] of readFileSync("src/data/project-pages.ts", "utf8").matchAll(/"href": "([^"]+)"/g)) {
  const m = href.match(/^\/kham-pha\/(.+)$/);
  if (m && !slugs.includes(m[1])) { console.log("FAIL dead link", href); fail++; }
}
process.exit(fail ? 1 : 0);
