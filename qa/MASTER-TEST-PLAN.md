# Master test plan — ticco.studio

Chạy **trước mỗi lần deploy** (local) và **sau mỗi lần deploy** (prod). Bug mới → ghi `qa/BUGS.md` + thêm
1 test cùng mã vào `scripts/regression.mjs` (test phải FAIL trên bản lỗi, PASS sau khi sửa).

## Cách chạy — 4 lớp, mỗi lớp nhìn từ một góc khác (cập nhật 05/10)

| Lớp | Lệnh | Bắt được gì | Khi nào |
|---|---|---|---|
| 1. Chức năng | `node scripts/regression.mjs` (local, Sheet GIẢ) · `node scripts/regression.mjs https://ticcostudios.com` (prod, chỉ đọc) | đặt hàng/COD, giá, giỏ, bảo mật, spam, các bug cũ | trước + sau mỗi deploy |
| 2. Giao diện vs Figma | `node scripts/ui-audit.mjs [url]` → `qa/ui-audit.md` | mọi trang × 360/390/430/1280/1920: kéo ngang, chữ ra ngoài màn, ảnh hỏng; chữ Figma **xuống dòng nhiều hơn thiết kế**, dòng dài hơn khung, **chồng nhau** chỗ Figma không chồng (mỗi chữ Figma mang `data-fig` = khung thiết kế) | trước + sau mỗi deploy |
| 3. Khách mới vào | `node scripts/site-crawl.mjs <thư-mục-ảnh> [url]` | trình duyệt sạch, iPhone + PC: đi hết mọi link, lỗi JS/console, 404, file hỏng; hành trình mua (menu → danh mục → SP → chọn mẫu → giỏ → số lượng → checkout trống → tìm kiếm → EN → chính sách) | sau mỗi deploy |
| 4. Hạ tầng | `node scripts/infra-check.mjs` → `qa/infra-check.md` | SSL còn hạn, http→https, www, header bảo mật, /vi→/, 404, admin đóng, sitemap 2 ngôn ngữ, robots, llms, icon, OG/link preview, canonical/hreflang, API chặn sai, tìm kiếm, tốc độ | sau mỗi deploy + định kỳ |
| + EN | `node scripts/i18n-check.mjs [url]` | bản tiếng Anh không còn chữ Việt | khi đổi nội dung |
| + Đơn thật | đặt 1 đơn CK + 1 COD trên prod, tên "TEST … - xoá" | Apps Script/Sheet thật (local chỉ có Sheet giả) | khi đổi checkout/Sheet |

Quy trình bug: lỗi tìm được → `qa/BUGS.md` (mã BUG-xxx, nguyên nhân, cách sửa, test bắt nó) → sửa → chạy lại cả 4 lớp →
deploy → chạy lớp 1-4 trên prod. Ảnh soát bằng mắt vẫn bắt buộc cho phần tử mới (lớp 2 đo hình học, không đo màu/ảnh đúng-sai).

```bash
NEXT_PUBLIC_SUPABASE_URL= npx next build && npx next start -p 3200   # bản local để chạy lớp 2 trước deploy
node scripts/ui-audit.mjs http://localhost:3200
```

## Phạm vi & ca kiểm thử

Cột **Tự động**: P = chạy cả local và prod · L = chỉ local · Tay = kiểm tay.

### 1. Hạ tầng / smoke
| ID | Ca kiểm thử | Tự động |
|---|---|---|
| SMK-01 | Mọi URL trong sitemap + /tim-kiem, /gio-hang, /checkout, /robots.txt trả 200 | P |
| SMK-02 | Sản phẩm không tồn tại → 404 | P |
| SEC-10 | /admin chưa đăng nhập → /admin/login, hoặc 404 khi chưa bật Supabase; không bao giờ 200/500 | P |
| SEC-11 | Security headers (X-Frame-Options, nosniff, Referrer-Policy, HSTS) | P |
| CON-01 | Không có lỗi JS trong console trên các trang đã mở | P |

