"use client";

import { motion } from "framer-motion";
import { ugcPhotos, brand } from "@/data/content";

export default function UGCSection() {
  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-orange)] mb-3">
              Từ cộng đồng
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-bold text-[var(--color-ink)]">
              Khách dùng thiệt.
            </h2>
          </div>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start inline-flex items-center gap-2 border-2 border-[var(--color-ink)] px-6 py-3 rounded-full font-semibold text-sm hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors"
          >
            Tag @ticco.official để xuất hiện ở đây →
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {ugcPhotos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="group"
            >
              <div className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-[var(--color-ink)] group-hover:shadow-[4px_4px_0_var(--color-ink)] transition-all duration-300 cursor-pointer relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://picsum.photos/seed/ticco-ugc-${photo.id}/400/400`}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[var(--color-ink)]/0 group-hover:bg-[var(--color-ink)]/40 transition-colors duration-300 flex items-end p-3">
                  <span className="text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-tight block">
                    {photo.caption}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty slot CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-sm text-[var(--color-ink)]/50"
        >
          Chụp ảnh với sản phẩm, tag{" "}
          <a href={brand.instagram} className="font-semibold text-[var(--color-ink)] hover:text-[var(--color-orange)] transition-colors">
            @ticco.official
          </a>{" "}
          — chúng mình sẽ repost 💛
        </motion.div>
      </div>
    </section>
  );
}
