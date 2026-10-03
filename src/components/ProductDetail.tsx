"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Reveal from "@/components/Reveal";
import type { Crop } from "@/lib/shop";
import { fillStyle, zoomSizes } from "@/lib/figmaCrop";
import { layoutBottom, type Box, type FigmaLayout } from "@/lib/shopFigma";
import { priceFor } from "@/lib/shop";

interface ProductDetailProps {
  id: string;
  name: string;
  /** Price charged in the cart. */
  priceFrom: number;
  /** Heading copy (Figma line breaks); shown uppercase. */
  title: string;
  /** Price copy, e.g. "445.000 VNĐ/ BST 3 box". */
  priceLabel: string;
  description: string;
  variants: string[];
  /** Option label → sibling product id, when the option buttons switch products (Sổ Căn Bản, Đần Sinh Tồn, mũ). */
  variantLinks?: Record<string, string>;
  /** Option label → gallery index to show as the main image when that option is picked (postcards, bandana). */
  variantImages?: Record<string, number>;
  /** Admin per-option settings; only prices are read here (priceFor). */
  variantOptions?: Record<string, { price?: number }>;
  specs: string[];
  note?: string;
  /** Main image first, then the small ones, each with its Figma crop. */
  gallery: Crop[];
  /** Extra captioned image under the specs (Gile Yên Tâm size chart). */
  extra?: Crop & { label: string; w: number; h: number };
  soldOut?: boolean;
  /** When this product is a combo: the standalone products it's made of, each still buyable on its own page. */
  bundleItems?: { id: string; name: string; image?: string; priceFrom: number; qty: number }[];
  /** Exact desktop positions from this product's Figma frame (only while its content is unchanged). */
  layout?: FigmaLayout;
}

type Vars = CSSProperties & Record<`--${string}`, string>;
// Full-quality photos are heavy: each one fades in from a soft blur once loaded, over the grey box, instead of popping in.
const fade = "opacity-0 blur-[6px] transition-[opacity,filter] duration-700 ease-out data-[loaded=true]:opacity-100 data-[loaded=true]:blur-none";
const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => (e.currentTarget.dataset.loaded = "true");
const cq = (px: number) => `${Math.round((px / 12.8) * 1e4) / 1e4}cqw`;
/** Desktop box at Figma frame coordinates, relative to (ox, oy); the page content starts at frame y 51. */
const at = (b: Box | undefined, ox = 0, oy = 51): Vars | undefined =>
  b && { "--x": cq(b[0] - ox), "--y": cq(b[1] - oy), "--w": cq(b[2]), "--h": cq(b[3]), ...(b[4] ? { "--lh": cq(b[4]) } : {}) };

