"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useCart } from "@/context/CartContext";
import AddressMap from "@/components/AddressMap";
import { FREE_SHIP_MIN, shippingFor } from "@/lib/checkout";

// Bank account shown after checkout (public info). Set in .env.local / Vercel:
//   NEXT_PUBLIC_BANK_ID (bank name shown to the customer, e.g. MB, VCB, ACB), NEXT_PUBLIC_BANK_ACCOUNT, NEXT_PUBLIC_BANK_ACCOUNT_NAME
const BANK = {
  id: process.env.NEXT_PUBLIC_BANK_ID ?? "",
  account: process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? "",
  name: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? "",
};

type Placed = { code: string; subtotal: number; shipping: number; total: number };
const STORE_KEY = "ticco-last-order";
const vnd = (n: number) => `${n.toLocaleString("vi-VN")} VNĐ`;

// addrFormat: "moi" = 2025 (tỉnh -> xã), "cu" = before 1/7/2025 (tỉnh -> quận/huyện -> xã); customer picks.
const empty = { name: "", phone: "", email: "", addrFormat: "moi", province: "", district: "", ward: "", address: "", note: "", website: "" };

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
  // tỉnh/thành -> phường/xã, public/data/vn-dia-gioi.json (provinces.open-api.vn v2, 34 tỉnh / 3321 xã, 2025)
  const [units, setUnits] = useState<Record<string, string[]> | null>(null);
  useEffect(() => {
    fetch("/data/vn-dia-gioi.json").then((r) => r.json()).then(setUnits).catch(() => setUnits({}));
  }, []);
  // old 3-level units, public/data/vn-dia-gioi-cu.json (provinces.open-api.vn v1, 63 tỉnh / 696 huyện / 10051 xã); loaded only if picked
  const oldFmt = form.addrFormat === "cu";
  const [oldUnits, setOldUnits] = useState<Record<string, Record<string, string[]>> | null>(null);
  useEffect(() => {
    if (oldFmt && !oldUnits) fetch("/data/vn-dia-gioi-cu.json").then((r) => r.json()).then(setOldUnits).catch(() => setOldUnits({}));
  }, [oldFmt, oldUnits]);
  const provinces = Object.keys((oldFmt ? oldUnits : units) ?? {});
  const districts = Object.keys(oldUnits?.[form.province] ?? {});
  const wards = (oldFmt ? oldUnits?.[form.province]?.[form.district] : units?.[form.province]) ?? [];

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

  // ---- Step 2: pay by bank transfer (static shop QR) ----
  // Placing an order empties the cart, so a non-empty cart means the customer started a NEW order after
  // this one: show the form again instead of trapping them on the old payment screen.
  if (placed && items.length === 0) {
    const configured = BANK.id && BANK.account;
    return (
      <section className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-2 font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">Đặt hàng thành công</h1>
        <p className="mb-8 text-[var(--color-ink)]/75">
          Cảm ơn bạn! Vui lòng chuyển khoản để Tíc Cơ xác nhận đơn <b>{placed.code}</b>. Tíc Cơ sẽ liên hệ qua số điện thoại bạn đã nhập.
        </p>

        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <div className="rounded-lg bg-white p-3 text-center shadow-sm">
            {/* Shop's own static QR (client's choice, no VietQR): the customer types the amount + note from the rows beside it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/qr-thanh-toan.png"
              alt="Mã QR chuyển khoản Tíc Cơ"
              className="mx-auto h-auto w-full"
              width={240}
              height={240}
              // Until the shop's QR file is uploaded, show a note instead of a broken image.
              onError={(e) => e.currentTarget.replaceWith(Object.assign(document.createElement("p"), { className: "p-6 text-sm text-[var(--color-ink)]/60", textContent: "Chuyển khoản theo thông tin tài khoản trong trang này, Tíc Cơ sẽ liên hệ xác nhận." }))}
            />
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

        {/* Since 1/7/2025 Vietnam has 2 levels: 34 tỉnh/thành -> phường/xã (no quận/huyện). Old 3-level kept for customers used to it. */}
        <fieldset className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <legend className="mb-1 block text-sm font-semibold text-[var(--color-ink)]">Kiểu địa chỉ</legend>
          {[
            ["moi", "Địa chỉ mới (từ 1/7/2025)"],
            ["cu", "Địa chỉ cũ (có quận/huyện)"],
          ].map(([v, label]) => (
            <label key={v} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="addrFormat"
                value={v}
                checked={form.addrFormat === v}
                onChange={() => {
                  // province/ward names differ between the two lists, so start over
                  setForm((f) => ({ ...f, addrFormat: v, province: "", district: "", ward: "" }));
                  setErrors((er) => ({ ...er, province: "", district: "", ward: "" }));
                }}
                className="accent-[var(--color-purple)]"
              />
              {label}
            </label>
          ))}
        </fieldset>
        <div className={`grid gap-5 ${oldFmt ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          <Field label="Tỉnh / Thành phố" error={errors.province}>
            <Combobox
              value={form.province}
              options={provinces}
              placeholder="Gõ để tìm, vd: ha noi"
              autoComplete="address-level1"
              onChange={(v) => {
                setForm((f) => (f.province === v ? f : { ...f, province: v, district: "", ward: "" }));
                setErrors((er) => ({ ...er, province: "" }));
              }}
            />
          </Field>
          {oldFmt && (
            <Field label="Quận / Huyện" error={errors.district}>
              <Combobox
                value={form.district}
                options={districts}
                placeholder={form.province ? "Gõ để tìm quận/huyện" : "Chọn tỉnh/thành trước"}
                autoComplete="address-level2"
                onChange={(v) => {
                  setForm((f) => (f.district === v ? f : { ...f, district: v, ward: "" }));
                  setErrors((er) => ({ ...er, district: "" }));
                }}
              />
            </Field>
          )}
          <Field label="Phường / Xã" error={errors.ward}>
            <Combobox
              value={form.ward}
              options={wards}
              placeholder={(oldFmt ? form.district : form.province) ? "Gõ để tìm phường/xã" : oldFmt ? "Chọn quận/huyện trước" : "Chọn tỉnh/thành trước"}
              onChange={(v) => {
                setForm((f) => ({ ...f, ward: v }));
                setErrors((er) => ({ ...er, ward: "" }));
              }}
            />
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

// Accent-insensitive: "ha noi" / "HN"-style partials find "Thành phố Hà Nội"; "dinh" finds "Phường Ba Đình".
const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/gi, "d").toLowerCase();

// Type-to-filter dropdown. Free text is still accepted (a new ward name, or the list failed to load);
// options only help the customer pick the exact official name quickly.
function Combobox({ value, options, onChange, placeholder, autoComplete }: { value: string; options: string[]; onChange: (v: string) => void; placeholder?: string; autoComplete?: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const q = fold(value.trim());
  const matches = (q ? options.filter((o) => fold(o).includes(q)) : options).slice(0, 50);
  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };
  return (
    <div className="relative">
      <input
        className={input}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete ?? "off"}
        role="combobox"
        aria-controls={listId}
        aria-expanded={open && matches.length > 0}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (!open || !matches.length) return;
          if (e.key === "Escape") return setOpen(false);
          const next = { ArrowDown: Math.min(active + 1, matches.length - 1), ArrowUp: Math.max(active - 1, 0) }[e.key];
          if (next !== undefined) {
            e.preventDefault();
            setActive(next);
          } else if (e.key === "Enter") {
            e.preventDefault();
            pick(matches[active]);
          }
        }}
      />
      {open && matches.length > 0 && !(matches.length === 1 && matches[0] === value) && (
        <ul id={listId} role="listbox" className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-[var(--color-ink)]/15 bg-white py-1 shadow-lg">
          {matches.map((o, i) => (
            <li
              key={o}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(o);
              }}
              className={`cursor-pointer px-4 py-2 text-sm ${i === active ? "bg-[var(--color-purple)]/10 text-[var(--color-purple)]" : ""}`}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
