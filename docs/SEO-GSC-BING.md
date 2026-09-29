# SEO/GEO — việc cần làm khi có tên miền thật

Đã có sẵn trong code: title/description/canonical từng trang, JSON-LD (Organization, WebSite+SearchAction, Product+Offer,
BreadcrumbList), `robots.txt` (mở cho Google/Bing và bot AI: GPTBot, ClaudeBot, PerplexityBot, Google-Extended…),
`sitemap.xml` (sản phẩm, danh mục, dự án, chính sách), `llms.txt` (tóm tắt thương hiệu + toàn bộ sản phẩm có giá).
Chấm điểm: `node scripts/seo-audit.mjs https://<domain>` → `qa/seo-report.md`.

## 1. Đổi tên miền (1 biến, mọi thứ tự theo)
Vercel → Settings → Environment Variables (Production): `NEXT_PUBLIC_SITE_URL` = `https://<tên-miền>` → Redeploy.
(Canonical, sitemap, robots, JSON-LD, llms.txt đều đọc biến này.)

## 2. Google Search Console
1. https://search.google.com/search-console → Thêm tài sản → **Tiền tố URL** `https://<tên-miền>`.
2. Chọn xác minh **Thẻ HTML** → copy phần `content="…"` (chỉ chuỗi mã).
3. Vercel env `GOOGLE_SITE_VERIFICATION` = chuỗi đó → Redeploy → bấm **Xác minh**.
4. Sơ đồ trang web → gửi `sitemap.xml`.
5. Kiểm tra URL → dán 3–5 trang chính (trang chủ, /san-pham, 1 sản phẩm) → **Yêu cầu lập chỉ mục**.

## 3. Bing Webmaster Tools
1. https://www.bing.com/webmasters → có thể **Nhập từ Google Search Console** (nhanh nhất, sau bước 2).
2. Hoặc thêm site thủ công → xác minh **Thẻ meta** → Vercel env `BING_SITE_VERIFICATION` = mã trong `content="…"` → Redeploy.
3. Sitemaps → gửi `https://<tên-miền>/sitemap.xml`.
   (Bing cũng cấp dữ liệu cho ChatGPT Search / Copilot → quan trọng cho GEO.)

## 4. Sau 3–7 ngày
- GSC → Trang: xem trang nào "Đã lập chỉ mục"; Kết quả nhiều định dạng → Sản phẩm/Breadcrumb hợp lệ.
- Chạy lại `scripts/seo-audit.mjs` với tên miền thật (site checks phải 8/8).
