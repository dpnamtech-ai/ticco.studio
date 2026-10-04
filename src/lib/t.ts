import en from "@/i18n/en.json";
import { DEFAULT_LANG, type Lang } from "@/lib/i18n";

// Translation: the Vietnamese source text is the key (whitespace-normalised), so Vietnamese renders exactly as before
// and English falls back to Vietnamese until a string is translated (scripts/i18n-check.mjs lists what's left).
// Kept out of i18n.ts so src/proxy.ts doesn't bundle the dictionary.
// ponytail: one dictionary for server and client (~60 KB raw, ~15 KB gzip in the client bundle); split it if it grows.

const EN = en as Record<string, string>;
const key = (s: string) => s.replace(/\s+/g, " ").trim();

// Same copy typed in capitals (the phone Figma frames set "TẤT CẢ SẢN PHẨM >" where desktop uses CSS uppercase):
// matched case-insensitively, and an all-caps source gets an all-caps translation.
let LOWER: Record<string, string> | undefined;
const lower = () => (LOWER ??= Object.fromEntries(Object.entries(EN).map(([k, v]) => [k.toLowerCase(), v])));

export function t(s: string, lang: Lang): string {
  if (lang === DEFAULT_LANG || !s) return s;
  const k = key(s);
  if (EN[k] !== undefined) return EN[k];
  const v = lower()[k.toLowerCase()];
  if (v === undefined) return s;
  return k === k.toUpperCase() ? v.toUpperCase() : v;
}

// Deep-translates every string in plain data (products, Figma page texts, legal pages); non-strings and paths
// ("/...", "#...") pass through unchanged.
export function tx<T>(data: T, lang: Lang): T {
  if (lang === DEFAULT_LANG) return data;
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") return /^[/#]/.test(v) ? v : t(v, lang);
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return walk(data) as T;
}
