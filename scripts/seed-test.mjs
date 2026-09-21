// Inserts the test-* products. Run: node --env-file=.env.local scripts/seed-test.mjs
import { createClient } from "@supabase/supabase-js";

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const base = { unit: "sản phẩm", category: "Văn phòng phẩm", sold_out: false, stock: 0, bundle_items: null };
const rows = [
  { ...base, id: "test-so-a", name: "Test Sổ A", price_from: 50000, image: "/images/dan-cheer.png", description: "Sổ test, tồn kho 5.", stock: 5, sort_order: 900 },
  { ...base, id: "test-so-b", name: "Test Sổ B", price_from: 60000, image: "/images/dan-laptop.png", description: "Sổ test, tồn kho 2.", stock: 2, sort_order: 901 },
  { ...base, id: "test-sticker", name: "Test Sticker", category: "In ấn", price_from: 20000, image: "/images/dan-cheer.png", description: "Chưa theo dõi kho (tồn = 0).", sort_order: 902 },
  { ...base, id: "test-hethang", name: "Test Hết hàng", category: "Phụ kiện đời sống", price_from: 30000, image: "/images/dan-laptop.png", description: "Đã bật Hết hàng bằng tay.", sold_out: true, sort_order: 903 },
  { ...base, id: "test-combo", name: "Test Combo Sổ", price_from: 100000, image: "/images/dan-cheer.png", description: "Combo = 1 Sổ A + 2 Sổ B.", sort_order: 904,
    bundle_items: [{ id: "test-so-a", qty: 1 }, { id: "test-so-b", qty: 2 }] },
];
const { error } = await db.from("products").upsert(rows);
console.log(error ? `FAILED: ${error.message}` : `OK: ${rows.length} test products upserted`);
