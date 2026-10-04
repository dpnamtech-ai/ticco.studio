"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { vnd } from "@/lib/shopFigma";
import { useLang, useT } from "@/components/LangSwitch";
import { localize } from "@/lib/i18n";

type Result = {
  products: { id: string; name: string; image: string; priceFrom: number; soldOut?: boolean }[];
  content: { slug: string; title: string; snippet: string; href: string }[];
};

// Search panel sliding in from the right (same feel as the cart drawer). Empty until you type; results come from
// /api/search, fetched 250ms after the last keystroke.
export default function SearchDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lang = useLang();
  const tr = useT();
  const [q, setQ] = useState("");
  const [res, setRes] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const term = q.trim();
    if (!term) return;
    const ctl = new AbortController();
    const t = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(term)}&lang=${lang}`, { signal: ctl.signal })
        .then((r) => r.json())
        .then((d: Result) => { setRes(d); setLoading(false); })
        .catch(() => {});
    }, 250);
    return () => { clearTimeout(t); ctl.abort(); };
  }, [q, lang]);

  // while open: Esc closes, the page behind doesn't scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const term = q.trim();
  const shown = term ? res : null;
  const total = shown ? shown.products.length + shown.content.length : 0;

  return (
    <AnimatePresence>
      {open && [
        <motion.div key="search-overlay" className="fixed inset-0 z-[60] bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />,
        <motion.aside
          key="search-panel"
          role="dialog"
          aria-label={tr("Tìm kiếm")}
          className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 300 }}
        >
          <form role="search" onSubmit={(e) => e.preventDefault()} className="flex items-center gap-3 border-b border-[var(--color-ink)]/10 px-5 py-4">
            <Search size={20} className="shrink-0 text-[var(--color-purple)]" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value.slice(0, 80))}
              autoFocus
              placeholder={tr("Tìm sản phẩm, dự án…")}
              aria-label={tr("Từ khoá tìm kiếm")}
              // BUG-026: hide the browser's own clear (×) next to our close button
              className="w-full bg-transparent py-1 text-base outline-none [&::-webkit-search-cancel-button]:appearance-none"
            />
            <button type="button" onClick={onClose} aria-label={tr("Đóng tìm kiếm")} className="text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]">
              <X size={22} />
            </button>
          </form>

          <div className="flex-1 overflow-y-auto px-5 py-4" aria-live="polite">
            {term && loading && !shown && <p className="text-sm text-[var(--color-ink)]/50">{tr("Đang tìm…")}</p>}
            {shown && total === 0 && !loading && <p className="text-sm text-[var(--color-ink)]/60">{tr("Không tìm thấy gì cho “")}{term}”.</p>}

            {shown && shown.products.length > 0 && (
              <>
                <h2 className="mb-2 text-sm font-bold uppercase text-[var(--color-purple)]">{tr("Sản phẩm")} ({shown.products.length})</h2>
                <ul className="mb-6 divide-y divide-[var(--color-ink)]/10">
                  {shown.products.map((p) => (
                    <li key={p.id}>
                      <Link href={localize(`/san-pham/${p.id}`, lang)} onClick={onClose} className="group flex items-center gap-3 py-3">
                        <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-[#d9d9d9]">
                          {p.image && <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold leading-snug group-hover:underline">{p.name}</p>
                          <p className="text-sm text-[var(--color-ink)]/60">{p.soldOut ? tr("Hết hàng") : vnd(p.priceFrom, lang)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {shown && shown.content.length > 0 && (
              <>
                <h2 className="mb-2 text-sm font-bold uppercase text-[var(--color-purple)]">{tr("Khám phá")} ({shown.content.length})</h2>
                <ul className="divide-y divide-[var(--color-ink)]/10">
                  {shown.content.map((c) => (
                    <li key={c.slug}>
                      <Link href={c.href} onClick={onClose} className="group block py-3">
                        <p className="font-semibold group-hover:underline">{c.title}</p>
                        {c.snippet && <p className="mt-1 line-clamp-2 text-sm text-[var(--color-ink)]/70">{c.snippet}</p>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </motion.aside>,
      ]}
    </AnimatePresence>
  );
}
