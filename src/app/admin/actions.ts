"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin-check";
import { MAX_PRICE, THUMB_SLOTS, parseVariantLines } from "@/lib/variants";
import { sanitizeDescription } from "@/lib/sanitize";
import type { ShipRule } from "@/lib/checkout";

// Server Actions are public HTTP endpoints — Next can invoke them from ANY
// route, so the /admin middleware matcher does not protect them. Every action
// that touches the service-role client must check the session itself.
async function requireAdmin() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdmin(user)) throw new Error("Unauthorized");
}

function parseProductForm(formData: FormData) {
  const specs = String(formData.get("specs") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  // "Bộ sản phẩm (combo)" textarea: one child product per line, "id" or "id qty" (qty defaults to 1).
  const bundleItems = String(formData.get("bundle_items") || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, qty] = line.split(/\s+/);
      return { id, qty: Math.max(1, Number(qty) || 1) };
    });

  return {
    id: String(formData.get("id") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    price_from: Number(formData.get("price_from") || 0),
    unit: String(formData.get("unit") || "sản phẩm").trim(),
    image: String(formData.get("image") || "").trim() || null,
    description: sanitizeDescription(String(formData.get("description") || "").trim()),
    specs,
    note: String(formData.get("note") || "").trim() || null,
    sold_out: formData.get("sold_out") === "on",
    stock: Math.max(0, Number(formData.get("stock") || 0)),
    bundle_items: bundleItems.length ? bundleItems : null,
  };
}

// A combo's page renders its children's live name/price/image at request time from the DB, but the
// page itself is statically cached — editing/deleting a child must also revalidate every combo that
// lists it, or those combos keep showing the old data until the combo's own page is next touched.
async function revalidateBundleParents(childId: string) {
  const { data } = await supabaseAdmin().from("products").select("id, bundle_items").not("bundle_items", "is", null);
  for (const row of data ?? []) {
    const items = row.bundle_items as { id: string }[] | null;
    if (items?.some((b) => b.id === childId)) revalidatePath(`/san-pham/${row.id}`);
  }
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

async function uploadImage(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Ảnh quá lớn (tối đa 5MB)");
  if (!file.type.startsWith("image/")) throw new Error("File phải là ảnh");
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8) || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabaseAdmin().storage.from("product-images").upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);
  return supabaseAdmin().storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

// Uploads the "<field>_file" input (if the admin picked one) to Supabase Storage and returns its
// public URL; otherwise falls back to the "<field>" text field (manual URL) or `fallback` (existing
// value on edit). File wins over text when both are given.
// ponytail: old objects are never deleted on replace/delete — bucket is small (product photos
// only), clean up by hand in Storage if it ever matters.
async function resolveImageField(formData: FormData, field: string, fallback: string | null): Promise<string | null> {
  const file = formData.get(`${field}_file`);
  if (file instanceof File && file.size > 0) return uploadImage(file);
  return String(formData.get(field) || "").trim() || fallback;
}

// Called from the description rich-text editor's "insert image" toolbar button (a client
// component, not a form submission) — same auth check and bucket as product images.
export async function uploadEditorImage(formData: FormData): Promise<string> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Chưa chọn ảnh");
  return uploadImage(file);
}

// Everything that needs the uploaded photos or the other products: images, the "Biến thể" lines (prices /
// photo numbers / links are checked against them) and field sanity checks. Throws a readable Vietnamese error.
async function completeProduct(formData: FormData, selfId: string) {
  const product = parseProductForm(formData);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.id) || product.id.length > 80) throw new Error("ID chỉ gồm chữ thường không dấu, số và gạch ngang (vd so-can-ban)");
  if (!product.name || product.name.length > 120) throw new Error("Tên sản phẩm phải có, tối đa 120 ký tự");
  if (!Number.isInteger(product.price_from) || product.price_from < 0 || product.price_from > MAX_PRICE) throw new Error("Giá không hợp lệ");
  if (!Number.isInteger(product.stock) || product.stock > 1_000_000) throw new Error("Tồn kho không hợp lệ");
  product.image = await resolveImageField(formData, "image", product.image);
  const thumbnails = (
    await Promise.all(Array.from({ length: THUMB_SLOTS }, (_, i) => resolveImageField(formData, `thumb_${i}`, null)))
  ).filter((t): t is string => Boolean(t));
  const { data: rows } = await supabaseAdmin().from("products").select("id");
  const parsed = parseVariantLines(String(formData.get("variants") || ""), {
    imageCount: (product.image ? 1 : 0) + thumbnails.length,
    productIds: new Set((rows ?? []).map((r) => r.id as string)),
    selfId,
  });
  if (!parsed.ok) throw new Error(parsed.error);
  return { ...product, thumbnails, variants: parsed.variants, variant_options: parsed.options };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const product = await completeProduct(formData, String(formData.get("id") || "").trim());
  const { error } = await supabaseAdmin().from("products").insert(product);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/san-pham");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProduct(originalId: string, formData: FormData) {
  await requireAdmin();
  const product = await completeProduct(formData, originalId);
  const { error } = await supabaseAdmin().from("products").update(product).eq("id", originalId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/san-pham");
  revalidatePath(`/san-pham/${originalId}`);
  revalidatePath("/");
  await revalidateBundleParents(originalId);
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const { error } = await supabaseAdmin().from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/san-pham");
  revalidatePath("/");
  await revalidateBundleParents(id);
}

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const ORDER_STATUSES = ["pending_payment", "paid", "shipped", "done", "cancelled"];
// Stock leaves the shelf once the customer has paid, and returns if the order is cancelled / reverted.
const HOLDS_STOCK = ["paid", "shipped", "done"];

