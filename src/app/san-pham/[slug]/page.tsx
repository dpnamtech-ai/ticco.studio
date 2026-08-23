import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getProduct } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";

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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

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
    <section className="max-w-7xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetail
        id={product.id}
        name={product.name}
        priceFrom={product.priceFrom}
        unit={product.unit ?? "sản phẩm"}
        description={
          product.description ??
          `${product.name} là sản phẩm thuộc dòng ${product.category} của Tíc Cơ — thiết kế đơn giản, dùng được hàng ngày.`
        }
        variants={product.variants ?? ["Mặc định"]}
        specs={product.specs ?? []}
        note={product.note}
        image={product.image}
        thumbnails={product.thumbnails}
        soldOut={product.soldOut}
      />
    </section>
  );
}
