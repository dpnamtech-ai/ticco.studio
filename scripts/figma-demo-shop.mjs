// Builds the shop catalog from the Figma "Thiết kế DEMO" page cache (.figma-cache/demo/san-pham-*.json + listing frames).
// Writes:
//   - the productLines block of src/data/content.ts (spliced in place, rest of the file untouched)
//   - src/data/shopFigma.json   display-only data: exact Figma title/price copy + image crops per product
//   - supabase/seed-demo-products.sql   idempotent upsert of the same catalog
// Usage: node scripts/figma-demo-shop.mjs   (then: node scripts/check-demo-shop.mjs)
import fs from "node:fs";
import path from "node:path";
import { productLines as current } from "../src/data/content.ts";

const root = path.resolve(import.meta.dirname, "..");
const demo = (n) => JSON.parse(fs.readFileSync(path.join(root, ".figma-cache/demo", `${n}.json`), "utf8"));

// Figma detail frame → product id. Existing ids are kept so old URLs keep working.
export const FRAME_TO_ID = {
  "san-pham-set-sticker-01": "sticker-01-doi-de-ot",
  "san-pham-set-sticker-02": "sticker-02-nguoi-viet-yeu-nuoc",
  "san-pham-set-sticker-03": "sticker-03-hay-ho",
  "san-pham-set-sticker-04": "sticker-04-ca-hoa",
  "san-pham-set-sticker-05": "sticker-05-ban-lam-duoc-ma",
  "san-pham-set-sticker-06": "sticker-06-doi-moi",
  "san-pham-set-sticker-07": "sticker-07-dan-noi",
  "san-pham-set-sticker-08": "sticker-08-dan-lao-dong",
  "san-pham-set-sticker-09": "sticker-09-chuc-nhau-that-su",
  "san-pham-postcard-nguoi-Viet": "postcard-nguoi-viet-yeu-nuoc",
  "san-pham-postcard-gai-dep": "postcard-gai-dep",
  "san-pham-postcard-ban-hoi-doi": "postcard-ban-hoi-toi-y-nghia-cuoc-doi",
  "san-pham-postcard-triet-ly-song-Dan": "bst-postcard-triet-ly-song-dan",
  "san-pham-boxset-tim-kiem-dieu-ky-dieu": "box-set-tim-kiem-dieu-ky-dieu",
  "san-pham-li-xi-2026": "li-xi-2026",
  "san-pham-than-chu-nam-moi-2026": "than-chu-nam-moi-2026",
  "san-pham-bst-so-can-ban": "so-can-ban",
  "san-pham-so-trong": "so-trong",
  "san-pham-so-nhat-ky": "so-nhat-ky",
  "san-pham-so-lao-dong": "so-lao-dong",
  "san-pham-so-nghi-di": "so-nghi-di",
  "san-pham-con-dau-go-han-hoan": "con-dau-go-han-hoan",
  "san-pham-bst-dan-sinh-ton": "bst-dan-sinh-ton",
  "san-pham-dan-sinh-ton-01": "dan-sinh-ton-01",
  "san-pham-dan-sinh-ton-02": "dan-sinh-ton-02",
  "san-pham-dan-sinh-ton-03": "dan-sinh-ton-03",
  "san-pham-lot-coc-ra-khoi": "lot-coc-ra-khoi",
  "san-pham-keychain-nguoi-Viet-yeu-nuoc": "keychain-nguoi-viet-yeu-nuoc",
  "san-pham-keychain-uoc-duoc-lam-con-cho": "keychain-uoc-duoc-lam-con-cho",
  "san-pham-keychain-khong-so-cuoc-doi": "keychain-khong-so-cuoc-doi",
  "san-pham-mu-ha-ha": "mu-tai-beo-ha-ha",
  "san-pham-mu-cha-sao": "mu-luoi-trai-cha-sao",
  "san-pham-gile-yen-tam": "gile-yen-tam",
  "san-pham-ao-thoai-mai": "ao-phong-thoai-mai",
  "san-pham-bandana-van-su-tuy-minh": "khan-bandana-van-su-tuy-minh",
  "san-pham-tui-song-cu-khoi": "tui-song-cu-khoi",
  "san-pham-tui-vung-vang": "tui-vung-vang",
  "san-pham-tui-xoi-loi-voi-doi": "tote-xoi-loi-voi-doi",
  "san-pham-tui-ngu-gu": "tui-ngu-du",
  "san-pham-tui-thuyen": "tui-thuyen",
};
// Listing card group name → product id, where it isn't just the detail frame's slug.
export const CARD_TO_ID = {
  "dan-sinh-ton": "bst-dan-sinh-ton",
  "postcard-nguoi-viet-yeu-nuoc": "postcard-nguoi-viet-yeu-nuoc",
  "postcard-ban-hoi-toi-y-nghia-cuoc-doi": "postcard-ban-hoi-toi-y-nghia-cuoc-doi",
  "tui-ngu-du": "tui-ngu-du",
  "mu-tai-beo-ha-ha": "mu-tai-beo-ha-ha",
  "mu-luoi-trai-cha-sao": "mu-luoi-trai-cha-sao",
};
export const LISTING_FRAMES = {
  "tat-ca-san-pham-trang-1": ["tat-ca", 1],
  "tat-ca-san-pham-trang-2": ["tat-ca", 2],
  "tat-ca-san-pham-trang-3": ["tat-ca", 3],
  "van-phong-pham": ["van-phong-pham", 1],
  "in-an-trang-1": ["in-an", 1],
  "in-an-trang-2": ["in-an", 2],
  "tui-xach": ["tui-xach", 1],
  "thoi-trang": ["thoi-trang", 1],
  "phu-kien-doi-song": ["phu-kien-doi-song", 1],
};
const SLUG_TO_CATEGORY = {
  "van-phong-pham": "Văn phòng phẩm",
  "in-an": "In ấn",
  "tui-xach": "Túi xách",
  "thoi-trang": "Thời trang",
  "phu-kien-doi-song": "Phụ kiện đời sống",
};
// Products that only have a detail frame (reached through the lua-chon buttons, not listed).
const UNLISTED = {
  "so-trong": { name: "Sổ Trống", category: "Văn phòng phẩm" },
  "so-nhat-ky": { name: "Sổ Nhật Ký", category: "Văn phòng phẩm" },
  "so-lao-dong": { name: "Sổ Lao Động", category: "Văn phòng phẩm" },
  "dan-sinh-ton-01": { name: "Móc khoá 01: Đần Cứ Bình Tĩnh", category: "Phụ kiện đời sống" },
  "dan-sinh-ton-02": { name: "Móc khoá 02: Đần Nuốt Nước Mắt Vào Trong", category: "Phụ kiện đời sống" },
  "dan-sinh-ton-03": { name: "Móc khoá 03: Đần Vắt Cực Khô, Sống Cực Căng", category: "Phụ kiện đời sống" },
};
// The detail frame shows "30.000 VNĐ/ tấm\n120.000 VNĐ/BST 05 tấm"; the listing sells the 5-card set.
const PRICE_OVERRIDE = { "bst-postcard-triet-ly-song-dan": 120000 };
// Figma typed these 4 lines as one wrapped paragraph.
const SPECS_OVERRIDE = {
  "so-can-ban": ["Định lượng giấy ruột sổ: 80gsm", "Độ dày vừa phải, gọn nhẹ mang theo hàng ngày", "Số trang: 160 trang", "Kích thước: 12.6 x 17.8cm"],
};
const UNIT_FALLBACK = { "con-dau-go-han-hoan": "hộp", "mu-tai-beo-ha-ha": "chiếc", "mu-luoi-trai-cha-sao": "chiếc", "postcard-gai-dep": "set", "postcard-ban-hoi-toi-y-nghia-cuoc-doi": "set" };

