// Two languages. Vietnamese keeps the unprefixed URLs (/san-pham/...): src/proxy.ts rewrites them to /vi/... inside
// the app, so every public route lives under src/app/[lang]. English is served under /en/....
export const LANGS = ["vi", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "vi";

export const isLang = (v: unknown): v is Lang => LANGS.includes(v as Lang);

// "/san-pham" -> "/san-pham" (vi) or "/en/san-pham" (en). External links and #anchors pass through untouched.
export function localize(path: string, lang: Lang) {
  if (lang === DEFAULT_LANG || !path.startsWith("/") || path.startsWith("//")) return path;
  return path === "/" ? "/en" : `/en${path}`;
}

// The current page's path without its language prefix, for the EN/VN switch.
export const stripLang = (pathname: string) => pathname.replace(/^\/(en|vi)(?=\/|$)/, "") || "/";

// <head> alternates for a page: canonical in its own language + hreflang links to both versions.
export const alternatesFor = (path: string, lang: Lang) => ({
  canonical: localize(path, lang),
  languages: { vi: path, en: localize(path, "en"), "x-default": path },
});
