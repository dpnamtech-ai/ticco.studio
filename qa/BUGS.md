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
| QA-GAP-01 | 30/09 | — | 75/75 pass nhưng lọt BUG-017/018: bộ test chỉ kiểm chức năng, **không so hình với Figma** | Thiếu tầng kiểm tra hình ảnh | Thêm `scripts/visual-diff.mjs` (so ảnh chụp trang với render Figma, báo vùng lệch) + review ảnh chụp mobile mỗi lần deploy | VIS-* | Đang làm |

## Còn mở (cần cấu hình/nội dung, không phải lỗi code)

| Mã | Mức | Mô tả | Ai |
|---|---|---|---|
| OPEN-01 | P0 | Prod chưa có `ORDER_SHEET_URL/SECRET` → đặt hàng trên live báo lỗi (an toàn, không mất đơn) | Bạn: Vercel env |
| OPEN-02 | P0 | Prod chưa có `NEXT_PUBLIC_BANK_*` → màn chuyển khoản không có STK | Bạn: Vercel env |
| OPEN-03 | P1 | Chưa có ảnh QR shop (`public/images/qr-thanh-toan.png`) — đang hiện câu thay thế | Khách |
| OPEN-04 | P1 | Footer thiếu thông tin người bán + trang chính sách (mẫu: `docs/footer-phap-ly-mau.md`) | Khách duyệt |
| OPEN-05 | P2 | Chưa gắn tên miền thật | Bạn |
