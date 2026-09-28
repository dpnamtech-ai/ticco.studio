"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { navLinks, brand } from "@/data/content";
import { useCart } from "@/context/CartContext";

type NavLink = (typeof navLinks)[number];

// Desktop item; "Khám phá" opens a sub-menu on hover/focus that jumps to a section of /kham-pha.
function NavItem({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <li className="relative group md:h-[calc(27*var(--u))] flex items-center">
      <Link
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={`hover-underline flex items-center ${link.href === "/kham-pha" ? "gap-px" : "gap-1"} hover:opacity-80 transition-opacity ${active ? "is-active font-extrabold" : ""}`}
      >
        {link.label}
        {/* Figma "Subtract": 7x6 down chevron in #ffd9c6 (gap 4px after SẢN PHẨM, 1px after KHÁM PHÁ) */}
        {link.dropdown && (
          <svg width="7" height="6" viewBox="0 0 7 6" aria-hidden className="shrink-0 md:w-[calc(7*var(--u))] md:h-[calc(6*var(--u))]">
            <path d="M0.4 0.6 3.5 5.2 6.6 0.6" fill="none" stroke="#ffd9c6" strokeWidth="1.3" />
          </svg>
        )}
      </Link>
      {"children" in link && link.children && (
        // pt-2 is an invisible bridge so the pointer can travel from the item to the card without closing it
        <div className="absolute left-0 top-full z-50 hidden pt-2 group-hover:block group-focus-within:block">
          <ul className="min-w-[250px] rounded-lg bg-white py-2 text-[var(--color-purple)] shadow-xl ring-1 ring-black/10">
            {link.children.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="block whitespace-nowrap px-5 py-2.5 transition-colors hover:bg-[var(--color-orange)]/15">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const pathname = usePathname();
  // A section is active on its own page and any page below it (e.g. /kham-pha/nguoi-viet-van-dong).
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const left = navLinks.slice(0, 2);
  const right = navLinks.slice(2);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[var(--color-orange)] text-white">
        {/* md+: Figma "thanh-chon" — logo centred (X615-664), left group ends 31px before it, right group starts
            30px after it; item gaps 38px (left) / 33px (right); Be Vietnam 600 13/19, no letter-spacing. */}
        <div className="relative max-w-[1280px] md:max-w-[calc(1280*var(--u))] mx-auto px-6 h-16 md:h-[calc(27*var(--u))] flex items-center justify-between gap-6 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-0">
          {/* Desktop nav — left */}
          <ul className="hidden md:flex justify-end items-center gap-[calc(38*var(--u))] mr-[calc(31*var(--u))] text-[calc(13*var(--u))] leading-[calc(19*var(--u))] font-semibold uppercase">
            {left.map((link) => (
              <NavItem key={link.href} link={link} active={isActive(link.href)} />
            ))}
          </ul>

          {/* Wordmark */}
          <Link href="/" aria-label={brand.shortName} className="shrink-0">
            {/* Figma logo layer "1 1" (49x15), real lettering */}
            <Image src="/images/logo-tic-co.png" alt={brand.shortName} width={2731} height={837} sizes="(min-width: 768px) 74px, 72px" priority className="w-[72px] md:w-[calc(49*var(--u))] h-auto" />
          </Link>

          {/* Desktop nav — right */}
          <ul className="hidden md:flex items-center gap-[calc(33*var(--u))] ml-[calc(30*var(--u))] text-[calc(13*var(--u))] leading-[calc(19*var(--u))] font-semibold uppercase">
            {right.map((link) => (
              <NavItem key={link.href} link={link} active={isActive(link.href)} />
            ))}
          </ul>

          {/* Icons */}
          {/* Figma "Frame 5" X1153-1219: search 21px (#fef7ff) + cart art 36x36, gap 9 */}
          <div className="hidden md:flex items-center gap-[calc(9*var(--u))] md:absolute md:right-[calc(61*var(--u))] md:top-1/2 md:-translate-y-1/2">
            <button aria-label="Tìm kiếm" className="text-[#fef7ff] hover:opacity-80 transition-opacity">
              <Search size={21} className="size-[calc(21*var(--u))]" />
            </button>
            <button onClick={openDrawer} aria-label="Giỏ hàng" className="relative hover:opacity-80 transition-opacity">
              <Image src="/images/figma/f7cee81a817a7fd43fa1390005911ca6d22bbadf.webp" alt="" width={108} height={108} className="size-[calc(36*var(--u))]" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute -top-1 -right-2 bg-[var(--color-purple)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[var(--color-orange)] text-white flex flex-col pt-20 px-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ul className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`font-[family-name:var(--font-heading)] text-3xl font-bold ${isActive(link.href) ? "underline underline-offset-8 decoration-4" : ""}`}
                  >
                    {link.label}
                  </Link>
                  {"children" in link && link.children && (
                    <ul className="mt-3 ml-4 flex flex-col gap-3 text-lg font-semibold">
                      {link.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} onClick={() => setMenuOpen(false)}>
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                setMenuOpen(false);
                openDrawer();
              }}
              className="mt-auto mb-12 inline-flex items-center justify-center gap-2 text-center text-sm font-semibold bg-white text-[var(--color-orange)] px-5 py-4 rounded-full"
            >
              <ShoppingCart size={18} /> Giỏ hàng {totalItems > 0 && `(${totalItems})`}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