const norm = (s) => s.replace(/\s+/g, " ").trim();
const r5 = (n) => Math.round(n * 1e5) / 1e5;

export function crop(layer) {
  const { src, scaleMode, imageTransform: m } = layer.image;
  // Rendered by fillStyle() in src/lib/figmaCrop.ts (inverse affine incl. skew, which needs the box aspect).
  if (scaleMode === "STRETCH" && m) return { src, m: m.map((row) => row.map(r5)), ar: r5(layer.w / layer.h) };
  return { src, fit: scaleMode === "STRETCH" ? "fill" : scaleMode === "FIT" ? "contain" : "cover" };
}

// Reading order: cluster rows (within 60px), then left→right.
export function readingOrder(items, tol = 60) {
  const sorted = [...items].sort((p, q) => p.y - q.y);
  const rows = [];
  for (const it of sorted) {
    const row = rows.find((r) => Math.abs(r[0].y - it.y) < tol);
    if (row) row.push(it);
    else rows.push([it]);
  }
  return rows.flatMap((r) => r.sort((p, q) => p.x - q.x));
}

const childrenOf = (layers, g) => layers.filter((l) => l.path === `${g.path} > ${g.name}`.replace(/^ > /, ""));

// A listing card = a GROUP whose direct children are 1 image + name + price text (+ optional sold-out group).
export function listingCards(frameName) {
  const { layers } = demo(frameName);
  const cards = [];
  for (const g of layers.filter((l) => l.type === "GROUP")) {
    const kids = childrenOf(layers, g);
    const img = kids.find((k) => k.image);
    const texts = kids.filter((k) => k.type === "TEXT");
    if (!img || texts.length !== 2) continue;
    const [nameL, priceL] = texts.sort((p, q) => p.y - q.y);
    const soldOut = kids.some((k) => k.name === "sold-out");
    const id = CARD_TO_ID[g.name.toLowerCase()] ?? FRAME_TO_ID[Object.keys(FRAME_TO_ID).find((f) => f.toLowerCase() === `san-pham-${g.name.toLowerCase()}`)];
    if (!id) throw new Error(`${frameName}: no product id for card group "${g.name}"`);
    cards.push({ id, x: g.x, y: g.y, name: norm(nameL.text), price: norm(priceL.text), soldOut, img });
  }
  return readingOrder(cards);
}

