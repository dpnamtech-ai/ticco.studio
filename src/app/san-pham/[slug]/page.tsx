import type { Metadata } from "next";
import { abs, plainText } from "@/lib/site";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getProducts, getProduct } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { suggestionsFor, variantImagesFor, variantLinksForProduct } from "@/lib/shop";
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
  const price = product.priceFrom > 0 ? `${product.priceFrom.toLocaleString("vi-VN")}đ` : "";
  const blurb = plainText(product.description, 120);
  return {
    title: `${product.name}${price ? ` — ${price}` : ""} | Tíc Cơ`,
    description: blurb ? `${blurb}${price ? ` Giá ${price}.` : ""}` : `${product.name} của Tíc Cơ — ${product.category}.`,
    keywords: [product.name, product.category, "Tíc Cơ", "quà tặng", "thương hiệu Việt"],
    alternates: { canonical: `/san-pham/${product.id}` },
    openGraph: { type: "website", title: product.name, images: product.image ? [product.image] : undefined },
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

  const url = abs(`/san-pham/${product.id}`);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.name,
        sku: product.id,
        url,
        category: product.category,
        description: plainText(product.description, 500),
        image: [product.image, ...(product.thumbnails ?? [])].filter((s): s is string => Boolean(s)).map(abs),
        brand: { "@type": "Brand", name: "Tíc Cơ" },
        ...(product.priceFrom > 0 && {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "VND",
            price: product.priceFrom,
            itemCondition: "https://schema.org/NewCondition",
            availability: product.soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            seller: { "@id": `${abs("/")}#org` },
          },
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: abs("/") },
          { "@type": "ListItem", position: 2, name: "Sản phẩm", item: abs("/san-pham") },
          { "@type": "ListItem", position: 3, name: product.name, item: url },
        ],
      },
    ],
  };

  return (
    <section className="bg-[#f5f5f5]">
      <script
        type="application/ld+json"
        // product.name/description are admin-entered free text — escape "<" so they can't break out of the script tag (stored XSS)
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />
      <div className=" [container-type:inline-size]">
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
          variantLinks={variantLinksForProduct(product.id, product.variantOptions)}
          variantImages={variantImagesFor(product.id, product.variantOptions)}
          variantOptions={product.variantOptions}
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
