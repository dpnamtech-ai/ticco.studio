import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getProducts, getProduct } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { suggestionsFor, variantLinksFor } from "@/lib/shop";
import { figmaDisplay, layoutBottom } from "@/lib/shopFigma";

const cq = (px: number) => `${Math.round((px / 12.8) * 1e4) / 1e4}cqw`;
const FOOTER_H = 337; // Figma footer height; everything above it in the frame belongs to this page
const CARD_H = 375; // suggestion card: 316 image + 20 + 19 name + 1 + 19 price

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Tíc Cơ`,
    description: `${product.name} — ${product.priceFrom.toLocaleString("vi-VN")} VNĐ. Sản phẩm Tíc Cơ.`,
  };
}

// Figma san-pham-* frames. Desktop values are Figma px / 12.8 (1280px frame = 100cqw).
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.id === slug);
  if (!product) notFound();

  const bundleItems = product.bundleItems
    ?.map((b) => {
      const item = products.find((p) => p.id === b.id);
      return item && { id: item.id, name: item.name, image: item.image, priceFrom: item.priceFrom, qty: b.qty };
    })
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  const f = figmaDisplay(product);
  const suggestions = suggestionsFor(products, product);
  // Frame positions of the "CÓ THỂ BẠN THÍCH" block and the page bottom, when the product has an exact layout.
  const L = f.layout;
  const vars = L && ({
    "--st": cq(L.suggest[1] - layoutBottom(L)),
    "--sx": cq(L.suggest[0]),
    "--ct": cq(L.cards[1] - L.suggest[1] - L.suggest[4]),
    "--pb": cq(L.frameH - FOOTER_H - L.cards[1] - CARD_H),
  } as CSSProperties);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image ? `https://ticcostudio.vercel.app${product.image}` : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: product.priceFrom || undefined,
      availability: product.soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  return (
    <section className="bg-[#f5f5f5]">
      <script
        type="application/ld+json"
        // product.name/description are admin-entered free text — escape "<" so they can't break out of the script tag (stored XSS)
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="max-w-[1280px] mx-auto [container-type:inline-size]">
      <div className={`px-4 lg:px-0 pt-6 pb-12 ${L ? "lg:pt-0 lg:pb-(--pb)" : "lg:pl-[7.031cqw] lg:pt-[4.375cqw] lg:pb-[5.781cqw]"}`} style={vars}>
        <ProductDetail
          id={product.id}
          name={product.name}
          priceFrom={product.priceFrom}
          title={f.title}
          priceLabel={f.detailPrice}
          description={
            product.description ||
            `${product.name} là sản phẩm thuộc dòng ${product.category} của Tíc Cơ — thiết kế đơn giản, dùng được hàng ngày.`
          }
          variants={product.variants ?? []}
          variantLinks={variantLinksFor(product.id)}
          specs={product.specs ?? []}
          note={product.note}
          gallery={f.gallery}
          extra={f.extra}
          soldOut={product.soldOut}
          bundleItems={bundleItems}
          layout={L}
        />

        {suggestions.length > 0 && (
          <section aria-labelledby="goi-y" className={`mt-12 ${L ? "lg:mt-(--st) lg:ml-(--sx)" : "lg:mt-[4.453cqw]"}`}>
            <Reveal variant="up">
              <h2 id="goi-y" className="text-lg lg:text-[1.5625cqw] leading-10 lg:leading-[7.031cqw] font-semibold tracking-[-0.8px] lg:tracking-[-0.0625cqw] text-[#53129e]">
                CÓ THỂ BẠN THÍCH:
              </h2>
            </Reveal>
            <div className={`mt-3 ${L ? "lg:mt-(--ct)" : "lg:-mt-[0.703cqw]"} grid grid-cols-2 lg:grid-cols-[repeat(4,19.766cqw)] gap-x-4 lg:gap-x-[1.953cqw] gap-y-8`}>
              {suggestions.map((p, i) => {
                const s = figmaDisplay(p);
                // Figma suggestion cards put the name 20px under the image (listing cards: 14px).
                return <ProductCard key={p.id} {...p} index={i} crop={s.cardCrop} priceLabel={s.cardPrice} nameClassName="lg:pt-[0.469cqw]" />;
              })}
            </div>
          </section>
        )}
      </div>
      </div>
    </section>
  );
}
