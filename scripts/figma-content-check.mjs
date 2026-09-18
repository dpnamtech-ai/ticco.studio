// Content-match test: every Figma text node must appear in the rendered page
// (checked line by line; visible text OR alt/aria-label/title, since headings are baked as images).
//   node scripts/figma-content-check.mjs [baseUrl]
import { readFileSync } from "node:fs";
import path from "node:path";

const BASE = process.argv[2] || "http://localhost:3100";
const FRAMES = {
  "trang-chu": "/",
  "san-pham": "/san-pham",
  "tung-san-pham": "/san-pham/so-can-ban",
  "kham-pha": "/kham-pha",
  "ve-Tic-Co": "/ve-tic-co",
  "mascot-Dan": "/mascot-dan",
  "du-an-Nguoi-Viet-Van-Dong": "/kham-pha/nguoi-viet-van-dong",
};
const data = JSON.parse(readFileSync(path.resolve(import.meta.dirname, "..", ".figma-cache", "file.json"), "utf8"));
const norm = (s) => s.normalize("NFC").toLowerCase().replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/[\s ]+/g, " ").trim();
const find = (n, name) => (n.name === name && n.type === "FRAME" ? n : (n.children || []).map((c) => find(c, name)).find(Boolean));
const texts = (n, out = []) => { if (n.type === "TEXT") out.push(...(n.characters || "").split("\n").map((l) => l.trim()).filter((l) => l.length > 2)); (n.children || []).forEach((c) => texts(c, out)); return out; };

let total = 0, miss = 0;
for (const [frameName, route] of Object.entries(FRAMES)) {
  const frame = find(data.document, frameName);
  if (!frame) { console.log(`?? frame ${frameName} not in cache`); continue; }
  const html = norm((await (await fetch(BASE + route)).text()).replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+?(?:alt|aria-label|title)="([^"]*)"[^>]*>/g, " $1 ").replace(/<[^>]+>/g, " "));
  const bad = [...new Set(texts(frame))].filter((t) => !html.includes(norm(t)));
  total += new Set(texts(frame)).size; miss += bad.length;
  console.log(`\n${frameName} -> ${route}: ${bad.length} missing / ${new Set(texts(frame)).size}`);
  bad.forEach((t) => console.log("  - " + JSON.stringify(t.slice(0, 90))));
}
console.log(`\nContent match: ${total - miss}/${total}`);
