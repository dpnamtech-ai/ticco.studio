import { lang } from "next/root-params";
import { DEFAULT_LANG, isLang, type Lang } from "@/lib/i18n";

// Current language in a Server Component (the [lang] root segment; admin pages have none -> Vietnamese).
export async function getLang(): Promise<Lang> {
  const l = await lang();
  return isLang(l) ? l : DEFAULT_LANG;
}
