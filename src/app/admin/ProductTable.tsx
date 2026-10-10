"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct, setProductsHidden } from "./actions";

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  price_from: number;
  image: string | null;
  stock: number;
  sold_out: boolean;
  hidden: boolean;
  bundle_items: { id: string; qty: number }[] | null;
};

type Status = "all" | "selling" | "sold_out" | "hidden";
const STATUS_LABEL: Record<Status, string> = { all: "Mọi trạng thái", selling: "Đang bán", sold_out: "Hết hàng", hidden: "Đang ẩn" };
const statusOf = (p: AdminProduct): Exclude<Status, "all"> => (p.hidden ? "hidden" : p.sold_out ? "sold_out" : "selling");
// accent-insensitive search: "tui vung" finds "Túi Vững Vàng"
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
const field = "border border-black/20 rounded-lg px-3 py-2 bg-white";

// Product list in /admin: search, category / status filters, plain or grouped-by-category view,
// STT = position on the storefront (sort_order), hide/show one product or a whole category.
export default function ProductTable({ products, categories }: { products: AdminProduct[]; categories: string[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const [grouped, setGrouped] = useState(false);

  const order = new Map(products.map((p, i) => [p.id, i + 1]));
  const shown = products.filter(
    (p) =>
      (!q || fold(`${p.name} ${p.id}`).includes(fold(q.trim()))) &&
      (!cat || p.category === cat) &&
      (status === "all" || statusOf(p) === status),
  );
  const groups = grouped
    ? [...categories, ...new Set(shown.map((p) => p.category).filter((c) => !categories.includes(c)))]
        .map((c) => ({ name: c, items: shown.filter((p) => p.category === c) }))
        .filter((g) => g.items.length)
    : [{ name: "", items: shown }];

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên…" className={`${field} w-64`} />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={field}>
          <option value="">Mọi danh mục</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className={field}>
          {Object.entries(STATUS_LABEL).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <div className="flex rounded-lg border border-black/20 overflow-hidden bg-white">
          {[false, true].map((g) => (
            <button key={String(g)} type="button" onClick={() => setGrouped(g)} className={`px-3 py-2 font-semibold ${grouped === g ? "bg-[var(--color-purple)] text-white" : ""}`}>
              {g ? "Theo nhóm" : "Danh sách"}
            </button>
          ))}
        </div>
        <span className="text-sm text-black/50 ml-auto">
          {shown.length} / {products.length} sản phẩm
        </span>
      </div>

      {groups.map((g) => (
        <div key={g.name} className="bg-white rounded-xl overflow-x-auto mb-6">
          {g.name && <GroupHeader name={g.name} items={g.items} />}
          <table className="w-full min-w-[760px] text-sm text-left">
            <thead className="bg-black/5">
              <tr>
                <th className="px-3 py-3 w-12 text-center" title="Thứ tự hiển thị trên web">STT</th>
                <th className="px-3 py-3 w-16">Ảnh</th>
                <th className="px-3 py-3">Tên</th>
                {!g.name && <th className="px-3 py-3">Danh mục</th>}
                <th className="px-3 py-3">Giá</th>
                <th className="px-3 py-3">Trạng thái</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {g.items.map((p) => (
                <Row key={p.id} p={p} stt={order.get(p.id)!} showCategory={!g.name} />
              ))}
              {g.items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-black/40">
                    {products.length ? "Không có sản phẩm nào khớp bộ lọc." : 'Chưa có sản phẩm nào. Bấm "+ Thêm sản phẩm" để bắt đầu.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

function GroupHeader({ name, items }: { name: string; items: AdminProduct[] }) {
  const [pending, start] = useTransition();
  const hidden = items.filter((p) => p.hidden).length;
  const set = (h: boolean) => start(() => setProductsHidden(items.map((p) => p.id), h));
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-black/10">
      <h2 className="font-bold text-base">{name}</h2>
      <span className="text-sm text-black/50">
        {items.length} sản phẩm{hidden ? `, ${hidden} đang ẩn` : ""}
      </span>
      <div className="ml-auto flex gap-2 text-sm">
        {pending && <span className="size-4 self-center animate-spin rounded-full border-2 border-black/40 border-t-transparent" aria-hidden />}
        <button type="button" disabled={pending || hidden === items.length} onClick={() => set(true)} className="rounded-lg border border-black/20 px-3 py-1.5 font-semibold disabled:opacity-40">
          Ẩn cả nhóm
        </button>
        <button type="button" disabled={pending || hidden === 0} onClick={() => set(false)} className="rounded-lg border border-black/20 px-3 py-1.5 font-semibold disabled:opacity-40">
          Hiện cả nhóm
        </button>
      </div>
    </div>
  );
}

function Pill({ tone, children }: { tone: "green" | "red" | "gray"; children: React.ReactNode }) {
  const c = { green: "bg-green-100 text-green-800", red: "bg-red-100 text-red-700", gray: "bg-black/10 text-black/60" }[tone];
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold mr-1 ${c}`}>{children}</span>;
}

function Row({ p, stt, showCategory }: { p: AdminProduct; stt: number; showCategory: boolean }) {
  const [pending, start] = useTransition();
  const remove = () => {
    if (confirm(`Xoá hẳn "${p.name}"? Không khôi phục được. (Muốn tạm gỡ khỏi web thì bấm "Ẩn".)`)) start(() => deleteProduct(p.id));
  };
  return (
    <tr className={`border-t border-black/10 ${p.hidden ? "bg-black/[0.03] text-black/50" : ""} ${pending ? "opacity-50" : ""}`}>
      <td className="px-3 py-2 text-center text-black/50">{stt}</td>
      <td className="px-3 py-2">
        {p.image ? (
          <Image src={p.image} alt="" width={40} height={40} className="size-10 rounded object-cover" />
        ) : (
          <div className="size-10 rounded bg-black/10" />
        )}
      </td>
      <td className="px-3 py-2 font-medium">{p.name}</td>
      {showCategory && <td className="px-3 py-2 text-black/60">{p.category}</td>}
      <td className="px-3 py-2 whitespace-nowrap">{p.price_from > 0 ? `${p.price_from.toLocaleString("vi-VN")} đ` : "Liên hệ"}</td>
      <td className="px-3 py-2">
        {p.hidden && <Pill tone="gray">Đang ẩn</Pill>}
        {p.sold_out ? <Pill tone="red">Hết hàng</Pill> : !p.hidden && <Pill tone="green">Đang bán</Pill>}
        {p.bundle_items?.length ? <Pill tone="gray">Combo</Pill> : p.stock > 0 && <span className="text-xs text-black/50">Còn {p.stock}</span>}
      </td>
      <td className="px-3 py-2 text-right whitespace-nowrap space-x-3">
        {pending && <span className="inline-block size-3.5 align-middle animate-spin rounded-full border-2 border-black/40 border-t-transparent" aria-hidden />}
        <Link href={`/admin/products/${p.id}`} className="text-[var(--color-purple)] font-semibold">
          Sửa
        </Link>
        <button type="button" disabled={pending} onClick={() => start(() => setProductsHidden([p.id], !p.hidden))} className="font-semibold text-black/70">
          {p.hidden ? "Hiện" : "Ẩn"}
        </button>
        <button type="button" disabled={pending} onClick={remove} className="text-red-600 font-semibold">
          Xoá
        </button>
      </td>
    </tr>
  );
}
