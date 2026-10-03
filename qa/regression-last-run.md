# Regression — 2026-10-03 20:16 UTC

Target: https://ticcostudios.com (production, read-only)
Result: **74/74 pass**

| | ID | Case | Chi tiết |
|---|---|---|---|
| ✅ | SMK-01 | Mọi URL trong sitemap + trang phụ trả 200 |  |
| ✅ | SMK-02 | Sản phẩm không tồn tại trả 404 |  |
| ✅ | SEC-10 | Admin chưa đăng nhập: chuyển về /admin/login (hoặc 404 khi chưa bật Supabase), không bao giờ 200/500 (BUG-010) |  |
| ✅ | ADM-30 | Gọi thẳng 6 server action admin (tạo/sửa/xoá SP, đổi đơn, upload, đăng xuất) khi chưa đăng nhập -> bị chặn |  |
| ✅ | LEG-01 | Footer chỉ có 5 link chính sách (mở được), không có link/thông tin người bán (khách yêu cầu bỏ) |  |
| ✅ | SEC-11 | Security headers (chống nhúng iframe, sniff, HSTS) |  |
| ✅ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) / |  |
| ✅ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /san-pham |  |
| ✅ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /san-pham/bst-postcard-triet-ly-song-dan |  |
| ✅ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /kham-pha |  |
| ✅ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /kham-pha/nguoi-viet-van-dong |  |
| ✅ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /ve-tic-co |  |
| ✅ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /mascot-dan |  |
| ✅ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /tim-kiem?q=dan |  |
| ✅ | IMG-02 | Ảnh web đúng chiều như ảnh gốc (ảnh điện thoại có cờ xoay EXIF) (BUG-014) |  |
| ✅ | MOB-01 | Không tràn ngang trên điện thoại (390) / |  |
| ✅ | MOB-01 | Không tràn ngang trên điện thoại (390) /san-pham |  |
| ✅ | MOB-01 | Không tràn ngang trên điện thoại (390) /san-pham/bst-postcard-triet-ly-song-dan |  |
| ✅ | MOB-01 | Không tràn ngang trên điện thoại (390) /kham-pha |  |
| ✅ | MOB-01 | Không tràn ngang trên điện thoại (390) /kham-pha/nguoi-viet-van-dong |  |
| ✅ | MOB-01 | Không tràn ngang trên điện thoại (390) /ve-tic-co |  |
| ✅ | MOB-01 | Không tràn ngang trên điện thoại (390) /mascot-dan |  |
| ✅ | MOB-01 | Không tràn ngang trên điện thoại (390) /tim-kiem?q=dan |  |
| ✅ | MOB-02 | Menu mobile mở được, đủ 4 mục + có nút tìm kiếm |  |
| ✅ | MOB-03 | Menu đang mở, bấm kính lúp -> menu đóng, thanh tìm kiếm trượt ra, con trỏ ở ô nhập (BUG-011) |  |
| ✅ | FX-01 | Mobile: chạm màn hình -> Đần rơi rồi tự biến mất, không chặn thao tác; PC không có |  |
| ✅ | MOB-04 | Menu mobile có danh mục sản phẩm (Tất cả, Văn phòng phẩm, In ấn…) bấm vào đúng tab |  |
| ✅ | MOB-05 | Thanh trên điện thoại có icon giỏ + số; menu không còn nút 'Giỏ hàng' to |  |
| ✅ | CART-03 | Giỏ hàng trên điện thoại: có ảnh, tên không bị bẻ từng chữ, không tràn ngang (BUG-013) |  |
| ✅ | UI-01 | Navbar Figma 2026-09-29: logo trái x≈35 rộng 83, 4 mục cách nhau 46 |  |
| ✅ | UI-02 | Mục menu của trang hiện tại in đậm |  |
| ✅ | UI-03 | Tab 'Tất cả sản phẩm' đang chọn = tím + đậm (BUG-003) |  |
| ✅ | UI-04 | Phân trang: trang hiện tại có màu khác (BUG-002) |  |
| ✅ | UI-05 | Badge giỏ hàng to, nằm trong thanh nav khi cuộn (BUG-001) |  |
| ✅ | UI-06 | Trang chủ: tiêu đề 'Những thứ chúng tôi có!' (Figma mới) |  |
| ✅ | UI-07 | 3 card dự án ở trang chủ link đúng trang dự án (BUG-004) |  |
| ✅ | PD-01 | Chọn 'Hạnh phúc là tự thân' đổi ảnh chính (bst-postcard-triet-ly-song-dan) (BUG-005) |  |
| ✅ | PD-01 | Chọn 'Tím' đổi ảnh chính (khan-bandana-van-su-tuy-minh) (BUG-005) |  |
| ✅ | PD-01 | Chọn 'Xanh rêu' đổi ảnh chính (lot-coc-ra-khoi) (BUG-005) |  |
| ✅ | PD-04 | Điện thoại: bấm lựa chọn -> tự cuộn thấy ảnh mới + URL ?chon= (BUG-015) |  |
| ✅ | PD-05 | BST Đầu Đội Mũ: 2 nút mũ dẫn sang trang từng mũ |  |
| ✅ | MAS-01 | Mascot: Đần nâng tạ lật đúng chiều Figma (bánh tạ to bên trái) (BUG-017) |  |
| ✅ | MAS-02 | Mascot mobile: chú thích hero nằm trong thiết kế, chữ >= 12px; 3 hàng Đần + chữ không chồng nhau (BUG-018) |  |
| ✅ | PD-02 | Lựa chọn dạng link chuyển sang sản phẩm anh em (Sổ) |  |
| ✅ | PD-03 | Sản phẩm hết hàng hiện SOLD OUT, không có nút thêm giỏ |  |
| ✅ | SRC-01 | Tìm 'dan' ra cả Sản phẩm và Khám phá, có nhãn phân biệt |  |
| ✅ | SRC-02 | Gõ không dấu vẫn tìm được ('so' chứa mọi kết quả của 'sổ') |  |
| ✅ | SRC-05 | Tìm 'áo' chỉ ra sản phẩm là áo, không lẫn 'bao/cao/giao' (BUG-012) |  |
| ✅ | SRC-06 | Tìm 'túi' chỉ ra túi |  |
| ✅ | SRC-07 | Trang /tim-kiem chưa gõ -> có danh mục, không có mục gợi ý (khách bỏ 'Có thể bạn sẽ thích') |  |
| ✅ | SRC-03 | Không có kết quả -> thông báo + link xem sản phẩm |  |
| ✅ | SRC-04 | Kính lúp trên navbar mở thanh tìm kiếm bên phải: trống khi chưa gõ, gõ ra kết quả, Esc đóng, trang sau không cuộn |  |
| ✅ | SEC-01 | XSS qua ô tìm kiếm không chạy script |  |
| ✅ | CART-01 | Thêm 2 lựa chọn khác nhau = 2 dòng, giá đúng từng lựa chọn (BUG-008) |  |
| ✅ | CART-02 | Trang giỏ: tăng số lượng, giữ sau khi tải lại, xoá dòng |  |
| ✅ | CANCEL-01 | Rời checkout giữa chừng: giỏ hàng vẫn còn nguyên |  |
| ✅ | CO-ADDR | Checkout: gõ không dấu 'ha noi' -> chọn Thành phố Hà Nội; 'ba dinh' -> Phường Ba Đình; không còn ô Quận/Huyện |  |
| ✅ | CANCEL-02 | Giỏ trống -> checkout báo 'Giỏ hàng trống', không có form đặt |  |
| ✅ | SEC-02 | JSON hỏng -> 400 |  |
| ✅ | SEC-03 | Honeypot (bot điền ô ẩn) -> 400 |  |
| ✅ | VAL-01 | SĐT sai -> 422 |  |
| ✅ | VAL-02 | Thiếu địa chỉ -> 422 |  |
| ✅ | VAL-03 | Giỏ rỗng -> 422 |  |
| ✅ | VAL-04 | Sản phẩm không tồn tại -> 422 |  |
| ✅ | VAL-05 | Số lượng 0 -> 422 |  |
| ✅ | VAL-06 | Số lượng 100 (quá 99) -> 422 |  |
| ✅ | VAL-06b | Số lượng 26 (đơn sỉ, ảnh lỗi 03/10) -> 200 |  |
| ✅ | VAL-07 | Số lượng lẻ 1.5 -> 422 |  |
| ✅ | VAL-08 | 31 dòng hàng -> 422 |  |
| ✅ | VAL-09 | Sản phẩm hết hàng -> 422 |  |
| ✅ | VAL-10 | Email sai -> 422 |  |
| ✅ | SEC-04 | GET /api/orders không được phép (405) |  |
| ✅ | VAL-11 | Form báo lỗi SĐT sai ngay dưới ô nhập |  |
| ✅ | CON-01 | Không có lỗi JS trong console trên các trang đã mở |  |
