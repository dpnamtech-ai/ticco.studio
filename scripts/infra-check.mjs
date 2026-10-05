// Infrastructure check of the live site (read-only: never creates an order).
//   node scripts/infra-check.mjs [https://ticcostudios.com] -> qa/infra-check.md, exit 1 on any FAIL
// TLS + redirects, security headers, routing (language prefix, 404s, admin closed), SEO files, icons + link preview
// tags, API guards, search, response time.
import { connect } from "node:tls";
import { writeFileSync } from "node:fs";

const BASE = (process.argv[2] || "https://ticcostudios.com").replace(/\/$/, "");
const host = new URL(BASE).host;
const rows = [];
const check = async (name, fn) => {
  try {
    const r = await fn();
    rows.push([r === true || r?.ok ? "PASS" : r?.warn ? "WARN" : "FAIL", name, r === true ? "" : (r?.detail ?? String(r))]);
  } catch (e) {
    rows.push(["FAIL", name, e.message.slice(0, 120)]);
  }
};
const get = (p, init = {}) => fetch(p.startsWith("http") ? p : BASE + p, { redirect: "manual", ...init });

await check("TLS certificate valid > 21 days", () => new Promise((res, rej) => {
  const s = connect({ host, port: 443, servername: host }, () => {
    const days = Math.round((new Date(s.getPeerCertificate().valid_to) - Date.now()) / 864e5);
    s.end();
    res({ ok: s.authorized && days > 21, detail: `${days} days left, authorized=${s.authorized}` });
  });
  s.on("error", rej);
}));
await check("http -> https", async () => { const r = await get(`http://${host}/`); return { ok: [301, 307, 308].includes(r.status) && r.headers.get("location")?.startsWith("https://"), detail: `${r.status} ${r.headers.get("location")}` }; });
await check("www serves the site", async () => { const r = await get(`https://www.${host}/`); return { ok: [200, 301, 307, 308].includes(r.status), detail: `${r.status} ${r.headers.get("location") ?? ""}` }; });
await check("home 200 + fast (< 1.5 s)", async () => { const t = Date.now(); const r = await get("/"); const ms = Date.now() - t; return { ok: r.status === 200 && ms < 1500, warn: r.status === 200, detail: `${r.status} in ${ms} ms` }; });

const home = await (await get("/")).text();
const headers = (await get("/")).headers;
for (const [h, re] of [["strict-transport-security", /max-age=\d{7,}/], ["x-content-type-options", /nosniff/], ["referrer-policy", /./]])
  await check(`header ${h}`, () => ({ ok: re.test(headers.get(h) ?? ""), detail: headers.get(h) ?? "missing" }));
await check("can't be framed (X-Frame-Options or CSP frame-ancestors)", () => ({ ok: /deny|sameorigin/i.test(headers.get("x-frame-options") ?? "") || /frame-ancestors/.test(headers.get("content-security-policy") ?? ""), detail: headers.get("x-frame-options") ?? "" }));

await check("/vi/... redirects to the unprefixed page", async () => { const r = await get("/vi/san-pham"); return { ok: r.status === 308 && new URL(r.headers.get("location"), BASE).pathname === "/san-pham", detail: `${r.status} ${r.headers.get("location")}` }; });
await check("/en pages served", async () => ({ ok: (await get("/en/san-pham")).status === 200, detail: "" }));
await check("unknown page -> 404", async () => { const r = await get("/khong-co-trang-nay"); return { ok: r.status === 404, detail: String(r.status) }; });
await check("unknown product -> 404", async () => { const r = await get("/san-pham/khong-co"); return { ok: r.status === 404, detail: String(r.status) }; });
await check("/admin closed (404 or login redirect, never 200/500)", async () => { const r = await get("/admin"); return { ok: r.status === 404 || (r.status >= 300 && r.status < 400 && /login/.test(r.headers.get("location") ?? "")), detail: String(r.status) }; });

await check("sitemap.xml lists both languages", async () => { const t = await (await get("/sitemap.xml")).text(); const n = (t.match(/<loc>/g) ?? []).length; return { ok: n > 50 && t.includes("/en/") && t.includes('hreflang="vi"'), detail: `${n} urls` }; });
await check("robots.txt points at the sitemap", async () => { const t = await (await get("/robots.txt")).text(); return { ok: t.includes(`${BASE}/sitemap.xml`) && !/Disallow: \/\s*$/m.test(t), detail: "" }; });
await check("llms.txt", async () => ({ ok: (await get("/llms.txt")).status === 200, detail: "" }));
for (const p of ["/favicon.ico", "/favicon-48.png", "/icon-512.png", "/apple-touch-icon.png", "/images/qr-thanh-toan.jpg"])
  await check(`asset ${p}`, async () => { const r = await get(p); return { ok: r.status === 200 && /image/.test(r.headers.get("content-type") ?? ""), detail: `${r.status} ${r.headers.get("content-type")}` }; });

const meta = (prop) => home.match(new RegExp(`<meta (?:property|name)="${prop}" content="([^"]*)"`))?.[1];
await check("home <title> is 'Tíc Cơ Studios' (client)", () => ({ ok: /<title>Tíc Cơ Studios<\/title>/.test(home), detail: home.match(/<title>[^<]*<\/title>/)?.[0] }));
await check("link preview: og:title / og:description / og:image", async () => {
  const img = meta("og:image");
  const ok = meta("og:title") && meta("og:description")?.startsWith("Thương hiệu Việt") && img && (await get(img)).status === 200;
  return { ok, detail: `${meta("og:title")} | ${meta("og:description")?.slice(0, 40)}… | ${img}` };
});
await check("canonical + hreflang on home", () => ({ ok: /rel="canonical" href="https:\/\/[^"]+"/.test(home) && /hrefLang="en"/i.test(home), detail: "" }));

await check("GET /api/orders refused (405)", async () => ({ ok: (await get("/api/orders")).status === 405, detail: "" }));
await check("POST /api/orders validates (empty order -> 422, nothing written)", async () => {
  const r = await get("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  return { ok: r.status === 422, detail: String(r.status) };
});
await check("search API answers", async () => { const r = await get("/api/search?q=dan"); const j = await r.json(); return { ok: r.status === 200 && j.products?.length > 0, detail: `${j.products?.length} products` }; });

const fails = rows.filter((r) => r[0] === "FAIL").length;
writeFileSync(
  "qa/infra-check.md",
  `# Infra check — ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC\n\nTarget: ${BASE} · **${rows.length - fails}/${rows.length} pass**\n\n| | check | detail |\n|---|---|---|\n` +
    rows.map((r) => `| ${r[0]} | ${r[1]} | ${String(r[2]).replace(/\|/g, "/")} |`).join("\n") + "\n",
);
for (const r of rows) if (r[0] !== "PASS") console.log(r.join("  "));
console.log(`${rows.length - fails}/${rows.length} pass -> qa/infra-check.md`);
process.exitCode = fails ? 1 : 0;