// Figma san-pham-* frames (1280 wide). With `layout`, every block sits at its frame position (desktop);
// without it, a flow layout with the frames' typical spacing is used. Desktop values are px / 12.8 cqw.
export default function ProductDetail({
  id,
  name,
  priceFrom,
  title,
  priceLabel,
  description,
  variants,
  variantLinks,
  variantImages,
  variantOptions,
  specs,
  note,
  gallery,
  extra,
  soldOut = false,
  bundleItems,
  layout: L,
}: ProductDetailProps) {
  const own = variantLinks && Object.keys(variantLinks).find((label) => variantLinks[label] === id);
  const [selected, setSelected] = useState(own ?? variants[0] ?? "Mặc định");
  const [added, setAdded] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // ?chon=<option> opens the product on that option (shareable links to "Bandana - Tím").
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("chon");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (v && variants.includes(v)) setSelected(v);
  }, [variants]);

  const pick = (v: string) => {
    setSelected(v);
    const url = new URL(window.location.href);
    url.searchParams.set("chon", v);
    window.history.replaceState(null, "", url);
    // On phones the photo sits above the option buttons: bring it into view so the switch is visible.
    if (variantImages && variantImages[v] !== undefined) {
      const r = mainRef.current?.getBoundingClientRect();
      if (r && r.bottom < window.innerHeight * 0.35) mainRef.current!.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({ id, name, variant: selected, price: priceFor({ id, priceFrom, variantOptions }, selected), image: main?.src });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const [first, ...smalls] = gallery;
  const main = gallery[variantImages?.[selected] ?? 0] ?? first;
  const wide = smalls.length > 4;
  const specText = specs.join("\n") + (note ? `${specs.length ? "\n\n" : ""}Lưu ý:\n${note}` : "");
  const abs = L ? "lg:absolute lg:left-(--x) lg:top-(--y) lg:w-(--w)" : "";
  const flow = (cls: string) => (L ? "lg:mt-0" : cls); // desktop spacing of the flow layout; positioned boxes need none
  const body = "text-sm lg:text-[1.094cqw] leading-5 lg:leading-[1.563cqw] font-light tracking-[-0.3px] lg:tracking-[-0.055cqw] text-black whitespace-pre-line";
  const option = `relative flex items-center justify-center h-8 min-w-[110px] px-3 rounded-md lg:rounded-[0.469cqw] bg-[#53129e] text-white text-[15px] lg:text-[1.406cqw] lg:leading-[1.484cqw] font-light tracking-[-0.05em] whitespace-nowrap transition-opacity hover:opacity-85 ${L ? "lg:w-full lg:h-full lg:min-w-0 lg:px-[0.469cqw]" :"lg:h-[2.5cqw] lg:min-w-[10.156cqw] lg:px-[1.25cqw]"}`;
  const label = "text-center";
  const picked = "ring-2 ring-[#53129e] ring-offset-2 ring-offset-[#f5f5f5]";
  const cta = `${variants.length ? "mt-4" : "mt-8"} ${flow(variants.length ? "lg:mt-[1.094cqw]" : "lg:mt-[3.672cqw]")} flex items-center justify-center w-full lg:w-[35.234cqw] h-10 lg:h-[3.125cqw] rounded-md lg:rounded-[0.469cqw] text-lg lg:text-[1.719cqw] lg:leading-[1.484cqw]`;
  const box = (b: Box) => ({ aspectRatio: `${b[2]} / ${b[3]}` });

  return (
    <div
      className={L ? "flex flex-col lg:block lg:relative lg:h-(--wh)" : "flex flex-col lg:grid lg:grid-cols-[42.969cqw_35.781cqw] lg:gap-x-[7.109cqw] lg:gap-y-[4.453cqw] lg:items-start"}
      style={L ? ({ "--wh": cq(layoutBottom(L) - 51) } as Vars) : undefined}
    >
      <Reveal variant="curtain" duration={1.3} className={`order-1 ${L ? abs : "lg:order-none lg:col-start-1 lg:row-start-1"}`} style={at(L?.gallery[0])}>
        <div ref={mainRef} className="relative aspect-[550/689] bg-[#d9d9d9] overflow-hidden scroll-mt-20" style={L && box(L.gallery[0])}>
          {main && <Image key={main.src} src={main.src} alt={selected === variants[0] ? name : `${name} - ${selected}`} fill priority className={fade} onLoad={onLoad} sizes={zoomSizes("(max-width: 1024px) 100vw, 43vw", main)} style={fillStyle(main)} />}
        </div>
      </Reveal>

      {smalls.length > 0 && (
        <div
          className={`order-2 mt-3 grid grid-cols-2 gap-3 ${L ? "lg:contents" : `lg:order-none lg:mt-0 lg:gap-[0.938cqw] lg:row-start-2 lg:col-start-1 ${wide ? "lg:grid-cols-3 lg:col-span-2 lg:w-[65cqw]" : ""}`}`}
        >
          {smalls.map((img, i) => (
            <Reveal
              key={`${img.src}-${i}`}
              variant="up"
              delay={0.05 * i}
              className={`group relative aspect-[269/336] overflow-hidden bg-[#d9d9d9] ${abs}`}
              style={L && { ...at(L.gallery[i + 1]), ...box(L.gallery[i + 1]) }}
            >
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                <Image src={img.src} alt={`${name} — ảnh ${i + 2}`} fill className={fade} onLoad={onLoad} style={fillStyle(img)} sizes={zoomSizes("(max-width: 1024px) 50vw, 22vw", img)} />
              </div>
            </Reveal>
          ))}
        </div>
      )}

      <div className={`order-3 mt-8 ${L ? "lg:contents" : `lg:order-none lg:-mt-[0.703cqw] lg:col-start-2 lg:row-start-1 ${wide ? "" : "lg:row-span-2"}`}`}>
        {/* Figma's SOLD OUT frames pin the description at Y336 and the button at Y506 whatever the title length. */}
        <div className={L ? "lg:contents" : soldOut ? "lg:min-h-[13.516cqw]" : undefined}>
          <Reveal variant="up" duration={1.1} className={abs} style={at(L?.title)}>
            <h1 className={`text-[28px] lg:text-[3.125cqw] leading-tight ${L ? "lg:leading-(--lh)" : "lg:leading-[3.516cqw]"} font-semibold uppercase tracking-[-1.2px] lg:tracking-[-0.156cqw] text-[#53129e] whitespace-pre-line`}>
              {title}
            </h1>
          </Reveal>
          <Reveal variant="up" delay={0.15} className={abs} style={at(L?.price)}>
            <p className={`mt-2 lg:mt-0 text-2xl lg:text-[2.656cqw] leading-[1.1] ${L ? "lg:leading-(--lh)" : ""} font-light tracking-[-1px] lg:tracking-[-0.133cqw] text-[#53129e] whitespace-pre-line`}>
              {priceLabel}
            </p>
          </Reveal>
        </div>

        <Reveal variant="blur" delay={0.25} duration={1.1} className={abs} style={at(L?.desc)}>
          {/* description is admin-authored rich text (Tiptap HTML), gated behind /admin auth — see requireAdmin() in admin/actions.ts */}
          <div className={`rich-content mt-6 ${flow(`lg:mt-[5.078cqw] ${soldOut ? "lg:min-h-[9.609cqw]" : ""}`)} ${body}`} dangerouslySetInnerHTML={{ __html: description }} />
        </Reveal>

        {bundleItems && bundleItems.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-black/70 mb-3">Bộ này gồm (bấm để xem/mua riêng):</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {bundleItems.map((item) => (
                <Link key={item.id} href={`/san-pham/${item.id}`} className="group block border border-black/10 rounded-lg overflow-hidden hover:border-[#53129e] transition-colors">
                  <div className="relative aspect-square bg-[#d9d9d9]">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="150px" />}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium line-clamp-2">
                      {item.qty > 1 ? `${item.qty}x ` : ""}
                      {item.name}
                    </p>
                    <p className="text-xs text-black/50">{item.priceFrom > 0 ? `${item.priceFrom.toLocaleString("vi-VN")} VNĐ` : "Liên hệ"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {variants.length > 0 && (
          <Reveal variant="up" delay={0.3} className={abs} style={at(L?.options?.box)}>
            <ul className={`mt-8 flex flex-wrap gap-x-3 gap-y-2 ${L ? "lg:mt-0 lg:block lg:relative" : "lg:mt-[3.672cqw] lg:gap-x-[1.172cqw] lg:gap-y-[0.547cqw]"}`}>
              {variants.map((v, i) => {
                const target = variantLinks?.[v];
                const b = L?.options?.buttons[i];
                const brk = !L && variantLinks && variants.length > 2 && i === variants.length - 1;
                return (
                  <li
                    key={v}
                    // Figma width is a minimum: some Figma labels are wider than their own button ("03 - Đần vắt cực khô…"),
                    // so the button grows to the right instead of letting the text spill out.
                    className={`flex ${brk ? "basis-full" : ""} ${b ? "lg:absolute lg:left-(--x) lg:top-(--y) lg:w-max lg:min-w-(--w) lg:h-(--h)" : ""}`}
                    style={b && L?.options && at(b, L.options.box[0], L.options.box[1])}
                  >
                    {target && target !== id ? (
                      <Link href={`/san-pham/${target}`} className={option}><span className={label}>{v}</span></Link>
                    ) : (
                      <button type="button" onClick={() => pick(v)} aria-pressed={selected === v} className={`${option} ${selected === v ? picked : ""}`}>
                        <span className={label}>{v}</span>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        )}

        <Reveal variant="up" delay={0.4} className={abs} style={at(L?.cta)}>
          {soldOut ? (
            <p className={`${cta} bg-[#e40000] text-white font-semibold`}><span>SOLD OUT</span></p>
          ) : (
            <motion.button
              type="button"
              onClick={handleAdd}
              whileTap={{ scale: 0.96 }}
              animate={added ? { backgroundColor: "#53129e" } : { backgroundColor: "#d9d9d9" }}
              className={`${cta} gap-2 text-black font-normal uppercase tracking-[-0.8px] lg:tracking-[-0.086cqw] hover:!bg-[#2a2828] hover:text-white transition-colors`}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span key="added" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="flex items-center gap-2 text-white">
                    <Check size={18} /> Đã thêm
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Thêm vào giỏ hàng
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </Reveal>

        <div className={`mt-8 h-px bg-[#9b9a9a] lg:w-[35.313cqw] ${flow("lg:mt-[3.984cqw]")} ${abs}`} style={at(L?.line)} />
        {specText && (
          <Reveal variant="up" delay={0.5} className={abs} style={at(L?.specs)}>
            <p className={`mt-2 ${flow("lg:mt-[0.547cqw]")} ${body}`}>{specText}</p>
          </Reveal>
        )}

        {extra && (
          <>
            <Reveal variant="up" delay={0.2} className={`mt-10 ${flow("lg:mt-[7.266cqw]")} ${abs}`} style={at(L?.extraLabel)}>
              <p className={`text-lg lg:text-[1.719cqw] leading-5 ${L ? "lg:leading-(--lh)" : "lg:leading-[1.484cqw]"} font-normal text-black`}>{extra.label}</p>
            </Reveal>
            <Reveal variant="up" delay={0.3} className={`mt-4 ${flow("lg:mt-[1.953cqw]")} ${abs}`} style={at(L?.extraImg)}>
              <div className="relative w-full max-w-[394px] lg:max-w-none lg:w-[30.781cqw] overflow-hidden" style={{ aspectRatio: `${extra.w} / ${extra.h}` }}>
                <Image src={extra.src} alt={`${name} — ${extra.label}`} fill className={fade} onLoad={onLoad} style={fillStyle(extra)} sizes={zoomSizes("(max-width: 1024px) 100vw, 31vw", extra)} />
              </div>
            </Reveal>
          </>
        )}
      </div>
    </div>
  );
}
