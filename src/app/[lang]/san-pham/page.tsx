import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getProducts } from "@/lib/products";
import { SHOP_CATEGORIES, paginate, shopCategory, shopListing } from "@/lib/shop";
import { figmaDisplay, figmaListing } from "@/lib/shopFigma";
import { getLang } from "@/lib/lang";
import { alternatesFor, localize } from "@/lib/i18n";
import { t } from "@/lib/t";

const cq = (px: number) => `${Math.round((px / 12.8) * 1e4) / 1e4}cqw`;
const GRID_X = 61; // frame x/y where the card area starts (divider at Y176 + 54)
const GRID_Y = 230;
const FOOTER_H = 337;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
// Tab left edges in the Figma "danh-muc" row, relative to the title (X61).
const TAB_X = [0, 242, 494, 630, 803, 995];
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

// Shareable URLs: /san-pham?danh-muc=in-an&trang=2 (no param = "Tất cả sản phẩm", page 1).
const href = (slug: string, page = 1) => {
  const q = new URLSearchParams();
  if (slug !== "tat-ca") q.set("danh-muc", slug);
  if (page > 1) q.set("trang", String(page));
  const s = q.toString();
  return s ? `/san-pham?${s}` : "/san-pham";
};

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const sp = await searchParams;
  const tab = shopCategory(one(sp["danh-muc"]));
  const page = Number(one(sp.trang) ?? 1);
  const lang = await getLang();
  return {
    alternates: alternatesFor(href(tab.slug, page > 1 ? page : 1), lang),
    title: tab.slug === "tat-ca" ? t("Tất cả sản phẩm Tíc Cơ — sổ tay, túi, sticker, quà tặng", lang) : `${t(tab.label, lang)} ${t("— Sản phẩm Tíc Cơ", lang)}`,
    description: t("Toàn bộ sản phẩm Tíc Cơ: văn phòng phẩm, in ấn, túi xách, thời trang, phụ kiện đời sống.", lang),
  };
}

