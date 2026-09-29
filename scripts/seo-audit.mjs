// SEO + GEO audit (Geoptie-style score per page) — run after deploy, or against local:
//   node scripts/seo-audit.mjs [baseUrl]        -> qa/seo-report.md
// SEO (60 pts): title, description, canonical, h1, indexable, og tags, image alts, text depth, internal links, speed.
// GEO (40 pts): structured data (JSON-LD types), entity facts (brand/price/availability), llms.txt + robots
// letting AI crawlers in, readable text an AI can quote. Site-level checks are listed separately.
import { writeFileSync } from "node:fs";

const BASE = (process.argv[2] || "http://localhost:3100").replace(/\/$/, "");
const PAGES = [
  "/", "/san-pham", "/san-pham?danh-muc=van-phong-pham", "/san-pham/bst-postcard-triet-ly-song-dan", "/san-pham/khan-bandana-van-su-tuy-minh",
  "/san-pham/bst-dan-sinh-ton", "/ve-tic-co", "/mascot-dan", "/kham-pha", "/kham-pha/nguoi-viet-van-dong", "/chinh-sach/doi-tra",
];
const AI_BOTS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];

const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/g, " ").replace(/\s+/g, " ").trim();
const meta = (html, re) => (html.match(re) || [])[1];

// ---- site level ----
const site = [];
const get = async (p) => { const r = await fetch(BASE + p); return { status: r.status, body: await r.text(), type: r.headers.get("content-type") || "" }; };
const robots = await get("/robots.txt");
const sitemap = await get("/sitemap.xml");
const llms = await get("/llms.txt");
const sitemapUrls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
site.push(["robots.txt", robots.status === 200 && /Sitemap:/i.test(robots.body)]);
site.push(["robots.txt cho phép bot AI (" + AI_BOTS.join(", ") + ")", AI_BOTS.every((b) => robots.body.includes(b)) && !/Disallow:\s*\/\s*$/m.test(robots.body)]);
site.push([`sitemap.xml (${sitemapUrls.length} URL)`, sitemap.status === 200 && sitemapUrls.length > 40]);
site.push(["sitemap dùng cùng tên miền với web", sitemapUrls.length > 0 && sitemapUrls.every((u) => u.startsWith(new URL(sitemapUrls[0]).origin))]);
site.push([`llms.txt (${llms.body.length} ký tự)`, llms.status === 200 && llms.body.startsWith("# ") && llms.body.includes("/san-pham/")]);
site.push(["Admin/giỏ/checkout bị chặn index", /Disallow: \/admin/.test(robots.body) && /Disallow: \/checkout/.test(robots.body)]);
const home = await get("/");
site.push(["Xác minh Google Search Console (meta)", /name="google-site-verification"/.test(home.body)]);
site.push(["Xác minh Bing Webmaster (meta)", /name="msvalidate.01"/.test(home.body)]);

// ---- per page ----
const rows = [];
for (const path of PAGES) {
  const t0 = Date.now();
  const r = await get(path);
  const ms = Date.now() - t0;
  const h = r.body;
  const title = meta(h, /<title>([^<]*)<\/title>/) ?? "";
  const desc = meta(h, /<meta name="description" content="([^"]*)"/) ?? "";
  const canonical = meta(h, /<link rel="canonical" href="([^"]*)"/);
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(h);
  const og = ["og:title", "og:description", "og:image"].filter((k) => h.includes(`property="${k}"`)).length;
  const imgs = [...h.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  // alt="" marks a decorative image (correct); a missing alt attribute is the error
  const alts = imgs.filter((i) => /\salt="/.test(i)).length;
  const words = text(h).split(" ").length;
  const links = new Set([...h.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1])).size;
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join(" ");
  const types = [...new Set([...ld.matchAll(/"@type":\s*(?:"([^"]+)"|\[([^\]]+)\])/g)].flatMap((m) => (m[1] ? [m[1]] : m[2].replace(/"/g, "").split(","))))];
  const isProduct = path.startsWith("/san-pham/");

  const checks = [
    // SEO — 60
    ["Title 20–70 ký tự", 8, title.length >= 20 && title.length <= 70, `${title.length}`],
    ["Description 70–160 ký tự", 8, desc.length >= 70 && desc.length <= 160, `${desc.length}`],
    ["Canonical đúng trang", 6, !!canonical && canonical.replace(BASE, "").length > 0, canonical ? canonical.replace(/^https?:\/\/[^/]+/, "") : "thiếu"],
    ["Đúng 1 thẻ H1", 6, h1 === 1, `${h1}`],
    ["Được phép index", 6, !noindex && r.status === 200, noindex ? "noindex" : `${r.status}`],
    ["Open Graph (title/desc/image)", 5, og === 3, `${og}/3`],
    ["Ảnh có thuộc tính alt", 6, !imgs.length || alts / imgs.length >= 0.9, `${alts}/${imgs.length}`],
    ["Đủ chữ (>= 150 từ)", 5, words >= 150, `${words} từ`],
    ["Link nội bộ >= 10", 4, links >= 10, `${links}`],
    ["HTML trả về < 1.5s", 6, ms < 1500, `${ms}ms`],
    // GEO — 40
    ["JSON-LD Organization/WebSite (thực thể thương hiệu)", 10, types.includes("Organization") && types.includes("WebSite"), types.join(",") || "không có"],
    [isProduct ? "JSON-LD Product + Offer (giá, tình trạng)" : "Nội dung có thực thể rõ (tên thương hiệu trong text)", 12, isProduct ? types.includes("Product") && /"price":\s*\d/.test(ld) && /availability/.test(ld) : /Tíc Cơ/.test(text(h)), isProduct ? (types.includes("Product") ? "có" : "thiếu") : "—"],
    [isProduct ? "BreadcrumbList" : "Description nêu rõ chủ đề trang", 8, isProduct ? types.includes("BreadcrumbList") : desc.length >= 70, ""],
    ["Có trong sitemap", 5, sitemapUrls.some((u) => u.replace(/^https?:\/\/[^/]+/, "").replace(/&amp;/g, "&") === path), ""],
    ["Có trong llms.txt", 5, path === "/" || llms.body.includes(path.split("?")[0]), ""],
  ];
  const score = checks.reduce((s, c) => s + (c[2] ? c[1] : 0), 0);
  rows.push({ path, score, title, checks });
}

// ---- report ----
const avg = Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length);
const siteOk = site.filter((s) => s[1]).length;
const md = [
  `# SEO / GEO report — ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`,
  "",
  `Target: ${BASE} · **Điểm trung bình: ${avg}/100** · Site checks: ${siteOk}/${site.length}`,
  "",
  "## Site",
  ...site.map(([n, ok]) => `- ${ok ? "✅" : "❌"} ${n}`),
  "",
  "## Trang",
  "| Điểm | Trang | Title |",
  "|---|---|---|",
  ...rows.map((r) => `| **${r.score}** | ${r.path} | ${r.title.replace(/\|/g, "/")} |`),
  "",
  "## Chi tiết lỗi (chỉ mục chưa đạt)",
  ...rows.flatMap((r) => {
    const miss = r.checks.filter((c) => !c[2]);
    return miss.length ? [`### ${r.path} — ${r.score}/100`, ...miss.map((c) => `- ❌ ${c[0]} (-${c[1]}) ${c[3] ? `· ${c[3]}` : ""}`), ""] : [];
  }),
].join("\n");
writeFileSync("qa/seo-report.md", md + "\n");
console.log(md.split("## Chi tiết")[0]);
