import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { SITE_URL as BASE } from "@/lib/site";
import { SHOP_CATEGORIES } from "@/lib/shop";
import { policies } from "@/data/legal";
import { figmaPages } from "@/data/project-pages";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const staticRoutes = [
    "/",
    "/san-pham",
    "/kham-pha",
    "/ve-tic-co",
    "/mascot-dan",
    ...SHOP_CATEGORIES.filter((c) => c.slug !== "tat-ca").map((c) => `/san-pham?danh-muc=${c.slug}`),
    ...Object.keys(figmaPages).filter((k) => k !== "kham-pha").map((k) => `/kham-pha/${k}`),
    ...policies.map((p) => `/chinh-sach/${p.slug}`),
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${BASE}/san-pham/${p.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
