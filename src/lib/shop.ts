// Storefront listing rules from the Figma "Thiết kế DEMO" page (frames tat-ca-san-pham-trang-1..3 and the
// category frames). Pure data + functions, no imports, so scripts/check-demo-shop.mjs can run it under Node.

export const PER_PAGE = 12;

// Tab order = left→right in the Figma "danh-muc" row. `category` = Product.category value.
export const SHOP_CATEGORIES = [
  { slug: "tat-ca", label: "Tất cả sản phẩm", category: null },
  { slug: "van-phong-pham", label: "Văn phòng phẩm", category: "Văn phòng phẩm" },
  { slug: "in-an", label: "In ấn", category: "In ấn" },
  { slug: "tui-xach", label: "Túi xách", category: "Túi xách" },
  { slug: "thoi-trang", label: "Thời trang", category: "Thời trang" },
  { slug: "phu-kien-doi-song", label: "Phụ kiện đời sống", category: "Phụ kiện đời sống" },
] as const;
export type ShopSlug = (typeof SHOP_CATEGORIES)[number]["slug"];

const STICKERS = [
  "sticker-01-doi-de-ot",
  "sticker-02-nguoi-viet-yeu-nuoc",
  "sticker-03-hay-ho",
  "sticker-04-ca-hoa",
  "sticker-05-ban-lam-duoc-ma",
  "sticker-06-doi-moi",
  "sticker-07-dan-noi",
  "sticker-08-dan-lao-dong",
  "sticker-09-chuc-nhau-that-su",
];

// Exact card order of each Figma listing frame (pages concatenated). Each tab has its own order in the design.
const ORDER: Record<ShopSlug, string[]> = {
  "tat-ca": [
    "tui-vung-vang", "khan-bandana-van-su-tuy-minh", "gile-yen-tam", "tui-song-cu-khoi",
    "tote-xoi-loi-voi-doi", "bst-dan-sinh-ton", "lot-coc-ra-khoi", "con-dau-go-han-hoan",
    "box-set-tim-kiem-dieu-ky-dieu", "so-can-ban", "bst-postcard-triet-ly-song-dan", STICKERS[0],
    ...STICKERS.slice(1),
    "postcard-nguoi-viet-yeu-nuoc", "postcard-gai-dep", "postcard-ban-hoi-toi-y-nghia-cuoc-doi", "tui-ngu-du",
    "tui-thuyen", "li-xi-2026", "than-chu-nam-moi-2026", "so-nghi-di",
    "ao-phong-thoai-mai", "mu-tai-beo-ha-ha", "mu-luoi-trai-cha-sao", "keychain-nguoi-viet-yeu-nuoc",
    "keychain-uoc-duoc-lam-con-cho", "keychain-khong-so-cuoc-doi",
  ],
  "van-phong-pham": ["so-can-ban", "so-nghi-di", "con-dau-go-han-hoan"],
  "in-an": [
    ...STICKERS,
    "bst-postcard-triet-ly-song-dan", "box-set-tim-kiem-dieu-ky-dieu", "postcard-nguoi-viet-yeu-nuoc",
    "postcard-gai-dep", "postcard-ban-hoi-toi-y-nghia-cuoc-doi", "li-xi-2026", "than-chu-nam-moi-2026",
  ],
  "tui-xach": ["tui-song-cu-khoi", "tui-vung-vang", "tote-xoi-loi-voi-doi", "tui-ngu-du", "tui-thuyen"],
  "thoi-trang": ["gile-yen-tam", "ao-phong-thoai-mai", "khan-bandana-van-su-tuy-minh", "mu-tai-beo-ha-ha", "mu-luoi-trai-cha-sao"],
  "phu-kien-doi-song": ["bst-dan-sinh-ton", "lot-coc-ra-khoi", "keychain-nguoi-viet-yeu-nuoc", "keychain-uoc-duoc-lam-con-cho", "keychain-khong-so-cuoc-doi"],
};

// Catalog products Figma doesn't list: single items of a collection (reached via its option buttons)
// and the pre-DEMO hat bundle (URL kept alive). Products added later from /admin are listed after the Figma ones.
const UNLISTED = new Set([
  "so-trong", "so-nhat-ky", "so-lao-dong",
  "dan-sinh-ton-01", "dan-sinh-ton-02", "dan-sinh-ton-03",
  "bst-dau-doi-mu-chan-vao-doi",
]);

