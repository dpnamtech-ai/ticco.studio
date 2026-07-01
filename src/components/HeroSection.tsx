"use client";

import { motion } from "framer-motion";
import { brand } from "@/data/content";

const DanIllustration = () => (
  <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
    {/* Body */}
    <ellipse cx="100" cy="130" rx="55" ry="45" fill="#F5A623" />
    {/* Head */}
    <circle cx="100" cy="88" r="52" fill="#F5A623" />
    {/* Face shadow */}
    <ellipse cx="100" cy="96" rx="36" ry="30" fill="#E8951A" opacity="0.3" />
    {/* Eyes */}
    <circle cx="84" cy="82" r="10" fill="#1A1208" />
    <circle cx="116" cy="82" r="10" fill="#1A1208" />
    {/* Eye shine */}
    <circle cx="87" cy="79" r="3.5" fill="white" />
    <circle cx="119" cy="79" r="3.5" fill="white" />
    {/* Blush */}
    <ellipse cx="72" cy="96" rx="10" ry="7" fill="#FF5C35" opacity="0.35" />
    <ellipse cx="128" cy="96" rx="10" ry="7" fill="#FF5C35" opacity="0.35" />
    {/* Smile */}
    <path d="M84 102 Q100 116 116 102" stroke="#1A1208" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Arms */}
    <ellipse cx="50" cy="118" rx="14" ry="10" fill="#F5A623" transform="rotate(-30 50 118)" />
    <ellipse cx="150" cy="118" rx="14" ry="10" fill="#F5A623" transform="rotate(30 150 118)" />
    {/* Feet */}
    <ellipse cx="82" cy="170" rx="16" ry="10" fill="#1A1208" />
    <ellipse cx="118" cy="170" rx="16" ry="10" fill="#1A1208" />
    {/* Stars decoration */}
    <text x="22" y="55" fontSize="18" fill="#FF5C35" opacity="0.7">✦</text>
    <text x="160" y="45" fontSize="14" fill="#F5A623" opacity="0.8">✦</text>
    <text x="170" y="140" fontSize="10" fill="#B8D4B0" opacity="0.9">✦</text>
  </svg>
);

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-12 px-6 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-[#F7C5A0] opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#C5DFF8] opacity-25 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            className="text-sm font-semibold tracking-widest uppercase text-[#FF5C35] mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Lifestyle Brand • Hồ Chí Minh
          </motion.p>

          <h1
            className="font-[family-name:var(--font-heading)] text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] text-[#1A1208] mb-6"
            style={{ whiteSpace: "pre-line" }}
          >
            {brand.slogan}
          </h1>

          <p className="text-lg md:text-xl text-[#1A1208]/70 mb-10 max-w-md leading-relaxed">
            {brand.tagline}
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.a
              href="#products"
              className="inline-flex items-center gap-2 bg-[#1A1208] text-[#FFF8F0] px-8 py-4 rounded-full font-semibold text-base hover:bg-[#FF5C35] transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Xem sản phẩm ↓
            </motion.a>
            <motion.a
              href={brand.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-[#1A1208] text-[#1A1208] px-8 py-4 rounded-full font-semibold text-base hover:bg-[#1A1208] hover:text-[#FFF8F0] transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Instagram →
            </motion.a>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-6 mt-10 pt-10 border-t border-[#1A1208]/10">
            <div>
              <p className="font-[family-name:var(--font-heading)] text-2xl font-bold">2k+</p>
              <p className="text-sm text-[#1A1208]/60">Followers</p>
            </div>
            <div className="w-px h-10 bg-[#1A1208]/15" />
            <div>
              <p className="font-[family-name:var(--font-heading)] text-2xl font-bold">500+</p>
              <p className="text-sm text-[#1A1208]/60">Đơn hàng</p>
            </div>
            <div className="w-px h-10 bg-[#1A1208]/15" />
            <div>
              <p className="font-[family-name:var(--font-heading)] text-2xl font-bold">4.9★</p>
              <p className="text-sm text-[#1A1208]/60">Đánh giá</p>
            </div>
          </div>
        </motion.div>

        {/* Illustration */}
        <motion.div
          className="relative flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-72 h-72 md:w-96 md:h-96"
          >
            <DanIllustration />
          </motion.div>

          {/* Floating badges */}
          <motion.div
            className="absolute top-8 right-4 md:right-0 bg-[#FFF8F0] border-2 border-[#1A1208] rounded-2xl px-4 py-2 shadow-[4px_4px_0_#1A1208] text-sm font-bold"
            animate={{ rotate: [2, -2, 2] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            🎁 Combo quà tuỳ chỉnh
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-0 md:-left-8 bg-[#F5A623] border-2 border-[#1A1208] rounded-2xl px-4 py-2 shadow-[4px_4px_0_#1A1208] text-sm font-bold"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 4.5, repeat: Infinity }}
          >
            ✦ Dán được mọi nơi
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs tracking-widest uppercase">scroll</span>
        <div className="w-px h-8 bg-[#1A1208]" />
      </motion.div>
    </section>
  );
}