export function detailFrame(frameName) {
  const { layers } = demo(frameName);
  const imgs = layers.filter((l) => l.image && l.path.includes("anh-san-pham"));
  // Drop images fully covered by a later (higher z) image in the same slot.
  const visible = imgs.filter((l, i) => !imgs.slice(i + 1).some((o) => Math.abs(o.x - l.x) < 4 && Math.abs(o.y - l.y) < 4 && Math.abs(o.w - l.w) < 4 && Math.abs(o.h - l.h) < 4));
  const main = visible.reduce((p, q) => (q.w * q.h > p.w * p.h ? q : p));
  const gallery = [main, ...readingOrder(visible.filter((l) => l !== main))];
  const texts = layers.filter((l) => l.type === "TEXT" && !l.path.includes("footer") && !l.path.includes("goi-y") && l.y > 60 && l.y < 1240);
  const bySize = (s) => texts.filter((t) => t.font.size === s && !t.path.includes("lua-chon")).sort((p, q) => p.y - q.y);
  const title = bySize(40)[0].text.trimEnd();
  const price = bySize(34)[0].text.trimEnd();
  const [desc, specs] = bySize(14);
  const variants = readingOrder(texts.filter((t) => t.path.includes("lua-chon")), 15).map((t) => t.text.trim());
  const soldOut = layers.some((l) => l.name === "sold-out");
  const sizeLabel = texts.find((t) => t.path.includes("thong-so"));
  const sizeImg = layers.find((l) => l.image && l.path.includes("thong-so"));

  // Figma boxes (frame px) for the desktop layout: [x, y, w, h] (+ line height for texts).
  const box = (l) => [l.x, l.y, l.w, l.h];
  const tbox = (l) => [...box(l), l.font.lineHeight];
  const optTexts = readingOrder(texts.filter((t) => t.path.includes("lua-chon")), 15);
  const optRects = layers.filter((l) => l.type === "RECTANGLE" && /lua-chon$/.test(l.path));
  const inside = (t, r) => t.x + t.w / 2 >= r.x && t.x + t.w / 2 <= r.x + r.w && t.y + t.h / 2 >= r.y && t.y + t.h / 2 <= r.y + r.h;
  const optGroup = layers.find((l) => l.name === "lua-chon");
  const cta = layers.find((l) => l.path.includes("thong-tin") && (l.name === "sold-out" || l.name === "button-them-vao-gio-hang"));
  const line = layers.find((l) => l.type === "LINE" && l.path.includes("thong-tin"));
  const suggest = layers.find((l) => l.type === "TEXT" && l.text.startsWith("CÓ THỂ BẠN THÍCH"));
  const cards = layers.filter((l) => l.type === "RECTANGLE" && l.path.includes("goi-y"));
  const layout = {
    frameH: demo(frameName).h,
    gallery: gallery.map(box),
    title: tbox(bySize(40)[0]),
    price: tbox(bySize(34)[0]),
    desc: tbox(desc),
    ...(optGroup ? { options: { box: box(optGroup), buttons: optTexts.map((t) => [...box(optRects.find((r) => inside(t, r))), ...box(t)]) } } : {}), // each button: rect + its label box
    cta: box(cta),
    line: [cta.x, line.y, 452, 1], // sticker-09's divider has a bogus x/width in Figma; it sits under the button like the others
    specs: tbox(specs),
    ...(sizeImg ? { extraLabel: tbox(sizeLabel), extraImg: box(sizeImg) } : {}),
    suggest: [suggest.x, suggest.y, suggest.w, suggest.h, suggest.font.lineHeight],
    cards: [Math.min(...cards.map((c) => c.x)), Math.min(...cards.map((c) => c.y))],
  };
  return { title, price, desc: desc.text, specs: specs.text, variants, soldOut, gallery, layout, extra: sizeImg && { label: sizeLabel.text.trim(), w: sizeImg.w, h: sizeImg.h, ...crop(sizeImg) } };
}

