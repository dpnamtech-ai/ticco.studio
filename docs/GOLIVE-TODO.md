# Go-live TODO — ticco.studio (cập nhật 30/09 sáng)

Prod: https://ticcostudio.vercel.app · regression local 81/81, prod 70/70 (chạy lại sau deploy), admin 16/16.
Test plan: `qa/MASTER-TEST-PLAN.md` · Bug log: `qa/BUGS.md` · Mẫu footer/chính sách: `docs/footer-phap-ly-mau.md`

## A. Chặn go-live (P0) — cần bạn/khách
| # | Việc | Ai | Ghi chú |
|---|---|---|---|
| A1 | ✅ 30/09 08:25 — `ORDER_SHEET_URL/SECRET` đã đặt trên Vercel, đơn test TCFGJZ30A4 vào Sheet OK. (cũ:) Vercel → Settings → Environment Variables (Production): `ORDER_SHEET_URL`, `ORDER_SHEET_SECRET` | Bạn | Giá trị đã có trong chat 30/09. Chưa có → đặt hàng trên live báo lỗi (không mất đơn) |
| A2 | Vercel env: `NEXT_PUBLIC_BANK_ID`, `NEXT_PUBLIC_BANK_ACCOUNT`, `NEXT_PUBLIC_BANK_ACCOUNT_NAME` | Bạn/khách | Chưa có → màn chuyển khoản không có STK |
| A3 | Sau A1+A2: Redeploy, rồi đặt 1 đơn thật trên điện thoại → thấy dòng trong Sheet → xoá | Bạn + Claude | Hoặc `! npx vercel login` để Claude tự làm A1–A3 |
| A4 | Ảnh QR của shop → `public/images/qr-thanh-toan.png` | Khách | Đang hiện câu thay thế |
| A5 | ✅ Sheet "Bị hạn chế" + đã xoá dòng test (30/09). Sheet đơn hàng: Chia sẻ = "Bị hạn chế"; xoá các dòng test (TCCURLTEST, TC1PK96026, TC1QUXT0HL, TC1RI3K014) | Bạn | Sheet chứa SĐT/địa chỉ khách |
| A6 | ✅ 2FA Vercel + GitHub (30/09); còn Google. Bật 2FA: GitHub `dpnamtech-ai`, Vercel, Google | Bạn | Ai vào được là đổi được STK/QR |

## B. Nên xong trước mở bán (P1)
| # | Việc | Ai |
|---|---|---|
| B1 | Tên miền thật: gửi tên + nơi mua → Claude `vercel domains add`, bạn thêm DNS; sửa `metadataBase`, sitemap | Bạn + Claude |
| B2 | ĐÃ DỰNG (30/09): footer chỉ 1 dòng link (user không muốn phơi tên/MST/địa chỉ); trang `/chinh-sach/thong-tin-nguoi-ban` + 5 chính sách, chỗ `[...]` tô vàng = khách điền trong `src/data/legal.ts`. Khi được Bộ CT duyệt: điền `seller.bctUrl` là logo tự hiện | Khách điền |
| B3 | Thông báo website với Bộ Công Thương (online.gov.vn) sau khi có tên miền | Khách |
| B4 | Khách duyệt giá/mô tả/tồn kho/hết hàng; chốt phí ship (30k, free từ 500k) | Khách |
| B5 | Quản lý sản phẩm: (a) giữ catalog trong code (Claude sửa hộ) hoặc (b) bật Supabase admin → chạy `supabase/schema*.sql` (kể cả **schema-6**), seed lại 40 SP **đủ 6 ảnh phụ + cột variant_options**, tạo tài khoản admin (`app_metadata.role=admin`), set env Supabase trên Vercel, chạy `scripts/rls-check.mjs` | Bạn quyết |

## C. Yêu cầu mới, chưa làm (30/09)
| # | Việc |
|---|---|
| C1 | **Hiệu ứng mobile**: chạm màn hình → vài con Đần rơi xuống (thay con trỏ Đần trên PC). Nhẹ, không chặn thao tác, tắt khi `prefers-reduced-motion` |
| C2 | ĐÃ LÀM 30/09 (736ef25): prod 64 → 99/100 (`scripts/seo-audit.mjs`). Còn: khi có domain làm theo `docs/SEO-GSC-BING.md` (đổi `NEXT_PUBLIC_SITE_URL`, verify GSC + Bing, submit sitemap). Mô tả gốc: **SEO + GEO**: từ khoá/title/description từng trang, JSON-LD (Product, Organization, BreadcrumbList), rà `robots.txt`, **`llms.txt`**, sitemap đủ trang, canonical theo tên miền thật; hướng dẫn **Google Search Console + Bing Webmaster** (verify + submit sitemap — cần tên miền thật); report kiểm tra kiểu Geoptie (điểm SEO/GEO từng trang) |

## D. Bộ test cần cải thiện
1. **So hình với Figma tự động** (lỗ hổng lớn nhất — đã lọt BUG-017/018): cần render mới 59 frame DEMO (ảnh trong `design/figma-assets` là bản 18/09, chỉ kham-pha + mascot còn khớp) → script chụp trang 1280 + so từng vùng (diff pixel) → báo vùng lệch + ảnh cạnh nhau. Hỏi user cách lấy render (user không muốn dùng Figma REST/MCP).
2. **Ảnh chụp mobile mỗi lần chạy**: lưu `qa/visual/<trang>-390.jpg` + `-1280.jpg` để soát bằng mắt nhanh (mục V của test plan).
3. **Admin với DB thật** (khi bật Supabase): đăng nhập admin → tạo/sửa/xoá SP thử → kiểm trang SP + giá giỏ; đưa `rls-check` vào regression với cờ `--db`.
4. **Prod run** đang bỏ qua các case đặt hàng (L): sau A1, thêm 1 case đặt đơn thật đánh dấu "TEST" + tự xoá dòng Sheet (cần hàm xoá trong Apps Script).
5. Hiệu năng: đo tải ảnh chất lượng cao trên 4G (Lighthouse mobile) — khách chấp nhận chậm nhưng cần số đo.
6. Tự chạy regression mỗi lần push (GitHub Actions) thay vì chạy tay.
