// Shared checkout rules: used by the /checkout form (client) and POST /api/orders (server).
// Prices are ALWAYS recomputed on the server from the catalog; the client only sends product ids.

export const FREE_SHIP_MIN = 500_000;
// Client's shipping rule (policy sheet, 08/10), nationwide, by number of items in the order:
// 1-5 items 23.000đ, 6-10 items 30.000đ, more 45.000đ; free from 500.000đ.
// ponytail: the sheet stops at 15 items; bigger orders keep 45.000đ until the client says otherwise.
const SHIP_TIERS: [maxItems: number, fee: number][] = [[5, 23_000], [10, 30_000], [Infinity, 45_000]];

export type OrderItemInput = { id: string; variant: string; qty: number };

export type OrderInput = {
  name: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  note: string;
  /** "bank" = transfer first (QR after ordering), "cod" = pay the courier on delivery */
  payment: "bank" | "cod";
  items: OrderItemInput[];
};

export function shippingFor(subtotal: number, items: number) {
  if (subtotal <= 0 || items <= 0 || subtotal >= FREE_SHIP_MIN) return 0;
  return SHIP_TIERS.find(([max]) => items <= max)![1];
}

// Order code doubles as the bank-transfer note, letters/digits only (banks strip other characters).
// Client rule (08/10): "TICCO" + random digits. 6 digits from the clock (changes every second, repeats every ~11 days)
// + 2 random digits, so two orders would need the same second and the same 1-in-100 draw to collide.
export function makeOrderCode() {
  const clock = String(Math.floor(Date.now() / 1000) % 1_000_000).padStart(6, "0");
  return `TICCO${clock}${String(Math.floor(Math.random() * 100)).padStart(2, "0")}`;
}

// Per-line quantity cap, shared by the cart (clamps) and the server (rejects) so a cart can never hold an unorderable line.
export const MAX_QTY = 99;

const PHONE_RE = /^(0|\+84)\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidationResult =
  | { ok: true; value: OrderInput }
  | { ok: false; errors: Record<string, string> };

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function validateOrder(raw: unknown): ValidationResult {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const value: OrderInput = {
    name: str(r.name, 80),
    phone: str(r.phone, 20).replace(/[\s.\-]/g, ""),
    email: str(r.email, 120),
    province: str(r.province, 80),
    district: str(r.district, 80),
    ward: str(r.ward, 80),
    address: str(r.address, 200),
    note: str(r.note, 500),
    payment: r.payment === "cod" ? "cod" : "bank",
    items: [],
  };

  if (value.name.length < 2) errors.name = "Vui lòng nhập họ tên";
  if (!PHONE_RE.test(value.phone)) errors.phone = "Số điện thoại chưa đúng (10 số, bắt đầu bằng 0)";
  if (value.email && !EMAIL_RE.test(value.email)) errors.email = "Email chưa đúng";
  if (!value.province) errors.province = "Vui lòng nhập tỉnh / thành phố";
  // no quận/huyện since the 2025 merger; required only when the customer picks the old address format
  if (r.addrFormat === "cu" && !value.district) errors.district = "Vui lòng nhập quận / huyện";
  if (!value.ward) errors.ward = "Vui lòng nhập phường / xã";
  if (value.address.length < 5) errors.address = "Vui lòng nhập số nhà, tên đường";

  const items = Array.isArray(r.items) ? r.items : [];
  if (items.length === 0 || items.length > 30) errors.items = "Giỏ hàng trống";
  for (const it of items) {
    const o = (it && typeof it === "object" ? it : {}) as Record<string, unknown>;
    const qty = Number(o.qty);
    if (typeof o.id !== "string" || !o.id || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      errors.items = `Mỗi sản phẩm đặt tối đa ${MAX_QTY} cái, cần nhiều hơn bạn nhắn Tíc Cơ nhé`;
      break;
    }
    value.items.push({ id: o.id.slice(0, 80), variant: str(o.variant, 80), qty });
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}
