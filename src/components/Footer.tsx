"use client";

import { motion } from "framer-motion";
import { brand } from "@/data/content";

const footerLinks = [
  {
    title: "Khám phá",
    links: [
      { label: "Sản phẩm", href: "#products" },
      { label: "Bộ sưu tập", href: "#collections" },
      { label: "Mascot Đần", href: "/dan" },
      { label: "Brand Story", href: "/brand-story" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Chính sách mua hàng", href: "/chinh-sach" },
      { label: "Liên hệ", href: `mailto:${brand.email}` },
      { label: "Combo quà tuỳ chỉnh", href: brand.instagram },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#1A1208] text-[#FFF8F0] pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Còn đang suy nghĩ?
            <br />
            <span className="text-[#F5A623]">Cứ nhắn tin đi.</span>
          </p>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#F5A623] text-[#1A1208] font-bold text-lg px-10 py-5 rounded-full hover:bg-[#FF5C35] hover:text-[#FFF8F0] transition-colors"
          >
            DM trên Instagram →
          </a>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-[#FFF8F0]/10 mb-16" />

        {/* Footer columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <p className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
              Ticco<span className="text-[#F5A623]">-</span>Vibe
            </p>
            <p className="text-[#FFF8F0]/60 text-sm leading-relaxed max-w-xs mb-6">
              Sticker, túi, móc khoá và những món quà nhỏ đầy cá tính — từ Hồ Chí Minh, ra khắp Việt Nam.
            </p>
            <div className="space-y-2 text-sm text-[#FFF8F0]/50">
              <p>📮 {brand.email}</p>
              <p>📍 {brand.address}</p>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <p className="font-semibold text-sm tracking-wider uppercase text-[#FFF8F0]/40 mb-4">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#FFF8F0]/70 hover:text-[#F5A623] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[#FFF8F0]/10">
          <p className="text-xs text-[#FFF8F0]/30">
            © {new Date().getFullYear()} Ticco-Vibe. Mọi quyền được bảo lưu.
          </p>
          <div className="flex gap-6">
            <a
              href={brand.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#FFF8F0]/50 hover:text-[#F5A623] transition-colors font-medium"
            >
              Instagram
            </a>
            <a
              href="/chinh-sach"
              className="text-xs text-[#FFF8F0]/50 hover:text-[#F5A623] transition-colors"
            >
              Chính sách
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
