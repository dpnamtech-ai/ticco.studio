export const brand = {
  name: "Ticco-Vibe",
  slogan: "Quà nhỏ,\ncảm xúc lớn.",
  tagline: "Những món nhỏ xíu, chứa cả một trời ý nghĩa.",
  instagram: "https://www.instagram.com/ticco.vibe",
  email: "hello@ticcovibe.vn",
  address: "Nhận ký gửi tại TP. Hồ Chí Minh",
  mission:
    "Ticco-Vibe tin rằng mỗi món quà nhỏ đều có thể mang theo một câu chuyện. Chúng mình làm ra những thứ đơn giản, dễ thương — để bạn có thể nói 'tao nghĩ đến mày' mà không cần dịp gì đặc biệt cả.",
};

export const navLinks = [
  { label: "Về chúng tôi", href: "#brand" },
  { label: "Sản phẩm", href: "#products" },
  { label: "Mascot Đần", href: "#dan" },
  { label: "Liên hệ", href: "#contact" },
];

export const productLines = [
  {
    id: "sticker",
    name: "Sticker Pack",
    tagline: "Dán lên mọi thứ, kể câu chuyện của bạn.",
    description:
      "Mỗi sheet sticker là một bộ nhân vật nhỏ — có thể là Đần đang ngủ gật, hay một câu chuyện ngắn về sáng thứ Hai.",
    collection: "BST Everyday Mood",
    emoji: "🌀",
    color: "#C5DFF8",
    priceFrom: 25000,
  },
  {
    id: "keychain",
    name: "Móc Khoá",
    tagline: "Lủng lẳng theo bạn mọi nơi.",
    description:
      "Móc khoá acrylic cứng cáp, in hình Đần và các nhân vật — nhỏ gọn nhưng đủ làm người ta hỏi 'ôi mua ở đâu vậy?'",
    collection: "BST Buddy Series",
    emoji: "🔑",
    color: "#F7C5A0",
    priceFrom: 45000,
  },
  {
    id: "tote",
    name: "Túi Tote",
    tagline: "Đựng được cả vũ trụ (và laptop nữa).",
    description:
      "Canvas dày, in lụa — không phai màu, không phá hình. Mang đi học, đi cafe, đi chợ đều ổn.",
    collection: "BST Carry Me",
    emoji: "🛍️",
    color: "#B8D4B0",
    priceFrom: 120000,
  },
  {
    id: "print",
    name: "Art Print",
    tagline: "Treo lên tường, bắt đầu ngày đẹp hơn.",
    description:
      "In offset khổ A4/A3, giấy định lượng cao — mỗi tháng ra một thiết kế mới theo chủ đề mùa.",
    collection: "BST Seasonal",
    emoji: "🖼️",
    color: "#F5A623",
    priceFrom: 80000,
  },
];

export const collections = [
  {
    id: "everyday-mood",
    name: "Everyday Mood",
    description: "Cho những ngày bình thường cũng cần một chút màu sắc.",
    season: "2024",
    items: 12,
    color: "#C5DFF8",
  },
  {
    id: "buddy-series",
    name: "Buddy Series",
    description: "Đần và những người bạn nhỏ — mỗi nhân vật một tính cách.",
    season: "2024",
    items: 8,
    color: "#F7C5A0",
  },
  {
    id: "seasonal",
    name: "Seasonal Drop",
    description: "Ra theo mùa, mỗi drop giới hạn — lỡ hết thì thôi.",
    season: "Hè 2025",
    items: 6,
    color: "#B8D4B0",
  },
];

export const giftGuides = [
  {
    occasion: "Sinh nhật",
    emoji: "🎂",
    tagline: "Không cần đắt, chỉ cần đúng ý.",
    picks: ["Sticker Pack", "Móc Khoá", "Combo tự chọn"],
    color: "#F7C5A0",
    seoTag: "quà tặng sinh nhật",
  },
  {
    occasion: "Valentine",
    emoji: "🌸",
    tagline: "Nhỏ thôi, nhưng ngọt lắm.",
    picks: ["Art Print", "Combo sticker + keychain"],
    color: "#F5A623",
    seoTag: "quà valentine ý nghĩa",
  },
  {
    occasion: "Quà đồng nghiệp",
    emoji: "☕",
    tagline: "Vừa dễ thương, vừa không awkward.",
    picks: ["Sticker Pack", "Túi Tote nhỏ"],
    color: "#C5DFF8",
    seoTag: "quà tặng đồng nghiệp",
  },
  {
    occasion: "Không cần dịp",
    emoji: "✨",
    tagline: "Vì 'tao nghĩ đến mày' không cần lý do.",
    picks: ["Bất kỳ thứ gì Đần xuất hiện"],
    color: "#B8D4B0",
    seoTag: "quà nhỏ dễ thương",
  },
];

export const ugcPhotos = [
  { id: 1, caption: "@user1 • sticker trên laptop 💻", color: "#C5DFF8" },
  { id: 2, caption: "@user2 • mang túi đi cafe ☕", color: "#F7C5A0" },
  { id: 3, caption: "@user3 • móc khoá mới 🔑", color: "#B8D4B0" },
  { id: 4, caption: "@user4 • print treo phòng trọ 🖼️", color: "#F5A623" },
  { id: 5, caption: "@user5 • combo quà sinh nhật 🎂", color: "#C5DFF8" },
  { id: 6, caption: "@user6 • sticker bình nước 💧", color: "#F7C5A0" },
];
