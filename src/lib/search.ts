import { getProducts } from "@/lib/products";
import { figmaPages } from "@/data/project-pages";
import { projects } from "@/data/content";
import type { FigLeaf } from "@/components/FigmaCanvas";

// Site search (products + /kham-pha page texts), shared by the search drawer's /api/search and /tim-kiem.

// Typed with accents ("áo") -> accents must match, so "áo" doesn't hit "bao", "cao", "giao".
// Typed without ("so tay") -> accent-insensitive, so it still finds "Sổ tay". Either way a match must start a word.
const strip = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/gi, "d").toLowerCase();
const accented = (q: string) => strip(q) !== q.toLowerCase().normalize("NFC");
function matcher(q: string) {
  const key = accented(q) ? (s: string) => s.normalize("NFC").toLowerCase() : strip;
  const escaped = key(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}`, "u");
  return (text: string) => re.test(key(text));
}
const plain = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// Every text layer of a /kham-pha page (cards included), in reading order.
function pageTexts(slug: string) {
  return figmaPages[slug].sections
    .flatMap((s) => s.items.flatMap((it) => ("items" in it ? it.items : [it])))
    .filter((l): l is Extract<FigLeaf, { k: "text" }> => l.k === "text")
    .map((t) => t.text.replace(/\s+/g, " ").trim());
}

export const cleanQuery = (raw: string | string[] | null | undefined) => (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 80) ?? "";

export async function search(q: string) {
  if (!q) return { products: [], content: [] };
  const hit = matcher(q);
  // Products: name matches only; the description is a fallback when no name matches
  // (otherwise "áo" also lists every product whose blurb mentions a shirt).
  const all = await getProducts();
  const byName = all.filter((p) => hit(p.name));
  const products = byName.length ? byName : all.filter((p) => hit(plain(p.description)));
  const content = Object.keys(figmaPages).flatMap((slug) => {
    const title = slug === "kham-pha" ? "Khám phá - Dự án vui" : (projects.find((p) => p.id === slug)?.title ?? slug);
    const found = [title, ...pageTexts(slug)].find(hit);
    return found ? [{ slug, title, snippet: found === title ? "" : found, href: slug === "kham-pha" ? "/kham-pha" : `/kham-pha/${slug}` }] : [];
  });
  return { products, content };
}