### 2. Đọc thông tin, ảnh, layout
| ID | Ca kiểm thử | Tự động |
|---|---|---|
| IMG-01 | 8 trang chính: mọi ảnh đang hiển thị load được, không tràn ngang (1280) | P |
| IMG-02 | Ảnh web đúng chiều như ảnh gốc (cờ xoay EXIF) | L (cần `design/demo-images`) |
| MOB-01 | 8 trang chính không tràn ngang ở 390px | P |
| UI-01 | Navbar Figma 29/09: logo trái x35 rộng 83, 4 mục cách 46 | P |
| UI-02 | Mục menu trang hiện tại in đậm | P |
| UI-06 | Trang chủ: "Những thứ chúng tôi có!" | P |
| UI-07 | 3 card dự án trang chủ link đúng trang dự án | P |
| MAS-01 | Mascot: Đần nâng tạ đúng chiều Figma | P |
| MAS-02 | Mascot mobile: chú thích hero trong thiết kế ≥12px; 3 hàng Đần + chữ không chồng nhau | P |

### 3. Điều hướng
| ID | Ca kiểm thử | Tự động |
|---|---|---|
| UI-03 | Tab danh mục đang chọn (kể cả "Tất cả") tím + đậm | P |
| UI-04 | Phân trang: trang hiện tại khác màu | P |
| MOB-02 | Menu mobile mở được, đủ 4 mục, có nút tìm kiếm | P |
| MOB-03 | Menu đang mở + bấm kính lúp → menu đóng, thấy ô tìm kiếm | P |
| MOB-04 | Menu mobile: mục con thu gọn mặc định; mở "Sản phẩm" có 6 danh mục; bấm "In ấn" → đúng tab | P |
| MOB-05 | Thanh mobile có icon giỏ + số; menu không có nút giỏ to | P |

### 4. Chi tiết sản phẩm
| ID | Ca kiểm thử | Tự động |
|---|---|---|
| PD-01 | Postcard / Bandana / Lót cốc: chọn lựa chọn → đổi ảnh chính đúng | P |
| PD-02 | Lựa chọn dạng link (Sổ, Đần Sinh Tồn, Mũ) → sang trang sản phẩm anh em | P |
| PD-03 | Hết hàng: SOLD OUT, không có nút thêm giỏ | P |
| PD-04 | Mobile: chọn lựa chọn → tự cuộn thấy ảnh; URL `?chon=`; mở `?chon=Tím` ra đúng ảnh | P |
| PD-05 | BST Đầu Đội Mũ: 2 nút mũ dẫn sang trang từng mũ | P |

### 5. Tìm kiếm
| ID | Ca kiểm thử | Tự động |
|---|---|---|
| SRC-01 | "dan" ra cả Sản phẩm và Khám phá, có nhãn | P |
| SRC-02 | Gõ không dấu tìm được như có dấu | P |
| SRC-03 | Không có kết quả → thông báo + link | P |
| SRC-04 | Kính lúp navbar → trang tìm kiếm, con trỏ ở ô nhập | P |
| SRC-05 | "áo" chỉ ra áo | P |
| SRC-06 | "túi" chỉ ra túi | P |
| SRC-07 | Trang tìm kiếm không trống: danh mục + gợi ý ngẫu nhiên | P |
| SEC-01 | XSS qua ô tìm kiếm không chạy | P |

### 6. Giỏ hàng, huỷ giữa chừng
| ID | Ca kiểm thử | Tự động |
|---|---|---|
| CART-01 | 2 lựa chọn = 2 dòng, giá đúng từng lựa chọn (tấm lẻ 30k, bộ 120k) | P |
| CART-02 | Tăng số lượng, giữ sau tải lại, xoá dòng | P |
| CART-03 | Giỏ trên điện thoại: có ảnh, tên ≤2 dòng, không tràn | P |
| CANCEL-01 | Rời checkout giữa chừng → giỏ còn nguyên | P |
| CANCEL-02 | Giỏ trống → checkout báo trống, không có form | P |
| CANCEL-03 | Sheet lỗi → khách thấy lỗi, giỏ giữ nguyên để thử lại | L |

### 7. Đặt hàng & thanh toán
| ID | Ca kiểm thử | Tự động |
|---|---|---|
| CO-ADDR | Chọn tỉnh/phường có tìm nhanh (không dấu), không còn ô Quận/Huyện | P |
| VAL-01..10 | Server từ chối: SĐT sai, thiếu địa chỉ, giỏ rỗng, SP không tồn tại, SL 0/21/1.5, >30 dòng, hàng hết, email sai | P |
| VAL-11 | Form hiện lỗi SĐT ngay dưới ô | P |
| ORD-01 | Đặt hàng: màn tổng quan + mã đơn + tổng đúng; Sheet nhận đúng giá dù giỏ bị sửa giá | L |
| ORD-02 | Tải lại sau khi đặt vẫn thấy thông tin chuyển khoản | L |
| ORD-03 | Đặt xong, mua tiếp → form đơn mới (không kẹt đơn cũ) | L |
| ORD-04 | Miễn phí ship từ 500k | L |

