// Seller info + policy pages required for a Vietnamese e-commerce site (ND 52/2013, amended ND 85/2021).
// DRAFT: anything in [square brackets] is a placeholder the client must fill in — it renders highlighted
// (see <Fill>) so gaps are obvious on the live preview. Source text: docs/footer-phap-ly-mau.md.
// Filling it in = replace the bracketed text; nothing else needs to change.

export const seller = {
  name: "[Tên hộ kinh doanh / công ty — VD: Hộ kinh doanh Tíc Cơ Studios]",
  license: "[số GCN ĐKKD] — cấp ngày [../../....] tại [cơ quan cấp]",
  taxId: "[mã số thuế]",
  representative: "[họ tên người đại diện]",
  address: "[số nhà, đường, phường/xã, tỉnh/thành]",
  phone: "[số điện thoại / Zalo]",
  email: "ticcoo.studio@gmail.com",
  hours: "[9:00–18:00, Thứ 2–Thứ 7]",
  /** Set to the online.gov.vn link once the site is notified to Bộ Công Thương; the badge shows then. */
  bctUrl: "" as string,
};

export type Policy = { slug: string; title: string; blocks: string[] };

// Each block: a paragraph, or a list when it starts with "- " (one item per line).
export const policies: Policy[] = [
  {
    slug: "thong-tin-nguoi-ban",
    title: "Thông tin người bán",
    blocks: [
      `- Tên: ${seller.name}
- Giấy CN đăng ký kinh doanh số ${seller.license}
- Mã số thuế: ${seller.taxId}
- Người đại diện: ${seller.representative}
- Địa chỉ: ${seller.address}
- Hotline/Zalo: ${seller.phone} · Email: ${seller.email}
- Giờ làm việc: ${seller.hours}`,
    ],
  },
  {
    slug: "thanh-toan",
    title: "Chính sách thanh toán",
    blocks: [
      "Tíc Cơ nhận thanh toán bằng chuyển khoản ngân hàng.",
      "- Sau khi đặt hàng, bạn nhận mã đơn (VD: TC1AB23CD4) cùng thông tin tài khoản và mã QR.\n- Chuyển đúng số tiền và ghi nội dung chuyển khoản = mã đơn.\n- Tíc Cơ đối chiếu và liên hệ xác nhận trong vòng [24 giờ làm việc].\n- Đơn chưa thanh toán sau [48 giờ] sẽ được huỷ.",
      "Tài khoản nhận: [Ngân hàng] · STK [...] · Chủ tài khoản [...]",
      "Tíc Cơ không bao giờ yêu cầu bạn cung cấp mật khẩu, mã OTP hay thông tin thẻ.",
    ],
  },
  {
    slug: "van-chuyen",
    title: "Chính sách vận chuyển",
    blocks: [
      "- Giao toàn quốc qua [GHN / GHTK / Viettel Post].\n- Phí ship 30.000đ mỗi đơn; miễn phí cho đơn từ 500.000đ.\n- Thời gian: nội thành [Hà Nội] [1–2] ngày; tỉnh khác [3–5] ngày làm việc, tính từ khi xác nhận thanh toán.\n- Tíc Cơ gửi mã vận đơn qua [SĐT/Zalo/email] để bạn theo dõi.",
    ],
  },
  {
    slug: "doi-tra",
    title: "Chính sách đổi trả",
    blocks: [
      "- Đổi/trả trong [7] ngày kể từ khi nhận hàng nếu: sản phẩm lỗi do sản xuất, giao sai mẫu/số lượng, hư hỏng do vận chuyển.\n- Điều kiện: còn nguyên tem/bao bì, chưa qua sử dụng; có video mở hộp (khuyến khích) hoặc ảnh chụp lỗi.\n- Tíc Cơ chịu phí ship đổi trả với lỗi từ phía Tíc Cơ.\n- Không áp dụng đổi trả: [sản phẩm giảm giá / in theo yêu cầu].\n- Hoàn tiền (nếu có) qua chuyển khoản trong [3–5] ngày làm việc sau khi Tíc Cơ nhận lại hàng.",
      "Liên hệ: [SĐT/Zalo] hoặc ticcoo.studio@gmail.com, kèm mã đơn.",
    ],
  },
  {
    slug: "bao-mat",
    title: "Chính sách bảo mật thông tin",
    blocks: [
      "- Thu thập: họ tên, số điện thoại, email (không bắt buộc), địa chỉ giao hàng, ghi chú đơn.\n- Mục đích: xử lý và giao đơn, liên hệ xác nhận, chăm sóc sau bán.\n- Chia sẻ: chỉ với đơn vị vận chuyển (tên, SĐT, địa chỉ) để giao hàng. Không bán hay cho thuê dữ liệu.\n- Lưu trữ: [trong thời gian cần cho giao dịch và nghĩa vụ kế toán, tối đa .. năm], trên hệ thống có kiểm soát truy cập.\n- Quyền của bạn: xem, sửa hoặc yêu cầu xoá thông tin — liên hệ ticcoo.studio@gmail.com.",
      "Web không lưu thông tin thẻ hay tài khoản ngân hàng của bạn.",
    ],
  },
  {
    slug: "dieu-khoan",
    title: "Điều khoản mua hàng",
    blocks: [
      "- Giá niêm yết bằng VNĐ, [đã/chưa] gồm VAT; phí ship hiển thị ở bước thanh toán.\n- Đơn hàng được xác nhận khi Tíc Cơ nhận đủ tiền. Nếu hết hàng sau khi bạn đã thanh toán, Tíc Cơ liên hệ để đổi mẫu hoặc hoàn tiền 100%.\n- Hình ảnh sản phẩm có thể chênh lệch màu nhẹ do màn hình.",
      "Giải quyết khiếu nại: gửi về ticcoo.studio@gmail.com hoặc [SĐT] kèm mã đơn; Tíc Cơ phản hồi trong [48 giờ]. Nếu không thương lượng được, tranh chấp được giải quyết theo pháp luật Việt Nam.",
    ],
  },
];
