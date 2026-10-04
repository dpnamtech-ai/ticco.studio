// UI audit: every page at phone + desktop widths, measured in a real browser against the design.
//   node scripts/ui-audit.mjs [baseUrl]        (default https://ticcostudios.com) -> qa/ui-audit.md, exit 1 on findings
// Checks per page and width (a page that times out is retried once):
//   - layout: page scrolls sideways, visible text outside the screen, broken images
//   - Figma fidelity: every text drawn from a Figma frame carries data-fig="frame,x,y,w,h,lineHeightPx,nowrap"
//     (src/components/FigmaCanvas.tsx); its rendered box is compared with the design box:
//       * wraps into more lines than in Figma (font/width drift -> text runs into what's below)
//       * two texts overlapping on screen whose Figma boxes don't overlap
// Motion is turned off (prefers-reduced-motion) so mid-animation transforms don't count as layout.
import { writeFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const BASE = (process.argv[2] || "https://ticcostudios.com").replace(/\/$/, "");
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const WIDTHS = [360, 390, 430, 1280, 1920];
const EXTRA = ["/gio-hang", "/checkout", "/tim-kiem?q=dan", "/en", "/en/mascot-dan", "/en/kham-pha", "/en/kham-pha/chuc-tet-nhau-that-su", "/en/san-pham"];

const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const paths = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => { const u = new URL(m[1]); return u.pathname + u.search; }))]
  .filter((p) => !p.startsWith("/en"));
// product pages share one template: all at 390 + 1280, a sample at the other widths
const products = paths.filter((p) => /^\/san-pham\/.+/.test(p));
const pagesFor = (w) => [...paths.filter((p) => !products.includes(p)), ...(w === 390 || w === 1280 ? products : products.slice(0, 4)), ...EXTRA];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
const findings = [];
let checked = 0;

for (const w of WIDTHS) {
  await page.setViewport({ width: w, height: 900, isMobile: w < 768, hasTouch: w < 768 });
  for (const path of pagesFor(w)) {
    checked++;
    try {
      await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 }).catch(() => page.goto(BASE + path, { waitUntil: "load", timeout: 90000 }));
      const h = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < h; y += 700) { await page.evaluate((y) => scrollTo(0, y), y); await new Promise((r) => setTimeout(r, 60)); }
      await new Promise((r) => setTimeout(r, 700));
      const res = await page.evaluate(() => {
        const iw = innerWidth, out = [];
        const vis = (el) => { const s = getComputedStyle(el); return el.offsetParent && s.visibility !== "hidden" && +s.opacity > 0.05; };
        if (document.documentElement.scrollWidth > iw + 1) out.push(`page scrolls sideways (${document.documentElement.scrollWidth}px wide)`);
        for (const im of document.images) if (vis(im) && im.complete && im.naturalWidth === 0) out.push(`broken image ${(im.currentSrc || im.src).slice(-60)}`);
        for (const el of document.querySelectorAll("main p, main h1, main h2, main h3, main a, main button, main li, footer p, nav a")) {
          if (!vis(el) || !el.textContent.trim() || el.closest("[aria-hidden=true]")) continue;
          const r = el.getBoundingClientRect();
          if (r.width && (r.right > iw + 2 || r.left < -2)) out.push(`text outside the screen: "${el.textContent.trim().slice(0, 40)}"`);
        }
        // Figma fidelity
        const figs = [];
        for (const el of document.querySelectorAll("[data-fig]")) {
          if (!vis(el)) continue;
          const [frame, x, y, fw, fh, lh, nowrap] = el.dataset.fig.split(",").map(Number);
          if ((frame === 390) !== iw < 1024) continue; // phone frames are drawn below lg, desktop frames from lg
          const scale = iw / frame;
          const r = el.getBoundingClientRect();
          const txt = el.textContent.trim().replace(/\s+/g, " ").slice(0, 45);
          if (txt.length <= 2) continue; // a lone bracket/glyph: wider than its tight box, nothing to read
          // lines in the design: the box height, or the copy's own line breaks when the Figma box is set tighter
          const figLines = Math.max(1, Math.round(fh / lh), el.innerText.trim().split("\n").length);
          const lines = Math.round(r.height / (lh * scale));
          if (lines > figLines) out.push(`wraps into ${lines} lines, Figma ${figLines}: "${txt}"`);
          figs.push({ txt, r, fig: { x, y, w: fw, h: fh } });
        }
        const hit = (a, b, m) => Math.min(a.right ?? a.x + a.w, b.right ?? b.x + b.w) - Math.max(a.left ?? a.x, b.left ?? b.x) > m && Math.min(a.bottom ?? a.y + a.h, b.bottom ?? b.y + b.h) - Math.max(a.top ?? a.y, b.top ?? b.y) > m;
        for (let i = 0; i < figs.length; i++) for (let j = i + 1; j < figs.length; j++)
          if (hit(figs[i].r, figs[j].r, 4) && !hit(figs[i].fig, figs[j].fig, 0)) out.push(`texts overlap (not in Figma): "${figs[i].txt}" / "${figs[j].txt}"`);
        return [...new Set(out)];
      });
      for (const f of res) findings.push({ w, path, f });
    } catch (e) {
      findings.push({ w, path, f: `could not check: ${e.message.slice(0, 100)}` });
    }
  }
  console.log(`${w}px done (${findings.length} findings so far)`);
}
await browser.close();

const rows = findings.map((x) => `| ${x.w} | ${x.path} | ${x.f.replace(/\|/g, "/")} |`);
writeFileSync(
  "qa/ui-audit.md",
  `# UI audit — ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC\n\nTarget: ${BASE} · ${checked} page×width checks · widths ${WIDTHS.join(", ")}\nResult: **${findings.length} finding(s)**\n\n` +
    (rows.length ? `| width | page | finding |\n|---|---|---|\n${rows.join("\n")}\n` : "Nothing found.\n"),
);
console.log(`${checked} checks, ${findings.length} findings -> qa/ui-audit.md`);
process.exitCode = findings.length ? 1 : 0;