### 8. Bảo mật / tấn công
| ID | Ca kiểm thử | Tự động |
|---|---|---|
| SEC-02 | JSON hỏng → 400 | P |
| SEC-03 | Honeypot (bot) → 400 | P |
| SEC-04 | GET /api/orders → 405 | P |
| SEC-05 | Giá giả từ client bị bỏ qua | L |
| SEC-06 | Chèn công thức vào Sheet bị vô hiệu | L |
| SEC-07 | XSS trong tên/ghi chú không chạy | L |
| SEC-09 | Chống spam: đơn thứ 7/phút/IP → 429 | L |
| — | Sheet sai SECRET → từ chối (đã test với Sheet thật 30/09) | Tay |
| — | Sheet chia sẻ "Bị hạn chế" (chứa SĐT, địa chỉ khách) | Tay |

### 9. Admin (nguy hiểm nhất nếu sai/bị hack)
| ID | Ca kiểm thử | Tự động |
|---|---|---|
| ADM-01..04 | Chỉ `app_metadata.role=admin` là admin; chưa đăng nhập / user thường / tự ghi `user_metadata.role` đều KHÔNG | test-admin |
| ADM-10..16 | Dòng "Biến thể" `tên \| giá \| ảnh số \| link`: đọc đúng; từ chối giá âm/chữ/`1.5e3`/quá lớn, ảnh số không tồn tại, link giả/độc (`javascript:`, `../`, URL ngoài), trùng tên, >20 dòng; sửa-lưu không mất cấu hình | test-admin |
| ADM-20..24 | Lọc HTML mô tả: giữ định dạng editor; xoá script/on*/style/form, javascript:/data:, iframe ngoài YouTube, object/embed/svg; link có noopener | test-admin |
| ADM-30 | Gọi thẳng 6 server action admin khi chưa đăng nhập (qua /admin/* và /) → bị chặn | L |
| SEC-10 | /admin chưa đăng nhập → /admin/login hoặc 404 | P |
| — | Khi đã bật Supabase: `node --env-file=.env.local scripts/rls-check.mjs` (anon key không ghi được products, không đọc được orders) | Tay (cần DB) |
| — | Khi đã bật Supabase: đăng nhập admin, tạo SP thử với biến thể có giá/ảnh/link → xem trang SP, thêm giỏ đúng giá → xoá SP | Tay (cần DB) |

### V. Soát bằng mắt — bắt buộc mỗi lần deploy (390px + 1280px, cạnh Figma DEMO)
| Trang | Chú ý đặc biệt |
|---|---|
| `/` | hero, dải tím danh mục, 12 card, 3 card dự án |
| `/san-pham`, `?danh-muc=in-an&trang=2` | tab, lưới card, phân trang |
| `/san-pham/bst-postcard-triet-ly-song-dan`, `khan-bandana-van-su-tuy-minh`, `so-trong` | ảnh chính + ảnh nhỏ, nút lựa chọn |
| `/kham-pha` + 6 trang dự án | ảnh (đúng chiều), chữ không đè ảnh |
| `/ve-tic-co` | bố cục chữ + ảnh |
| `/mascot-dan` | hero + chú thích, 3 Đần + dải tím (hướng Đần!), dải marching |
| `/gio-hang`, `/checkout`, màn đặt thành công | bố cục mobile, ô chọn địa chỉ, QR/STK |
| `/tim-kiem` (trống, "áo", "zzz") | gợi ý, nhãn |
| Menu mobile | thu gọn/mở, icon giỏ |

## Việc tiếp theo cho QA
- Xuất ảnh render mới của 59 frame DEMO (ảnh trong `design/figma-assets` là bản 18/09, chỉ kham-pha & mascot còn khớp)
  → viết so sánh ảnh tự động từng vùng để mục V bớt phụ thuộc mắt người.
- Sau khi có env Vercel: đặt 1 đơn thật trên prod (điện thoại) → kiểm tra dòng trong Sheet thật, rồi xoá.
