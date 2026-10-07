"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Figma DEMO layer "con-tro-chuot" (863:53, "con trỏ chuột Đần") used as the mouse cursor.
// The art sits inside a 2560px transparent square (visible 18%-83%), so a 56px box shows a ~37px Đần.
// Hotspot = tip of the raised finger (~24%, 15% of the square). Only on hover-capable fine pointers;
// the native cursor is hidden (html.dan-cursor in globals.css) only after this mounts, so no-JS keeps the OS cursor.
// The page scales with the viewport (cqw); a fixed 56px cursor looked tiny on big screens (client 08/10), so it
// scales too: 56px at 1280 wide and up.
const SIZE = "max(56px, 4.375vw)";

export default function DanCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("dan-cursor");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const s = el.offsetWidth;
      el.style.transform = `translate3d(${e.clientX - s * 0.24}px, ${e.clientY - s * 0.15}px, 0)`;
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
        width={112}
        height={112}
        loading="eager"
        draggable={false}
        className="h-full w-full transition-transform duration-150 group-data-[hover=true]:scale-125"
        style={{ transformOrigin: "24% 15%" }}
      />
    </div>
  );
}
