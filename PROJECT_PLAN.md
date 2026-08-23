# KẾ HOẠCH PHÁT TRIỂN DỰ ÁN TICCO.STUDIO

## 1. Phân công vai trò (AI Workflow)
- **AGY (Tech Lead / Project Manager):** Chỉ định hướng Plan, không can thiệp sâu vào tech. Đảm bảo đúng định hướng: Free/rẻ nhất, đủ dùng, dễ chạy.
- **Claude (Tech / Developer):** Toàn quyền quyết định tech stack chi tiết, triển khai code, config, setup. Bám sát 100% (Pixel-perfect) theo Figma.
- **AGY (Tech Lead / Project Manager):** Lập kế hoạch, theo dõi tiến độ, review code do Claude viết, đưa ra định hướng kiến trúc và giải pháp (như cổng thanh toán, tối ưu hiệu năng). Tự liên tục update và review lại plan này.
- **Claude (Frontend / Fullstack Developer):** Thực thi code trực tiếp, thao tác với Terminal, xử lý CSS (Tailwind), React components, logic kết nối API và Git.

## 2. Giải pháp Cổng thanh toán (Free 100%)
Để tối ưu chi phí (0 đồng phí giao dịch) và dễ tích hợp tại thị trường Việt Nam, giải pháp ưu việt nhất hiện nay là **Chuyển khoản VietQR tự động qua PayOS** hoặc **VietQR.io**.
- **Cách hoạt động:** Khi người dùng thanh toán, web sinh mã QR động. Khách hàng dùng App ngân hàng quét. PayOS nhận diện tiền và bắn Webhook về web để tự động xác nhận đơn hàng trong 2-3 giây.
- **Ưu điểm:** Miễn phí giao dịch (vì bản chất là chuyển khoản 24/7). Không yêu cầu giấy phép đăng ký kinh doanh. Khách không cần nhập tay số tiền.

## 3. Lộ trình Triển khai (Linh hoạt cập nhật)

### Phase 1: Setup Base & Core Layout (Đang giao cho Claude)
- Đọc file ảnh thiết kế (	rang-chu.png trong _figma_exports) để bóc tách Color Palette, Typography.
- Setup 	ailwind.config.ts, globals.css.
- Dựng UI Component dùng chung: Header (Navbar), Footer.

### Phase 2: Phát triển các Trang (Pages)
- Trang chủ (	rang-chu.png).
- Danh sách sản phẩm (san-pham.png) và Chi tiết (	ung-san-pham.png).
- Khám phá & Về Ticco (kham-pha.png, e-Tic-Co.png).

### Phase 3: Xử lý Logic & Thanh toán
- Quản lý State giỏ hàng (Cart). ✅ Xong (React Context + localStorage).
- Đấu nối logic thanh toán PayOS. ⏳ Chưa bắt đầu — cần API key PayOS thật + Figma chưa có
  design cho Cart/Checkout (Page 2 trong file Figma vẫn trống).

### Phase 4: Pixel-fidelity với Figma thật (2026-08-23)
- Dựng tool đọc Figma trực tiếp qua REST API (`scripts/figma-fetch.mjs` +
  `figma-summarize.mjs`) thay vì đối chiếu ảnh export tĩnh — nhanh và chính xác hơn.
- Rà soát 2 vòng (JSON toạ độ + so trực quan ảnh export full-res) toàn bộ 6 trang, sửa
  hàng loạt lỗi lệch Figma thật (Hero, BrandSection, mascot-Dan composition, ảnh sản phẩm,
  bong bóng trang trí `/ve-tic-co`...). Chi tiết đầy đủ xem
  `D:\agent\checkpoints\2026-08-23T1700_claude_ticco-studio-figma-fidelity-qa-admin.md`.
- Catalog sản phẩm chuyển từ data bịa sang **28 sản phẩm thật** lấy từ Google Sheet checklist
  của team (không phải Figma — Figma nhiều phần chỉ là placeholder lorem).

### Phase 5: QA đo được + Admin panel
- `qa/testcases.md` + `scripts/qa-check.mjs`: bộ test Functional/SEO/GEO/Figma-match, chạy lại
  được sau mỗi lần fix, in ra % pass (hiện tại 100% phần tự động hoá).
- Admin panel (`/admin`, Supabase Auth + CRUD sản phẩm): **code đã xong, chưa hoạt động** — cần
  dodoh tạo Supabase project (free) và cung cấp 3 key (xem `.env.local.example`).
- Deploy: production tại https://ticcostudio.vercel.app, auto-deploy từ GitHub mỗi lần push.

