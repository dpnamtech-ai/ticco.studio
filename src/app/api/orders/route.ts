import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { supabaseAdmin } from "@/lib/supabase/server";
import { makeOrderCode, shippingFor, validateOrder, type OrderInput } from "@/lib/checkout";

// POST /api/orders - validates the form, re-prices the cart from the catalog (never trusts client prices),
// stores the order (Supabase, when configured) and emails the shop. Payment itself is a bank transfer
// (VietQR) confirmed by hand, so nothing here touches money.
//
// Env (all optional; missing ones only disable that step):
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
    ${o.note ? `<p>Ghi chú: ${esc(o.note)}</p>` : ""}
    <table cellpadding="6" style="border-collapse:collapse" border="1"><tr><th>Sản phẩm</th><th>SL</th><th>Thành tiền</th></tr>${rows}</table>
    <p>Tạm tính: ${vnd(subtotal)}<br>Phí ship: ${vnd(shipping)}<br><b>Tổng: ${vnd(total)}</b></p>
    <p>Khách chuyển khoản với nội dung <b>${esc(code)}</b>. Đối chiếu sao kê để xác nhận.</p>`;
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

async function saveOrder(code: string, o: OrderInput, lines: PricedLine[], subtotal: number, shipping: number, total: number) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return false;
  try {
    const { error } = await supabaseAdmin()
      .from("orders")
      .insert({
        code,
        customer: { name: o.name, phone: o.phone, email: o.email, province: o.province, district: o.district, ward: o.ward, address: o.address, note: o.note },
        items: lines,
        subtotal,
        shipping,
        total,
        status: "pending_payment",
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

  const parsed = validateOrder(body);
  if (!parsed.ok) return NextResponse.json({ error: "Vui lòng kiểm tra lại thông tin", fields: parsed.errors }, { status: 422 });
  const order = parsed.value;

  // Re-price every line from the catalog.
  const lines: PricedLine[] = [];
  for (const it of order.items) {
    const p = await getProduct(it.id);
    if (!p) return NextResponse.json({ error: `Sản phẩm không tồn tại: ${it.id}` }, { status: 422 });
    if (p.soldOut) return NextResponse.json({ error: `"${p.name}" đã hết hàng` }, { status: 422 });
    lines.push({ id: p.id, name: p.name, variant: it.variant, qty: it.qty, price: p.priceFrom });
  }

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  const code = makeOrderCode();

  const [stored, emailed] = await Promise.all([
    saveOrder(code, order, lines, subtotal, shipping, total),
    sendShopEmail(code, order, lines, subtotal, shipping, total),
  ]);

  return NextResponse.json({ code, subtotal, shipping, total, stored, emailed });
}
