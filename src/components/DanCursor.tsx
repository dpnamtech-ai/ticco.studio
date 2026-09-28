"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Figma DEMO layer "con-tro-chuot" (863:53, "con trỏ chuột Đần") used as the mouse cursor.
// The art sits inside a 2560px transparent square (visible 18%-83%), so a 56px box shows a ~37px Đần.
// Hotspot = tip of the raised finger (~24%, 15% of the square). Only on hover-capable fine pointers;
// the native cursor is hidden (html.dan-cursor in globals.css) only after this mounts, so no-JS keeps the OS cursor.
const SIZE = 56;
const HOT_X = Math.round(SIZE * 0.24);
const HOT_Y = Math.round(SIZE * 0.15);

export default function DanCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("dan-cursor");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      el.style.transform = `translate3d(${e.clientX - HOT_X}px, ${e.clientY - HOT_Y}px, 0)`;
      el.style.opacity = "1";
      el.dataset.hover = String(!!(e.target as Element).closest?.("a, button, [data-hover], [role=button]"));
    };
    const hide = () => (el.style.opacity = "0");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    return () => {
      root.classList.remove("dan-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="group fixed top-0 left-0 z-[9999] pointer-events-none select-none opacity-0"
      style={{ width: SIZE, height: SIZE }}
    >
      <Image
        src="/images/figma/d589ad7c701656373d6884e2905ee9267b4d2665.webp"
        alt=""
        width={SIZE}
        height={SIZE}
        loading="eager"
        draggable={false}
        className="h-full w-full transition-transform duration-150 group-data-[hover=true]:scale-125"
        style={{ transformOrigin: `${HOT_X}px ${HOT_Y}px` }}
      />
    </div>
  );
}
