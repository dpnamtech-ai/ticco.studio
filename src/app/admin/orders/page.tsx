import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin-check";
import { updateOrderStatus } from "../actions";

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Chờ thanh toán",
  paid: "Đã thanh toán",
  shipped: "Đang giao",
  done: "Hoàn tất",
  cancelled: "Đã huỷ",
};

type OrderItem = { name: string; variant?: string; qty: number; price: number };

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  // Orders are service-role only (RLS, no public policy) — check the session before using that client.
  const {
    data: { user },
  } = await (await supabaseServer()).auth.getUser();
  if (!isAdmin(user)) redirect("/admin/login");

  const query = supabaseAdmin().from("orders").select("*").order("created_at", { ascending: false });
  const { data: orders, error } = await (status && status in STATUS_LABEL ? query.eq("status", status) : query);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">
            Quản lý đơn hàng
          </h1>
          <Link href="/admin" className="border border-black/20 px-5 py-2.5 rounded-lg font-semibold">
            ← Sản phẩm
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 text-sm">
          {[["", "Tất cả"], ...Object.entries(STATUS_LABEL)].map(([v, l]) => (
            <Link
              key={v}
              href={v ? `/admin/orders?status=${v}` : "/admin/orders"}
              className={`px-4 py-1.5 rounded-full border ${(status ?? "") === v ? "bg-[var(--color-purple)] text-white border-transparent" : "border-black/20"}`}
            >
              {l}
            </Link>
          ))}
        </div>

        {error && <p className="text-red-600 mb-4">Lỗi tải dữ liệu: {error.message}</p>}

        <div className="space-y-4">
          {(orders ?? []).map((o) => {
            const c = o.customer as Record<string, string>;
            return (
              <div key={o.code} className="bg-white rounded-xl p-5 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-base">{o.code}</span>
                    <span className="text-black/50 ml-3">{new Date(o.created_at).toLocaleString("vi-VN")}</span>
                  </div>
                  <form action={updateOrderStatus.bind(null, o.code)} className="flex gap-2">
                    <select name="status" defaultValue={o.status} className="border border-black/20 rounded-lg px-3 py-1.5">
                      {Object.entries(STATUS_LABEL).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <input
                      name="tracking"
                      defaultValue={o.ghn_order_code ?? ""}
                      placeholder="Mã vận đơn"
                      className="border border-black/20 rounded-lg px-3 py-1.5 w-40"
                    />
                    <button className="bg-[var(--color-purple)] text-white font-semibold px-4 py-1.5 rounded-lg">Lưu</button>
                  </form>
                </div>
                <p className="mt-3">
                  <b>{c.name}</b> · {c.phone} · {c.email}
                </p>
                <p className="text-black/60">
                  {[c.address, c.ward, c.district, c.province].filter(Boolean).join(", ")}
                </p>
                {c.note && <p className="text-black/60 italic">Ghi chú: {c.note}</p>}
                <ul className="mt-3 border-t border-black/10 pt-3 space-y-1">
                  {(o.items as OrderItem[]).map((it, i) => (
                    <li key={i} className="flex justify-between">
                      <span>
                        {it.name}
                        {it.variant ? ` (${it.variant})` : ""} × {it.qty}
                      </span>
                      <span>{(it.price * it.qty).toLocaleString("vi-VN")} đ</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-right text-black/60">Phí ship: {o.shipping.toLocaleString("vi-VN")} đ</p>
                <p className="text-right font-bold">Tổng: {o.total.toLocaleString("vi-VN")} đ</p>
              </div>
            );
          })}
          {orders && orders.length === 0 && <p className="text-center text-black/40 py-8">Chưa có đơn hàng nào.</p>}
        </div>
      </div>
    </div>
  );
}
