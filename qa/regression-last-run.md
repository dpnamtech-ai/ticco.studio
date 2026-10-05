# Regression — 2026-10-05 19:05 UTC

Target: http://localhost:3100 (local, full incl. orders on a mock Sheet)
Result: **5/88 pass**

| | ID | Case | Chi tiết |
|---|---|---|---|
| ✅ | SMK-01 | Mọi URL trong sitemap + trang phụ trả 200 |  |
| ✅ | SMK-02 | Sản phẩm không tồn tại trả 404 |  |
| ✅ | SEC-10 | Admin chưa đăng nhập: chuyển về /admin/login (hoặc 404 khi chưa bật Supabase), không bao giờ 200/500 (BUG-010) |  |
| ❌ | ADM-30 | Gọi thẳng 6 server action admin (tạo/sửa/xoá SP, đổi đơn, upload, đăng xuất) khi chưa đăng nhập -> bị chặn | terminated |
| ❌ | LEG-01 | Footer chỉ có 5 link chính sách (mở được), không có link/thông tin người bán (khách yêu cầu bỏ) | fetch failed |
| ❌ | SEC-11 | Security headers (chống nhúng iframe, sniff, HSTS) | fetch failed |
| ❌ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) / | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /san-pham | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham; still open:  |
| ❌ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /san-pham/bst-postcard-triet-ly-song-dan | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham/bst-postcard-triet-ly-song-dan; still open:  |
| ❌ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /kham-pha | net::ERR_CONNECTION_REFUSED at http://localhost:3100/kham-pha; still open:  |
| ❌ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /kham-pha/nguoi-viet-van-dong | net::ERR_CONNECTION_REFUSED at http://localhost:3100/kham-pha/nguoi-viet-van-dong; still open:  |
| ❌ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /ve-tic-co | net::ERR_CONNECTION_REFUSED at http://localhost:3100/ve-tic-co; still open:  |
| ❌ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /mascot-dan | net::ERR_CONNECTION_REFUSED at http://localhost:3100/mascot-dan; still open:  |
| ❌ | IMG-01 | Ảnh load đủ + không tràn ngang (1280) /tim-kiem?q=dan | net::ERR_CONNECTION_REFUSED at http://localhost:3100/tim-kiem?q=dan; still open:  |
| ✅ | IMG-02 | Ảnh web đúng chiều như ảnh gốc (ảnh điện thoại có cờ xoay EXIF) (BUG-014) |  |
| ❌ | MOB-01 | Không tràn ngang trên điện thoại (390) / | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | MOB-01 | Không tràn ngang trên điện thoại (390) /san-pham | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham; still open:  |
| ❌ | MOB-01 | Không tràn ngang trên điện thoại (390) /san-pham/bst-postcard-triet-ly-song-dan | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham/bst-postcard-triet-ly-song-dan; still open:  |
| ❌ | MOB-01 | Không tràn ngang trên điện thoại (390) /kham-pha | net::ERR_CONNECTION_REFUSED at http://localhost:3100/kham-pha; still open:  |
| ❌ | MOB-01 | Không tràn ngang trên điện thoại (390) /kham-pha/nguoi-viet-van-dong | net::ERR_CONNECTION_REFUSED at http://localhost:3100/kham-pha/nguoi-viet-van-dong; still open:  |
| ❌ | MOB-01 | Không tràn ngang trên điện thoại (390) /ve-tic-co | net::ERR_CONNECTION_REFUSED at http://localhost:3100/ve-tic-co; still open:  |
| ❌ | MOB-01 | Không tràn ngang trên điện thoại (390) /mascot-dan | net::ERR_CONNECTION_REFUSED at http://localhost:3100/mascot-dan; still open:  |
| ❌ | MOB-01 | Không tràn ngang trên điện thoại (390) /tim-kiem?q=dan | net::ERR_CONNECTION_REFUSED at http://localhost:3100/tim-kiem?q=dan; still open:  |
| ❌ | MOB-02 | Menu mobile mở được, đủ 4 mục + có nút tìm kiếm | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | MOB-03 | Menu đang mở, bấm kính lúp -> menu đóng, thanh tìm kiếm trượt ra, con trỏ ở ô nhập (BUG-011) | Execution context was destroyed, most likely because of a navigation. |
| ❌ | FX-01 | Mobile: chạm màn hình -> Đần rơi rồi tự biến mất, không chặn thao tác; PC không có | net::ERR_CONNECTION_REFUSED at http://localhost:3100/chinh-sach/doi-tra; still open:  |
| ❌ | MOB-04 | Menu mobile có danh mục sản phẩm (Tất cả, Văn phòng phẩm, In ấn…) bấm vào đúng tab | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | MOB-05 | Thanh trên điện thoại có icon giỏ + số; menu không còn nút 'Giỏ hàng' to | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | CART-03 | Giỏ hàng trên điện thoại: có ảnh, tên không bị bẻ từng chữ, không tràn ngang (BUG-013) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham/dan-sinh-ton-03; still open:  |
| ❌ | UI-01 | Navbar Figma 2026-09-29: logo trái x≈35 rộng 83, 4 mục cách nhau 46 | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham; still open:  |
| ❌ | UI-02 | Mục menu của trang hiện tại in đậm | Execution context was destroyed, most likely because of a navigation. |
| ❌ | UI-03 | Tab 'Tất cả sản phẩm' đang chọn = tím + đậm (BUG-003) | Failed to execute 'getComputedStyle' on 'Window': parameter 1 is not of type 'Element'. |
| ❌ | UI-04 | Phân trang: trang hiện tại có màu khác (BUG-002) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham?trang=2; still open:  |
| ❌ | UI-05 | Badge giỏ hàng to, nằm trong thanh nav khi cuộn (BUG-001) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | UI-06 | Trang chủ: tiêu đề 'Những thứ chúng tôi có!' (Figma mới) | fetch failed |
| ❌ | UI-07 | 3 card dự án ở trang chủ link đúng trang dự án (BUG-004) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | PD-01 | Chọn 'Hạnh phúc là tự thân' đổi ảnh chính (bst-postcard-triet-ly-song-dan) (BUG-005) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham/bst-postcard-triet-ly-song-dan; still open:  |
| ❌ | PD-01 | Chọn 'Tím' đổi ảnh chính (khan-bandana-van-su-tuy-minh) (BUG-005) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham/khan-bandana-van-su-tuy-minh; still open:  |
| ❌ | PD-01 | Chọn 'Xanh rêu' đổi ảnh chính (lot-coc-ra-khoi) (BUG-005) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham/lot-coc-ra-khoi; still open:  |
| ❌ | PD-04 | Điện thoại: bấm lựa chọn -> tự cuộn thấy ảnh mới + URL ?chon= (BUG-015) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham/khan-bandana-van-su-tuy-minh; still open:  |
| ❌ | PD-05 | BST Đầu Đội Mũ: 2 nút mũ dẫn sang trang từng mũ | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham/bst-dau-doi-mu-chan-vao-doi; still open:  |
| ❌ | MAS-01 | Mascot: Đần nâng tạ lật đúng chiều Figma (bánh tạ to bên trái) (BUG-017) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/mascot-dan; still open:  |
| ❌ | MAS-02 | Mascot mobile: chú thích hero nằm trong thiết kế, chữ >= 12px; 3 hàng Đần + chữ không chồng nhau (BUG-018) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/mascot-dan; still open:  |
| ❌ | PD-02 | Lựa chọn dạng link chuyển sang sản phẩm anh em (Sổ) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham/so-trong; still open:  |
| ❌ | PD-03 | Sản phẩm hết hàng hiện SOLD OUT, không có nút thêm giỏ | net::ERR_CONNECTION_REFUSED at http://localhost:3100/san-pham/so-nghi-di; still open:  |
| ❌ | SRC-01 | Tìm 'dan' ra cả Sản phẩm và Khám phá, có nhãn phân biệt | net::ERR_CONNECTION_REFUSED at http://localhost:3100/tim-kiem?q=dan; still open:  |
| ❌ | SRC-02 | Gõ không dấu vẫn tìm được ('so' chứa mọi kết quả của 'sổ') | net::ERR_CONNECTION_REFUSED at http://localhost:3100/tim-kiem?q=s%E1%BB%95; still open:  |
| ❌ | SRC-05 | Tìm 'áo' chỉ ra sản phẩm là áo, không lẫn 'bao/cao/giao' (BUG-012) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/tim-kiem?q=%C3%A1o; still open:  |
| ❌ | SRC-06 | Tìm 'túi' chỉ ra túi | net::ERR_CONNECTION_REFUSED at http://localhost:3100/tim-kiem?q=t%C3%BAi; still open:  |
| ❌ | SRC-07 | Trang /tim-kiem chưa gõ -> có danh mục, không có mục gợi ý (khách bỏ 'Có thể bạn sẽ thích') | net::ERR_CONNECTION_REFUSED at http://localhost:3100/tim-kiem; still open:  |
| ❌ | SRC-03 | Không có kết quả -> thông báo + link xem sản phẩm | net::ERR_CONNECTION_REFUSED at http://localhost:3100/tim-kiem?q=zzqxqzz; still open:  |
| ❌ | SRC-04 | Kính lúp trên navbar mở thanh tìm kiếm bên phải: trống khi chưa gõ, gõ ra kết quả, Esc đóng, trang sau không cuộn | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | SEC-01 | XSS qua ô tìm kiếm không chạy script | net::ERR_CONNECTION_REFUSED at http://localhost:3100/tim-kiem?q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E%3Cscript%3Ealert(2)%3C%2Fscript%3E; still open:  |
| ❌ | CART-01 | Thêm 2 lựa chọn khác nhau = 2 dòng, giá đúng từng lựa chọn (BUG-008) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | CART-02 | Trang giỏ: tăng số lượng, giữ sau khi tải lại, xoá dòng | net::ERR_CONNECTION_REFUSED at http://localhost:3100/gio-hang; still open:  |
| ❌ | CANCEL-01 | Rời checkout giữa chừng: giỏ hàng vẫn còn nguyên | net::ERR_CONNECTION_REFUSED at http://localhost:3100/checkout; still open:  |
| ❌ | CO-ADDR | Checkout: gõ không dấu 'ha noi' -> chọn Thành phố Hà Nội; 'ba dinh' -> Phường Ba Đình; không còn ô Quận/Huyện | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | CANCEL-02 | Giỏ trống -> checkout báo 'Giỏ hàng trống', không có form đặt | Execution context was destroyed, most likely because of a navigation. |
| ❌ | SEC-02 | JSON hỏng -> 400 | fetch failed |
| ❌ | SEC-03 | Honeypot (bot điền ô ẩn) -> 400 | fetch failed |
| ❌ | VAL-01 | SĐT sai -> 422 | fetch failed |
| ❌ | VAL-02 | Thiếu địa chỉ -> 422 | fetch failed |
| ❌ | VAL-03 | Giỏ rỗng -> 422 | fetch failed |
| ❌ | VAL-04 | Sản phẩm không tồn tại -> 422 | fetch failed |
| ❌ | VAL-05 | Số lượng 0 -> 422 | fetch failed |
| ❌ | VAL-06 | Số lượng 100 (quá 99) -> 422 | fetch failed |
| ❌ | VAL-06b | Số lượng 26 (đơn sỉ, ảnh lỗi 03/10) -> 200 | fetch failed |
| ❌ | VAL-07 | Số lượng lẻ 1.5 -> 422 | fetch failed |
| ❌ | VAL-08 | 31 dòng hàng -> 422 | fetch failed |
| ❌ | VAL-09 | Sản phẩm hết hàng -> 422 | fetch failed |
| ❌ | VAL-10 | Email sai -> 422 | fetch failed |
| ❌ | VAL-12 | Mobile: bấm đặt khi form trống -> trang cuộn tới ô lỗi đầu tiên (BUG-024) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | CO-02 | Mobile: giá trong tóm tắt đơn không bị bẻ 2 dòng (BUG-025) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | SRC-08 | Ô tìm kiếm không có nút xoá thứ hai của trình duyệt (BUG-026) | net::ERR_CONNECTION_REFUSED at http://localhost:3100/tim-kiem?q=dan; still open:  |
| ❌ | SEC-04 | GET /api/orders không được phép (405) | fetch failed |
| ❌ | VAL-11 | Form báo lỗi SĐT sai ngay dưới ô nhập | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | ORD-01 | Đặt hàng: màn tổng quan + mã đơn + tổng đúng; Sheet nhận giá đúng dù giỏ bị sửa giá | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | ORD-02 | Tải lại trang sau khi đặt vẫn thấy thông tin chuyển khoản | Protocol error (Page.reload): Not attached to an active page |
| ❌ | ORD-03 | Đặt xong, mua tiếp, vào checkout -> form đơn MỚI (không kẹt ở đơn cũ) (BUG-009) | Execution context was destroyed, most likely because of a navigation. |
| ❌ | ORD-04 | Miễn phí ship khi đơn >= 500k | fetch failed |
| ❌ | ORD-05 | COD: Sheet nhận đơn ghi [COD] + payment=cod | fetch failed |
| ❌ | ORD-06 | COD trên form: màn đặt xong báo thu tiền khi giao, không hiện mã QR | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | SEC-05 | Giá giả gửi từ client bị bỏ qua (server tự tính) | fetch failed |
| ❌ | SEC-06 | Chèn công thức vào Sheet bị vô hiệu (= + - @ -> chữ thường) | fetch failed |
| ❌ | SEC-07 | XSS trong tên/ghi chú: giao diện không chạy script | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | CANCEL-03 | Sheet lỗi -> khách thấy báo lỗi, giỏ hàng GIỮ NGUYÊN để thử lại | net::ERR_CONNECTION_REFUSED at http://localhost:3100/; still open:  |
| ❌ | SEC-09 | Chống spam: đơn thứ 7 trong 1 phút từ 1 IP -> 429 | fetch failed |
| ✅ | CON-01 | Không có lỗi JS trong console trên các trang đã mở |  |