// Must match layoutSig() in src/lib/shopFigma.ts.
export const layoutSig = (p) => JSON.stringify([p.name, p.priceFrom, p.description, p.variants ?? [], p.specs ?? [], p.note ?? null, !!p.soldOut, p.image ?? null, p.thumbnails ?? []]);

const cleanText = (s) => s.split("\n").map((l) => l.trimEnd()).join("\n").trim();
function splitSpecs(text) {
  const lines = cleanText(text).split("\n");
  const i = lines.findIndex((l) => /^Lưu ý/.test(l.trim()));
  const specs = (i < 0 ? lines : lines.slice(0, i)).map((l) => l.trim()).filter(Boolean);
  const note = i < 0 ? undefined : lines.slice(i + 1).map((l) => l.trim()).filter(Boolean).join("\n") || undefined;
  return { specs, note };
}
const priceNumbers = (s) => [...s.matchAll(/(\d{1,3}(?:\.\d{3})+)\s*VNĐ/g)].map((m) => Number(m[1].replace(/\./g, "")));

// ---- build ----
if (path.resolve(process.argv[1] ?? "").toLowerCase() === import.meta.filename.toLowerCase()) {
  const listings = Object.fromEntries(Object.keys(LISTING_FRAMES).map((f) => [f, listingCards(f)]));
  const allCards = ["tat-ca-san-pham-trang-1", "tat-ca-san-pham-trang-2", "tat-ca-san-pham-trang-3"].flatMap((f) => listings[f]);
  const categoryOf = {};
  for (const [f, [slug]] of Object.entries(LISTING_FRAMES)) if (slug !== "tat-ca") for (const c of listings[f]) categoryOf[c.id] = SLUG_TO_CATEGORY[slug];
  const cardOf = Object.fromEntries(allCards.map((c) => [c.id, c]));
  const detailOf = Object.fromEntries(Object.entries(FRAME_TO_ID).map(([f, id]) => [id, detailFrame(f)]));

  const orderIds = [...allCards.map((c) => c.id), ...Object.keys(UNLISTED)];
  const products = [];
  const display = {};
  for (const id of orderIds) {
    const d = detailOf[id];
    const card = cardOf[id];
    const old = current.find((p) => p.id === id);
    const nums = priceNumbers(d.price);
    const priceFrom = PRICE_OVERRIDE[id] ?? nums[0];
    const unit = d.price.match(/VNĐ\/\s*([^\n]+)/)?.[1].trim() ?? old?.unit ?? UNIT_FALLBACK[id] ?? "sản phẩm";
    const { specs, note } = splitSpecs(d.specs);
    const name = card?.name ?? UNLISTED[id].name;
    const [image, ...thumbnails] = d.gallery.map((l) => l.image.src);
    products.push({
      id,
      name,
      category: categoryOf[id] ?? UNLISTED[id].category,
      priceFrom,
      unit,
      ...(d.soldOut || card?.soldOut ? { soldOut: true } : {}),
      image,
      thumbnails,
      description: cleanText(d.desc),
      ...(d.variants.length ? { variants: d.variants } : {}),
      specs: SPECS_OVERRIDE[id] ?? specs,
      ...(note ? { note } : {}),
    });
    display[id] = {
      name,
      priceFrom,
      title: cleanText(d.title),
      detailPrice: cleanText(d.price),
      ...(card ? { cardPrice: card.price, card: crop(card.img) } : {}),
      gallery: d.gallery.map(crop),
      ...(d.extra ? { extra: d.extra } : {}),
      // Exact desktop positions; used only while the product still has exactly this content (layoutSig).
      layout: { sig: layoutSig(products.at(-1)), ...d.layout },
    };
  }
  // Keep old ids that Figma dropped (their URLs stay alive; they are not listed).
  for (const p of current) if (!products.some((q) => q.id === p.id)) products.push(p);

  // 1) content.ts: replace only the productLines array.
  const contentPath = path.join(root, "src/data/content.ts");
  const src = fs.readFileSync(contentPath, "utf8");
  const start = src.indexOf("export const productLines = [");
  const eol = src.includes("\r\n") ? "\r\n" : "\n";
  const end = src.indexOf(`${eol}];${eol}`, start);
  if (start < 0 || end < 0) throw new Error("productLines block not found");
  const body = products.map((p) => "  " + JSON.stringify(p, null, 2).replace(/^(\s*)"(\w+)":/gm, "$1$2:").replace(/\n/g, `${eol}  `)).join(`,${eol}`);
  fs.writeFileSync(contentPath, `${src.slice(0, start)}export const productLines = [${eol}${body},${src.slice(end)}`);

  // 2) display data
  // Listing frames: the designer nudged some cards off the grid, so keep each card image's x/y + the pager's y.
  const listingLayout = {};
  for (const [frame, [slug, page]] of Object.entries(LISTING_FRAMES)) {
    const pager = demo(frame).layers.find((l) => l.name === "chon-trang");
    listingLayout[`${slug}:${page}`] = {
      ids: listings[frame].map((c) => c.id),
      cards: listings[frame].map((c) => [c.img.x, c.img.y]),
      pager: pager ? pager.y : null,
      // the highlighted tab's purple differs by a hair between frames (#53129e / #55149f / #6625b1)
      tabColor: demo(frame).layers.find((l) => l.path.endsWith("danh-muc") && l.font?.weight === 800)?.color ?? null,
      frameH: demo(frame).h,
    };
  }
  fs.writeFileSync(path.join(root, "src/data/shopFigma.json"), JSON.stringify({ frames: FRAME_TO_ID, listings: listingLayout, products: display }, null, 1) + "\n");

  // 3) Supabase seed
  const q = (s) => (s == null ? "null" : `'${String(s).replace(/'/g, "''")}'`);
  const arr = (a) => (a?.length ? `array[${a.map(q).join(", ")}]` : "'{}'") + "::text[]";
  const rows = products
    .filter((p) => orderIds.includes(p.id))
    .map((p, i) => `  (${[q(p.id), q(p.name), q(p.category), p.priceFrom, q(p.unit), q(p.image), arr(p.thumbnails), q(p.description), arr(p.variants), arr(p.specs), q(p.note), !!p.soldOut, (i + 1) * 10].join(", ")})`);
  const sql = `-- Generated by scripts/figma-demo-shop.mjs from the Figma "Thiết kế DEMO" page. Do not edit by hand.
-- Idempotent: run as many times as needed in the Supabase SQL editor (after schema-5-thumbnails.sql).
-- Leaves stock and bundle_items alone (admin-managed). Images are served from /public/images/figma/.
insert into products (id, name, category, price_from, unit, image, thumbnails, description, variants, specs, note, sold_out, sort_order) values
${rows.join(",\n")}
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  price_from = excluded.price_from,
  unit = excluded.unit,
  image = excluded.image,
  thumbnails = excluded.thumbnails,
  description = excluded.description,
  variants = excluded.variants,
  specs = excluded.specs,
  note = excluded.note,
  sold_out = excluded.sold_out,
  sort_order = excluded.sort_order;
`;
  fs.writeFileSync(path.join(root, "supabase/seed-demo-products.sql"), sql);
  console.log(`wrote ${products.length} products (${orderIds.length} from Figma)`);
}
