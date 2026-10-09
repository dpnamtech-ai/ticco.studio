"use client";

import { useEffect, useRef } from "react";

// Phones only: a tap drops a few little Đần that tumble down and fade; holding the finger keeps them pouring out
// (following it) until it lifts. Finger only (pointerType "touch"): the client tried it on desktop clicks (08/10) and
// took it back (09/10) — the desktop has the Đần cursor. Plain DOM + Web Animations (no React state per sprite),
// pointer-events none so taps still hit the page, capped at MAX sprites, off for prefers-reduced-motion.
const ART = [
  "/images/mascot-dan/bio/dan-1.png",
  "/images/mascot-dan/bio/dan-2.png",
  "/images/mascot-dan/bio/dan-3.png",
  "/images/figma/d589ad7c701656373d6884e2905ee9267b4d2665.webp",
].map((src) => `/_next/image?url=${encodeURIComponent(src)}&w=256&q=90`); // q must be one of next.config images.qualities, or the optimizer answers 400
const PER_TAP = 3;
const HOLD_EVERY = 140; // ms between Đần while the finger stays down
const MAX = 40;

export default function DanRain() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = layer.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // warm the image cache on touch devices so the first tap isn't blank
    if (matchMedia("(pointer: coarse)").matches) ART.forEach((src) => (new Image().src = src)); // warm the cache on touch devices

    const spawn = (x: number, y: number, delay = 0) => {
      if (root.childElementCount >= MAX) return;
      const img = document.createElement("img");
      const size = 30 + Math.random() * 18;
      img.src = ART[Math.floor(Math.random() * ART.length)];
      img.alt = "";
      img.style.cssText = `position:fixed;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:auto;will-change:transform,opacity`;
      root.appendChild(img);
      const dx = (Math.random() - 0.5) * 140;
      const spin = (Math.random() - 0.5) * 420;
      img
        .animate(
          [
            { transform: "translate(0,0) rotate(0deg) scale(0.4)", opacity: 1 },
            { transform: `translate(${dx * 0.4}px,-${30 + Math.random() * 40}px) rotate(${spin * 0.3}deg) scale(1)`, opacity: 1, offset: 0.25 },
            { transform: `translate(${dx}px,${220 + Math.random() * 160}px) rotate(${spin}deg) scale(0.9)`, opacity: 0 },
          ],
          // slow, floaty fall
          { duration: 1700 + Math.random() * 600, easing: "cubic-bezier(.3,.1,.55,1)", delay },
        )
        .finished.finally(() => img.remove());
    };

    let timer = 0;
    let at = { x: 0, y: 0 };
    const stop = () => clearInterval(timer);
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      at = { x: e.clientX, y: e.clientY };
      for (let i = 0; i < PER_TAP; i++) spawn(at.x, at.y, i * 40);
      stop();
      timer = window.setInterval(() => spawn(at.x, at.y), HOLD_EVERY);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") at = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    // pointercancel fires when the touch turns into a scroll, so scrolling stops the stream too
    for (const t of ["pointerup", "pointercancel"]) window.addEventListener(t, stop);
    return () => {
      stop();
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      for (const t of ["pointerup", "pointercancel"]) window.removeEventListener(t, stop);
    };
  }, []);

  return <div ref={layer} aria-hidden className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden" />;
}
