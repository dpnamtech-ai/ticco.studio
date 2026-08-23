"use client";

import { motion } from "framer-motion";
import { brand } from "@/data/content";

export default function BrandSection() {
  return (
    <section id="brand" className="py-24 px-6 bg-[var(--color-ink)] text-[var(--color-cream)] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-[var(--color-orange)] mb-4">
              Đây là brand nào?
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Chúng mình là{" "}
              <span className="text-[var(--color-orange)]">Tíc Cơ.</span>
            </h2>
            <p
              className="text-[var(--color-cream)]/75 text-lg leading-relaxed mb-8"
              style={{ whiteSpace: "pre-line" }}
            >
              {brand.mission}
            </p>

            {/* Values */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: "💪", label: "Chăm chỉ với đời" },
                { icon: "✨", label: "Niềm vui giản đơn" },
                { icon: "🌊", label: "Phóng khoáng" },
              ].map((v) => (
                <div key={v.label} className="bg-[var(--color-cream)]/8 rounded-2xl p-4">
                  <span className="text-2xl">{v.icon}</span>
                  <p className="font-semibold mt-2 text-sm">{v.label}</p>
                </div>
              ))}
            </div>

            <a
              href="/ve-tic-co"
              className="inline-flex items-center gap-2 border border-[var(--color-cream)]/30 text-[var(--color-cream)] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[var(--color-cream)]/10 transition-colors"
            >
              Hiểu hơn về Tíc Cơ →
            </a>
          </motion.div>

          {/* Dan illustration */}
          <motion.div
            id="dan"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
            <div className="bg-[var(--color-orange)] rounded-[40px] p-12 w-full max-w-sm mx-auto relative overflow-hidden">
              <motion.div
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-56 h-56 mx-auto"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/mascot-dan.png" alt="Mascot Đần" className="w-full h-full object-contain" />
              </motion.div>

              {/* Label */}
              <div className="text-center mt-4">
                <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--color-ink)]">Mascot Đần</p>
                <p className="text-[var(--color-ink)]/70 text-sm mt-1">Hay ngủ gật, nhưng rất dễ thương.</p>
              </div>

              {/* Easter egg hint */}
              <motion.div
                className="absolute bottom-4 right-4 text-xs text-[var(--color-ink)]/40 font-medium"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                psst... có ẩn gì đó 👀
              </motion.div>
            </div>

            <a
              href="/mascot-dan"
              className="mt-6 inline-flex items-center gap-2 text-[var(--color-orange)] font-semibold hover:underline"
            >
              Làm quen với Đần! →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
