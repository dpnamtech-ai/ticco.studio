// Shared checkout rules: used by the /checkout form (client) and POST /api/orders (server).
// Prices are ALWAYS recomputed on the server from the catalog; the client only sends product ids.

export const FREE_SHIP_MIN = 500_000;
// Placeholder flat fee until the Giao Hàng Nhanh fee API is wired in (see /api/orders).
export const SHIP_FEE = 30_000;

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
  items: OrderItemInput[];
};

export function shippingFor(subtotal: number) {
  return subtotal <= 0 || subtotal >= FREE_SHIP_MIN ? 0 : SHIP_FEE;
}

// Order code doubles as the bank-transfer note: 10 chars, letters/digits only (banks strip other characters).
export function makeOrderCode() {
  const t = Date.now().toString(36).toUpperCase().slice(-5).padStart(5, "0");
  const r = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").padEnd(3, "X").slice(0, 3);
  return `TC${t}${r}`;
}

// VietQR image (public quick-link service, no key needed). Bank = short code such as "MB", "VCB", "ACB".
export function vietQrUrl(p: { bank: string; account: string; name?: string; amount: number; info: string }) {
  const q = new URLSearchParams({ amount: String(p.amount), addInfo: p.info });
  if (p.name) q.set("accountName", p.name);
  return `https://img.vietqr.io/image/${encodeURIComponent(p.bank)}-${encodeURIComponent(p.account)}-compact2.png?${q}`;
}

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
    items: [],
  };

  if (value.name.length < 2) errors.name = "Vui lòng nhập họ tên";
  if (!PHONE_RE.test(value.phone)) errors.phone = "Số điện thoại chưa đúng (10 số, bắt đầu bằng 0)";
  if (value.email && !EMAIL_RE.test(value.email)) errors.email = "Email chưa đúng";
  if (!value.province) errors.province = "Vui lòng nhập tỉnh / thành phố";
  if (!value.district) errors.district = "Vui lòng nhập quận / huyện";
  if (!value.ward) errors.ward = "Vui lòng nhập phường / xã";
  if (value.address.length < 5) errors.address = "Vui lòng nhập số nhà, tên đường";

  const items = Array.isArray(r.items) ? r.items : [];
  if (items.length === 0 || items.length > 30) errors.items = "Giỏ hàng trống";
  for (const it of items) {
    const o = (it && typeof it === "object" ? it : {}) as Record<string, unknown>;
    const qty = Number(o.qty);
    if (typeof o.id !== "string" || !o.id || !Number.isInteger(qty) || qty < 1 || qty > 20) {
      errors.items = "Sản phẩm trong giỏ không hợp lệ";
      break;
    }
    value.items.push({ id: o.id.slice(0, 80), variant: str(o.variant, 80), qty });
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}
