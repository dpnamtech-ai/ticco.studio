"use client";

import { useParams, usePathname } from "next/navigation";
import { DEFAULT_LANG, LANGS, isLang, localize, stripLang, type Lang } from "@/lib/i18n";

// Current language from the [lang] route segment (proxy rewrites unprefixed URLs to /vi/...).
export function useLang(): Lang {
  const { lang } = useParams<{ lang?: string }>();
  return isLang(lang) ? lang : DEFAULT_LANG;
}

// The current page without its language prefix, e.g. /en/san-pham -> /san-pham (for active states and the switch).
export function usePagePath() {
  return stripLang(usePathname());
}

const LABEL = { short: { vi: "VN", en: "EN" }, long: { vi: "Tiếng Việt", en: "English" } } as const;

// EN/VN switch: the same page in the other language. The query (?danh-muc=, ?q=) and #section are carried over on
// click rather than read with useSearchParams, which would opt every static page out of prerendering.
export default function LangSwitch({ variant, className = "", onSwitch }: { variant: "short" | "long"; className?: string; onSwitch?: () => void }) {
  const lang = useLang();
  const path = usePagePath();
  return (
    <div className={`flex items-center ${className}`} aria-label="Ngôn ngữ / Language">
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden className="mx-[0.4em] opacity-60">·</span>}
          {l === lang ? (
            <span aria-current="true" className="font-extrabold">
              {LABEL[variant][l]}
            </span>
          ) : (
            // plain <a>: a full load for the other language; Link would ignore the href rewritten on click
            <a
              href={localize(path, l)}
              hrefLang={l}
              lang={l}
              onClick={(e) => {
                e.currentTarget.href = localize(path, l) + location.search + location.hash;
                onSwitch?.();
              }}
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              {LABEL[variant][l]}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}