// Figma frames tat-ca-san-pham-trang-1..3 / van-phong-pham / in-an-trang-1..2 / tui-xach / thoi-trang / phu-kien-doi-song.
// Desktop values are Figma px / 12.8 (1280px frame = 100cqw).
export default async function SanPhamPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const lang = await getLang();
  const T = (s: string) => t(s, lang);
  const link = (slug: string, page = 1) => localize(href(slug, page), lang);
  const tab = shopCategory(one(sp["danh-muc"]));
  const all = shopListing(await getProducts(), tab.slug);
  const { items, page, pages } = paginate(all, Number(one(sp.trang) ?? 1));
  // Exact card boxes of this Figma frame (the designer nudged some off the grid) while the page shows exactly its products.
  const FL = figmaListing(tab.slug, page, items.map((p) => p.id));
  const footerTop = FL && FL.frameH - FOOTER_H;
  const vars = FL && ({
    "--gh": cq((FL.pager ?? footerTop!) - GRID_Y),
    "--pb": cq(FL.pager ? footerTop! - FL.pager - 24 : 0),
  } as CSSProperties);

  const btn = "flex h-6 lg:h-[1.875cqw] items-center justify-center rounded-[5px] lg:rounded-[0.391cqw] bg-[#e66107] text-[15px] lg:text-[1.172cqw] font-semibold tracking-[-1.05px] lg:tracking-[-0.082cqw] text-white";
  const wide = `${btn} w-[84px] lg:w-[6.563cqw]`;
  const num = `${btn} w-[25px] lg:w-[1.953cqw]`;

  return (
    <section className="bg-[#f5f5f5]">
      <div className=" [container-type:inline-size]">
      <div className={`px-4 lg:px-0 lg:pl-[4.766cqw] pt-6 lg:pt-[3.047cqw] pb-12 ${FL ? "lg:pb-(--pb)" : "lg:pb-[4.609cqw]"}`} style={vars}>
        {/* Figma 2026-09-29 dropped the visible "Danh mục sản phẩm" title; the tabs sit 39px under the navbar. */}
        <h1 className="sr-only">{T("Danh mục sản phẩm")}</h1>

        <Reveal variant="up" duration={1}>
          <nav aria-label={T("Danh mục sản phẩm")} className="lg:w-[91.094cqw]">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:relative lg:h-[1.484cqw] text-sm lg:text-[1.5625cqw] leading-5 lg:leading-[1.484cqw] tracking-[-0.5px] lg:tracking-[-0.094cqw] uppercase">
              {SHOP_CATEGORIES.map((c, i) => {
                const active = c.slug === tab.slug;
                return (
                  <li key={c.slug} className="lg:absolute lg:left-(--x)" style={{ "--x": `${TAB_X[i] / 12.8}cqw` } as CSSProperties}>
                    <Link
                      href={link(c.slug)}
                      aria-current={c.slug === tab.slug ? "page" : undefined}
                      className={`lg:block whitespace-nowrap transition-colors hover:text-[#53129e] ${active ? "font-extrabold text-[#53129e]" : "font-medium text-black"}`}
                      style={active && FL?.tabColor ? { color: FL.tabColor } : undefined}
                    >
                      {T(c.label)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-3 lg:mt-[1.016cqw] h-px bg-[#323133] lg:w-[90.703cqw]" />
        </Reveal>

        <div className={`mt-8 lg:mt-[4.219cqw] grid grid-cols-2 lg:grid-cols-4 gap-x-4 lg:gap-x-[2.734cqw] gap-y-8 lg:gap-y-[4.453cqw] lg:w-[90.703cqw] ${FL ? "lg:block lg:relative lg:h-(--gh)" : ""}`}>
          {items.map((p, i) => {
            const f = figmaDisplay(p);
            const card = <ProductCard key={p.id} {...p} index={i % 4} crop={f.cardCrop} priceLabel={f.cardPrice} displayName={f.title.startsWith("[BST") ? f.title : undefined} />;
            const c = FL?.cards[i];
            return c ? (
              <div key={p.id} className="lg:absolute lg:left-(--x) lg:top-(--y) lg:w-(--w)" style={{ "--x": cq(c[0] - GRID_X), "--y": cq(c[1] - GRID_Y), "--w": cq(264) } as CSSProperties}>
                {card}
              </div>
            ) : (
              card
            );
          })}
        </div>
        {items.length === 0 && <p className="mt-8 text-center text-[var(--color-ink)]/60">{T("Chưa có sản phẩm trong danh mục này.")}</p>}

        {pages > 1 && (
          <nav aria-label={T("Chọn trang")} className={`mt-12 ${FL ? "lg:mt-0" : "lg:mt-[4.688cqw]"} lg:w-[90.703cqw] flex justify-center`}>
            <ul className="flex items-center">
              <li className="mr-[11px] lg:mr-[0.859cqw]">
                {page > 1 ? <Link href={link(tab.slug, page - 1)} rel="prev" className={wide}>{T("Trước")}</Link> : <span className={`${wide} opacity-40`} aria-disabled="true">{T("Trước")}</span>}
              </li>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <li key={n} className={n > 1 ? "ml-[5px] lg:ml-[0.391cqw]" : undefined}>
                  {n === page ? (
                    <span className={`${num} !bg-[#53129e] ring-2 ring-[#53129e] ring-offset-2 ring-offset-[#f5f5f5]`} aria-current="page">{n}</span>
                  ) : (
                    <Link href={link(tab.slug, n)} className={num} aria-label={`${T("Trang")} ${n}`}>{n}</Link>
                  )}
                </li>
              ))}
              <li className="ml-[11px] lg:ml-[0.859cqw]">
                {page < pages ? <Link href={link(tab.slug, page + 1)} rel="next" className={wide}>{T("Sau")}</Link> : <span className={`${wide} opacity-40`} aria-disabled="true">{T("Sau")}</span>}
              </li>
            </ul>
          </nav>
        )}
      </div>
      </div>
    </section>
  );
}
