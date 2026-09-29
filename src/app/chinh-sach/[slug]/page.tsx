import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Fill from "@/components/Fill";
import { policies } from "@/data/legal";

export const dynamicParams = false;
export const generateStaticParams = () => policies.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = policies.find((x) => x.slug === slug);
  // description = the policy's own opening lines (placeholders shown without brackets)
  const lead = p?.blocks.join(" ").replace(/^- /gm, "").replace(/\n- /g, " ").replace(/[[\]]/g, "").replace(/\s+/g, " ");
  return p ? { title: `${p.title} — Tíc Cơ`, description: `${p.title} Tíc Cơ: ${lead}`.slice(0, 157).replace(/\s+\S*$/, "") + "…", alternates: { canonical: `/chinh-sach/${p.slug}` } } : {};
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = policies.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 text-[15px] leading-relaxed text-[var(--color-ink)]">
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">{p.title}</h1>
      <div className="space-y-4">
        {p.blocks.map((b, i) =>
          b.startsWith("- ") ? (
            <ul key={i} className="list-disc space-y-1.5 pl-5">
              {b.split("\n").map((li) => (
                <li key={li}>
                  <Fill>{li.replace(/^- /, "")}</Fill>
                </li>
              ))}
            </ul>
          ) : (
            <p key={i}>
              <Fill>{b}</Fill>
            </p>
          ),
        )}
      </div>
      <nav aria-label="Các chính sách khác" className="mt-12 border-t border-[var(--color-ink)]/15 pt-6 text-sm">
        <p className="mb-2 font-semibold">Chính sách khác</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {policies.filter((x) => x.slug !== p.slug).map((x) => (
            <li key={x.slug}>
              <Link href={`/chinh-sach/${x.slug}`} className="text-[var(--color-purple)] hover:underline">
                {x.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
