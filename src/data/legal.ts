import text from "./policy-text.json";

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

// Policy wording = the client's sheet (tab "Chính sách", 08/10), copied verbatim into policy-text.json:
// a block ending in ":" is a section heading, "- " lines are a list, anything else a paragraph.

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
  { slug: "thanh-toan", title: "Chính sách thanh toán", blocks: text["thanh-toan"] },
  { slug: "van-chuyen", title: "Chính sách vận chuyển", blocks: text["van-chuyen"] },
  { slug: "doi-tra", title: "Chính sách đổi trả", blocks: text["doi-tra"] },
  { slug: "bao-mat", title: "Chính sách bảo mật thông tin", blocks: text["bao-mat"] },
  { slug: "dieu-khoan", title: "Điều khoản mua hàng", blocks: text["dieu-khoan"] },
];
