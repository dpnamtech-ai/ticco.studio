"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";

function parseProductForm(formData: FormData) {
  const variants = String(formData.get("variants") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const specs = String(formData.get("specs") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

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
  };
}

export async function createProduct(formData: FormData) {
  const product = parseProductForm(formData);
  const { error } = await supabaseAdmin().from("products").insert(product);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/san-pham");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProduct(originalId: string, formData: FormData) {
  const product = parseProductForm(formData);
  const { error } = await supabaseAdmin().from("products").update(product).eq("id", originalId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/san-pham");
  revalidatePath(`/san-pham/${originalId}`);
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin().from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/san-pham");
  revalidatePath("/");
}

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
