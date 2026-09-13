"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string;
  name: string;
  priceFrom: number;
  image?: string;
  index?: number;
  soldOut?: boolean;
  nameClassName?: string;
}

export default function ProductCard({ id, name, priceFrom, image, index = 0, soldOut = false, nameClassName = "" }: ProductCardProps) {
  return (
    <motion.a
      href={`/san-pham/${id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group block"
    >
      <div className="relative aspect-[4/5] bg-[#D9D9D9] mb-4 border-2 border-transparent group-hover:border-[var(--color-ink)] transition-colors duration-300">
        {image && (
          <Image src={image} alt={name} fill quality={90} className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
        )}
        {soldOut && (
          <span className="absolute top-2 left-2 bg-[var(--color-ink)] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
            Hết hàng
          </span>
        )}
      </div>
      <div className="text-center">
        <h3 className={`font-semibold text-[var(--color-ink)] ${nameClassName}`}>{name}</h3>
        <p className="text-sm text-[var(--color-ink)]/50 mt-1">
          {priceFrom > 0 ? `${priceFrom.toLocaleString("vi-VN")} VNĐ` : "Liên hệ"}
        </p>
      </div>
    </motion.a>
  );
}
