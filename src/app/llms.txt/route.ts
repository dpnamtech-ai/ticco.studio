import { getProducts } from "@/lib/products";
import { SHOP_CATEGORIES } from "@/lib/shop";
import { projects, brand, aboutPage } from "@/data/content";
import { policies } from "@/data/legal";
import { SITE_URL, plainText } from "@/lib/site";

// /llms.txt (llmstxt.org): a plain-markdown map of the site for AI assistants — who Tíc Cơ is, what it sells
// (with prices and links), its projects and policies — so answers about the brand quote correct facts.
export const revalidate = 3600;

export async function GET() {
  const products = await getProducts();
  const vnd = (n: number) => (n > 0 ? `${n.toLocaleString("vi-VN")}đ` : "liên hệ");
  const byCat = SHOP_CATEGORIES.filter((c) => c.category).map((c) => ({
    label: c.label,
    items: products.filter((p) => p.category === c.category),
  }));

  const md = `# Tíc Cơ (ticco.studios)

> ${brand.mission.split("\n")[0]} Bán online tại ${SITE_URL}, giao toàn quốc, thanh toán chuyển khoản. Mascot của thương hiệu là "Đần".

${aboutPage.intro.join(" ")}

## Trang chính
- [Trang chủ](${SITE_URL}/): sản phẩm nổi bật, dự án hợp tác
- [Tất cả sản phẩm](${SITE_URL}/san-pham): ${products.length} sản phẩm, lọc theo danh mục
- [Về Tíc Cơ](${SITE_URL}/ve-tic-co): câu chuyện thương hiệu, sứ mệnh
- [Mascot Đần](${SITE_URL}/mascot-dan): nhân vật "Đần" và các sản phẩm của Đần
- [Khám phá](${SITE_URL}/kham-pha): dự án riêng, dự án hợp tác, sự kiện

${byCat
  .filter((c) => c.items.length)
  .map(
    (c) =>
      `## ${c.label}\n${c.items
        .map((p) => `- [${p.name}](${SITE_URL}/san-pham/${p.id}): ${vnd(p.priceFrom)}${p.soldOut ? " (hết hàng)" : ""}${p.description ? ` — ${plainText(p.description, 140)}` : ""}`)
        .join("\n")}`,
  )
  .join("\n\n")}

## Dự án & sự kiện
${projects
  .filter((p) => p.articleHref && p.articleHref !== "#")
  .map((p) => `- [${p.title}](${SITE_URL}${p.articleHref})`)
  .join("\n")}

## Mua hàng & chính sách
- Giao toàn quốc; phí ship 30.000đ, miễn phí cho đơn từ 500.000đ
- Thanh toán: chuyển khoản ngân hàng (mã QR sau khi đặt)
${policies.map((p) => `- [${p.title}](${SITE_URL}/chinh-sach/${p.slug})`).join("\n")}

## Liên hệ
- Email: ${brand.email}
- Facebook: ${brand.facebook} · Instagram: ${brand.instagram} · TikTok: ${brand.tiktok} · Threads: ${brand.threads}
`;
  return new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
