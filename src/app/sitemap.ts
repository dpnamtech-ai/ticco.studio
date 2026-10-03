import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { SITE_URL as BASE } from "@/lib/site";
import { SHOP_CATEGORIES } from "@/lib/shop";
import { policies } from "@/data/legal";
import { figmaPages } from "@/data/project-pages";
import { LANGS, localize } from "@/lib/i18n";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const paths = [
    "/",
    "/san-pham",
    "/kham-pha",
    "/ve-tic-co",
    "/mascot-dan",
    ...SHOP_CATEGORIES.filter((c) => c.slug !== "tat-ca").map((c) => `/san-pham?danh-muc=${c.slug}`),
    ...Object.keys(figmaPages).filter((k) => k !== "kham-pha").map((k) => `/kham-pha/${k}`),
    ...policies.map((p) => `/chinh-sach/${p.slug}`),
    ...products.map((p) => `/san-pham/${p.id}`),
  ];

  // every page in both languages, each entry pointing at its other-language version (hreflang)
  const languages = (path: string) => ({ vi: `${BASE}${path}`, en: `${BASE}${localize(path, "en")}` });
  return paths.flatMap((path) =>
    LANGS.map((lang) => ({ url: `${BASE}${localize(path, lang)}`, lastModified: new Date(), alternates: { languages: languages(path) } })),
  );
}
