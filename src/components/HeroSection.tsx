"use client";

import { motion } from "framer-motion";
import { brand } from "@/data/content";

export default function HeroSection() {
  return (
    <section className="bg-[var(--color-orange)] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="font-[family-name:var(--font-heading)] text-6xl md:text-7xl font-extrabold leading-[1.05] mb-8"
            style={{ whiteSpace: "pre-line" }}
          >
            {brand.slogan}
          </h1>

          <div className="border border-white/40 rounded-2xl px-6 py-5 max-w-sm mb-10 text-sm leading-relaxed">
            Chúng tôi có bán sản phẩm dễ dùng — để bạn tìm thấy niềm vui trong mọi điều đời thường!
          </div>

          <a
            href="#products"
            className="inline-flex items-center gap-2 bg-white text-[var(--color-orange)] px-8 py-4 rounded-full font-semibold text-base hover:bg-[var(--color-ink)] hover:text-white transition-colors"
          >
            Xem sản phẩm →
          </a>
        </motion.div>

        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-basket.jpg"
            alt="Giỏ đồ Tíc Cơ"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
