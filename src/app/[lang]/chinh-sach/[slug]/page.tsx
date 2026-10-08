import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Fill from "@/components/Fill";
import { policies } from "@/data/legal";
import { getLang } from "@/lib/lang";
import { alternatesFor, localize, type Lang } from "@/lib/i18n";
import { t } from "@/lib/t";

export const dynamicParams = false;
export const generateStaticParams = () => policies.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = policies.find((x) => x.slug === slug);
  const lang = await getLang();
  // description = the policy's own opening lines (placeholders shown without brackets)
  const lead = p?.blocks.map((b) => block(b, lang)).join(" ").replace(/^- /gm, "").replace(/\n- /g, " ").replace(/[[\]]/g, "").replace(/\s+/g, " ");
  const title = t(p?.title ?? "", lang);
  return p ? { title: `${title} — Tíc Cơ`, description: `${title} Tíc Cơ: ${lead}`.slice(0, 157).replace(/\s+\S*$/, "") + "…", alternates: alternatesFor(`/chinh-sach/${p.slug}`, lang) } : {};
}

// A policy block in the page language. Whole blocks are in the dictionary; the seller-info block is built from
// fields, so it goes line by line, translating each "[placeholder]" and the text around it separately.
function block(b: string, lang: Lang) {
  const whole = t(b, lang);
  if (whole !== b) return whole;
  return b
    .split("\n")
    .map((line) =>
      line
        .split(/(\[[^\]]*\])/)
        .map((part) => (part.startsWith("[") ? t(part, lang) : part.replace(/[^·]+/g, (s) => (s.trim() ? s.replace(s.trim(), t(s.trim(), lang)) : s))))
        .join(""),
    )
    .join("\n");
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = policies.find((x) => x.slug === slug);
  if (!p) notFound();
  const lang = await getLang();
  const T = (s: string) => t(s, lang);
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 text-[0.9375rem] leading-relaxed text-[var(--color-ink)]">
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">{T(p.title)}</h1>
      <div className="space-y-4">
        {p.blocks.map((source, i) => {
          const b = block(source, lang);
          return b.startsWith("- ") ? (
            <ul key={i} className="list-disc space-y-1.5 pl-5">
              {b.split("\n").map((li) => (
                <li key={li}>
                  <Fill>{li.replace(/^- /, "")}</Fill>
                </li>
              ))}
            </ul>
          ) : /:$/.test(source) ? (
            // a section heading ("Phí vận chuyển:", "Quyền của khách hàng:" … in the client's policy sheet)
            <h2 key={i} className="pt-3 font-semibold">
              {b}
            </h2>
          ) : (
            <p key={i} className="whitespace-pre-line">
              <Fill>{b}</Fill>
            </p>
          );
        })}
      </div>
      <nav aria-label={T("Các chính sách khác")} className="mt-12 border-t border-[var(--color-ink)]/15 pt-6 text-sm">
        <p className="mb-2 font-semibold">{T("Chính sách khác")}</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {policies.filter((x) => x.slug !== p.slug).map((x) => (
            <li key={x.slug}>
              <Link href={localize(`/chinh-sach/${x.slug}`, lang)} className="text-[var(--color-purple)] hover:underline">
                {T(x.title)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
