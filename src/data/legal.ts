import text from "./policy-text.json";

// Policy pages (ND 52/2013, amended ND 85/2021). No seller-info page: the client asked for it to go (30/09, again 09/10).
export type Policy = { slug: string; title: string; blocks: string[] };

// Policy wording = the client's sheet (tab "Chính sách", 08/10), copied verbatim into policy-text.json:
// a block ending in ":" is a section heading, "- " lines are a list, anything else a paragraph.

// Each block: a paragraph, or a list when it starts with "- " (one item per line).
export const policies: Policy[] = [
  { slug: "thanh-toan", title: "Chính sách thanh toán", blocks: text["thanh-toan"] },
  { slug: "van-chuyen", title: "Chính sách vận chuyển", blocks: text["van-chuyen"] },
  { slug: "doi-tra", title: "Chính sách đổi trả", blocks: text["doi-tra"] },
  { slug: "bao-mat", title: "Chính sách bảo mật thông tin", blocks: text["bao-mat"] },
  { slug: "dieu-khoan", title: "Điều khoản mua hàng", blocks: text["dieu-khoan"] },
];
