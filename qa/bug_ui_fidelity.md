# Bug log — UI / Figma fidelity

Đo bằng máy, không phải nhìn bằng mắt. Nguồn số liệu:

```bash
node scripts/figma-fetch.mjs                    # refresh .figma-cache (REST, KHÔNG dính rate-limit MCP)
node scripts/figma-summarize.mjs "trang-chu"    # toạ độ/size/font/màu thật của frame
```

Mốc chuẩn đã xuất sẵn: `qa/figma-trang-chu.txt`, `qa/figma-ve-Tic-Co.txt`, `qa/figma-mascot-Dan.txt`.

Kích thước frame thiết kế: trang-chu 1280x4558 · ve-Tic-Co 1280x1996 · mascot-Dan 1280x3897.

---

## B1 — Ảnh bị phục vụ nhỏ hơn kích thước hiển thị (nguyên nhân "ảnh bị vỡ") — HIGH

Client export layer ở 4x để ảnh nét, nhưng `next/image` đang chọn biến thể NHỎ HƠN khung hiển thị rồi
phóng to lên, nên ảnh mờ/rỗ. File 4x hiện không được dùng tới.

Đo tại `/` (JS trong trang, `naturalWidth` vs `getBoundingClientRect().width`):

| Ảnh (alt) | Hiển thị | Ảnh thật tải về | Tỉ lệ |
|---|---|---|---|
| Giỏ đồ Tíc Cơ (hero) | 1072px | 706px | 0.66x |
| BST Đần Sinh Tồn | 280px | 158px | 0.56x |
| Túi Sống Cừ Khôi | 280px | 156px | 0.56x |
| Gile Yên Tâm | 280px | 158px | 0.56x |
| Box Set Tìm Kiếm Điều Kỳ Diệu | 280px | 157px | 0.56x |
| BST Sổ Căn Bản | 280px | 480px | 1.71x (chấp nhận được) |

Ngưỡng cần đạt: `naturalWidth >= 2 x` chiều rộng CSS (màn retina). Hiện gần như toàn bộ card sản phẩm
đang ở ~0.56x, tức thiếu ~3.5 lần độ phân giải.

**Fix**: sửa prop `sizes` cho đúng khung thật của ảnh (card sản phẩm render 280px ở desktop →
`sizes` phải phản ánh điều đó, không được khai báo nhỏ hơn), kiểm tra lại `quality`, và xác nhận
bằng cách đo lại `naturalWidth` chứ không chỉ nhìn ảnh.

## B2 — Ảnh text export để `alt` rỗng — HIGH (SEO + a11y)

Chữ thiết kế được thay bằng ảnh export là đúng yêu cầu client (chữ do team client tự vẽ tay, không
thể dựng lại bằng webfont). Nhưng khi `alt=""` thì toàn bộ nội dung tiếng Việt biến mất khỏi HTML.

- `/ve-tic-co`: 5 ảnh, **4 ảnh không có `sizes`**, có ảnh `alt` rỗng.
- `/mascot-dan`: 10 ảnh, **6 ảnh `alt` rỗng**, phần lớn không có `sizes`.

**Fix**: mọi ảnh-thay-chữ phải có `alt` là đúng câu tiếng Việt gốc (tên file export chính là nội dung
chữ). Ảnh trang trí thuần tuý mới được để `alt=""`.

## B3 — Bộ QA cũ không kiểm tra bố cục — MEDIUM

`node scripts/qa-check.mjs` đang pass **34/34 (100%)** trong khi client đánh giá UI sai lệch nhiều.
Bộ test chỉ kiểm route 200 / SEO / ảnh có fetch được, **không kiểm toạ độ, kích thước, hay độ nét**.

**Fix**: bổ sung test đối chiếu hình học (so `getBoundingClientRect()` của các khối chính với toạ độ
trong `qa/figma-*.txt` ở khổ 1280, sai số cho phép ~8px) và test độ nét (`naturalWidth >= 2x` CSS
width) vào quy trình QA.

## B4 — Dấu ngoặc `(` `)` ở hero dùng sai font — LOW

`qa/figma-trang-chu.txt` ghi rõ 2 ký tự ngoặc trong khối subtext hero dùng **`Big Caslon` size 100**,
khác hẳn `Be Vietnam` của phần chữ còn lại. Hiện code render chung một font.

**Fix**: hoặc dùng ảnh export `Frame 6.png`, hoặc dựng đúng Big Caslon cho riêng 2 ký tự này.

---

## Cần xác nhận lại (chưa đo xong)

- Chiều cao trang thật so với frame thiết kế ở đúng khổ 1280 (lần đo đầu cửa sổ trình duyệt không
  chịu về 1280, `clientWidth` báo 1905 → số liệu chiều cao chưa so sánh được).
- Nền `Rectangle 21/22/23` ở ve-tic-co: agent trước nghi là gradient trong khi code đang tô màu phẳng.
- Vị trí % của 3 badge trong `BrandSection.tsx` (suy ra từ dữ liệu Figma cũ, chưa đối chiếu lại với
  `qa/figma-trang-chu.txt` mới).