// Option buttons ("lua-chon") that switch between sibling products instead of picking a cart variant.
export const VARIANT_LINKS: Record<string, string>[] = [
  { "Sổ trống": "so-trong", "Sổ nhật ký": "so-nhat-ky", "Sổ lao động": "so-lao-dong", "Bộ 3 sổ": "so-can-ban" },
  {
    "01 - Đần cứ bình tình": "dan-sinh-ton-01",
    "02 - Đần nuốt nước mắt vào trong": "dan-sinh-ton-02",
    "03 - Đần vắt cực khô, sống cực căng": "dan-sinh-ton-03",
    "BST 3 box": "bst-dan-sinh-ton",
  },
  { "Mũ tai bèo Ha Ha": "mu-tai-beo-ha-ha", "Mũ lưỡi trai Chả Sao": "mu-luoi-trai-cha-sao" },
];
// In-page options that each have their own photo: option label -> gallery index shown in the main image slot.
// ponytail: indexes into the product's gallery order (image, then thumbnails); re-check if /admin reorders photos.
export const VARIANT_IMAGES: Record<string, Record<string, number>> = {
  "bst-postcard-triet-ly-song-dan": {
    "BST 5 tấm": 0,
    "Lối sống 3 không": 1,
    "Cười vì điều nhỏ": 2,
    "Hạnh phúc là tự thân": 3,
    "Lao động": 4,
    "Đời nhỏ tí": 5,
  },
  "khan-bandana-van-su-tuy-minh": { "Xanh lá": 0, "Tím": 1 },
  "lot-coc-ra-khoi": { "Hoạ tiết sọc": 0, "Xanh rêu": 2 },
};
// Options priced differently from the product's base price (single postcard vs the 5-card set).
// ponytail: hardcoded like VARIANT_IMAGES; move into the products table if /admin needs to edit it.
const VARIANT_PRICES: Record<string, Record<string, number>> = {
  "bst-postcard-triet-ly-song-dan": {
    "BST 5 tấm": 120_000,
    "Lối sống 3 không": 30_000,
    "Cười vì điều nhỏ": 30_000,
    "Hạnh phúc là tự thân": 30_000,
    "Lao động": 30_000,
    "Đời nhỏ tí": 30_000,
  },
};
/** Price charged for one unit of `variant` — used by the cart (display) and /api/orders (the real charge). */
export const priceFor = (p: { id: string; priceFrom: number }, variant: string) => VARIANT_PRICES[p.id]?.[variant] ?? p.priceFrom;

// A combo whose options open the standalone products but which isn't one of the options itself.
const BUNDLE_LINKS: Record<string, Record<string, string>> = {
  "bst-dau-doi-mu-chan-vao-doi": { 'Mũ tai bèo "Ha Ha"': "mu-tai-beo-ha-ha", 'Mũ lưỡi trai "Chả Sao"': "mu-luoi-trai-cha-sao" },
};
export const variantLinksFor = (id: string) => VARIANT_LINKS.find((g) => Object.values(g).includes(id)) ?? BUNDLE_LINKS[id];

export const shopCategory = (slug: string | undefined) => SHOP_CATEGORIES.find((c) => c.slug === slug) ?? SHOP_CATEGORIES[0];
export const slugForCategory = (category: string) => SHOP_CATEGORIES.find((c) => c.category === category)?.slug ?? "tat-ca";

type Listable = { id: string; category: string };

/** Products of one tab in display order: the Figma order first, then anything else (new /admin products) in catalog order. */
export function shopListing<T extends Listable>(products: T[], slug: string): T[] {
  const tab = shopCategory(slug);
  const inTab = products.filter((p) => !UNLISTED.has(p.id) && (tab.category === null || p.category === tab.category));
  const rank = (id: string) => {
    const i = ORDER[tab.slug].indexOf(id);
    return i < 0 ? Infinity : i;
  };
  // Array.prototype.sort is stable, so unranked products keep their incoming (sort_order) order.
  return [...inTab].sort((a, b) => rank(a.id) - rank(b.id));
}

export function paginate<T>(items: T[], page: number) {
  const pages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pages);
  return { items: items.slice((current - 1) * PER_PAGE, current * PER_PAGE), page: current, pages };
}

/** "CÓ THỂ BẠN THÍCH": same-category products first, topped up from the full listing. */
export function suggestionsFor<T extends Listable>(products: T[], product: Listable, count = 4): T[] {
  const pool = [...shopListing(products, slugForCategory(product.category)), ...shopListing(products, "tat-ca")];
  return pool.filter((p, i) => p.id !== product.id && pool.findIndex((q) => q.id === p.id) === i).slice(0, count);
}

/** A stored Figma image fill: imageTransform `m` + box aspect `ar`, or the scaleMode's object-fit. Render with fillStyle() from ./figmaCrop. */
export type Crop = { src: string; m?: readonly [readonly [number, number, number], readonly [number, number, number]]; ar?: number; fit?: string };
