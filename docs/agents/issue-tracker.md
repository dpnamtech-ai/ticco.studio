# Issue Tracker Skill

## Mục đích

Skill này dùng để chuyển yêu cầu từ người dùng hoặc QA thành các issue rõ ràng, có tiêu chí chấp nhận, hạn chế, và kế hoạch kiểm thử thật trước khi triển khai. Mục tiêu là đảm bảo mọi task trong repo này đi theo cùng một mô hình làm việc: hiểu vấn đề, tách công việc, fix đúng nguyên nhân, verify bằng bằng chứng.

## Nhiệm vụ chính

- Chuyển requirement thành issue hoặc task có cấu trúc rõ.
- Phân biệt bug, feature, refactor, và nội dung giả định cần xác nhận.
- Khuyến khích viết acceptance criteria và verification steps ngay từ đầu.
- Không triển khai ngay khi chưa có scope rõ ràng hoặc chưa xác định root cause.
- Luôn kết thúc bằng evidence từ build/test/QA thay vì “có vẻ ổn”.

## Template issue chuẩn

### 1) Title
Ngắn gọn, mô tả đúng sự việc.

Ví dụ:
- Fix cart drawer quantity sync on reload
- Add missing product image assets for catalog
- Remove dead project links from landing page

### 2) Problem
Mô tả ngắn gọn: vấn đề đang xảy ra là gì, ở đâu, tác động đến người dùng hoặc hệ thống.

### 3) Context
Ghi chú ngắn:
- Route/page liên quan
- File/component liên quan
- Môi trường: dev/production
- Dữ liệu thực tế hoặc quy ước trong repo

### 4) Acceptance criteria
Liệt kê dưới dạng checklists rõ ràng:
- [ ] Điều gì xảy ra sau khi fix
- [ ] Điều gì không được phá vỡ
- [ ] Mức độ tương thích với thiết kế/QA

### 5) Constraints
Ghi rõ ràng các giới hạn:
- Không dùng placeholder nếu đã có dữ liệu thật
- Không sửa style không liên quan
- Duy trì compatibility với Next.js/App Router
- Cần check SEO/JSON-LD nếu là page public

### 6) Risks / unknowns
Liệt kê các điểm chưa chắc chắn để tránh fix mù:
- Figma mismatch
- Dữ liệu sản phẩm chưa hoàn chỉnh
- API key/supabase chưa có
- UI issue chỉ xuất hiện ở production

### 7) Verification
Mỗi issue phải có ít nhất 1 bước verify bằng chứng:
- `npm run build`
- `npx tsc --noEmit`
- QA script nếu có
- Browser check hoặc route check
- Mỗi fix phải có output cụ thể

### 8) Definition of done
Issue được coi là xong khi:
- Root cause được xác định rõ
- Fix được triển khai đúng nơi
- Accept criteria đã đạt
- Verification đã chạy thành công
- Không có regression đáng kể tại phạm vi liên quan

## Quy tắc làm việc trong repo này

### 1) Ưu tiên chứng cứ
Trước khi trả lời “đã fix”, cần chạy lệnh kiểm tra có liên quan. Với UI/Next.js repo này, các bước kiểm tra thường là:
- `npx tsc --noEmit`
- `npm run build`
- `node scripts/qa-check.mjs` nếu cần kiểm tra public routes

### 2) Không đoán mò
Nếu bug chỉ thấy ở production nhưng không lặp lại ở dev, không tự suy diễn là đã fix. Cần xác minh root cause bằng code/path/routing/assets/data flow.

### 3) Không thêm dữ liệu giả
Không tạo placeholder image, lorem text, hoặc sản phẩm giả nếu repo đang có dữ liệu thực hoặc design xác nhận. Nếu thiếu thông tin, cần báo rõ ràng và yêu cầu dữ liệu thật thay vì đưa ra giá trị ngẫu nhiên.

### 4) Tối ưu theo mục tiêu product
Repo này có các tiêu chí riêng:
- Pixel fidelity so với Figma
- Đúng route và nội dung SEO/GEO
- Cart và pages phải hoạt động mượt
- Không làm sai về design, text, hay metadata

### 5) Sắp xếp theo mức độ ưu tiên
Phân loại issue theo kiểu:
- P0: lỗi nghiêm trọng ảnh hưởng hoạt động hoặc chất lượng release
- P1: lỗi chức năng quan trọng nhưng không phá vỡ toàn bộ
- P2: cải tiến/UX design
- P3: cleanup hoặc refactor không bắt buộc

## Quy trình làm việc chuẩn

1. Đọc yêu cầu và xác định đúng loại issue.
2. Kiểm tra context có liên quan trong repo.
3. Viết issue template ngắn gọn.
4. Tách sub-task nếu cần.
5. Khởi tạo fix phù hợp với root cause.
6. Chạy verification phù hợp.
7. Ghi lại evidence và kết luận rõ: fix / blocked / cần input thêm.

## Ví dụ issue thực tế

### Title
Fix dead project links on /kham-pha

### Problem
Các project cards đang render button "Đọc thêm về dự án" nhưng articleHref là "#" hoặc route chưa tồn tại. Điều này tạo link chết trên trang khám phá.

### Acceptance criteria
- [ ] Không còn button dead-link trên /kham-pha khi route không tồn tại
- [ ] Khi có article thật, link render đúng route
- [ ] Không phá vỡ layout grid hoặc hover state

### Verification
- [ ] Run product page check
- [ ] Confirm link hidden or valid route
- [ ] Run build/type check

## Definition of done
Issue chỉ đóng khi đã có:
- Mô tả rõ vấn đề
- Root cause được xác minh
- Fix + verification output
- Không có regression trong phạm vi liên quan

## Prompt mẫu cho AI / agent

> Hãy xử lý yêu cầu này như issue trong repo ticco.studio. Đầu tiên xác định root cause, sau đó tạo issue template ngắn gọn với problem, acceptance criteria, constraints, verification, và chỉ triển khai khi scope đã rõ. Luôn dùng bằng chứng từ build/test trước khi kết luận fix thành công.
