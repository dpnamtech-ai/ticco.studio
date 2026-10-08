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
| BUG-050 | 08/10 | P2 | (khách) Gắn link Instagram cho 3 thẻ "Đọc thêm về người Việt U80/U30/U10" | — | links trong gen-project-pages (desktop + mobile) | BUG-050 | ✅ |
| BUG-051 | 08/10 | P2 | (khách) Menu mobile: mục con Sản phẩm cỡ chữ không đều, dính gạch chân mục cha | Mục con 16px, ngôn ngữ 18px, mục chính 24px; cách mục cha 8px | Mục con 18px như dòng ngôn ngữ, cách 16px | BUG-051 | ✅ |
| BUG-052 | 08/10 | P1 | (khách, sheet) Phí ship theo số món: 1-5 món 23k, 6-10 30k, >10 45k, đơn từ 500k miễn phí; mã đơn TICCO + số | Trước: 30k/đơn cố định; mã TC… | shippingFor(subtotal, số món); mã TICCO + 8 số (web) / TICCO + 6 số dò trùng trong Sheet (Apps Script, khách cần dán lại) | BUG-052, ORD-01 | ✅ |
| BUG-053 | 08/10 | P1 | (khách) Trang chủ desktop bản EN: link, nhãn vàng, chú thích quanh Đần vẫn tiếng Việt | Là ảnh PNG có chữ Việt in sẵn; i18n-check chỉ đọc chữ thật | Bản EN dựng chữ thật cùng màu/cỡ; xoá khối phone chết trong BrandSection | BUG-053 | ✅ |
| UI-11b | 08/10 | P1 | (khách) Trang thanh toán màn lớn: cột "Đơn hàng của bạn" bị bóp | Cột lưới để px cố định sau khi chữ đã co giãn (do mình đổi cỡ chữ gốc) | Cột tính bằng rem | — | ✅ |
| POL-01 | 08/10 | — | (khách) Cập nhật 5 trang chính sách theo sheet | — | src/data/policy-text.json (nguyên văn sheet) + bản EN | BUG-043 | ✅ |
| BUG-049 | 08/10 | P0 | (khách, gửi từ tối 07/10, iPhone) Hero MOBILE: chữ trong ngoặc dồn thành 1 đoạn, mất bố cục 3 hàng giãn của Figma | Figma mobile xếp 3 hàng bằng chuỗi nhiều dấu cách; whitespace-pre-line gộp hết dấu cách. Mình sửa nhầm bản desktop (BUG-045) vì không đối chiếu ảnh khách là mobile | Chữ có >= 3 dấu cách liền dùng pre-wrap (giữ dấu cách, xuống dòng theo khung như Figma). Test FAIL trên bản cũ, PASS bản mới | BUG-049 | ✅ |
| UI-11 | 08/10 | P1 | (khách) "To hay nhỏ phải nhất quán": trang chính sách, giỏ hàng, thanh toán, tìm kiếm, 2 cửa sổ trượt, nhãn Hết hàng, icon đóng không to theo màn hình | Các trang Tailwind dùng rem = 16px cố định | html font-size max(16px, 100vw/80): bằng 16px ở 1280, to dần ở màn lớn; px cứng còn sót -> rem. Quét toàn bộ chữ 1280 vs 2560 trên 12 loại trang: 0 chỗ không co giãn | UI-11 | ✅ |
| UI-10 | 08/10 | P1 | (khách) Thanh tiến trình cuộn và link chính sách ở footer bé tí trên màn lớn | Cùng gốc BUG-046: cả trang phóng to theo bề ngang (--u, cqw) nhưng vài phần dùng chung để px cố định (3px, 12.5px). Chưa test nào so màn nhỏ với màn lớn | Thanh tiến trình 4u, link footer max(12.5px, 0.977vw). UI-10 đo 5 phần dùng chung ở 1280 và 2560, phải to gấp ~2 | UI-10 | ✅ |
| BUG-048 | 08/10 | P1 | (QA) Mưa Đần trên mobile hỏng: ảnh trả 400 | Mình hạ chất lượng ảnh xuống 90 nhưng DanRain gọi thẳng URL q=100. FX-01 chỉ đếm số ảnh, không kiểm ảnh tải được | URL q=90; thêm bản desktop (bấm/giữ chuột, con Đần to theo màn hình). BUG-048 kiểm ảnh tải xong ở cả 2 bản | BUG-048 | ✅ |
| BUG-044 | 08/10 | P1 | (khách, iPhone EN) Thẻ trang chủ: tên "[ĐẦN SURVIVAL COLLECTION] KEYCHAIN 01…" đè lên giá | Chữ trong thẻ Figma đặt toạ độ cố định từng dòng; tên dài hơn thiết kế không đẩy giá xuống. Test cũ lọc bỏ thẻ display:contents nên không kiểm được gì | Chữ trong thẻ xếp chồng (stack) theo khoảng cách Figma, cả desktop lẫn khung mobile; test kiểm từng dòng chữ, đã xác nhận FAIL trên bản cũ | BUG-044 | ✅ |
| BUG-045 | 08/10 | P1 | (khách) Hero "Đời dễ ợt": chữ "có bán sản phẩm" tràn ra ngoài dấu ")" | Khung chữ cố định 25,25% bề ngang; trình duyệt dựng chữ rộng hơn (font/cỡ chữ tối thiểu) thì tràn. Không tái hiện trên Chrome | Khung chỉ là bề ngang tối thiểu, ")" đi theo dòng dài nhất; các cụm chữ không xuống dòng | BUG-045 | ✅ (chờ khách xác nhận trên máy của họ) |
| BUG-046 | 08/10 | P2 | (khách) Con trỏ Đần nhỏ lít nhít trên màn lớn | Con trỏ cố định 56px trong khi cả trang co giãn theo bề ngang | Con trỏ max(56px, 4,375vw) | BUG-046 | ✅ |
| BUG-034 (đổi) | 08/10 | P1 | (khách) Ảnh sản phẩm hiện lâu, phải cuộn mới hiện, trông lag | Yêu cầu cũ (hiệu ứng mờ->nét khi cuộn tới) + ảnh chất lượng 100 (2MB/ảnh) | Bỏ hết hiệu ứng ảnh ở trang chi tiết, tải ngay mọi ảnh, chất lượng 90 (~3 lần nhẹ hơn, giữ nguyên độ phân giải). Test cũ BUG-036 xoá vì trái yêu cầu mới | BUG-034 | ✅ |
| BUG-047 | 08/10 | P2 | (khách gửi 3 ảnh Đần) Thẻ 3 móc khoá hiện nguyên ảnh rộng, Đần nhỏ ở góc | Thẻ không có khung cắt Figma | Thẻ dùng đúng khung của ảnh chính (đã dò trên ảnh gốc HD: trùng ảnh khách gửi), giữ ảnh gốc nét | BUG-035 | ✅ |
| BUG-038 | 07/10 | P1 | (khách) Trang chủ + "Tất cả sản phẩm" vẫn hiện thẻ BST Đần cũ, chưa có 3 móc khoá tách | Thẻ Figma trỏ bst-dan-sinh-ton | Thẻ trang chủ/mascot (desktop + khung mobile qua generator RENAME) -> móc khoá 01; "Tất cả" liệt kê 3 móc khoá, ẩn BST | BUG-038 | ✅ |
| BUG-039 | 07/10 | P1 | (khách) Trang chủ mobile: chữ NGHỆ mất dấu mũ, chữ ĐỜI mất góc | Khung ảnh xoay tính kiểu "đổi w/h" (chỉ đúng ở 90°) cắt góc ảnh xoay 5,22° | Giải ngược khung gốc của ảnh xoay (unrotated) | BUG-039 | ✅ |
| BUG-040 | 07/10 | P2 | (khách) Mascot EN mobile: "I just want…" chữ lí nhí 9px | fitText đếm dòng gõ (1) thay vì dòng hiển thị (2) nên chia đôi cỡ chữ | Đếm dòng theo chiều cao khung; bản dịch 2 dòng | BUG-040 | ✅ |
| BUG-041 | 07/10 | P1 | (QA tự chụp) Desktop: tên ở "Có thể bạn thích" đè nhau; tiêu đề mũ 3 dòng đè giá; EN "Real New Year Wishes" đè Đần; EN "Make Life New" rớt 1 chữ "that" | Tên thẻ ép 1 dòng; tiêu đề mũ đổi trong shopFigma (dùng cả trang chi tiết có toạ độ cố định); fitText chia dòng cho câu vốn tự xuống dòng | Bỏ nowrap tên thẻ; chỉ thẻ danh sách chèn xuống dòng sau "]"; chỉ chia dòng khi dòng gõ = dòng hiển thị; EN tiêu đề Tết "Real New Year / Wishes" | BUG-041 | ✅ |
| BUG-042 | 07/10 | P3 | (QA) Trang BST mũ cũ không ảnh vẫn trong sitemap | — | Sitemap bỏ sản phẩm không có ảnh | — | ✅ |
| BUG-043 | 07/10 | P2 | (QA) Chính sách thanh toán: thiếu COD, mã đơn mẫu cũ TC1AB23CD4 | Chưa cập nhật sau COD + mã TC00001 | Sửa nội dung VN + EN | BUG-043 | ✅ |
| BUG-035 | 07/10 | P1 | (khách) Phụ kiện đời sống: tên móc khoá 02 đè lên 03, thẻ BST Đần Sinh Tồn lặp với 3 móc lẻ | Tên thẻ ép 1 dòng (nowrap) tràn sang thẻ bên; BST vẫn trong danh sách tab | Bỏ BST khỏi tab (vẫn ở "Tất cả"); 3 móc khoá dùng tên Figma nhiều dòng "[BST ĐẦN SINH TỒN] / MÓC KHOÁ 0x / …" | BUG-035 | ✅ |
| BUG-036 | 07/10 | P2 | (khách, lần 3) Ảnh phụ vẫn "không có hiệu ứng" | Ảnh nhỏ tải nhanh, chuyển 0,7s blur 6px chạy cùng lúc trượt lên nên mắt không thấy | Ảnh phụ: blur 16px, 1,4s, bắt đầu sau 0,3s khi đã vào 75% màn | BUG-036 | ✅ |
| BUG-037 | 07/10 | P2 | (khách) Nút "02 - Đần nuốt nước mắt…" bị cắt ở trang BST | Không tái hiện trên Chrome 390–1920 (ảnh chụp có thể từ bản cũ/Safari); thêm test chặn chữ ra ngoài nút | Test canh 1024/1280/390 | BUG-037 | Theo dõi |
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
