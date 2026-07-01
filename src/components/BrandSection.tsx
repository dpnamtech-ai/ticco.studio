"use client";

import { motion } from "framer-motion";
import { brand } from "@/data/content";

const DanBig = () => (
  <svg viewBox="0 0 300 300" fill="none" className="w-full h-full">
    {/* Sleeping Đần */}
    <circle cx="150" cy="145" r="90" fill="#F5A623" />
    <ellipse cx="150" cy="152" rx="62" ry="52" fill="#E8951A" opacity="0.25" />
    {/* Closed eyes (sleeping) */}
    <path d="M118 130 Q128 122 138 130" stroke="#1A1208" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M162 130 Q172 122 182 130" stroke="#1A1208" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    {/* Blush */}
    <ellipse cx="108" cy="148" rx="14" ry="9" fill="#FF5C35" opacity="0.3" />
    <ellipse cx="192" cy="148" rx="14" ry="9" fill="#FF5C35" opacity="0.3" />
    {/* Smile */}
    <path d="M130 160 Q150 175 170 160" stroke="#1A1208" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Zzz */}
    <text x="200" y="80" fontSize="22" fill="#1A1208" opacity="0.5" fontWeight="bold">z</text>
    <text x="218" y="62" fontSize="16" fill="#1A1208" opacity="0.35" fontWeight="bold">z</text>
    <text x="232" y="48" fontSize="12" fill="#1A1208" opacity="0.2" fontWeight="bold">z</text>
    {/* Stars */}
    <text x="30" y="80" fontSize="20" fill="#FF5C35" opacity="0.6">✦</text>
    <text x="245" y="200" fontSize="14" fill="#C5DFF8" opacity="0.8">✦</text>
    <text x="55" y="220" fontSize="10" fill="#B8D4B0" opacity="0.7">✦</text>
  </svg>
);

export default function BrandSection() {
  return (
    <section id="brand" className="py-24 px-6 bg-[#1A1208] text-[#FFF8F0] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-[#F5A623] mb-4">
              Đây là brand nào?
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Chúng mình là{" "}
              <span className="text-[#F5A623]">Ticco-Vibe.</span>
            </h2>
            <p className="text-[#FFF8F0]/75 text-lg leading-relaxed mb-8">
              {brand.mission}
            </p>

            {/* Values */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {[
                { icon: "🌱", label: "Local made", desc: "Làm tại Việt Nam" },
                { icon: "🎨", label: "Có concept", desc: "Mỗi dòng một câu chuyện" },
                { icon: "📦", label: "Gói đẹp", desc: "Quà ra quà" },
                { icon: "💌", label: "Có tâm", desc: "Không ship hàng kém chất" },
              ].map((v) => (
                <div key={v.label} className="bg-[#FFF8F0]/8 rounded-2xl p-4">
                  <span className="text-2xl">{v.icon}</span>
                  <p className="font-semibold mt-2">{v.label}</p>
                  <p className="text-sm text-[#FFF8F0]/60">{v.desc}</p>
                </div>
              ))}
            </div>

            <a
              href="/brand-story"
              className="inline-flex items-center gap-2 border border-[#FFF8F0]/30 text-[#FFF8F0] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#FFF8F0]/10 transition-colors"
            >
              Đọc brand story đầy đủ →
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
            <div className="bg-[#F5A623] rounded-[40px] p-12 w-full max-w-sm mx-auto relative overflow-hidden">
              <motion.div
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-56 h-56 mx-auto"
              >
                <DanBig />
              </motion.div>

              {/* Label */}
              <div className="text-center mt-4">
                <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[#1A1208]">Mascot Đần</p>
                <p className="text-[#1A1208]/70 text-sm mt-1">Hay ngủ gật, nhưng rất dễ thương.</p>
              </div>

              {/* Easter egg hint */}
              <motion.div
                className="absolute bottom-4 right-4 text-xs text-[#1A1208]/40 font-medium"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                psst... có ẩn gì đó 👀
              </motion.div>
            </div>

            <a
              href="/dan"
              className="mt-6 inline-flex items-center gap-2 text-[#F5A623] font-semibold hover:underline"
            >
              Khám phá trang riêng của Đần →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
