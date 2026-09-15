"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import MagnifierImage from "./MagnifierImage";

interface ProductDetailProps {
  id: string;
  name: string;
  priceFrom: number;
  unit: string;
  description: string;
  variants: string[];
  specs: string[];
  note?: string;
  image?: string;
  thumbnails?: string[];
  soldOut?: boolean;
}

export default function ProductDetail({
  id,
  name,
  priceFrom,
  unit,
  description,
  variants,
  specs,
  note,
  image,
  thumbnails,
  soldOut = false,
}: ProductDetailProps) {
  const [selected, setSelected] = useState(variants[0]);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({ id, name, variant: selected, price: priceFrom });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <div className="aspect-[550/689] relative mb-4 bg-[#D9D9D9]">
          {image && <MagnifierImage src={image} alt={name} priority sizes="(max-width: 768px) 100vw, 550px" />}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="group aspect-[269/337] relative overflow-hidden bg-[#D9D9D9]">
              {thumbnails?.[i] && (
                <Image
                  src={thumbnails[i]}
                  alt=""
                  fill
                  quality={90}
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 275px"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)] uppercase mb-2">
          {name}
          {soldOut && (
            <span className="ml-3 align-middle bg-[var(--color-ink)] text-white text-xs font-bold uppercase tracking-wide px-2 py-1 rounded">
              Hết hàng
            </span>
          )}
        </h1>
        <p className="text-2xl font-semibold text-[var(--color-purple)] mb-6">
          {priceFrom > 0 ? `${priceFrom.toLocaleString("vi-VN")} VNĐ/ ${unit}` : "Liên hệ để biết giá"}
        </p>

        <p
          className="text-[var(--color-ink)]/80 leading-relaxed mb-8"
          style={{ whiteSpace: "pre-line" }}
        >
          {description}
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          {variants.map((v) => (
            <button
              key={v}
              onClick={() => setSelected(v)}
              className={
                selected === v
                  ? "bg-[var(--color-purple)] text-white px-5 py-2.5 rounded-md text-sm font-semibold"
                  : "bg-[var(--color-purple)]/10 text-[var(--color-purple)] px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-[var(--color-purple)]/20 transition-colors"
              }
            >
              {v}
            </button>
          ))}
        </div>

        <motion.button
          onClick={handleAdd}
          disabled={soldOut}
          whileTap={{ scale: 0.96 }}
          animate={added ? { backgroundColor: "var(--color-purple)" } : { backgroundColor: "#D9D9D9" }}
          className="w-full hover:bg-[var(--color-ink)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D9D9D9] text-[var(--color-ink)] data-[added=true]:text-white font-semibold py-4 rounded-lg uppercase text-sm tracking-wide mb-8 flex items-center justify-center gap-2"
          data-added={added}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-2 text-white"
              >
                <Check size={18} /> Đã thêm
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {soldOut ? "Hết hàng" : "Thêm vào giỏ hàng"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="border-t border-[var(--color-ink)]/15 pt-6 space-y-1.5 text-sm text-[var(--color-ink)]/75">
          {specs.map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>

        {note && (
          <div className="mt-6 text-sm text-[var(--color-ink)]/60">
            <p className="font-semibold text-[var(--color-ink)]/80">Lưu ý:</p>
            <p style={{ whiteSpace: "pre-line" }}>{note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
