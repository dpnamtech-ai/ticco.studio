"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import { navLinks, brand } from "@/data/content";
import { useCart } from "@/context/CartContext";

type NavLink = (typeof navLinks)[number];

// Desktop item; "Khám phá" opens a sub-menu on hover/focus that jumps to a section of /kham-pha.
function NavItem({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <li className="relative group md:h-[27px] flex items-center">
      <Link
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={`hover-underline flex items-center gap-1 hover:opacity-80 transition-opacity ${active ? "is-active font-extrabold" : ""}`}
      >
        {link.label}
        {link.dropdown && <ChevronDown size={14} />}
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
        <div className="relative max-w-[1280px] mx-auto px-6 h-16 md:h-[27px] flex items-center justify-between md:justify-center gap-6 md:gap-8">
          {/* Desktop nav — left */}
          <ul className="hidden md:flex items-center gap-8 text-sm md:text-[13px] font-semibold uppercase tracking-wide">
            {left.map((link) => (
              <NavItem key={link.href} link={link} active={isActive(link.href)} />
            ))}
          </ul>

          {/* Wordmark */}
          <Link href="/" aria-label={brand.shortName} className="shrink-0">
            {/* Figma logo layer "1 1" (49x15), real lettering */}
            <Image src="/images/logo-tic-co.png" alt={brand.shortName} width={2731} height={837} sizes="(min-width: 768px) 49px, 72px" priority className="w-[72px] md:w-[49px] h-auto" />
          </Link>

          {/* Desktop nav — right */}
          <ul className="hidden md:flex items-center gap-8 text-sm md:text-[13px] font-semibold uppercase tracking-wide">
            {right.map((link) => (
              <NavItem key={link.href} link={link} active={isActive(link.href)} />
            ))}
          </ul>

          {/* Icons */}
          <div className="hidden md:flex items-center gap-[10px] md:absolute md:right-[61px]">
            <button aria-label="Tìm kiếm" className="hover:opacity-80 transition-opacity">
              <Search size={20} />
            </button>
            <button onClick={openDrawer} aria-label="Giỏ hàng" className="relative hover:opacity-80 transition-opacity">
              <ShoppingCart size={20} />
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
