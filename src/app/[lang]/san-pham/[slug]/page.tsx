import type { Metadata } from "next";
import { abs, plainText } from "@/lib/site";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getProducts, getProduct } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { suggestionsFor, variantImagesFor, variantLinksForProduct } from "@/lib/shop";
import { figmaDisplay, layoutBottom, vnd } from "@/lib/shopFigma";
import { getLang } from "@/lib/lang";
import { alternatesFor, localize } from "@/lib/i18n";
import { t, tx } from "@/lib/t";

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
  const lang = await getLang();
  const T = (s: string) => t(s, lang);
  const name = T(product.name);
  const price = product.priceFrom > 0 ? (lang === "en" ? vnd(product.priceFrom, lang) : `${product.priceFrom.toLocaleString("vi-VN")}đ`) : "";
  const blurb = plainText(T(product.description), 120);
  return {
    title: `${name}${price ? ` — ${price}` : ""} ${T("| Tíc Cơ")}`,
    description: blurb ? `${blurb}${price ? ` ${T("Giá")} ${price}.` : ""}` : `${name} ${T("của Tíc Cơ —")} ${T(product.category)}.`,
    keywords: [name, T(product.category), "Tíc Cơ", T("quà tặng"), T("thương hiệu Việt")],
    alternates: alternatesFor(`/san-pham/${product.id}`, lang),
    openGraph: { type: "website", title: name, images: product.image ? [product.image] : undefined },
  };
}

// Shrink for a translated title longer than the Figma copy: single lines keep their width, multi-line their area.
const fitRatio = (source: string, shown: string) => {
  const r = source.replace(/\s+/g, "").length / shown.replace(/\s+/g, "").length;
  return r >= 1 ? 1 : source.includes("\n") ? Math.sqrt(r) : r;
};

// Figma san-pham-* frames. Desktop values are Figma px / 12.8 (1280px frame = 100cqw).
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lang = await getLang();
  const T = (s: string) => t(s, lang);
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

  const url = abs(localize(`/san-pham/${product.id}`, lang));
  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: T(product.name),
        sku: product.id,
        url,
        category: T(product.category),
        description: plainText(T(product.description), 500),
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
            seller: { "@id": `${abs(localize("/", lang))}#org` },
          },
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: T("Trang chủ"), item: abs(localize("/", lang)) },
          { "@type": "ListItem", position: 2, name: T("Sản phẩm"), item: abs(localize("/san-pham", lang)) },
          { "@type": "ListItem", position: 3, name: T(product.name), item: url },
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
          title={T(f.title)}
          titleFit={fitRatio(f.title, T(f.title))}
          priceLabel={T(f.detailPrice)}
          description={
            T(product.description) ||
            `${T(product.name)} ${T("là sản phẩm thuộc dòng")} ${T(product.category)} ${T("của Tíc Cơ — thiết kế đơn giản, dùng được hàng ngày.")}`
          }
          variants={product.variants ?? []}
          variantLinks={variantLinksForProduct(product.id, product.variantOptions)}
          variantImages={variantImagesFor(product.id, product.variantOptions)}
          variantOptions={product.variantOptions}
          specs={(product.specs ?? []).map(T)}
          note={product.note && T(product.note)}
          gallery={f.gallery}
          extra={tx(f.extra, lang)}
          soldOut={product.soldOut}
          bundleItems={bundleItems}
          layout={L}
        />

        {suggestions.length > 0 && (
          <section aria-labelledby="goi-y" className={`mt-12 ${L ? "lg:mt-(--st) lg:ml-(--sx)" : "lg:mt-[4.453cqw]"}`}>
            <Reveal variant="up">
              <h2 id="goi-y" className="text-lg lg:text-[1.5625cqw] leading-10 lg:leading-[7.031cqw] font-semibold tracking-[-0.8px] lg:tracking-[-0.0625cqw] text-[#53129e]">
                {T("CÓ THỂ BẠN THÍCH:")}
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
