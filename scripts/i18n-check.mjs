// English-site leftover check: opens every /en page and lists text that is still Vietnamese.
//   node scripts/i18n-check.mjs                 # starts `next start` on :3102 from the current .next build
//   node scripts/i18n-check.mjs https://x.app   # checks a deployed site instead
// Writes qa/i18n-missing.json ({ "<Vietnamese text>": ["/en/page", ...] }) and exits 1 while anything is left.
// Only brand names stay Vietnamese on the English site (ALLOWED below).
import { spawn, execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const REMOTE = process.argv[2];
const BASE = (REMOTE || "http://localhost:3102").replace(/\/$/, "");
// brand + mascot names, "Tết" (English copy keeps the festival's name) and partners' own names
const ALLOWED = [/tíc cơ/gi, /^(tíc|cơ)$/gi, /đần/gi, /tết/gi, /Lớp học Hồng Xiêm/g]; // word effects split "Tíc" / "Cơ"
// Vietnamese-only letters (plain a-z words like "Bandana" are fine in both languages)
const VN = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
const isVietnamese = (s) => VN.test(ALLOWED.reduce((t, re) => t.replace(re, ""), s));

let server;
if (!REMOTE) {
  if (await fetch(BASE).then(() => true, () => false)) throw new Error(`${BASE} already in use (old build?)`);
  server = spawn("npx", ["next", "start", "-p", "3102"], { shell: true, stdio: "ignore" });
  for (let i = 0; i < 60 && !(await fetch(BASE).then((r) => r.ok, () => false)); i++) await new Promise((r) => setTimeout(r, 1000));
}

try {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).filter((p) => !/^\/en(\/|$)/.test(p));
  const en = [...new Set([...paths, "/gio-hang", "/checkout", "/tim-kiem?q=tui"].map((p) => (p === "/" ? "/en" : `/en${p}`)))];

  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const missing = {};
  for (const path of en) {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 60000 });
    const texts = await page.evaluate(() => {
      const BLOCK = "p,h1,h2,h3,h4,h5,h6,li,a,button,label,dt,dd,td,th,figcaption,option,summary,blockquote";
      const out = new Set();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (!n.nodeValue.trim() || n.parentElement.closest("script,style,noscript")) continue;
        const el = n.parentElement.closest(BLOCK) || n.parentElement;
        out.add(el.textContent.replace(/\s+/g, " ").trim());
      }
      for (const el of document.querySelectorAll("[alt],[placeholder],[aria-label],[title]")) {
        for (const a of ["alt", "placeholder", "aria-label", "title"]) if (el.getAttribute(a)) out.add(el.getAttribute(a).trim());
      }
      out.add(document.title);
      out.add(document.querySelector('meta[name="description"]')?.content ?? "");
      return [...out];
    });
    for (const t of texts.filter(isVietnamese)) (missing[t] ??= []).push(path);
  }
  await browser.close();

  const n = Object.keys(missing).length;
  writeFileSync("qa/i18n-missing.json", JSON.stringify(missing, null, 1) + "\n");
  console.log(`${en.length} English pages, ${n} Vietnamese text(s) left -> qa/i18n-missing.json`);
  process.exitCode = n ? 1 : 0;
} finally {
  if (server) {
    try {
      if (process.platform === "win32") execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: "ignore" });
      else server.kill();
    } catch { /* already gone */ }
  }
}
