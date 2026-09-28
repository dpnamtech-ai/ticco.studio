// Self-check: the static catalog (src/data/content.ts), the listing logic (src/lib/shop.ts) and the Supabase seed
// agree with the Figma "Thiết kế DEMO" frames in .figma-cache/demo. Usage: node scripts/check-demo-shop.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { productLines } from "../src/data/content.ts";
import { shopListing, paginate, VARIANT_LINKS } from "../src/lib/shop.ts";
import { FRAME_TO_ID, LISTING_FRAMES, listingCards, detailFrame } from "./figma-demo-shop.mjs";

const root = path.resolve(import.meta.dirname, "..");
const byId = new Map(productLines.map((p) => [p.id, p]));
const norm = (s) => s.replace(/\s+/g, " ").trim();
const nums = (s) => [...s.matchAll(/(\d{1,3}(?:\.\d{3})+)\s*VNĐ/g)].map((m) => Number(m[1].replace(/\./g, "")));
const words = (s) => s.toLowerCase().normalize("NFC").replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(" ");
let checks = 0;
const ok = (cond, msg) => {
  assert.ok(cond, msg);
  checks++;
};

// Listing frames: every card → product, exact order per page, page count.
const cardsOf = {};
for (const [frame, [slug, page]] of Object.entries(LISTING_FRAMES)) {
  const cards = listingCards(frame);
  const got = paginate(shopListing(productLines, slug), page);
  assert.deepEqual(got.items.map((p) => p.id), cards.map((c) => c.id), `${frame}: product order`);
  checks++;
  const { layers } = JSON.parse(fs.readFileSync(path.join(root, ".figma-cache/demo", `${frame}.json`), "utf8"));
  // Visible page buttons = "o-N" groups that have a background (in-an's "3" is an orphan white label).
  const pageButtons = layers.filter((l) => l.type === "RECTANGLE" && /chon-trang > o-\d+$/.test(l.path)).length;
  ok(got.pages === Math.max(1, pageButtons), `${frame}: ${got.pages} pages, Figma shows ${pageButtons}`);
  for (const c of cards) {
    const p = byId.get(c.id);
    ok(p, `${frame}: card ${c.id} has no product`);
    ok(norm(p.name) === c.name, `${frame}: name "${p.name}" ≠ "${c.name}"`);
    ok(p.image === c.img.image.src, `${frame}: ${c.id} card image ${c.img.image.src} ≠ product image ${p.image}`);
    ok(!!p.soldOut === c.soldOut, `${frame}: ${c.id} sold-out badge`);
    (cardsOf[c.id] ??= []).push(c);
  }
}

// Detail frames: every san-pham-* frame maps to a product whose data matches the frame's layers.
const frames = fs.readdirSync(path.join(root, ".figma-cache/demo")).filter((f) => f.startsWith("san-pham-")).map((f) => f.replace(/\.json$/, ""));
ok(frames.length === 40, `expected 40 san-pham-* frames, found ${frames.length}`);
for (const frame of frames) {
  const id = FRAME_TO_ID[frame];
  const p = byId.get(id);
  ok(p, `${frame}: no product (id ${id})`);
  const d = detailFrame(frame);
  assert.deepEqual([p.image, ...(p.thumbnails ?? [])], d.gallery.map((l) => l.image.src), `${frame}: images`);
  checks++;
  const cardPrice = cardsOf[id]?.[0]?.price ?? "";
  ok(nums(d.price).includes(p.priceFrom) || nums(cardPrice).includes(p.priceFrom), `${frame}: price ${p.priceFrom} not in "${d.price}" / "${cardPrice}"`);
  if (!cardsOf[id]) {
    const title = new Set(words(d.title));
    ok(words(p.name).every((w) => title.has(w)), `${frame}: name "${p.name}" not in title "${d.title}"`);
  }
  assert.deepEqual(p.variants ?? [], d.variants, `${frame}: variants`);
  checks++;
  ok(!!p.soldOut === d.soldOut, `${frame}: sold out`);
  ok(norm(d.desc).startsWith(norm(p.description).slice(0, 40)), `${frame}: description`);
}
ok(new Set(Object.values(FRAME_TO_ID)).size === 40, "frame → id mapping is 1:1");

// Option buttons that switch products point at existing products that show the same buttons.
for (const group of VARIANT_LINKS)
  for (const id of Object.values(group)) {
    ok(byId.get(id), `variant link → missing ${id}`);
    assert.deepEqual([...(byId.get(id).variants ?? [])].sort(), Object.keys(group).sort(), `${id}: variant buttons`);
    checks++;
  }

// Seed covers the whole Figma catalog.
const sql = fs.readFileSync(path.join(root, "supabase/seed-demo-products.sql"), "utf8");
for (const id of Object.values(FRAME_TO_ID)) ok(sql.includes(`('${id}', `), `seed missing ${id}`);

console.log(`check-demo-shop: ${checks} checks passed`);
