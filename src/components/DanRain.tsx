"use client";

import { useEffect, useRef } from "react";

// Phones' answer to the desktop Đần cursor: every tap drops a few little Đần that tumble down and fade.
// Plain DOM + Web Animations (no React state per sprite), pointer-events none so taps still hit the page,
// capped at MAX sprites, finger taps only (pointerType "touch": no mouse/pen), off for prefers-reduced-motion.
const ART = [
  "/images/mascot-dan/bio/dan-1.png",
  "/images/mascot-dan/bio/dan-2.png",
  "/images/mascot-dan/bio/dan-3.png",
  "/images/figma/d589ad7c701656373d6884e2905ee9267b4d2665.webp",
].map((src) => `/_next/image?url=${encodeURIComponent(src)}&w=128&q=100`);
const PER_TAP = 3;
const MAX = 24;

export default function DanRain() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = layer.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // warm the image cache on touch devices so the first tap isn't blank
    if (matchMedia("(pointer: coarse)").matches) ART.forEach((src) => (new Image().src = src));

    const drop = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || root.childElementCount >= MAX) return;
      for (let i = 0; i < PER_TAP; i++) {
        const img = document.createElement("img");
        const size = 30 + Math.random() * 18;
        img.src = ART[Math.floor(Math.random() * ART.length)];
        img.alt = "";
        img.style.cssText = `position:fixed;left:${e.clientX - size / 2}px;top:${e.clientY - size / 2}px;width:${size}px;height:auto;will-change:transform,opacity`;
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
            { duration: 1000 + Math.random() * 400, easing: "cubic-bezier(.35,.1,.6,1)", delay: i * 40 },
          )
          .finished.finally(() => img.remove());
      }
    };
    window.addEventListener("pointerdown", drop, { passive: true });
    return () => window.removeEventListener("pointerdown", drop);
  }, []);

  return <div ref={layer} aria-hidden className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden" />;
}
