"use client";

import { motion } from "framer-motion";
import { collections } from "@/data/content";

export default function CollectionsSection() {
  return (
    <section id="collections" className="py-24 px-6 bg-[var(--color-ink)]/[0.03]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-orange)] mb-3">
            Bộ sưu tập
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-bold text-[var(--color-ink)]">
            Mỗi BST<br />một câu chuyện.
          </h2>
        </motion.div>

        <div className="space-y-4">
          {collections.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8 rounded-3xl border-2 border-[var(--color-ink)]/10 hover:border-[var(--color-ink)] hover:shadow-[6px_6px_0_var(--color-ink)] transition-all duration-300"
              style={{ backgroundColor: col.color }}
            >
              <div className="flex items-center gap-6">
                <span className="font-[family-name:var(--font-heading)] text-4xl font-bold text-[var(--color-ink)]/20 w-12 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--color-ink)]">
                      {col.name}
                    </h3>
                    <span className="text-xs bg-[var(--color-ink)]/10 text-[var(--color-ink)] px-3 py-1 rounded-full font-medium">
                      {col.season}
                    </span>
                  </div>
                  <p className="text-[var(--color-ink)]/65 text-sm">{col.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 md:shrink-0">
                <span className="text-sm text-[var(--color-ink)]/50 font-medium">{col.items} sản phẩm</span>
                <span className="text-sm font-semibold text-[var(--color-ink)] group-hover:underline">
                  Xem BST →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
