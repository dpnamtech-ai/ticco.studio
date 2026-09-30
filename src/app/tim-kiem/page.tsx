import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { SHOP_CATEGORIES } from "@/lib/shop";
import { vnd } from "@/lib/shopFigma";
import { cleanQuery, search } from "@/lib/search";

export const metadata: Metadata = { title: "Tìm kiếm — Tíc Cơ", robots: { index: false } };

type SearchParams = Promise<{ q?: string | string[] }>;

// Full-page results (target of the sitelinks search box in the JSON-LD); the navbar opens SearchDrawer instead.
export default async function TimKiemPage({ searchParams }: { searchParams: SearchParams }) {
  const q = cleanQuery((await searchParams).q);
  const { products, content } = await search(q);

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <form action="/tim-kiem" role="search" className="flex gap-3">
        <input
          name="q"
          type="search"
          defaultValue={q}
          autoFocus
          placeholder="Tìm sản phẩm, dự án…"
          aria-label="Từ khoá tìm kiếm"
          className="w-full rounded-lg border border-[var(--color-ink)]/20 bg-white px-4 py-3 text-base outline-none focus:border-[var(--color-purple)]"
        />
        <button className="rounded-lg bg-[var(--color-purple)] px-6 font-semibold text-white hover:opacity-90">Tìm</button>
      </form>

      {!q && (
        <nav aria-label="Danh mục sản phẩm" className="mt-5 flex flex-wrap gap-2">
          {SHOP_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={c.slug === "tat-ca" ? "/san-pham" : `/san-pham?danh-muc=${c.slug}`}
              className="rounded-full border border-[var(--color-purple)]/30 px-4 py-1.5 text-sm font-semibold text-[var(--color-purple)] hover:bg-[var(--color-purple)] hover:text-white"
            >
              {c.label}
            </Link>
          ))}
        </nav>
      )}

      {q && (
        <p className="mt-6 text-sm text-[var(--color-ink)]/60">
          {products.length + content.length} kết quả cho “{q}”
        </p>
      )}

      {products.length > 0 && (
        <>
          <h2 className="mt-8 mb-4 text-lg font-bold text-[var(--color-purple)]">Sản phẩm ({products.length})</h2>
          <ProductGrid items={products} label />
        </>
      )}

      {content.length > 0 && (
        <>
          <h2 className="mt-10 mb-4 text-lg font-bold text-[var(--color-purple)]">Nội dung khám phá ({content.length})</h2>
          <ul className="divide-y divide-[var(--color-ink)]/10">
            {content.map((c) => (
              <li key={c.slug}>
                <Link href={c.href} className="group block py-4">
                  <span className={`${tag} bg-[var(--color-purple)]/10 text-[var(--color-purple)]`}>Khám phá</span>
                  <p className="mt-1 font-semibold group-hover:underline">{c.title}</p>
                  {c.snippet && <p className="mt-1 line-clamp-2 text-sm text-[var(--color-ink)]/70">{c.snippet}</p>}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {q && products.length + content.length === 0 && (
        <p className="mt-10 text-center text-[var(--color-ink)]/70">
          Không tìm thấy gì cho “{q}”.{" "}
          <Link href="/san-pham" className="font-semibold text-[var(--color-orange)] hover:underline">
            Xem tất cả sản phẩm
          </Link>
        </p>
      )}

    </section>
  );
}

const tag = "inline-block rounded-full px-3 py-0.5 text-xs font-semibold uppercase";

function ProductGrid({ items, label = false }: { items: Product[]; label?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((p) => (
        <li key={p.id}>
          <Link href={`/san-pham/${p.id}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#d9d9d9]">
              {p.image && <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, 220px" className="object-cover" />}
              {p.soldOut && <span className={`${tag} absolute left-2 top-2 bg-[#e40000] text-white`}>Hết hàng</span>}
            </div>
            {label && <span className={`${tag} mt-2 bg-[var(--color-orange)]/15 text-[var(--color-orange)]`}>Sản phẩm</span>}
            <p className="mt-1 font-semibold leading-snug group-hover:underline">{p.name}</p>
            <p className="text-sm text-[var(--color-ink)]/60">{vnd(p.priceFrom)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
