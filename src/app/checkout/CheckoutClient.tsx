"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import AddressMap from "@/components/AddressMap";
import { FREE_SHIP_MIN, shippingFor, vietQrUrl } from "@/lib/checkout";

// Bank account shown after checkout (public info). Set in .env.local / Vercel:
//   NEXT_PUBLIC_BANK_ID (VietQR short code, e.g. MB, VCB, ACB), NEXT_PUBLIC_BANK_ACCOUNT, NEXT_PUBLIC_BANK_ACCOUNT_NAME
const BANK = {
  id: process.env.NEXT_PUBLIC_BANK_ID ?? "",
  account: process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? "",
  name: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? "",
};

type Placed = { code: string; subtotal: number; shipping: number; total: number };
const STORE_KEY = "ticco-last-order";
const vnd = (n: number) => `${n.toLocaleString("vi-VN")} VNĐ`;

const empty = { name: "", phone: "", email: "", province: "", district: "", ward: "", address: "", note: "", website: "" };

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-[var(--color-ink)]">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}

const input =
  "w-full rounded-lg border border-[var(--color-ink)]/20 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-[var(--color-purple)]";

function CopyRow({ label, value }: { label: string; value: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--color-ink)]/10 py-2 text-sm">
      <span className="text-[var(--color-ink)]/60">{label}</span>
      <span className="flex items-center gap-2 font-semibold">
        {value}
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(value);
            setDone(true);
            setTimeout(() => setDone(false), 1200);
          }}
          className="rounded border border-[var(--color-purple)]/40 px-2 py-0.5 text-xs text-[var(--color-purple)]"
        >
          {done ? "Đã chép" : "Chép"}
        </button>
      </span>
    </div>
  );
}

