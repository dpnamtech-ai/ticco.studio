"use client";

import WIDTHS from "./image-widths.json";

// next/image loader (next.config images.loaderFile): local photos are served from the copies pre-rendered by
// scripts/gen-image-sizes.mjs (public/_img/<width>/…, webp q90) instead of Vercel's optimizer, whose Hobby quota ran
// out on 2026-10-11 (402 on every uncached photo). The requested width rounds UP to the nearest pre-rendered one, so
// a photo is never shown softer than asked. Remote images (admin uploads on Supabase Storage) and SVG/GIF pass through.
export function imageUrl(src: string, width: number) {
  if (!src.startsWith("/images/") || /\.(svg|gif)$/i.test(src)) return src;
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `/_img/${w}${src.slice("/images".length).replace(/\.\w+$/, ".webp")}`;
}

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  return imageUrl(src, width);
}
