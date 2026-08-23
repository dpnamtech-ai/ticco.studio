"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

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
        <div className="aspect-square relative overflow-hidden mb-4 bg-[#D9D9D9]">
          {image && <Image src={image} alt={name} fill className="object-cover" />}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square bg-[#D9D9D9]" />
          <div className="aspect-square bg-[#D9D9D9]" />
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
          {priceFrom.toLocaleString("vi-VN")} VNĐ/ {unit}
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
                  ? "bg-[var(--color-purple)] text-white px-5 py-2.5 rounded-full text-sm font-semibold"
                  : "bg-[var(--color-purple)]/10 text-[var(--color-purple)] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[var(--color-purple)]/20 transition-colors"
              }
            >
              {v}
            </button>
          ))}
        </div>

        <button
          onClick={handleAdd}
          disabled={soldOut}
          className="w-full bg-[#D9D9D9] hover:bg-[var(--color-ink)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D9D9D9] disabled:hover:text-[var(--color-ink)] text-[var(--color-ink)] font-semibold py-4 rounded-lg uppercase text-sm tracking-wide mb-8"
        >
          {soldOut ? "Hết hàng" : added ? "Đã thêm ✓" : "Thêm vào giỏ hàng"}
        </button>

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
