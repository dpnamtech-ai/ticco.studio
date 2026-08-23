import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { deleteProduct, signOut } from "./actions";

export default async function AdminDashboard() {
  const supabase = await supabaseServer();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div className="min-h-screen bg-[var(--color-cream)] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">
            Quản lý sản phẩm
          </h1>
          <div className="flex gap-3">
            <Link
              href="/admin/products/new"
              className="bg-[var(--color-purple)] text-white font-semibold px-5 py-2.5 rounded-lg"
            >
              + Thêm sản phẩm
            </Link>
            <form action={signOut}>
              <button className="border border-black/20 px-5 py-2.5 rounded-lg font-semibold">Đăng xuất</button>
            </form>
          </div>
        </div>

        {error && <p className="text-red-600 mb-4">Lỗi tải dữ liệu: {error.message}</p>}

        <div className="bg-white rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-black/5">
              <tr>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Hết hàng</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {(products ?? []).map((p) => (
                <tr key={p.id} className="border-t border-black/10">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-black/60">{p.category}</td>
                  <td className="px-4 py-3">
                    {p.price_from > 0 ? `${p.price_from.toLocaleString("vi-VN")} đ` : "Liên hệ"}
                  </td>
                  <td className="px-4 py-3">{p.sold_out ? "Có" : ""}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link href={`/admin/products/${p.id}`} className="text-[var(--color-purple)] font-semibold">
                      Sửa
                    </Link>
                    <form action={deleteProduct.bind(null, p.id)} className="inline">
                      <button className="text-red-600 font-semibold">Xoá</button>
                    </form>
                  </td>
                </tr>
              ))}
              {products && products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-black/40">
                    Chưa có sản phẩm nào. Bấm &quot;+ Thêm sản phẩm&quot; để bắt đầu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
