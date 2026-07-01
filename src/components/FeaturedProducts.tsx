"use client";

import { motion } from "framer-motion";
import { productLines, brand } from "@/data/content";

export default function FeaturedProducts() {
  return (
    <section id="products" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-[#FF5C35] mb-3">
              Sản phẩm nổi bật
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-bold text-[#1A1208]">
              Tại đây có bán.
            </h2>
          </div>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start md:self-auto inline-flex items-center gap-2 border-2 border-[#1A1208] px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#1A1208] hover:text-[#FFF8F0] transition-colors"
          >
            Mua tại Instagram →
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {productLines.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div
                className="relative rounded-3xl h-64 flex flex-col justify-between border-2 border-transparent hover:border-[#1A1208] transition-all duration-300 hover:shadow-[6px_6px_0_#1A1208] overflow-hidden"
                style={{ backgroundColor: product.color }}
              >
                {/* Product image */}
                <div className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://picsum.photos/seed/ticco-product-${product.id}/400/300`}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-30"
                  />
                </div>

                {/* Content on top of image */}
                <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                  {/* Emoji + tag row */}
                  <div className="flex items-start justify-between">
                    <span className="text-5xl">{product.emoji}</span>
                    <span className="text-xs font-semibold bg-[#1A1208]/10 backdrop-blur-sm text-[#1A1208] px-3 py-1 rounded-full">
                      {product.collection}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-[#1A1208]/60 mb-1">
                      từ {product.priceFrom.toLocaleString("vi-VN")}đ
                    </p>
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[#1A1208]">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#1A1208]/70 mt-1">{product.tagline}</p>
                  </div>
                </div>
              </div>

              {/* Description on hover */}
              <motion.p
                className="text-sm text-[#1A1208]/70 mt-3 px-1 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                {product.description}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-[#1A1208] text-[#FFF8F0] rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <p className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-1">
              Muốn tự ghép combo quà?
            </p>
            <p className="text-[#FFF8F0]/70 text-sm">
              Chọn sticker + túi + móc khoá, chúng mình gói cho — đẹp và đúng ý.
            </p>
          </div>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap bg-[#F5A623] text-[#1A1208] font-bold px-8 py-4 rounded-full hover:bg-[#FF5C35] hover:text-[#FFF8F0] transition-colors"
          >
            Nhắn tin tạo combo →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
