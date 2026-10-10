import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { productCategories } from "@/data/content";
import ProductTable, { type AdminProduct } from "./ProductTable";

export default async function AdminDashboard() {
  const supabase = await supabaseServer();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, category, price_from, image, stock, sold_out, hidden, bundle_items")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">Quản lý sản phẩm</h1>
          <Link href="/admin/products/new" className="bg-[var(--color-purple)] text-white font-semibold px-5 py-2.5 rounded-lg">
            + Thêm sản phẩm
          </Link>
        </div>

        {error && <p className="text-red-600 mb-4">Lỗi tải dữ liệu: {error.message}</p>}
        <ProductTable products={(products ?? []) as AdminProduct[]} categories={productCategories} />
      </div>
    </div>
  );
}
