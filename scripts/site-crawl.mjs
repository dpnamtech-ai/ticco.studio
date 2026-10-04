// node scripts/site-crawl.mjs <screenshotDir> [baseUrl] -> prints findings, journey screenshots in <screenshotDir>
// First-visit test on the live site: fresh browser contexts (no cookies/cart), phone + desktop.
// 1) crawl every internal link reachable from the home page; 2) a shopper's journey up to (not including) placing an order.
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
const OUT = process.argv[2]; mkdirSync(OUT, { recursive: true });
const U = (process.argv[3] || "https://ticcostudios.com").replace(/\/$/, "");
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const issues = [];
const note = (k, m) => issues.push(`[${k}] ${m}`);

async function fresh(mobile) {
  const ctx = await b.createBrowserContext();
  const p = await ctx.newPage();
  if (mobile) { await p.setUserAgent(IPHONE); await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); }
  else await p.setViewport({ width: 1366, height: 800 });
  const tag = mobile ? "phone" : "pc";
  p.on("pageerror", (e) => note(tag, `JS error on ${p.url()}: ${e.message.slice(0, 120)}`));
  p.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) note(tag, `console on ${p.url()}: ${m.text().slice(0, 120)}`); });
  p.on("response", (r) => { const s = r.status(); if (s >= 400 && r.url().startsWith(U) && !r.url().includes("/api/orders")) note(tag, `${s} ${r.url().replace(U, "")} (from ${p.url().replace(U, "")})`); });
  p.on("requestfailed", (r) => { if (r.url().startsWith(U) && !/_rsc=|\/_next\/image/.test(r.url()) && r.failure()?.errorText !== "net::ERR_ABORTED") note(tag, `failed ${r.url().replace(U, "")}: ${r.failure()?.errorText}`); });
  return { ctx, p, tag };
}

// ---------- 1. crawl ----------
for (const mobile of [true, false]) {
  const { ctx, p, tag } = await fresh(mobile);
  const seen = new Set(), queue = ["/"];
  while (queue.length && seen.size < 160) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    const res = await p.goto(U + path, { waitUntil: "networkidle2", timeout: 60000 }).catch((e) => (note(tag, `nav ${path}: ${e.message}`), null));
    if (!res) continue;
    if (res.status() >= 400) { note(tag, `page ${res.status()} ${path}`); continue; }
    const h = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 600) { await p.evaluate((y) => scrollTo(0, y), y); await new Promise((r) => setTimeout(r, 70)); }
    await new Promise((r) => setTimeout(r, 900));
    const r = await p.evaluate((origin) => {
      const out = { links: [], bad: [] };
      if (!document.title) out.bad.push("no <title>");
      if (document.documentElement.scrollWidth > innerWidth + 1) out.bad.push(`page scrolls sideways (${document.documentElement.scrollWidth}px)`);
      for (const im of document.images) if (im.offsetParent && im.complete && im.naturalWidth === 0) out.bad.push("broken image " + (im.currentSrc || im.src).replace(origin, "").slice(0, 70));
      for (const a of document.querySelectorAll("a[href]")) {
        const u = new URL(a.href, location.href);
        if (u.origin === origin && !u.pathname.startsWith("/admin") && !/\.(png|jpe?g|webp|pdf)$/.test(u.pathname)) out.links.push(u.pathname + u.search);
        if (!a.textContent.trim() && !a.querySelector("img,svg") && !a.getAttribute("aria-label")) out.bad.push(`empty link -> ${a.getAttribute("href")}`);
      }
      return out;
    }, U);
    for (const m of new Set(r.bad)) note(tag, `${path}: ${m}`);
    for (const l of r.links) if (!seen.has(l)) queue.push(l);
  }
  console.log(`${tag}: crawled ${seen.size} pages`);
  await ctx.close();
}

