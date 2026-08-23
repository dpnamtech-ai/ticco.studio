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
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error || !data || data.length === 0) return fromStatic();

    return data.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      priceFrom: p.price_from,
      unit: p.unit,
      image: p.image ?? undefined,
      description: p.description,
      variants: p.variants ?? undefined,
      specs: p.specs ?? undefined,
      note: p.note ?? undefined,
      soldOut: p.sold_out,
    }));
  } catch {
    return fromStatic();
  }
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}
