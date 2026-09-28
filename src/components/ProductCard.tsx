"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import type { Crop } from "@/lib/shop";
import { fillStyle, zoomSizes } from "@/lib/figmaCrop";

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
  /** Present on combo products; only used to show the "Combo" badge. */
  bundleItems?: unknown[];
  nameClassName?: string;
  /** Overrides the Figma name (e.g. the featured row shows the Sổ Căn Bản name on one line). */
  displayName?: string;
  /** Figma home/mascot card: 210x277 image, 15px name, 12px price. */
  compact?: boolean;
  /** Figma crop of the image fill (shop listing / suggestions). */
  crop?: Crop;
  /** Exact Figma price copy, e.g. "165.000 VNĐ/ box". */
  priceLabel?: string;
}

export default function ProductCard({ id, name, priceFrom, image, index = 0, soldOut = false, bundleItems, nameClassName = "", displayName, compact = false, crop, priceLabel }: ProductCardProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <motion.a
      href={`/san-pham/${id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group block"
    >
      <div ref={ref} className={`relative ${compact ? "aspect-[210/277] mb-[10px] lg:mb-[0.781cqw] border-2 border-transparent group-hover:border-[var(--color-ink)] transition-colors duration-300" : "aspect-[264/330] mb-2.5 lg:mb-[1.094cqw]"} bg-[#D9D9D9] overflow-hidden`}>
        {image && !loaded && <div className="shimmer absolute inset-0 overflow-hidden" />}
        {image && (
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08 }}
            animate={{ scale: seen ? 1 : 1.08 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={`absolute inset-0 transition-transform ${compact ? "duration-300 group-hover:scale-110" : "duration-500 group-hover:scale-105"}`}>
              <Image
                src={image}
                alt={name}
                fill
               
                onLoad={() => setLoaded(true)}
                style={fillStyle(crop)}
                sizes={zoomSizes(compact ? "(max-width: 768px) 50vw, 25vw" : "(max-width: 1024px) 50vw, 25vw", crop?.m, compact ? 1.1 : 1.05)}
              />
            </div>
          </motion.div>
        )}
        {bundleItems?.length ? (
          <span className="absolute top-2 right-2 bg-[var(--color-purple)] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
            Combo
          </span>
        ) : null}
        {soldOut && !compact && (
          <span className="absolute left-0 top-[1px] bg-[#e40000] text-white text-xs lg:text-[1.5625cqw] leading-5 lg:leading-[1.484cqw] font-semibold tracking-[0.2px] lg:tracking-[0.016cqw] px-2 lg:px-0 lg:w-[8.125cqw] text-center">
            SOLD OUT
          </span>
        )}
        {soldOut && compact && (
          <span className="absolute top-2 left-2 bg-[var(--color-ink)] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
            Hết hàng
          </span>
        )}
      </div>
      <div className="text-center">
        <h3 className={compact ? `text-[15px] leading-[19px] lg:text-[1.172cqw] lg:leading-[1.484cqw] font-normal tracking-[-0.6px] lg:tracking-[-0.047cqw] text-[#323133] whitespace-pre-line ${nameClassName}` : `text-sm leading-5 lg:text-[1.328cqw] lg:leading-[1.484cqw] font-medium tracking-[-0.5px] lg:tracking-[-0.094cqw] text-black lg:whitespace-nowrap lg:-mx-[3.125cqw] ${nameClassName}`}>
          {compact ? displayName ?? FIGMA_NAMES[id] ?? name.toUpperCase() : name}
        </h3>
        <p className={compact ? "text-xs leading-5 lg:text-[0.9375cqw] lg:leading-[1.5625cqw] font-light tracking-[-0.48px] lg:tracking-[-0.0375cqw] text-[#8b8989]" : "text-xs leading-5 lg:text-[1.016cqw] lg:leading-[1.484cqw] lg:mt-[0.078cqw] font-light tracking-[-0.4px] lg:tracking-[-0.07cqw] text-black"}>
          {priceLabel ?? (priceFrom > 0 ? `${priceFrom.toLocaleString("vi-VN")} VNĐ` : "Liên hệ")}
        </p>
      </div>
    </motion.a>
  );
}
