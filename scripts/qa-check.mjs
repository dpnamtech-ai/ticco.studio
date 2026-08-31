// Automated portion of the regression test suite (qa/testcases.md tracks the
// manual/visual portion — Figma-match, design polish). Run after every fix:
//   node scripts/qa-check.mjs [baseUrl]
// Default baseUrl is the local dev server; pass the Vercel URL to check prod.
//
// Prints PASS/FAIL per case plus an overall %, so the report stays honest and
// re-runnable instead of "trust me, I looked at it."

const BASE = process.argv[2] || "http://localhost:3100";

const ROUTES = [
  "/",
  "/san-pham",
  "/san-pham/so-can-ban",
  "/kham-pha",
  "/ve-tic-co",
  "/mascot-dan",
  "/gio-hang",
];

const results = [];
function record(category, name, pass, detail = "") {
  results.push({ category, name, pass, detail });
}

async function fetchText(path) {
  const res = await fetch(BASE + path);
  return { res, text: await res.text() };
}

// --- Functional / regression: every route loads ---
for (const route of ROUTES) {
  try {
    const res = await fetch(BASE + route);
    record("Functional", `${route} trả về 200`, res.status === 200, `status=${res.status}`);
  } catch (e) {
    record("Functional", `${route} trả về 200`, false, String(e.message));
  }
}

// --- SEO: every route has a non-empty <title> and <meta name="description"> ---
for (const route of ROUTES) {
  const { text } = await fetchText(route);
  const title = /<title>([^<]*)<\/title>/.exec(text)?.[1] ?? "";
  const desc = /<meta name="description" content="([^"]*)"/.exec(text)?.[1] ?? "";
  record("SEO", `${route} có <title>`, title.length > 0 && title.length < 70, `"${title}" (${title.length} ký tự)`);
  record(
    "SEO",
    `${route} có meta description`,
    desc.length > 0 && desc.length < 160,
    `${desc.length} ký tự`
  );
  record("SEO", `${route} có og:title`, /property="og:title"/.test(text));
}

// --- SEO: sitewide infra ---
{
  const robots = await fetch(BASE + "/robots.txt");
  record("SEO", "robots.txt tồn tại", robots.status === 200);
  const sitemap = await fetch(BASE + "/sitemap.xml");
  record("SEO", "sitemap.xml tồn tại", sitemap.status === 200);
}

// --- GEO (AI/generative-engine visibility): structured data + crawlable text ---
{
  const { text } = await fetchText("/san-pham/so-can-ban");
  record("GEO", "Trang sản phẩm có JSON-LD Product schema", /application\/ld\+json/.test(text) && /"@type":\s*"Product"/.test(text));
}
{
  const { text } = await fetchText("/");
  record("GEO", "Trang chủ có JSON-LD Organization schema", /"@type":\s*"Organization"/.test(text));
  // Rough crawlable-text check: strip tags/scripts, see if there's real Vietnamese content, not just an empty shell.
  const stripped = text.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
  record("GEO", "Trang chủ có đủ nội dung text (không chỉ ảnh)", stripped.length > 1200, `${stripped.length} ký tự sau khi strip tag`);
}

// --- Functional: images actually load (the bug class found this session) ---
{
  const { text } = await fetchText("/mascot-dan");
  const imgSrcs = [...text.matchAll(/<img[^>]+src="([^"]+)"/g)]
    .map((m) => m[1].replace(/&amp;/g, "&"))
    .filter((s) => s.startsWith("/"));
  let allOk = imgSrcs.length > 0;
  for (const src of imgSrcs.slice(0, 8)) {
    const r = await fetch(BASE + src);
    if (!r.ok) allOk = false;
  }
  record("Functional", "/mascot-dan: ảnh trong HTML load được (200)", allOk, `${imgSrcs.length} ảnh kiểm tra`);
}

// --- Report ---
const byCategory = {};
for (const r of results) {
  byCategory[r.category] ??= [];
  byCategory[r.category].push(r);
}

let totalPass = 0;
for (const [cat, items] of Object.entries(byCategory)) {
  console.log(`\n=== ${cat} ===`);
  for (const r of items) {
    console.log(`${r.pass ? "✅" : "❌"} ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
    if (r.pass) totalPass++;
  }
}

const pct = ((totalPass / results.length) * 100).toFixed(1);
console.log(`\n=== TỔNG: ${totalPass}/${results.length} pass (${pct}%) ===`);
if (Number(pct) < 90) console.log("⚠️  Dưới ngưỡng 90% — cần sửa tiếp trước khi báo cáo client.");
