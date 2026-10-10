import { productLines as staticProductLines } from "@/data/content";
import { supabaseServer } from "./supabase/server";

export type Product = {
  id: string;
  name: string;
  category: string;
  priceFrom: number;
  unit: string;
  image?: string;
  thumbnails?: string[];
  description: string;
  variants?: string[];
  specs?: string[];
  note?: string;
  soldOut?: boolean;
  stock?: number;
  /** Per-option price / photo / link from /admin (src/lib/variants.ts). */
  variantOptions?: Record<string, { price?: number; image?: number; link?: string }>;
  /** Set when this product is a combo/bundle: ids of the standalone products it's made of. */
  bundleItems?: { id: string; qty: number }[];
};

function fromStatic(): Product[] {
  return staticProductLines as Product[];
}

// Reads from Supabase when it's configured; otherwise (or on any error —
// e.g. the table hasn't been created yet) falls back to the hardcoded
// catalog in content.ts so the site never breaks mid-migration.
export async function getProducts(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return fromStatic();

  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("hidden", false) // hidden in /admin: off the storefront and not orderable, but kept
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error || !data || data.length === 0) return fromStatic();

    return data.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      priceFrom: p.price_from,
      unit: p.unit,
      // next/image throws (500s the whole page) on a src that isn't "/path" or a URL; admin input is free text.
      image: /^(\/|https?:\/\/)/.test(p.image ?? "") ? p.image : undefined,
      thumbnails: p.thumbnails?.length ? p.thumbnails : undefined,
      description: p.description,
      variants: p.variants ?? undefined,
      specs: p.specs ?? undefined,
      note: p.note ?? undefined,
      soldOut: p.sold_out,
      stock: p.stock ?? 0,
      bundleItems: p.bundle_items ?? undefined,
      variantOptions: p.variant_options ?? undefined,
    }));
  } catch {
    return fromStatic();
  }
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}
