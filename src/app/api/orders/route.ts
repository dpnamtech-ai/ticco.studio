import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import { priceFor } from "@/lib/shop";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getShipRule } from "@/lib/ship-rule";
import { makeOrderCode, shippingFor, validateOrder, type OrderInput } from "@/lib/checkout";
import { t } from "@/lib/t";

// POST /api/orders - validates the form, re-prices the cart from the catalog (never trusts client prices),
// stores the order (Supabase, when configured) and emails the shop. Payment itself is a bank transfer
// (VietQR) confirmed by hand, so nothing here touches money.
//
// Env (each optional; a missing one only disables that step, but at least one must record the order):
//   ORDER_SHEET_URL, ORDER_SHEET_SECRET                       -> append a row to the Google Sheet (scripts/google-sheet-orders.gs)
//   RESEND_API_KEY, ORDER_NOTIFY_EMAIL [, ORDER_FROM_EMAIL]   -> email the shop
//   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY       -> save into the `orders` table

export const dynamic = "force-dynamic";

// Very small per-instance rate limit (spam guard, not a security boundary).
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const vnd = (n: number) => `${n.toLocaleString("vi-VN")} VNĐ`;

type PricedLine = { id: string; name: string; variant: string; qty: number; price: number };

async function sendShopEmail(code: string, o: OrderInput, lines: PricedLine[], subtotal: number, shipping: number, total: number) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!key || !to) {
    console.log(`[orders] email not configured - new order ${code}: ${total} VND, ${o.name} ${o.phone}`);
    return false;
  }
  const rows = lines
    .map((l) => `<tr><td>${esc(l.name)}${l.variant ? ` (${esc(l.variant)})` : ""}</td><td align="right">${l.qty}</td><td align="right">${vnd(l.price * l.qty)}</td></tr>`)
    .join("");
  const html = `
    <h2>Đơn hàng mới ${esc(code)}</h2>
    <p><b>${esc(o.name)}</b> · ${esc(o.phone)}${o.email ? ` · ${esc(o.email)}` : ""}</p>
    <p>${esc([o.address, o.ward, o.district, o.province].join(", "))}</p>
    <p><b>${o.payment === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản trước"}</b></p>
    ${o.note ? `<p>Ghi chú: ${esc(o.note)}</p>` : ""}
    <table cellpadding="6" style="border-collapse:collapse" border="1"><tr><th>Sản phẩm</th><th>SL</th><th>Thành tiền</th></tr>${rows}</table>
    <p>Tạm tính: ${vnd(subtotal)}<br>Phí ship: ${vnd(shipping)}<br><b>Tổng: ${vnd(total)}</b></p>
    ${o.payment === "cod" ? `<p>Gọi khách xác nhận rồi gửi hàng thu hộ <b>${vnd(total)}</b>.</p>` : `<p>Khách chuyển khoản với nội dung <b>${esc(code)}</b>. Đối chiếu sao kê để xác nhận.</p>`}`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ORDER_FROM_EMAIL ?? "Tíc Cơ <onboarding@resend.dev>",
        to: [to],
        subject: `Đơn mới ${code} - ${vnd(total)}`,
        html,
        ...(o.email ? { reply_to: o.email } : {}),
      }),
    });
    if (!res.ok) console.error("[orders] resend failed", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("[orders] resend error", e);
    return false;
  }
}

// Customer text must never be read as a formula by Google Sheets ("=IMPORTXML(...)" could leak other rows):
// a leading apostrophe makes the cell plain text and is not shown.
const cell = (v: string) => (/^[=+\-@\t\r]/.test(v) ? `'${v}` : v);

// Apps Script now and then answers with an error page instead of its JSON (seen live 2026-10-04: a COD order failed,
// the same order went through seconds later). One retry; if the first write did land, the shop sees a duplicate row,
// which beats losing the order.
async function sendToSheet(code: string, o: OrderInput, lines: PricedLine[], subtotal: number, shipping: number, total: number) {
  const first = await sendToSheetOnce(code, o, lines, subtotal, shipping, total);
  if (first !== null || !process.env.ORDER_SHEET_URL) return first;
  await new Promise((r) => setTimeout(r, 1500));
  return sendToSheetOnce(code, o, lines, subtotal, shipping, total);
}

