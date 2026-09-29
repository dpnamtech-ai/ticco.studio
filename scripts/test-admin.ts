// Admin rules that guard the shop's data — run: npx tsx scripts/test-admin.ts   (exit 1 on any failure)
// Covers: who counts as admin, the "Biến thể" line parser (prices / photos / links an admin types in),
// and the description sanitizer (what reaches customers' screens). ids ADM-xx match qa/MASTER-TEST-PLAN.md.
import assert from "node:assert/strict";
import type { User } from "@supabase/supabase-js";
import { isAdmin } from "../src/lib/supabase/admin-check";
import { formatVariantLines, parseVariantLines } from "../src/lib/variants";
import { sanitizeDescription } from "../src/lib/sanitize";

let pass = 0, fail = 0;
function t(id: string, name: string, fn: () => void) {
  try { fn(); pass++; console.log(`PASS ${id} ${name}`); } catch (e) { fail++; console.log(`FAIL ${id} ${name}\n     ${(e as Error).message.split("\n")[0]}`); }
}
const user = (o: Partial<User>) => ({ id: "u", aud: "authenticated", created_at: "", app_metadata: {}, user_metadata: {}, ...o }) as User;

// ---- who is admin ----
t("ADM-01", "Chưa đăng nhập không phải admin", () => assert.equal(isAdmin(null), false));
t("ADM-02", "Đăng nhập thường (ai cũng tự đăng ký được) không phải admin", () => assert.equal(isAdmin(user({})), false));
t("ADM-03", "Tự ghi role=admin vào user_metadata (người dùng sửa được) KHÔNG thành admin", () =>
  assert.equal(isAdmin(user({ user_metadata: { role: "admin" } })), false));
t("ADM-04", "Chỉ app_metadata.role=admin (chỉ service key/SQL ghi được) là admin", () =>
  assert.equal(isAdmin(user({ app_metadata: { role: "admin" } })), true));

// ---- "Biến thể" lines ----
const ctx = { imageCount: 7, productIds: new Set(["so-trong", "so-nhat-ky"]), selfId: "bst-postcard" };
const ok = (text: string) => { const r = parseVariantLines(text, ctx); if (!r.ok) throw new Error(r.error); return r; };
const bad = (text: string, re: RegExp) => { const r = parseVariantLines(text, ctx); assert.equal(r.ok, false, `phải bị từ chối: ${text}`); assert.match((r as { error: string }).error, re); };

t("ADM-10", "Dòng đơn giản = chỉ tên, không có cấu hình", () => { const r = ok("Size M\nSize L"); assert.deepEqual(r.variants, ["Size M", "Size L"]); assert.equal(r.options, null); });
t("ADM-11", "Giá + ảnh + link đọc đúng", () => {
  const r = ok("BST 5 tấm | 120000 | 1\nLao động | 30.000 | 5\nTím | | 2\nSổ nhật ký | | | so-nhat-ky");
  assert.deepEqual(r.options, { "BST 5 tấm": { price: 120000, image: 1 }, "Lao động": { price: 30000, image: 5 }, "Tím": { image: 2 }, "Sổ nhật ký": { link: "so-nhat-ky" } });
});
t("ADM-12", "Giá âm / chữ / số lẻ / quá lớn bị từ chối", () => { bad("A | -1", /giá/); bad("A | abc", /giá/); bad("A | 1.5e3", /giá/); bad("A | 999999999999", /giá/); });
t("ADM-13", "Ảnh số không tồn tại / 0 / lẻ bị từ chối", () => { bad("A | | 8", /ảnh số 8/); bad("A | | 0", /ảnh/); bad("A | | 1.5", /ảnh/); });
t("ADM-14", "Link tới sản phẩm không có / chuỗi độc (javascript:, ../, URL ngoài) bị từ chối", () => {
  bad("A | | | khong-co", /không có sản phẩm/);
  bad("A | | | javascript:alert(1)", /ID sản phẩm/);
  bad("A | | | ../admin", /ID sản phẩm/);
  bad("A | | | https://evil.com", /ID sản phẩm/);
});
t("ADM-15", "Trùng tên, tên rỗng, tên quá dài, >4 cột, >20 dòng bị từ chối", () => {
  bad("A\nA", /trùng/); bad(" | 1000", /tên/); bad(`${"x".repeat(81)}`, /80/); bad("A|1|1|so-trong|x", /4 cột/);
  bad(Array.from({ length: 21 }, (_, i) => `V${i}`).join("\n"), /Tối đa 20/);
});
t("ADM-16", "Sửa rồi lưu lại không mất cấu hình (format -> parse ra y hệt)", () => {
  const text = "BST 5 tấm | 120000 | 1\nLao động | 30000 | 5\nTím | | 2\nSổ nhật ký | | | so-nhat-ky\nSize M";
  const a = ok(text); const b = ok(formatVariantLines(a.variants, a.options));
  assert.deepEqual(b, a);
});

// ---- description sanitizer ----
const clean = sanitizeDescription;
t("ADM-20", "Giữ định dạng editor (đậm, danh sách, link, ảnh, bảng)", () => {
  const html = '<p><strong>Đậm</strong> <em>nghiêng</em> <a href="https://ticco.vn">link</a></p><ul><li>a</li></ul><img src="https://x.supabase.co/a.webp" alt="a"><table><tbody><tr><td>1</td></tr></tbody></table>';
  const out = clean(html);
  for (const k of ["<strong>", "<em>", 'href="https://ticco.vn"', "<li>a</li>", 'src="https://x.supabase.co/a.webp"', "<td>1</td>"]) assert.ok(out.includes(k), `mất ${k}: ${out}`);
});
t("ADM-21", "Xoá <script>, onerror/onclick, <style>, <form>", () => {
  const out = clean('<p onclick="x()">a</p><script>alert(1)</script><img src="https://a.co/i.png" onerror="alert(1)"><style>*{}</style><form action="//evil"><input></form>');
  assert.ok(!/script|onerror|onclick|<style|<form|<input/i.test(out), out);
});
t("ADM-22", "Chặn javascript:/data: trong link và ảnh", () => {
  const out = clean('<a href="javascript:alert(1)">x</a><a href="JaVaScRiPt:alert(1)">y</a><img src="data:image/svg+xml;base64,PHN2Zz4=">');
  assert.ok(!/javascript|data:/i.test(out), out);
});
t("ADM-23", "iframe chỉ cho YouTube, chặn iframe khác và <object>/<embed>/<svg>", () => {
  const out = clean('<iframe src="https://www.youtube.com/embed/abc"></iframe><iframe src="https://evil.com"></iframe><object data="x"></object><embed src="x"><svg onload="alert(1)"></svg>');
  assert.ok(out.includes("youtube.com/embed/abc") && !/evil|<object|<embed|<svg/i.test(out), out);
});
t("ADM-24", "Link mở tab mới có rel=noopener (chống tabnabbing)", () => {
  assert.match(clean('<a href="https://a.co" target="_blank">x</a>'), /rel="noopener noreferrer"/);
});

console.log(`\n${pass}/${pass + fail} pass`);
process.exit(fail ? 1 : 0);