// ---------- 2. shopper journey (phone, then pc) ----------
for (const mobile of [true, false]) {
  const { ctx, p, tag } = await fresh(mobile);
  const step = async (name, fn) => {
    try { await fn(); await p.screenshot({ path: `${OUT}/${tag}-${name}.jpg`, type: "jpeg", quality: 60 }); }
    catch (e) { note(tag, `journey "${name}" failed: ${e.message.slice(0, 160)}`); await p.screenshot({ path: `${OUT}/${tag}-${name}-FAIL.jpg`, type: "jpeg", quality: 60 }).catch(() => {}); }
  };
  const clickText = (sel, re) => p.evaluate((sel, src) => { const el = [...document.querySelectorAll(sel)].find((e) => e.offsetParent && new RegExp(src, "i").test(e.textContent.trim())); if (!el) throw new Error("not found " + src); el.click(); }, sel, re.source);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  await step("01-home", async () => { await p.goto(U, { waitUntil: "networkidle2" }); await wait(2500); });
  if (mobile) await step("02-menu", async () => { await p.click('button[aria-label="Menu"]'); await wait(700); await clickText("a", /^Sản phẩm$/); await p.waitForFunction(() => location.pathname === "/san-pham"); await wait(1200); });
  else await step("02-menu", async () => { await clickText("nav a", /^Sản phẩm$/); await p.waitForFunction(() => location.pathname === "/san-pham"); await wait(1200); });
  await step("03-category", async () => { await clickText("main a", /^Túi xách$/); await p.waitForFunction(() => location.search.includes("tui-xach")); await wait(1200); });
  await step("04-product", async () => { await p.goto(U + "/san-pham/khan-bandana-van-su-tuy-minh", { waitUntil: "networkidle2" }); await wait(800); await clickText("main button", /^Tím$/); await wait(800); });
  await step("05-add-to-cart", async () => { await clickText("main button", /Thêm vào giỏ/); await wait(1200); const n = await p.evaluate(() => JSON.parse(localStorage.getItem("ticco-cart") || "[]").length); if (n !== 1) throw new Error("cart has " + n); });
  await step("06-cart-page", async () => { await p.goto(U + "/gio-hang", { waitUntil: "networkidle2" }); await p.click('button[aria-label="Tăng số lượng"]'); await wait(500); const q = await p.evaluate(() => JSON.parse(localStorage.getItem("ticco-cart"))[0].qty); if (q !== 2) throw new Error("qty " + q); });
  await step("07-checkout-empty-submit", async () => { await clickText("a", /Mua ngay/); await p.waitForFunction(() => location.pathname === "/checkout"); await wait(800); await p.click("form button:not([type=button])"); await wait(2500); const t = await p.evaluate(() => document.body.innerText); if (!/Vui lòng nhập họ tên|kiểm tra lại/i.test(t)) throw new Error("no validation message"); });
  await step("08-search", async () => { await p.goto(U + "/", { waitUntil: "networkidle2" }); await p.evaluate(() => [...document.querySelectorAll('button[aria-label="Tìm kiếm"]')].find((b) => b.offsetParent).click()); await wait(600); await p.keyboard.type("đần"); await wait(2500); const n = await p.evaluate(() => [...document.querySelectorAll("a")].filter((a) => a.offsetParent && /\/san-pham\/|\/kham-pha/.test(a.getAttribute("href") || "") && a.closest("[class*=fixed]")).length); if (n < 2) throw new Error("search results " + n); });
  await step("09-lang-en", async () => { await p.goto(U + "/mascot-dan", { waitUntil: "networkidle2" }); if (mobile) { await p.click('button[aria-label="Menu"]'); await wait(600); } await p.evaluate(() => [...document.querySelectorAll("a[hreflang=en]")].find((a) => a.offsetParent).click()); await p.waitForFunction(() => location.pathname === "/en/mascot-dan"); await wait(1500); });
  await step("10-footer-policy", async () => { await p.goto(U + "/", { waitUntil: "networkidle2" }); await clickText("footer a", /Chính sách đổi trả/); await p.waitForFunction(() => location.pathname.includes("doi-tra")); await wait(800); });
  await ctx.close();
}
console.log(issues.length ? [...new Set(issues)].join("\n") : "NO ISSUES");
await b.close();
