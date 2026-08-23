# Bộ Test Case — ticco.studio

Quy trình QA lặp lại sau mỗi lần fix. Mục tiêu: **≥ 90% pass** trước khi báo cáo client.

## Cách chạy

```bash
# Phần tự động (Functional / SEO / GEO) — chạy được ngay, không cần người
node scripts/qa-check.mjs                              # check local dev (localhost:3100)
node scripts/qa-check.mjs https://ticcostudio.vercel.app  # check production

# Phần Figma-match (bảng dưới) — cần soát bằng tay + Figma JSON:
node scripts/figma-fetch.mjs                            # cập nhật cache mới nhất từ Figma
node scripts/figma-summarize.mjs "<tên-frame>"           # in toạ độ/màu/text 1 frame để đối chiếu
```

Mỗi lần fix xong: chạy lại `qa-check.mjs`, cập nhật % ở đầu file này, cập nhật cột Status trong
bảng Figma-match cho những mục vừa sửa.

---

## 1. Functional / Regression (tự động — scripts/qa-check.mjs)

| # | Test case | Cách check |
|---|-----------|-----------|
| F1 | Mọi route trả 200 | curl từng route |
| F2 | Ảnh trong HTML thực sự load được (không phải chỉ có src, phải fetch 200) | Bug lớp này đã gặp thật 2 lần trong session (mascot-dan ảnh biến mất trên production, kham-pha 8 card dùng nhầm 1 ảnh) — check bằng cách fetch từng `src` |
| F3 | `tsc --noEmit` sạch | Chạy trước mỗi commit |
| F4 | `npm run build` sạch (production build, không chỉ dev) | Bug ảnh ở trên **không** hiện ra ở dev, chỉ hiện ở production — luôn build thật trước khi kết luận "đã fix" |
| F5 | Không có `console.error` khi load trang | Kiểm tra thủ công qua browser console khi cần |
| F6 | Giỏ hàng: thêm/sửa số lượng/xoá hoạt động, giữ qua localStorage | Test tay qua browser |
| F7 | Không tràn ngang trang (`scrollWidth <= clientWidth`) | Kiểm tra thủ công cho trang có composition absolute-position (mascot-dan) |

## 2. SEO (tự động — scripts/qa-check.mjs)

| # | Test case |
|---|-----------|
| S1 | Mỗi route có `<title>` không rỗng, dưới 70 ký tự |
| S2 | Mỗi route có `meta description` không rỗng, dưới 160 ký tự |
| S3 | Mỗi route có `og:title` (Open Graph) |
| S4 | `robots.txt` tồn tại, chặn `/admin` và `/gio-hang` |
| S5 | `sitemap.xml` tồn tại, liệt kê đủ trang + tất cả sản phẩm |

## 3. GEO — Generative Engine Optimization (tự động — scripts/qa-check.mjs)

*(Tối ưu để AI answer engine — ChatGPT/Perplexity/Google AI Overview — đọc và trích dẫn đúng nội dung)*

| # | Test case |
|---|-----------|
| G1 | Trang sản phẩm có JSON-LD `Product` schema (tên, giá, tình trạng còn/hết hàng) |
| G2 | Trang chủ có JSON-LD `Organization` schema (tên brand, logo, social link) |
| G3 | Nội dung text đủ nhiều sau khi strip HTML (không phải trang chỉ toàn ảnh — AI crawler đọc text, không đọc được ảnh) |

## 4. Figma Design Match (thủ công — cần đối chiếu `scripts/figma-summarize.mjs`)

Trạng thái: `✅ Verified` = đã đo toạ độ/màu/text thật và khớp · `⚠️ Approximate` = đúng nội dung/cấu
trúc nhưng chưa đo pixel-exact · `❌ Known gap` = biết rõ đang thiếu/khác Figma, chưa sửa.

| Trang | Section | Status | Ghi chú |
|-------|---------|--------|---------|
| `/` | Hero (headline, ảnh, subtext ngoặc kép) | ✅ Verified | Đo tỷ lệ 43.7/56.3, font-size, text chính xác từ Figma |
| `/` | Featured Products (4 sản phẩm) | ✅ Verified | Đúng 4 item + thứ tự theo Figma |
| `/` | Brand section (mission, 3 pillar, meet-Đần) | ✅ Verified | Absolute-position theo % đo từ Figma; ảnh meet-Đần đã export đúng ảnh gốc |
| `/` | Category grid, Collections, Gift Guide, UGC | ❌ Known gap | Figma **không có thiết kế** cho phần này (frame trống dưới Y2522) — nội dung hiện tại là tự soạn, không có gì để đối chiếu |
| `/san-pham` | Product grid, category tabs | ✅ Verified | Tỷ lệ card, màu, cấu trúc khớp |
| `/san-pham/[slug]` | Chi tiết sản phẩm | ✅ Verified | Tỷ lệ ảnh 4:5 đã sửa đúng theo Figma (550×689 / 269×337) |
| `/kham-pha` | 3 nhóm project card | ✅ Verified | Text thật từ sheet (khác placeholder lặp lại của Figma — cố ý, vì Figma dùng lorem); ảnh chỉ hiện cho project có ảnh thật |
| `/ve-tic-co` | Intro + mission | ✅ Verified | Text đúng 100% |
| `/ve-tic-co` | Statement section (chữ rải "nghệ một cách...") | ⚠️ Approximate | Đúng nội dung, chưa đo vị trí rải chữ pixel-exact như Figma (chữ to 100px rải theo toạ độ riêng từng chữ) |
| `/ve-tic-co` | Bong bóng tím trang trí sau đoạn text | ❌ Known gap | Chưa dựng — Figma có shape tím phía sau các đoạn text intro, code hiện chưa có |
| `/mascot-dan` | 3 hàng mô tả + ribbon | ✅ Verified | Composition absolute-position đo pixel-exact, đã qua 3 vòng sửa mới đúng |
| `/mascot-dan` | Card "cống hiến và sống chiến" (3 card) | ❌ Known gap | Figma chính nó cũng chỉ điền 1/3 ảnh (thiết kế dở dang) — giữ nguyên theo đúng Figma |

---

## Log kết quả theo từng lần chạy

| Ngày | % Tự động (F+S+G) | Figma-match (Verified/tổng) | Ghi chú |
|------|-----|-----|---------|
| 2026-08-23 (lần 1) | 76.5% (26/34) | — | Baseline trước khi vá SEO/GEO |
| 2026-08-23 (lần 2) | **100% (34/34)** | 9 Verified / 4 gap | Thêm robots.txt, sitemap.xml, JSON-LD Product+Organization, rút gọn meta description quá dài |
