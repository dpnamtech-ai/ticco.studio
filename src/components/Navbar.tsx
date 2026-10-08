"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ChevronDown } from "lucide-react";
import { navLinks, brand } from "@/data/content";
import { useCart } from "@/context/CartContext";
import SearchDrawer from "@/components/SearchDrawer";
import LangSwitch, { useLang, usePagePath, useT } from "@/components/LangSwitch";
import { localize } from "@/lib/i18n";

type NavLink = (typeof navLinks)[number];

// Desktop item; "Khám phá" opens a sub-menu on hover/focus that jumps to a section of /kham-pha.
function NavItem({ link, active }: { link: NavLink; active: boolean }) {
  const lang = useLang();
  const t = useT();
  return (
    <li className="relative group md:h-[calc(27*var(--u))] flex items-center">
      <Link
        href={localize(link.href, lang)}
        aria-current={active ? "page" : undefined}
        className={`hover-underline flex items-center hover:opacity-80 transition-opacity ${active ? "is-active font-extrabold" : ""}`}
      >
        {t(link.label)}
      </Link>
      {"children" in link && link.children && (
        // pt-2 is an invisible bridge so the pointer can travel from the item to the card without closing it
        <div className="absolute left-0 top-full z-50 hidden pt-2 group-hover:block group-focus-within:block">
          <ul className="min-w-[250px] rounded-lg bg-white py-2 text-[var(--color-purple)] shadow-xl ring-1 ring-black/10">
            {link.children.map((c) => (
              <li key={c.href}>
                <Link href={localize(c.href, lang)} className="block whitespace-nowrap px-5 py-2.5 transition-colors hover:bg-[var(--color-orange)]/15">
                  {t(c.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

// The menu section (with sub-pages) that a path belongs to, e.g. /kham-pha/x -> "/kham-pha".
const sectionOf = (p: string) => navLinks.find((l) => "children" in l && (p === l.href || p.startsWith(`${l.href}/`)))?.href ?? null;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const lang = useLang();
  const t = useT();
  // without the /en prefix, so active states and sections work the same in both languages
  const pathname = usePagePath();
  // which collapsible section of the mobile menu is open
  const [expanded, setExpanded] = useState<string | null>(() => sectionOf(pathname));
  // A section is active on its own page and any page below it (e.g. /kham-pha/nguoi-viet-van-dong).
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  // Any navigation (menu link, the always-visible search icon, logo, back button) closes the full-screen mobile
  // menu — otherwise it stays on top of the new page and the tap looks like it did nothing — and opens the
  // menu section of the page you're on. Done while rendering (React's "adjust state on prop change"), not in an effect.
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMenuOpen(false);
    setExpanded(sectionOf(pathname));
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[var(--color-orange)] text-white">
        {/* md+: Figma "thanh-chon" (2026-09-29) — logo left (X35, 83x25), the 4 items centred as one group
            with 46px gaps and no dropdown chevrons; Be Vietnam 600 13/19, no letter-spacing. */}
        <div className="relative max-w-[1280px] md:max-w-[calc(1280*var(--u))] mx-auto px-[calc(21*var(--m))] md:px-6 h-[calc(32*var(--m))] md:h-[calc(27*var(--u))] flex items-center justify-between gap-6 md:justify-center md:gap-0">
          {/* Wordmark */}
          <Link href={localize("/", lang)} aria-label={brand.shortName} className="shrink-0 md:absolute md:left-[calc(35*var(--u))] md:top-1/2 md:-translate-y-1/2">
            <Image src="/images/logo-tic-co.png" alt={brand.shortName} width={2731} height={837} sizes="(min-width: 768px) 7vw, 13vw" quality={90} priority className="w-[calc(47*var(--m))] md:w-[calc(83*var(--u))] h-auto" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-[calc(46*var(--u))] text-[calc(13*var(--u))] leading-[calc(19*var(--u))] font-semibold uppercase">
            {navLinks.map((link) => (
              <NavItem key={link.href} link={link} active={isActive(link.href)} />
            ))}
          </ul>

          {/* Icons */}
          {/* Figma "Frame 5" X1153-1219: search 21px (#fef7ff) + cart art 36x36, gap 9 */}
          <div className="hidden md:flex items-center gap-[calc(9*var(--u))] md:absolute md:right-[calc(61*var(--u))] md:top-1/2 md:-translate-y-1/2">
            <LangSwitch variant="short" className="mr-[calc(8*var(--u))] text-[calc(12*var(--u))] font-semibold leading-none" />
            <button onClick={() => setSearchOpen(true)} aria-label={t("Tìm kiếm")} className="text-[#fef7ff] hover:opacity-80 transition-opacity">
              <Search size={21} className="size-[calc(21*var(--u))]" />
            </button>
            <button onClick={openDrawer} aria-label={t("Giỏ hàng")} className="relative hover:opacity-80 transition-opacity">
              <Image src="/images/figma/f7cee81a817a7fd43fa1390005911ca6d22bbadf.webp" alt="" width={108} height={108} className="size-[calc(36*var(--u))]" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    // The 36u cart art overflows the 27u bar by 4.5u each side: top 4.5u keeps the badge inside the bar,
                    // so it isn't cut off by the viewport edge once the promo bar scrolls away.
                    className="absolute top-[calc(4.5*var(--u))] -right-[calc(8*var(--u))] bg-[var(--color-purple)] text-white text-[calc(12*var(--u))] leading-none font-bold min-w-[calc(18*var(--u))] h-[calc(18*var(--u))] px-[calc(4*var(--u))] rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Mobile: search + cart (with count) + burger, always in the bar. Sizes/gaps = the 390 mobile Figma frames
              (search 17, cart art 29, burger 12x8); p + negative margin widens the tap area without moving the icons. */}
          <button onClick={() => { setMenuOpen(false); setSearchOpen(true); }} aria-label={t("Tìm kiếm")} className="md:hidden ml-auto -m-2 p-2">
            <Search className="size-[calc(17*var(--m))]" />
          </button>
          <button onClick={openDrawer} aria-label={t("Giỏ hàng")} className="md:hidden relative ml-[calc(3*var(--m))] -my-2 py-2">
            <Image src="/images/figma/f7cee81a817a7fd43fa1390005911ca6d22bbadf.webp" alt="" width={108} height={108} className="size-[calc(29*var(--m))]" />
            {totalItems > 0 && (
              <span className="absolute top-0 -right-[calc(5*var(--m))] flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[var(--color-purple)] px-1 text-[10px] font-bold leading-none text-white">
                {totalItems}
              </span>
            )}
          </button>
          <button className="md:hidden ml-[calc(7*var(--m))] -m-2 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? (
              <X className="size-[calc(14*var(--m))]" />
            ) : (
              <span aria-hidden className="flex w-[calc(12*var(--m))] flex-col gap-[calc(3*var(--m))]">
                {[0, 1, 2].map((i) => <span key={i} className="block h-px bg-current" />)}
              </span>
            )}
          </button>
        </div>
      </nav>

      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 overflow-y-auto bg-[var(--color-orange)] text-white flex flex-col pt-[calc(50*var(--m)+24px)] pb-10 px-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Top level stays short: sections with sub-pages collapse (chevron), the one you're in starts open. */}
            <ul className="mt-4 flex flex-col divide-y divide-white/20">
              {navLinks.map((link) => {
                const kids = "children" in link ? link.children : undefined;
                const open = expanded === link.href;
                return (
                  <li key={link.href} className="py-3">
                    <div className="flex items-center justify-between">
                      <Link
                        href={localize(link.href, lang)}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive(link.href) ? "page" : undefined}
                        className={`font-[family-name:var(--font-heading)] text-2xl font-bold ${isActive(link.href) ? "underline underline-offset-8 decoration-2" : ""}`}
                      >
                        {t(link.label)}
                      </Link>
                      {kids && (
                        <button
                          type="button"
                          aria-label={`${t(open ? "Thu gọn" : "Mở")} ${t(link.label)}`}
                          aria-expanded={open}
                          onClick={() => setExpanded(open ? null : link.href)}
                          className="-mr-2 p-2"
                        >
                          <ChevronDown size={22} className={`transition-transform ${open ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                    {kids && open && (
                      // one size for every sub item, the same as the language row (18px), aligned with the parent's text and clear of
                      // its underline (client 08/10: sub-menu sizes looked uneven, "Tất cả sản phẩm" touched the underline)
                      <ul className="mt-4 flex flex-col gap-3 pb-1 text-lg leading-6 font-semibold text-white/90">
                        {kids.map((c) => (
                          <li key={c.href}>
                            <Link href={localize(c.href, lang)} onClick={() => setMenuOpen(false)} className="block">
                              {t(c.label)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            <LangSwitch variant="long" className="mt-8 text-lg font-semibold" onSwitch={() => setMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
