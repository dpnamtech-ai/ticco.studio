"use client";

import { useEffect, useRef } from "react";

// Plays the ScatterWords words in (adds .sw-in) once the group scrolls into view; see scatterWords.tsx.
export function ScatterGroup({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("sw-in");
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
