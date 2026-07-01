"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, brand } from "@/data/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#FFF8F0]/95 backdrop-blur-sm shadow-[0_1px_0_#1A1208]"
            : "bg-transparent"
        }`}
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="font-[family-name:var(--font-heading)] font-bold text-xl text-[#1A1208] tracking-tight">
            Ticco<span className="text-[#FF5C35]">-</span>Vibe
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-[#1A1208] hover-underline transition-opacity hover:opacity-70"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={brand.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold bg-[#1A1208] text-[#FFF8F0] px-5 py-2 rounded-full hover:bg-[#FF5C35] transition-colors"
            >
              Mua tại Instagram →
            </a>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`block h-0.5 w-6 bg-[#1A1208] transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-[#1A1208] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-[#1A1208] transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#FFF8F0] flex flex-col pt-20 px-8"
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
                    className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#1A1208]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={brand.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto mb-12 text-center text-sm font-semibold bg-[#1A1208] text-[#FFF8F0] px-5 py-4 rounded-full"
            >
              Mua tại Instagram →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
