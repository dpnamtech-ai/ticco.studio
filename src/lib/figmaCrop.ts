import type { CSSProperties } from "react";

/** Figma image fill `imageTransform` (2x3 affine, image-space UV of the visible window). */
export type ImageTransform = readonly [readonly [number, number, number], readonly [number, number, number]];

/**
 * Reproduces a Figma STRETCH fill with an imageTransform (crop/zoom) in CSS, without touching the file:
 * the visible window is u∈[tx, tx+a], v∈[ty, ty+d], stretched onto the box. Put the returned style on an
 * <img> (or next/image `fill`) inside an `overflow-hidden` relative box.
 */
export function cropStyle([[a, , tx], [, d, ty]]: ImageTransform): CSSProperties {
  return {
    position: "absolute",
    width: `${100 / a}%`,
    height: `${100 / d}%`,
    left: `${(-tx / a) * 100}%`,
    top: `${(-ty / d) * 100}%`,
    maxWidth: "none",
  };
}

/**
 * Same crop for a next/image `fill` (which rejects style.width/height): the image keeps its 100% box and is
 * scaled/shifted with a transform instead. Parent must be `overflow-hidden`.
 * Pass the box `aspect` (Figma layer w/h) to also reproduce rotation/skew terms; without it they are ignored.
 */
export function cropFillStyle([[a, b, tx], [c, d, ty]]: ImageTransform, aspect?: number): CSSProperties {
  if (aspect === undefined) [b, c] = [0, 0];
  // The fill maps box UV → image UV; the <img> (stretched over the box) needs the inverse.
  const det = a * d - b * c;
  const [i11, i12, i21, i22] = [d / det, -b / det, -c / det, a / det];
  const ox = -(i11 * tx + i12 * ty);
  const oy = -(i21 * tx + i22 * ty);
  const r = aspect ?? 1;
  const r5 = (n: number) => Math.round(n * 1e5) / 1e5;
  const lin = b || c ? `matrix(${r5(i11)}, ${r5(i21 / r)}, ${r5(i12 * r)}, ${r5(i22)}, 0, 0)` : `scale(${r5(i11)}, ${r5(i22)})`;
  return { transformOrigin: "0 0", transform: `translate(${r5(ox * 100)}%, ${r5(oy * 100)}%) ${lin}` };
}

/** Style for a next/image `fill` from a stored Figma fill: a crop transform, or the scaleMode's object-fit. */
export function fillStyle(f?: { m?: ImageTransform; ar?: number; fit?: string }): CSSProperties {
  if (f?.m) return { objectFit: "fill", ...cropFillStyle(f.m, f.ar) };
  return { objectFit: (f?.fit as CSSProperties["objectFit"]) ?? "cover" };
}
