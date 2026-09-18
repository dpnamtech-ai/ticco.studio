"use client";

import { useState } from "react";
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
  /** Figma home/mascot card: 210x277 image, 15px name, 12px price. */
  compact?: boolean;
}

export default function ProductCard({ id, name, priceFrom, image, index = 0, soldOut = false, nameClassName = "", compact = false }: ProductCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.a
      href={`/san-pham/${id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group block"
    >
      <div className={`relative ${compact ? "aspect-[210/277] mb-[10px]" : "aspect-[4/5] mb-4"} bg-[#D9D9D9] overflow-hidden border-2 border-transparent group-hover:border-[var(--color-ink)] transition-colors duration-300`}>
        {image && !loaded && <div className="shimmer absolute inset-0 overflow-hidden" />}
        {image && (
          <Image
            src={image}
            alt={name}
            fill
            quality={90}
            onLoad={() => setLoaded(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
        {soldOut && (
          <span className="absolute top-2 left-2 bg-[var(--color-ink)] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
            Hết hàng
          </span>
        )}
      </div>
      <div className="text-center">
        <h3 className={`font-semibold text-[var(--color-ink)] ${compact ? "text-[15px] leading-[22px] min-h-[45px]" : ""} ${nameClassName}`}>{name}</h3>
        <p className={`text-[var(--color-ink)]/50 ${compact ? "text-xs mt-[5px]" : "text-sm mt-1"}`}>
          {priceFrom > 0 ? `${priceFrom.toLocaleString("vi-VN")} VNĐ` : "Liên hệ"}
        </p>
      </div>
    </motion.a>
  );
}
