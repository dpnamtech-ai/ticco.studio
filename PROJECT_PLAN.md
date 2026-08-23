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
- Quản lý State giỏ hàng (Cart).
- Đấu nối logic thanh toán PayOS.

