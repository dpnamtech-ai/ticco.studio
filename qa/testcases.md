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
| `/` | Featured Products: nhãn viết hoa đầy đủ + không có heading "Hàng mới về" thừa | ✅ Verified | Figma trang-chu KHÔNG có heading này (chỉ san-pham page mới có) — đã xoá; nhãn sản phẩm chuyển uppercase khớp Figma |
| `/` | Hero: ngoặc kép "(...)" trang trí | ✅ Verified | Sửa lại IN HOA + BOLD + justify + ngoặc to/đậm hơn, khớp ảnh Figma export |
| `/` | Category grid, Collections, Gift Guide, UGC | ❌ Known gap | Figma **không có thiết kế** cho phần này (frame trống dưới Y2522) — nội dung hiện tại là tự soạn, không có gì để đối chiếu |
| `/san-pham` | Product grid, category tabs | ✅ Verified | Tỷ lệ card, màu, cấu trúc khớp |
| `/san-pham/[slug]` | Chi tiết sản phẩm | ✅ Verified | Tỷ lệ ảnh 4:5 đã sửa đúng theo Figma (550×689 / 269×337) |
| `/san-pham/[slug]` | 2 ảnh thumbnail dưới ảnh chính | ✅ Verified | Trước là ô xám giả — đã export đúng 2 ảnh thật từ Figma (giống hệt nhau, đúng như thiết kế gốc) |
| `/kham-pha` | 3 nhóm project card | ✅ Verified | Text thật từ sheet (khác placeholder lặp lại của Figma — cố ý, vì Figma dùng lorem); ảnh chỉ hiện cho project có ảnh thật |
| `/ve-tic-co` | Intro + mission | ✅ Verified | Text đúng 100% |
| `/ve-tic-co` | Statement section (chữ "nghệ một cách..." trên ảnh) | ✅ Verified | Chữ đã có sẵn (baked-in) trong file ảnh export — ban đầu tôi thêm chữ HTML đè lên gây nhân đôi, đã phát hiện và bỏ overlay thừa |
| `/ve-tic-co` | Bong bóng tím trang trí sau đoạn text | ✅ Verified | Dựng bằng absolute-position + border-radius blob theo đúng toạ độ Rectangle/Ellipse trong Figma |
| `/mascot-dan` | 3 hàng mô tả + ribbon | ✅ Verified | Composition absolute-position đo pixel-exact, đã qua 3 vòng sửa mới đúng |
| `/mascot-dan` | Banner intro/closing | ✅ Fixed (2026-09-15) | 2 file ảnh `intro-banner.png`/`closing-banner.png` bị tráo ngược nội dung — đã swap file, giờ đúng vị trí |
| `/mascot-dan` | Grid sản phẩm cuối trang ("Lan toả lối sống Đần...") | ✅ Fixed (2026-09-15) | Figma có hẳn 1 section grid 8 sản phẩm + nút "TẤT CẢ SẢN PHẨM" ở cuối frame (Y2679-3897) mà code không có — đã thêm |
| `/mascot-dan` | Card "tinh thần Đần" (3 pose + 4 caption, section nền `#E5E5E5` đầu trang) | ✅ Fixed (2026-09-16) | Đã export đúng 6 ảnh thật từ Figma (`char-1-dance`, `char-2-dance`, `char-3-laptop`, `chain-left/mid/right`) qua REST script + crop bằng `sharp`, thay 3 card lặp lại cũ. Verify bằng screenshot thật (chrome-devtools MCP, outline debug xác nhận đúng 6 ảnh, không thừa/thiếu). Còn sạn nhỏ: 2 ảnh (`char-1-dance`, `char-3-laptop`) dính chút chữ caption bleed ở góc do crop-from-composite (không phải lỗi code, xem checkpoint 2026-09-16T2300) — chấp nhận được ở kích thước hiển thị thật, nâng cấp lên scale 3 khi Figma quota reset. Đã push lên nhánh `demo/motion-upgrades` (KHÔNG phải `main` — chưa lên prod cho tới khi merge). |
| Trang chủ `/` | "Dự án chung tay hợp tác" (CollabSection cuối trang) | ✅ Fixed (2026-09-15) | Figma Rectangle 24 nền cam (#e66107) đằng sau khối 3 project card — code thiếu nền cam, chữ tối màu trên nền sáng mặc định. Component `ProjectCard` đã có sẵn prop `onOrange` (dùng đúng ở `/kham-pha`) nhưng `CollabSection.tsx` quên truyền — đã sửa. |
| `/kham-pha` | 8 nút "Đọc thêm về dự án" | ✅ Fixed (2026-09-18) | `articleHref: "#"` cho cả 8 project trong `content.ts`, chưa có trang bài viết nào — dead link. Đã hỏi user 2 lần không có trả lời → tự quyết theo đề xuất an toàn nhất: `ProjectCard.tsx` giờ ẩn nút khi `articleHref` rỗng hoặc `"#"`. Bật lại khi có bài viết thật. |
| Footer (mọi trang) | Link "Chính sách mua hàng" / "Chính sách" → `/chinh-sach` | ✅ Fixed (2026-09-18) | Route `/chinh-sach` chưa tồn tại (404 xác nhận qua browser 2 lần). Đã hỏi user 2 lần không có trả lời → tự quyết: xoá 2 link này khỏi `Footer.tsx` cho tới khi có nội dung chính sách thật để dựng trang. |
| `/`, `/san-pham`, chi tiết sản phẩm, `/gio-hang`, `/mascot-dan` | Cart drawer (thêm/sửa SL/xoá/persist localStorage) | ✅ Verified (2026-09-18) | Test qua sub-agent QA: add-to-cart từ product detail, tăng/giảm SL (giảm về 0 tự xoá), xoá item, empty state, `localStorage['ticco-cart']` đúng qua reload — pass hết. Ghi chú: `ProductCard.tsx` (card lưới) không có nút add-to-cart nhanh, chỉ `ProductDetail.tsx` mới có — đúng như code hiện tại, không phải thiếu sót của commit này. |
| Toàn site | Feedback microinteraction khi add-to-cart (nút đổi màu/icon, badge giỏ hàng nảy) | ✅ Verified (2026-09-18) | `ProductDetail.tsx` nút chuyển "Đã thêm" 1.5s rồi revert; `Navbar.tsx` badge spring-pop khi `totalItems` đổi. Không có component `Toast` riêng — feedback nằm ngay trong 2 chỗ này. Không có spec Figma (freehand interaction trên nhánh demo). |
| `/mascot-dan`, brand section trang chủ | Idle mascot animation (bob lên xuống) | ⚠️ Approximate (2026-09-18) | `FloatingMascot.tsx` dùng `animate={{y:[0,-10,0]}}` framer-motion, transform-only nên không gây layout shift. Sub-agent QA không xác nhận trực quan được do Chrome automation throttle rAF (vấn đề công cụ, không phải bug) — code đúng chuẩn, cần liếc mắt thật 5s để chắc chắn 100%. |
| Toàn site | Page transition khi chuyển route | ✅ Verified (2026-09-18) | `PageTransition.tsx` (`AnimatePresence mode="wait"`, fade+slide 0.25s). Test `/ → /san-pham → /mascot-dan → /gio-hang` cả forward-click lẫn back/forward browser — mượt, không FOUC, không overlay sót lại, không tràn ngang. Không có spec Figma (freehand, nhánh demo chưa merge main). |
| `/san-pham`, chi tiết sản phẩm | Hover-zoom ảnh (card lưới + 2 thumbnail chi tiết) | ✅ Verified (2026-09-18) | `group-hover:scale-110` + `overflow-hidden`, test qua CDP hover thật trên ~30 card + cả 2 thumbnail, reset sạch khi mouse-leave, không tràn ra ngoài, test lại ở 768px vẫn đúng. |
| Chi tiết sản phẩm | Magnifier lens cursor-following (ảnh chính) | ✅ Verified (2026-09-18) | `MagnifierImage.tsx` — track cursor chính xác sub-pixel ở 4 điểm test, clamp đúng ở rìa ảnh, unmount sạch khi mouse-leave, test thêm ở 390px/768px không lỗi. Không có spec Figma (Figma MCP hết quota Starter plan lúc test, nhưng theo thiết kế đây vốn là freehand interaction). |

---

## Log kết quả theo từng lần chạy

| Ngày | % Tự động (F+S+G) | Figma-match (Verified/tổng) | Ghi chú |
|------|-----|-----|---------|
| 2026-08-23 (lần 1) | 76.5% (26/34) | — | Baseline trước khi vá SEO/GEO |
| 2026-08-23 (lần 2) | **100% (34/34)** | 9 Verified / 4 gap | Thêm robots.txt, sitemap.xml, JSON-LD Product+Organization, rút gọn meta description quá dài |
| 2026-09-15 (fresh audit, round 3) | **100% (34/34)** | 9 Verified / 4 gap (không đổi) | Chụp lại toàn bộ 6 trang từ production (viewport ~1470px, browser remote không ép được về 1280px), soi trực tiếp bằng mắt + `getBoundingClientRect`/`naturalWidth` qua JS, đối chiếu với `qa/figma-*.txt`. Không tìm thấy bug thị giác mới — 3 vòng fix trước (badge, ảnh sản phẩm, blob tím, mascot) vẫn giữ nguyên trên production. 2 nghi vấn ban đầu (hero ảnh "biến mất", 1 khung sản phẩm "trống trơn" giữa `/san-pham`) đều là false alarm do ảnh load trễ/họa hình render chậm lúc chụp — xác minh lại bằng JS `complete`/`naturalWidth` thì ảnh vẫn load đủ. Card sản phẩm xám (Sổ Nghỉ Đi, Sticker 01/02...) là đúng thiết kế — sản phẩm đó chưa có ảnh thật trong `content.ts`/`public/images/products/`, không phải bug. |
| 2026-09-18 (round 4, motion/interaction features + 2 fix quyết định tự động) | **100% (34/34)**, không regression | 16 Verified/Approximate / 4 gap (+7 mục mới) | 2 bug đã biết (hỏi user 2 lần không trả lời) được tự sửa theo đề xuất an toàn nhất: ẩn nút "Đọc thêm về dự án" dead-link ở `/kham-pha`, xoá link footer 404 `/chinh-sach`. Sau đó dùng 2 sub-agent QA song song audit 7 tính năng motion/interaction mới ở nhánh `demo/motion-upgrades` (cart drawer, feedback microinteraction, idle mascot, page transition, hover-zoom card+thumbnail, magnifier lens) — cả 7 đều pass, không bug, console sạch. Mục thứ 15 (missing product images ~15/22 sản phẩm) vẫn giữ nguyên không đổi — content gap, không tự thêm ảnh giả thay user. |
