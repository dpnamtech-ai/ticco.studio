"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useCart } from "@/context/CartContext";
import AddressMap from "@/components/AddressMap";
import { FREE_SHIP_MIN, shippingFor } from "@/lib/checkout";
import { useLang, useT } from "@/components/LangSwitch";
import { localize } from "@/lib/i18n";
import { vnd as vndOf } from "@/lib/shopFigma";

// Shop QR poster + the account printed on it (for customers who transfer by hand); change both together.
const QR_SRC = "/images/qr-thanh-toan.jpg";
const ACCOUNT = { bank: "Techcombank", number: "19037100037019" }; // PHAM KHANH LY

type Placed = { code: string; subtotal: number; shipping: number; total: number; payment?: "bank" | "cod" };
const STORE_KEY = "ticco-last-order";

// addrFormat: "moi" = 2025 (tỉnh -> xã), "cu" = before 1/7/2025 (tỉnh -> quận/huyện -> xã); customer picks.
const empty = { name: "", phone: "", email: "", addrFormat: "moi", province: "", district: "", ward: "", address: "", note: "", payment: "bank", website: "" };

// label/error arrive in Vietnamese (field errors come from the server); shown in the page language
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const t = useT();
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-[var(--color-ink)]">{t(label)}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-600">{t(error)}</span>}
    </label>
  );
}

const input =
  "w-full rounded-lg border border-[var(--color-ink)]/20 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-[var(--color-purple)]";

function CopyRow({ label, value, shown = value }: { label: string; value: string; shown?: string }) {
  const t = useT();
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--color-ink)]/10 py-2 text-sm">
      <span className="whitespace-nowrap text-[var(--color-ink)]/60">{t(label)}</span>
      <span className="flex items-center gap-2 text-right font-semibold">
        {shown}
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(value);
            setDone(true);
            setTimeout(() => setDone(false), 1200);
          }}
          className="rounded border border-[var(--color-purple)]/40 px-2 py-0.5 text-xs text-[var(--color-purple)]"
        >
          {t(done ? "Đã chép" : "Chép")}
        </button>
      </span>
    </div>
  );
}

