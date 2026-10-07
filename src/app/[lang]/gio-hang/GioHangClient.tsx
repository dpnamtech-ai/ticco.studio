"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCart, variantNote } from "@/context/CartContext";
import Reveal from "@/components/Reveal";
import { useLang, useT } from "@/components/LangSwitch";
import { localize } from "@/lib/i18n";
import { vnd } from "@/lib/shopFigma";

export default function GioHangClient() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const lang = useLang();
  const t = useT();

  if (items.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <Reveal variant="blur" duration={1.1}>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)] mb-4">
            {t("Giỏ hàng trống")}
          </h1>
        </Reveal>
        <Link href={localize("/san-pham", lang)} className="text-[var(--color-orange)] font-semibold hover:underline">
          {t("Xem sản phẩm →")}
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <Reveal variant="mask" className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">{t("Mua đi bạn ơi!")}</h1>
      </Reveal>

      <div className="divide-y divide-[var(--color-ink)]/10">
        {items.map((item) => (
          // Photo left; name + remove on top, quantity + line total underneath — reads the same on a phone and a laptop.
          <div key={`${item.id}-${item.variant}`} className="flex gap-4 py-5">
            <Link href={localize(`/san-pham/${item.id}`, lang)} className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 overflow-hidden bg-[#D9D9D9]">
              {item.image && <Image src={item.image} alt={t(item.name)} fill sizes="96px" className="object-cover" />}
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={localize(`/san-pham/${item.id}`, lang)} className="font-semibold leading-snug text-[var(--color-ink)] line-clamp-2 hover:underline">
                    {t(item.name)}
                  </Link>
                  {variantNote(item) && <p className="mt-0.5 text-sm text-[var(--color-ink)]/55 truncate">{t(variantNote(item))}</p>}
                </div>
                <button
                  onClick={() => removeItem(item.id, item.variant)}
                  aria-label={t("Xoá")}
                  className="-mr-1 -mt-1 shrink-0 p-1 text-[var(--color-ink)]/40 hover:text-[var(--color-orange)]"
                >
                  <X size={18} className="size-[1.125rem]" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, item.variant, item.qty - 1)}
                    className="w-8 h-8 rounded-full border border-[var(--color-ink)]/20 hover:bg-[var(--color-ink)]/5"
                    aria-label={t("Giảm số lượng")}
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.variant, item.qty + 1)}
                    className="w-8 h-8 rounded-full border border-[var(--color-ink)]/20 hover:bg-[var(--color-ink)]/5"
                    aria-label={t("Tăng số lượng")}
                  >
                    +
                  </button>
                </div>
                <p className="whitespace-nowrap font-semibold text-[var(--color-ink)]">{vnd(item.price * item.qty, lang)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-[var(--color-ink)]/15">
        <p className="text-lg font-semibold text-[var(--color-ink)]">{t("Tạm tính")}</p>
        <p className="text-2xl font-bold text-[var(--color-purple)]">
          {vnd(subtotal, lang)}
        </p>
      </div>

      <Link
        href={localize("/checkout", lang)}
        className="block text-center w-full bg-[var(--color-purple)] text-white font-semibold py-4 rounded-lg uppercase text-sm tracking-wide mt-6 hover:bg-[var(--color-ink)] transition-colors"
      >
        {t("Mua ngay mua ngay")}
      </Link>
    </section>
  );
}