async function sendToSheetOnce(code: string, o: OrderInput, lines: PricedLine[], subtotal: number, shipping: number, total: number) {
  const url = process.env.ORDER_SHEET_URL;
  if (!url) return null;
  try {
    // Apps Script answers a POST with a redirect to the result; fetch follows it.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.ORDER_SHEET_SECRET,
        code,
        // COD also goes into the note, so it shows even before the sheet script with the COD status is deployed
        customer: Object.fromEntries(
          Object.entries({ ...o, note: o.payment === "cod" ? `[COD] ${o.note}`.trim() : o.note })
            .filter(([k]) => k !== "items")
            .map(([k, v]) => [k, cell(String(v))]),
        ),
        items: lines.map((l) => ({ ...l, name: cell(l.name), variant: cell(l.variant) })),
        subtotal,
        shipping,
        total,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    const out = (await res.json().catch(() => null)) as { ok?: boolean; code?: string } | null;
    if (!out?.ok) console.error("[orders] sheet rejected", res.status, out);
    // The sheet draws the code (TICCO + digits; an older script numbered TC00001…) and returns what it wrote; the
    // oldest script returns none. Keep the sheet's code either way so the row and the customer see the same one.
    return out?.ok ? (out.code && /^(TICCO|TC)\d+$/.test(out.code) ? out.code : code) : null;
  } catch (e) {
    console.error("[orders] sheet error", e);
    return null;
  }
}

async function saveOrder(code: string, o: OrderInput, lines: PricedLine[], subtotal: number, shipping: number, total: number) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return false;
  try {
    const { error } = await supabaseAdmin()
      .from("orders")
      .insert({
        code,
        customer: { name: o.name, phone: o.phone, email: o.email, province: o.province, district: o.district, ward: o.ward, address: o.address, note: o.note, payment: o.payment },
        items: lines,
        subtotal,
        shipping,
        total,
        status: o.payment === "cod" ? "pending_cod" : "pending_payment",
      });
    if (error) console.error("[orders] supabase insert failed", error.message);
    return !error;
  } catch (e) {
    console.error("[orders] supabase error", e);
    return false;
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ error: "Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút." }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
  // Honeypot: real users never fill this hidden field.
  if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  // Messages with a product name in them are written per language here; fixed ones are translated by the checkout page.
  const en = (body as Record<string, unknown>)?.lang === "en";
  const parsed = validateOrder(body);
  if (!parsed.ok) return NextResponse.json({ error: "Vui lòng kiểm tra lại thông tin", fields: parsed.errors }, { status: 422 });
  const order = parsed.value;

  // Re-price every line from the catalog.
  const catalog = new Map((await getProducts()).map((p) => [p.id, p]));
  const lines: PricedLine[] = [];
  for (const it of order.items) {
    const p = catalog.get(it.id);
    if (!p) return NextResponse.json({ error: en ? `Product not found: ${it.id}` : `Sản phẩm không tồn tại: ${it.id}` }, { status: 422 });
    if (p.soldOut) return NextResponse.json({ error: en ? `"${t(p.name, "en")}" is sold out` : `"${p.name}" đã hết hàng` }, { status: 422 });
    // stock 0 = "not tracked" (the column defaults to 0), so only enforce it once an admin has entered a count.
    if (!p.bundleItems?.length && (p.stock ?? 0) > 0 && it.qty > p.stock!) {
      return NextResponse.json({ error: en ? `Only ${p.stock} left of "${t(p.name, "en")}"` : `"${p.name}" chỉ còn ${p.stock} sản phẩm` }, { status: 422 });
    }
    lines.push({ id: p.id, name: p.name, variant: it.variant, qty: it.qty, price: priceFor(p, it.variant) });
  }

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = shippingFor(subtotal, lines.reduce((n, l) => n + l.qty, 0), await getShipRule());
  const total = subtotal + shipping;
  // Sheet first: it hands out the sequential code. Sheet down → random fallback code, DB/email still record it.
  // ponytail: a sheet timeout AFTER writing leaves the row with its own code but the customer/email with the fallback code.
  const sheetCode = await sendToSheet(makeOrderCode(), order, lines, subtotal, shipping, total);
  const sheeted = sheetCode !== null;
  const code = sheetCode ?? makeOrderCode();

  const [stored, emailed] = await Promise.all([
    saveOrder(code, order, lines, subtotal, shipping, total),
    sendShopEmail(code, order, lines, subtotal, shipping, total),
  ]);
  // Never tell the customer "đặt hàng thành công" (and show the QR) for an order the shop has no record of.
  if (!stored && !sheeted && !emailed) {
    console.error(`[orders] order ${code} was not recorded anywhere`, JSON.stringify({ order, lines, total }));
    return NextResponse.json({ error: "Chưa gửi được đơn hàng, bạn thử lại sau ít phút hoặc nhắn Tíc Cơ qua Facebook/Instagram nhé." }, { status: 503 });
  }

  return NextResponse.json({ code, subtotal, shipping, total, stored, sheeted, emailed });
}