export default function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [placed, setPlaced] = useState<Placed | null>(null);

  // Restore the payment screen after a refresh.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setPlaced(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => (er[k] ? { ...er, [k]: "" } : er)); // clear a field's error as soon as it is edited
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setFormError("");
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items: items.map((i) => ({ id: i.id, variant: i.variant, qty: i.qty })) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.fields ?? {});
        setFormError(data.error ?? "Không gửi được đơn, vui lòng thử lại.");
        return;
      }
      const order: Placed = { code: data.code, subtotal: data.subtotal, shipping: data.shipping, total: data.total };
      sessionStorage.setItem(STORE_KEY, JSON.stringify(order));
      setPlaced(order);
      clearCart();
      window.scrollTo({ top: 0 });
    } catch {
      setFormError("Mất kết nối, vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  }

  // ---- Step 2: pay by bank transfer (VietQR) ----
  if (placed) {
    const configured = BANK.id && BANK.account;
    return (
      <section className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-2 font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">Đặt hàng thành công</h1>
        <p className="mb-8 text-[var(--color-ink)]/75">
          Cảm ơn bạn! Vui lòng chuyển khoản để Tíc Cơ xác nhận đơn <b>{placed.code}</b>. Tíc Cơ sẽ liên hệ qua số điện thoại bạn đã nhập.
        </p>

        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <div className="rounded-lg bg-white p-3 text-center shadow-sm">
            {configured ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vietQrUrl({ bank: BANK.id, account: BANK.account, name: BANK.name, amount: placed.total, info: placed.code })}
                alt={`Mã VietQR chuyển khoản ${vnd(placed.total)} nội dung ${placed.code}`}
                className="mx-auto h-auto w-full"
                width={240}
                height={300}
              />
            ) : (
              <p className="p-6 text-sm text-[var(--color-ink)]/60">Chưa cấu hình tài khoản ngân hàng nhận tiền.</p>
            )}
          </div>
          <div>
            {configured && (
              <>
                <CopyRow label="Ngân hàng" value={BANK.id} />
                <CopyRow label="Số tài khoản" value={BANK.account} />
                {BANK.name && <CopyRow label="Chủ tài khoản" value={BANK.name} />}
              </>
            )}
            <CopyRow label="Số tiền" value={String(placed.total)} />
            <CopyRow label="Nội dung" value={placed.code} />
            <p className="mt-4 text-sm text-[var(--color-ink)]/60">
              Tạm tính {vnd(placed.subtotal)} · Ship {placed.shipping ? vnd(placed.shipping) : "miễn phí"} · <b>Tổng {vnd(placed.total)}</b>. Nhớ ghi đúng nội dung chuyển khoản.
            </p>
          </div>
        </div>

        <Link href="/san-pham" className="mt-10 inline-block font-semibold text-[var(--color-orange)] hover:underline">
          ← Tiếp tục xem sản phẩm
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">Giỏ hàng trống</h1>
        <Link href="/san-pham" className="font-semibold text-[var(--color-orange)] hover:underline">
          Xem sản phẩm →
        </Link>
      </section>
    );
  }

  // ---- Step 1: customer details ----
  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-6 py-12 md:grid-cols-[1fr_340px]">
      <form onSubmit={submit} noValidate className="space-y-5">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">Thông tin nhận hàng</h1>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Họ và tên" error={errors.name}>
            <input className={input} value={form.name} onChange={set("name")} autoComplete="name" required />
          </Field>
          <Field label="Số điện thoại" error={errors.phone}>
            <input className={input} value={form.phone} onChange={set("phone")} autoComplete="tel" inputMode="tel" required />
          </Field>
        </div>
        <Field label="Email (nhận xác nhận, không bắt buộc)" error={errors.email}>
          <input className={input} type="email" value={form.email} onChange={set("email")} autoComplete="email" />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Tỉnh / Thành phố" error={errors.province}>
            <input className={input} value={form.province} onChange={set("province")} autoComplete="address-level1" required />
          </Field>
          <Field label="Quận / Huyện" error={errors.district}>
            <input className={input} value={form.district} onChange={set("district")} autoComplete="address-level2" required />
          </Field>
          <Field label="Phường / Xã" error={errors.ward}>
            <input className={input} value={form.ward} onChange={set("ward")} required />
          </Field>
        </div>
        <Field label="Số nhà, tên đường" error={errors.address}>
          <input className={input} value={form.address} onChange={set("address")} autoComplete="street-address" required />
        </Field>

        <AddressMap query={[form.address, form.ward, form.district, form.province].filter(Boolean).join(", ")} />

        <Field label="Ghi chú (không bắt buộc)">
          <textarea className={input} rows={3} value={form.note} onChange={set("note")} />
        </Field>

        {/* honeypot: hidden from people, bots fill it */}
        <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={set("website")} name="website" />

        {formError && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}

        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-lg bg-[var(--color-purple)] py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[var(--color-ink)] disabled:opacity-60"
        >
          {sending ? "Đang gửi…" : "Đặt hàng và nhận mã chuyển khoản"}
        </button>
      </form>

      <aside className="h-fit rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-[var(--color-purple)]">Đơn hàng của bạn</h2>
        <ul className="divide-y divide-[var(--color-ink)]/10 text-sm">
          {items.map((i) => (
            <li key={`${i.id}-${i.variant}`} className="flex justify-between gap-3 py-2">
              <span>
                {i.name} <span className="text-[var(--color-ink)]/50">({i.variant}) × {i.qty}</span>
              </span>
              <span className="font-semibold">{vnd(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t border-[var(--color-ink)]/15 pt-3 text-sm">
          <div className="flex justify-between"><dt>Tạm tính</dt><dd>{vnd(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Phí ship</dt><dd>{shipping ? vnd(shipping) : "Miễn phí"}</dd></div>
          {shipping > 0 && (
            <p className="text-xs text-[var(--color-ink)]/55">Mua thêm {vnd(FREE_SHIP_MIN - subtotal)} để được miễn phí ship.</p>
          )}
          <div className="flex justify-between pt-2 text-base font-bold text-[var(--color-purple)]"><dt>Tổng</dt><dd>{vnd(total)}</dd></div>
        </dl>
      </aside>
    </section>
  );
}
