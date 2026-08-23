# Bugs & Fix Instructions for "Về Tíc Cơ" (ve-tic-co)

## 1. Hero Section - Lỗi Grid Layout & Text Distribution
- **Hiện tại:** Code dùng `md:grid-cols-[1fr_1fr_auto]`. Toàn bộ 3 đoạn văn của `aboutPage.intro` bị gộp chung vào cột 1. Cột 2 chứa Title mobile và `aboutPage.mission`. Cột 3 chứa Title desktop ("Về Tíc Cơ").
- **Figma Design:** Bố cục chia text theo từng khối không đều:
  - **Khối trái (Cột 1):** Chỉ chứa đoạn `aboutPage.intro[0]`.
  - **Khối giữa (Cột 2):** Chứa đoạn `aboutPage.intro[1]` và `aboutPage.intro[2]`.
  - **Khối phải (Cột 3):** Chứa Title "VỀ TÍC CƠ" (ở trên) và 2 đoạn `aboutPage.mission` (ở dưới).
- **Cách fix:** 
  - Điều chỉnh lại logic map array `aboutPage.intro`. Tách phần tử đầu tiên vào cột 1, 2 phần tử còn lại vào cột 2.
  - Chuyển `aboutPage.mission` sang cột 3, nằm ngay dưới Title "Về Tíc Cơ".

## 2. Hero Section - Lỗi Title "VỀ TÍC CƠ"
- **Hiện tại:** Chữ "Về Tíc Cơ" đang để `self-start`, căn lề trái, và không in hoa.
- **Cách fix:** Đổi sang chữ in hoa (`uppercase`), thêm class `text-right` và ngắt thành 3 dòng.

## 3. Hero Section - Lỗi vị trí Bọng Tím (Purple Bubbles)
- **Cách fix:** Sau khi sửa Grid, chuyển Bubble sang bám theo từng cụm text bằng `relative` / `absolute` cho chính xác.

## 4. Footer Banner - "Tíc Cơ hân hoan chào bạn!"
- **Hiện tại:** `md:grid-cols-3` cho 4 item, item 4 bị rớt dòng.
- **Cách fix:** Đổi thành `md:grid-cols-4`. Chữ `TÍC CƠ HÂN HOAN CHÀO BẠN!` viết hoa và xuống dòng làm 3 dòng.
