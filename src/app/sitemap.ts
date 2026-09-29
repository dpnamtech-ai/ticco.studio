import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { policies } from "@/data/legal";
import { figmaPages } from "@/data/project-pages";

const BASE = "https://ticcostudio.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const staticRoutes = [
    "/",
    "/san-pham",
    "/kham-pha",
    "/ve-tic-co",
    "/mascot-dan",
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
