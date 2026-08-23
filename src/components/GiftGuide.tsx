"use client";

import { motion } from "framer-motion";
import { giftGuides, brand } from "@/data/content";

export default function GiftGuide() {
  return (
    <section className="py-24 px-6 bg-[var(--color-cream)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-orange)] mb-3">
            Gợi ý theo dịp
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-bold text-[var(--color-ink)]">
            Mua quà cho ai?
          </h2>
          <p className="text-[var(--color-ink)]/60 mt-4 text-lg max-w-xl mx-auto">
            Dù là dịp gì, Tíc Cơ đều có thứ phù hợp — và sẽ còn đẹp hơn nếu bạn tự tạo combo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {giftGuides.map((guide, i) => (
            <motion.div
              key={guide.occasion}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group"
            >
              <a
                href={brand.instagram}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                className="block rounded-3xl p-8 border-2 border-transparent hover:border-[var(--color-ink)] hover:shadow-[6px_6px_0_var(--color-ink)] transition-all duration-300"
                style={{ backgroundColor: guide.color }}
              >
                <div className="text-5xl mb-5">{guide.emoji}</div>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--color-ink)] mb-2">
                  {guide.occasion}
                </h3>
                <p className="text-sm text-[var(--color-ink)]/70 mb-5 leading-relaxed">{guide.tagline}</p>
                <ul className="space-y-1.5">
                  {guide.picks.map((pick) => (
                    <li key={pick} className="flex items-center gap-2 text-sm text-[var(--color-ink)]/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ink)] flex-shrink-0" />
                      {pick}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 text-xs font-semibold text-[var(--color-ink)]/50 group-hover:text-[var(--color-ink)] transition-colors">
                  Xem trên Instagram →
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* SEO-friendly tags — hidden visually but crawlable */}
        <div className="sr-only">
          {giftGuides.map((g) => (
            <span key={g.seoTag}>{g.seoTag} </span>
          ))}
        </div>
      </div>
    </section>
  );
}
