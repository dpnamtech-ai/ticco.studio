"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";

// Server Actions are public HTTP endpoints — Next can invoke them from ANY
// route, so the /admin middleware matcher does not protect them. Every action
// that touches the service-role client must check the session itself.
async function requireAdmin() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
}

function parseProductForm(formData: FormData) {
  const variants = String(formData.get("variants") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
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
    description: String(formData.get("description") || "").trim(),
    variants,
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

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const product = parseProductForm(formData);
  const { error } = await supabaseAdmin().from("products").insert(product);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/san-pham");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProduct(originalId: string, formData: FormData) {
  await requireAdmin();
  const product = parseProductForm(formData);
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
