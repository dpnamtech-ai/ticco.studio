"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import { navLinks, brand } from "@/data/content";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const left = navLinks.slice(0, 2);
  const right = navLinks.slice(2);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[var(--color-orange)] text-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Desktop nav — left */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wide">
            {left.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover-underline flex items-center gap-1 hover:opacity-80 transition-opacity">
                  {link.label}
                  {link.dropdown && <ChevronDown size={14} />}
                </a>
              </li>
            ))}
          </ul>

          {/* Wordmark */}
          <a
            href="/"
            className="font-[family-name:var(--font-heading)] text-2xl font-bold lowercase shrink-0"
          >
            {brand.shortName}
          </a>

          {/* Desktop nav — right */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wide">
            {right.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover-underline flex items-center gap-1 hover:opacity-80 transition-opacity">
                  {link.label}
                  {link.dropdown && <ChevronDown size={14} />}
                </a>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className="hidden md:flex items-center gap-5 ml-auto">
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
                    className="absolute -top-2 -right-2 bg-[var(--color-yellow)] text-[var(--color-ink)] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
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
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-[family-name:var(--font-heading)] text-3xl font-bold"
                  >
                    {link.label}
                  </a>
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
