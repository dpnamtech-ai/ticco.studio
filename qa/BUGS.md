# Bug log — ticco.studio

Mỗi bug có 1 test tự động mang cùng mã trong `scripts/regression.mjs` (cột **Test**), nên bug đã sửa
không thể quay lại mà không bị bắt. Bug mới: thêm 1 dòng ở đây + 1 test trước khi sửa (test phải FAIL
trên bản lỗi, PASS sau khi sửa).

Mức độ: **P0** mất tiền/mất đơn/lộ dữ liệu · **P1** chặn khách mua hoặc sai nội dung chính · **P2** xấu/khó dùng · **P3** nhỏ.

| Mã | Ngày | Mức | Mô tả | Nguyên nhân gốc | Sửa | Test | Trạng thái |
|---|---|---|---|---|---|---|---|
| BUG-001 | 30/09 | P2 | Số trên giỏ hàng nhỏ, bị cắt mất khi cuộn trang | Icon giỏ 36u cao hơn thanh nav 27u, badge `-top-1` thò ra ngoài mép màn hình khi thanh khuyến mãi cuộn đi | Badge to hơn, đặt trong thanh nav | UI-05 | ✅ 603fd07 |
| BUG-002 | 30/09 | P2 | Phân trang không biết đang ở trang nào | Trang hiện tại cùng màu cam với trang khác | Trang hiện tại màu tím + viền | UI-04 | ✅ 603fd07 |
| BUG-003 | 30/09 | P2 | Tab "Tất cả sản phẩm" không tím/đậm khi đang chọn | Code bỏ qua tab `tat-ca` theo frame Figma cũ | Tab nào đang chọn cũng tím đậm | UI-03 | ✅ 603fd07 |
| BUG-004 | 30/09 | P1 | Bấm card dự án ở trang chủ không đi đâu | Card không có link | Cả card là link tới trang dự án | UI-07 | ✅ 603fd07 |
| BUG-005 | 30/09 | P1 | Postcard/Bandana/Lót cốc: bấm lựa chọn không đổi ảnh | Chưa có map lựa chọn → ảnh | `VARIANT_IMAGES` trong `src/lib/shop.ts` | PD-01 | ✅ 603fd07 |
| BUG-006 | 30/09 | P0 | Đơn không ghi được đâu vẫn báo "Đặt hàng thành công" → mất đơn | API trả 200 kể cả khi DB/Sheet/email đều tắt | Trả 503, khách thấy lỗi, giỏ giữ nguyên | CANCEL-03 | ✅ 603fd07 |
| BUG-007 | 30/09 | P0 | Chèn công thức (`=IMPORTXML(...)`) vào Sheet qua tên/ghi chú → có thể rò dữ liệu khách khác | Chữ bắt đầu bằng `=` `+` `-` `@` bị Sheets hiểu là công thức | Thêm `'` phía trước (server) | SEC-06 | ✅ 6aec1db |
| BUG-008 | 30/09 | P0 | Postcard lẻ bị tính 120.000đ/tấm (giá bộ 5) | Giá luôn lấy `priceFrom`, không theo lựa chọn | `priceFor()` giá theo lựa chọn, cả giỏ và server | CART-01, ORD-01 | ✅ 6aec1db |
| BUG-009 | 30/09 | P1 | Đặt xong 1 đơn, mua tiếp → checkout kẹt ở màn đơn cũ, không đặt được đơn 2 | Màn "đã đặt" lưu sessionStorage, không bao giờ xoá | Chỉ hiện màn đã đặt khi giỏ trống | ORD-03 | ✅ |
| BUG-010 | 30/09 | P2 | `/admin` trả 500 trên prod | Chưa cấu hình Supabase trên Vercel → proxy crash | Chưa có Supabase thì `/admin` = 404 (đóng an toàn) | SEC-10 | ✅ |
| BUG-011 | 30/09 | P1 | Mobile: menu đang mở bấm kính lúp "không có gì xảy ra" | Chuyển trang nhưng lớp menu toàn màn hình không đóng, che trang mới | Đổi trang là đóng menu | MOB-03 | ✅ |
| BUG-012 | 30/09 | P1 | Tìm "áo" ra 24–31 kết quả không phải áo | Bỏ dấu rồi khớp chuỗi con ("ao" ⊂ "bao", "giao") + tìm cả mô tả | Gõ có dấu → khớp đúng dấu; khớp đầu từ; tên trước, mô tả chỉ khi không tên nào khớp | SRC-05, SRC-06 | ✅ |
| BUG-013 | 30/09 | P2 | Giỏ hàng trên điện thoại xấu: tên bẻ từng chữ, ô ảnh xám, lựa chọn lặp tên | Cả dòng dồn 1 hàng ngang; giỏ không lưu ảnh | Ảnh trái + 2 tầng; lưu ảnh lựa chọn; ẩn lựa chọn trùng tên | CART-03 | ✅ |
| BUG-014 | 30/09 | P1 | Ảnh "Tay ông đặt cạnh tay cháu" (Người Việt Vận Động) bị xoay ngang | Ảnh điện thoại có cờ EXIF xoay 90°; script tạo ảnh web bỏ cờ mà không xoay | `.rotate()` trong `scripts/figma-demo-webcopy.mjs`, tạo lại ảnh | IMG-02 | ✅ |
| BUG-015 | 30/09 | P2 | Mobile: bấm lựa chọn Bandana không thấy gì thay đổi | Ảnh nằm phía trên, đổi ngoài màn hình | Tự cuộn tới ảnh + URL `?chon=` | PD-04 | ✅ |
| BUG-016 | 30/09 | P2 | BST Đầu Đội Mũ: 2 nút mũ không dẫn sang trang mũ | Tên nút có dấu ngoặc kép, không khớp map link | `BUNDLE_LINKS` | PD-05 | ✅ |
| BUG-017 | 30/09 | P1 | Trang Mascot: Đần nâng tạ bị lật trái/phải so với Figma → dải tím tím thứ 2 bắt đầu giữa khoảng trống (PC + mobile) | Layer Figma xoay 180°, PNG xuất ra chỉ lật dọc → kết quả là ảnh gương | `-scale-x-100` | MAS-01 | ✅ |
| BUG-018 | 30/09 | P2 | Trang Mascot mobile: chú thích hero thành đoạn chữ thường (mất thiết kế); 3 dải tím trôi lơ lửng vì chữ bị ẩn | Cách sửa cũ ẩn chữ nhỏ và in lại dạng text thường | Hero: phóng to vùng giữa bản thiết kế (chú thích ~14px); phần giới thiệu: 3 hàng Đần + chữ + dải tím từ mép | MAS-02 | ✅ |
| BUG-019 | 30/09 | P2 | Menu mobile dài, chữ to, nút "Giỏ hàng" to ở cuối trông vụng; thanh trên không có icon giỏ | Menu liệt kê hết mục con; giỏ chỉ vào được qua menu | Mục con thu gọn (mở sẵn mục đang xem), chữ nhỏ hơn, icon giỏ + số trên thanh | MOB-04, MOB-05 | ✅ |
| BUG-020 | 30/09 | P1 | Checkout phải gõ tay tỉnh/quận/phường, dễ sai; còn ô Quận/Huyện dù VN đã bỏ cấp huyện từ 1/7/2025 | Ô nhập tự do | Ô chọn có tìm nhanh (gõ không dấu), 34 tỉnh + 3321 phường/xã (`public/data/vn-dia-gioi.json`), bỏ Quận/Huyện | CO-ADDR | ✅ |
| BUG-021 | 30/09 | P1 | Admin: nhập giá `1.5e3` được nhận thành 15.000đ | `Number()` hiểu số mũ sau khi bỏ dấu chấm | Giá chỉ nhận chữ số (+ dấu phân cách nghìn) | ADM-12 | ✅ (bắt bởi test trước khi lên prod) |
| BUG-022 | 03/10 | P1 | Hiệu ứng mobile mất khi chuyển sang khung Figma mobile (Đần xoay, Đần nảy/lơ lửng, dải chữ sáng dần) | Bộ vẽ khung mobile chỉ vẽ tĩnh | Gắn hiệu ứng desktop vào layer tương ứng (FX trong gen-project-pages) | ảnh 2 khung hình | ✅ 5fc1f28 |
| BUG-023 | 04/10 | P1 | Mascot mobile: Đần cầm laptop + nâng tạ lộn ngược | Figma ghi lật ngang = "xoay 180°" | Xoay 180° vẽ thành lật gương | ảnh | ✅ dea6743 |
| BUG-024 | 05/10 | P2 | Mobile checkout: bấm đặt khi thiếu thông tin, báo lỗi ở cạnh nút, không thấy ô sai | Không cuộn tới ô lỗi | Cuộn tới ô lỗi đầu tiên | VAL-12 | ✅ |
| BUG-025 | 05/10 | P3 | Mobile checkout: giá "280.000 VNĐ" bẻ 2 dòng | Không nowrap | whitespace-nowrap | CO-02 | ✅ |
| BUG-026 | 05/10 | P3 | Ô tìm kiếm có 2 nút × (trình duyệt + web) | Nút xoá mặc định của input search | Ẩn nút của trình duyệt | SRC-08 | ✅ |
| BUG-027 | 05/10 | P1 | (khách) Mascot mobile chữ thường; Freezedom tô nền cả đoạn; Chúc Tết xuống dòng khác mẫu; khoảng trắng Mình Trong Nhà; đường kẻ Neenee | id layer mobile khác desktop; thiếu font Be Vietnam Pro; khung không footer; làm tròn px | UPPER, MARK_PARTS mobile, font Pro, cắt chiều cao, dải +1px | ui-audit | ✅ dc053fd |
| BUG-030 | 06/10 | P1 | Regression chạy trên prod ghi đơn thật vào Sheet của shop (VAL-06b "Regression Test" 0900000000 ×26, ~10-15 dòng từ 03/10) | Case mong đợi 200 không bị chặn khi chạy prod | Case đặt hàng thành công chỉ chạy local (Sheet giả) | VAL-06b | ✅ |
| BUG-031 | 06/10 | P2 | (khách) Về Tíc Cơ mobile: khối 3 lặp chữ khối 2 | Figma mobile đặt nhầm chữ | Khối 3 lấy đoạn sứ mệnh của desktop (TEXT_FROM) | BUG-031 | ✅ |
| BUG-032 | 06/10 | P2 | (khách) Nhãn vàng trang chủ mobile: 2 khung vàng lệch nhau, chữ như tòi ra; EN chữ to nhỏ khác nhau | Bộ vẽ mobile tô nền chữ + vẽ hình chữ nhật Figma = 2 lớp; câu EN dài bị thu nhỏ | Bỏ nền chữ trên mobile; EN "Mindful of life" | BUG-032 | ✅ |
| BUG-033 | 06/10 | P1 | (khách) Bấm ảnh mũ ở trang Neenee -> trang sản phẩm ô xám, không ảnh | 2 thẻ mũ trỏ về trang BST mũ cũ (trước DEMO, không có ảnh) | Mỗi thẻ trỏ đúng mũ của nó | BUG-033 | ✅ |
| BUG-034 | 06/10 | P2 | (khách) 4 ảnh phụ sản phẩm không thấy hiệu ứng mờ->nét | Ảnh dưới màn hình tải + chạy hiệu ứng trước khi khách cuộn tới | Chỉ chuyển nét khi đã tải VÀ đang trên màn hình (SharpenIn) | BUG-034 | ✅ |
| QA-GAP-02 | 05/10 | — | Bộ test cũ không đo giao diện mobile so với Figma, không đi như khách mới | — | Thêm 4 lớp: ui-audit (Figma, 5 khổ), crawl khách mới, infra-check, i18n-check — xem MASTER-TEST-PLAN | — | ✅ |
| QA-GAP-01 | 30/09 | — | 75/75 pass nhưng lọt BUG-017/018: bộ test chỉ kiểm chức năng, **không so hình với Figma** | Thiếu tầng kiểm tra hình ảnh | Thêm `scripts/visual-diff.mjs` (so ảnh chụp trang với render Figma, báo vùng lệch) + review ảnh chụp mobile mỗi lần deploy | VIS-* | Đang làm |

## Còn mở (cần cấu hình/nội dung, không phải lỗi code)

| Mã | Mức | Mô tả | Ai |
|---|---|---|---|
| OPEN-01 | P0 | Prod chưa có `ORDER_SHEET_URL/SECRET` → đặt hàng trên live báo lỗi (an toàn, không mất đơn) | Bạn: Vercel env |
| OPEN-02 | — | ✅ 03/10 STK hiện từ hằng ACCOUNT (theo ảnh QR), bỏ env NEXT_PUBLIC_BANK_* | — |
| OPEN-03 | — | ✅ 03/10 ảnh QR shop đã có (`qr-thanh-toan.jpg`) | — |
| OPEN-04 | P1 | Footer thiếu thông tin người bán + trang chính sách (mẫu: `docs/footer-phap-ly-mau.md`) | Khách duyệt |
| OPEN-05 | P2 | Chưa gắn tên miền thật | Bạn |