export default function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart();
  const lang = useLang();
  const t = useT();
  const vnd = (n: number) => vndOf(n, lang);
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
        body: JSON.stringify({ ...form, lang, items: items.map((i) => ({ id: i.id, variant: i.variant, qty: i.qty })) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.fields ?? {});
        // BUG-024: on a phone the message sits by the button, far below the field to fix: bring the first one into view
        requestAnimationFrame(() => document.querySelector("form .text-red-600")?.closest("label")?.scrollIntoView({ behavior: "smooth", block: "center" }));
        // errors.items has no input of its own: show its text instead of the generic "kiểm tra lại thông tin"
        setFormError(t(data.fields?.items ?? data.error ?? "Không gửi được đơn, vui lòng thử lại."));
        return;
      }
      const order: Placed = { code: data.code, subtotal: data.subtotal, shipping: data.shipping, total: data.total, payment: form.payment as Placed["payment"] };
      sessionStorage.setItem(STORE_KEY, JSON.stringify(order));
      setPlaced(order);
      clearCart();
      window.scrollTo({ top: 0 });
    } catch {
      setFormError(t("Mất kết nối, vui lòng thử lại."));
    } finally {
      setSending(false);
    }
  }

  // ---- Step 2: pay by bank transfer (static shop QR) ----
  // Placing an order empties the cart, so a non-empty cart means the customer started a NEW order after
  // this one: show the form again instead of trapping them on the old payment screen.
  // Cash on delivery: no QR, the shop calls to confirm and the courier collects the total.
  if (placed && items.length === 0 && placed.payment === "cod") {
    return (
      <section className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-2 font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">{t("Đặt hàng thành công")}</h1>
        <p className="mb-6 text-[var(--color-ink)]/75">
          {t("Cảm ơn bạn! Tíc Cơ đã nhận đơn")} <b>{placed.code}</b>{t(" và sẽ gọi xác nhận qua số điện thoại bạn đã nhập trước khi gửi hàng.")}
        </p>
        <div className="rounded-lg border-2 border-[var(--color-orange)] bg-[var(--color-orange)]/5 p-4">
          <p className="text-sm font-semibold text-[var(--color-orange)]">{t("Thanh toán khi nhận hàng (COD)")}</p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-purple)]">{vnd(placed.total)}</p>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">
            {t("Tạm tính")} {vnd(placed.subtotal)} · Ship {placed.shipping ? vnd(placed.shipping) : t("miễn phí")}. {t("Bạn trả số tiền này cho người giao hàng.")}
          </p>
        </div>
        <Link href={localize("/san-pham", lang)} className="mt-10 inline-block font-semibold text-[var(--color-orange)] hover:underline">
          {t("← Tiếp tục xem sản phẩm")}
        </Link>
      </section>
    );
  }

  if (placed && items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-2 font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">{t("Đặt hàng thành công")}</h1>
        <p className="mb-8 text-[var(--color-ink)]/75">
          {t("Cảm ơn bạn! Vui lòng chuyển khoản để Tíc Cơ xác nhận đơn")} <b>{placed.code}</b>{t(". Tíc Cơ sẽ liên hệ qua số điện thoại bạn đã nhập.")}
        </p>

        {/* Shop's own static poster QR (client's file, shown uncropped): it carries no amount/note, so those two
            sit in a highlighted box the customer copies from. Phones can't scan their own screen -> save button. */}
        <div className="grid items-start gap-8 md:grid-cols-[minmax(0,360px)_1fr]">
          <div className="mx-auto w-full max-w-[22.5rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={QR_SRC} alt={t("Mã QR chuyển khoản Tíc Cơ (Techcombank)")} width={1878} height={2560} className="h-auto w-full rounded-lg bg-white shadow-sm" />
            <a
              href={QR_SRC}
              download="tic-co-qr-chuyen-khoan.jpg"
              className="mt-3 block rounded-lg border-2 border-[var(--color-purple)] py-3 text-center font-semibold text-[var(--color-purple)] md:hidden"
            >
              {t("Lưu ảnh QR để quét trong app ngân hàng")}
            </a>
          </div>
          <div>
            <div className="rounded-lg border-2 border-[var(--color-orange)] bg-[var(--color-orange)]/5 p-4">
              <p className="mb-2 text-sm font-semibold text-[var(--color-orange)]">{t("Mã QR không tự điền, bạn nhập đúng 2 dòng này:")}</p>
              <CopyRow label="Số tiền" value={String(placed.total)} shown={vnd(placed.total)} />
              <CopyRow label="Nội dung" value={placed.code} />
            </div>
            <div className="mt-4">
              <CopyRow label={`STK ${ACCOUNT.bank}`} value={ACCOUNT.number} />
            </div>
            <p className="mt-4 text-sm text-[var(--color-ink)]/60">
              {t("Tạm tính")} {vnd(placed.subtotal)} · Ship {placed.shipping ? vnd(placed.shipping) : t("miễn phí")} · <b>{t("Tổng")} {vnd(placed.total)}</b>
            </p>
          </div>
        </div>

        <Link href={localize("/san-pham", lang)} className="mt-10 inline-block font-semibold text-[var(--color-orange)] hover:underline">
          {t("← Tiếp tục xem sản phẩm")}
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">{t("Giỏ hàng trống")}</h1>
        <Link href={localize("/san-pham", lang)} className="font-semibold text-[var(--color-orange)] hover:underline">
          {t("Xem sản phẩm →")}
        </Link>
      </section>
    );
  }

  // ---- Step 1: customer details ----
  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-6 py-12 md:grid-cols-[1fr_340px]">
      <form onSubmit={submit} noValidate className="space-y-5">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">{t("Thông tin nhận hàng")}</h1>

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
          <legend className="mb-1 block text-sm font-semibold text-[var(--color-ink)]">{t("Kiểu địa chỉ")}</legend>
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
              {t(label)}
            </label>
          ))}
        </fieldset>
        <div className={`grid gap-5 ${oldFmt ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          <Field label="Tỉnh / Thành phố" error={errors.province}>
            <Combobox
              value={form.province}
              options={provinces}
              placeholder={t("Gõ để tìm, vd: ha noi")}
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
                placeholder={t(form.province ? "Gõ để tìm quận/huyện" : "Chọn tỉnh/thành trước")}
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
              placeholder={t((oldFmt ? form.district : form.province) ? "Gõ để tìm phường/xã" : oldFmt ? "Chọn quận/huyện trước" : "Chọn tỉnh/thành trước")}
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

        <fieldset className="space-y-2 text-sm">
          <legend className="mb-1 block text-sm font-semibold text-[var(--color-ink)]">{t("Hình thức thanh toán")}</legend>
          {[
            ["bank", "Chuyển khoản trước (quét mã QR sau khi đặt)"],
            ["cod", "Thanh toán khi nhận hàng (COD)"],
          ].map(([v, label]) => (
            <label key={v} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="payment"
                value={v}
                checked={form.payment === v}
                onChange={() => setForm((f) => ({ ...f, payment: v }))}
                className="accent-[var(--color-purple)]"
              />
              {t(label)}
            </label>
          ))}
        </fieldset>

        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-lg bg-[var(--color-purple)] py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[var(--color-ink)] disabled:opacity-60"
        >
          {t(sending ? "Đang gửi…" : form.payment === "cod" ? "Đặt hàng" : "Đặt hàng và nhận mã chuyển khoản")}
        </button>
      </form>

      <aside className="h-fit rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-[var(--color-purple)]">{t("Đơn hàng của bạn")}</h2>
        <ul className="divide-y divide-[var(--color-ink)]/10 text-sm">
          {items.map((i) => (
            <li key={`${i.id}-${i.variant}`} className="flex justify-between gap-3 py-2">
              <span>
                {t(i.name)} <span className="text-[var(--color-ink)]/50">({t(i.variant)}) × {i.qty}</span>
              </span>
              <span className="whitespace-nowrap font-semibold">{vnd(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t border-[var(--color-ink)]/15 pt-3 text-sm">
          <div className="flex justify-between"><dt>{t("Tạm tính")}</dt><dd>{vnd(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>{t("Phí ship")}</dt><dd>{shipping ? vnd(shipping) : t("Miễn phí")}</dd></div>
          {shipping > 0 && (
            <p className="text-xs text-[var(--color-ink)]/55">{t("Mua thêm")} {vnd(FREE_SHIP_MIN - subtotal)} {t("để được miễn phí ship.")}</p>
          )}
          <div className="flex justify-between pt-2 text-base font-bold text-[var(--color-purple)]"><dt>{t("Tổng")}</dt><dd>{vnd(total)}</dd></div>
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