type OrderLine = { id: string; qty: number };

// Adds `sign * qty` to every product's stock; a combo moves its children's stock, not its own.
// ponytail: read-modify-write, not atomic — fine for one admin clicking, use an SQL rpc if that changes.
async function moveStock(lines: OrderLine[], sign: 1 | -1) {
  const db = supabaseAdmin();
  const { data: products, error } = await db.from("products").select("id, stock, bundle_items");
  if (error) throw new Error(error.message);
  const byId = new Map((products ?? []).map((p) => [p.id, p]));
  const delta = new Map<string, number>();
  const add = (id: string, n: number) => delta.set(id, (delta.get(id) ?? 0) + n);
  for (const l of lines) {
    const bundle = byId.get(l.id)?.bundle_items as { id: string; qty: number }[] | null;
    if (bundle?.length) bundle.forEach((b) => add(b.id, b.qty * l.qty));
    else add(l.id, l.qty);
  }
  for (const [id, n] of delta) {
    const p = byId.get(id);
    if (!p) continue;
    const stock = Math.max(0, p.stock + sign * n);
    // Only touch sold_out at the edges, so a hand-set "Hết hàng" on untracked products is left alone.
    const patch: { stock: number; sold_out?: boolean } = { stock };
    if (sign < 0 && stock === 0) patch.sold_out = true;
    if (sign > 0 && stock > 0) patch.sold_out = false;
    const { error: e } = await db.from("products").update(patch).eq("id", id);
    if (e) throw new Error(e.message);
    revalidatePath(`/san-pham/${id}`);
  }
  revalidatePath("/san-pham");
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateOrderStatus(code: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status"));
  if (!ORDER_STATUSES.includes(status)) throw new Error("Invalid status");
  const tracking = String(formData.get("tracking") || "").trim() || null;

  const db = supabaseAdmin();
  const { data: order, error: readErr } = await db.from("orders").select("items, stock_deducted").eq("code", code).single();
  if (readErr) throw new Error(readErr.message);

  const shouldHold = HOLDS_STOCK.includes(status);
  if (shouldHold !== order.stock_deducted) await moveStock(order.items as OrderLine[], shouldHold ? -1 : 1);

  const { error } = await db.from("orders").update({ status, ghn_order_code: tracking, stock_deducted: shouldHold }).eq("code", code);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}

// /admin/phi-ship form: rows "đến [maxItems] sản phẩm → [fee]đ" (blank maxItems = "trở lên", last row only)
// and "miễn phí từ [freeFrom]đ" (blank = never free). Errors come back as ?error=… so the client sees why.
export async function saveShipRule(formData: FormData) {
  await requireAdmin();
  const int = (v: FormDataEntryValue | null) => (String(v ?? "").replace(/[.\s,đ]/g, "") === "" ? null : Number(String(v).replace(/[.\s,đ]/g, "")));
  const maxes = formData.getAll("maxItems").map(int);
  const fees = formData.getAll("fee").map(int);
  const tiers: ShipRule["tiers"] = [];
  let error = "";
  maxes.forEach((maxItems, i) => {
    const fee = fees[i];
    if (fee == null && maxItems == null) return; // empty row
    if (fee == null || !Number.isInteger(fee) || fee < 0 || fee > MAX_PRICE) error ||= `Dòng ${i + 1}: phí ship không hợp lệ`;
    else if (maxItems != null && (!Number.isInteger(maxItems) || maxItems < 1)) error ||= `Dòng ${i + 1}: số sản phẩm không hợp lệ`;
    else tiers.push({ maxItems, fee });
  });
  if (!error && tiers.length === 0) error = "Cần ít nhất 1 mức phí";
  tiers.forEach((t, i) => {
    const prev = tiers[i - 1]?.maxItems;
    if (i > 0 && (prev == null || (t.maxItems != null && t.maxItems <= prev))) error ||= "Các mức phải tăng dần; dòng để trống số sản phẩm (\"trở lên\") phải là dòng cuối";
  });
  const freeFrom = int(formData.get("freeFrom"));
  if (freeFrom != null && (!Number.isInteger(freeFrom) || freeFrom < 0 || freeFrom > MAX_PRICE * 100)) error ||= "Mức miễn phí ship không hợp lệ";
  if (error) redirect(`/admin/phi-ship?error=${encodeURIComponent(error)}`);

  const { error: dbErr } = await supabaseAdmin()
    .from("settings")
    .upsert({ key: "shipping", value: { tiers, freeFrom } satisfies ShipRule, updated_at: new Date().toISOString() });
  if (dbErr) redirect(`/admin/phi-ship?error=${encodeURIComponent(dbErr.message)}`);
  revalidatePath("/", "layout"); // checkout pages and llms.txt read the rule
  redirect("/admin/phi-ship?saved=1");
}
