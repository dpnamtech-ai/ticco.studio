"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

// Figma product-name copy (uppercase, with the design's own line breaks) for the compact cards.
const FIGMA_NAMES: Record<string, string> = {
  "bst-dan-sinh-ton": "BỘ SƯU TẬP\nĐẦN SINH TỒN",
  "tui-song-cu-khoi": "TÚI SỐNG CỪ KHÔI",
  "so-can-ban": "BỘ SƯU TẬP\nSỔ CĂN BẢN",
  "gile-yen-tam": "GILE YÊN TÂM",
  "box-set-tim-kiem-dieu-ky-dieu": "BOXSET TÌM KIẾM\nĐIỀU KỲ DIỆU",
  "sticker-07-dan-noi": "SET STICKER 07:\nĐẦN NÓI",
  "tui-vung-vang": "TÚI VỮNG VÀNG",
  "sticker-05-ban-lam-duoc-ma": "SET STICKER 05:\nBẠN LÀM ĐƯỢC MÀ",
  "khan-bandana-van-su-tuy-minh": "BANDANA\nVẠN SỰ TUỲ MÌNH",
  "tote-xoi-loi-voi-doi": "TÚI XỞI LỞI VỚI ĐỜI",
  "lot-coc-ra-khoi": "LÓT CỐC RA KHƠI",
  "bst-postcard-triet-ly-song-dan": "SET POSTCARD\nTRIẾT LÝ SỐNG ĐẦN",
};

interface ProductCardProps {
  id: string;
  name: string;
  priceFrom: number;
  image?: string;
  index?: number;
  soldOut?: boolean;
  nameClassName?: string;
  /** Overrides the Figma name (e.g. the featured row shows the Sổ Căn Bản name on one line). */
  displayName?: string;
  /** Figma home/mascot card: 210x277 image, 15px name, 12px price. */
  compact?: boolean;
}

export default function ProductCard({ id, name, priceFrom, image, index = 0, soldOut = false, nameClassName = "", displayName, compact = false }: ProductCardProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -35% 0px" });

  return (
    <motion.a
      href={`/san-pham/${id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -35% 0px" }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group block"
    >
      <div ref={ref} className={`relative ${compact ? "aspect-[210/277] mb-[10px] lg:mb-[0.781cqw]" : "aspect-[4/5] mb-4"} bg-[#D9D9D9] overflow-hidden border-2 border-transparent group-hover:border-[var(--color-ink)] transition-colors duration-300`}>
        {image && !loaded && <div className="shimmer absolute inset-0 overflow-hidden" />}
        {image && (
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.18 }}
            animate={{ scale: seen ? 1 : 1.18 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={image}
              alt={name}
              fill
              quality={90}
              onLoad={() => setLoaded(true)}
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </motion.div>
        )}
        {soldOut && (
          <span className="absolute top-2 left-2 bg-[var(--color-ink)] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
            Hết hàng
          </span>
        )}
      </div>
      <div className="text-center">
        <h3 className={compact ? `text-[15px] leading-[19px] lg:text-[1.172cqw] lg:leading-[1.484cqw] font-normal tracking-[-0.6px] lg:tracking-[-0.047cqw] text-[#323133] whitespace-pre-line ${nameClassName}` : `font-semibold text-[var(--color-ink)] ${nameClassName}`}>
          {compact ? displayName ?? FIGMA_NAMES[id] ?? name.toUpperCase() : name}
        </h3>
        <p className={compact ? "text-xs leading-5 lg:text-[0.9375cqw] lg:leading-[1.5625cqw] font-light tracking-[-0.48px] lg:tracking-[-0.0375cqw] text-[#8b8989]" : "text-sm mt-1 text-[var(--color-ink)]/50"}>
          {priceFrom > 0 ? `${priceFrom.toLocaleString("vi-VN")} VNĐ` : "Liên hệ"}
        </p>
      </div>
    </motion.a>
  );
}
