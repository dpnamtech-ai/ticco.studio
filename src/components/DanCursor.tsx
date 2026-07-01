"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DanCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setIsHover(!!t.closest("a, button, [data-hover]"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] select-none"
      animate={{
        x: pos.x - 16,
        y: pos.y - 16,
        scale: isHover ? 1.4 : 1,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    >
      {/* Đần face cursor */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" fill="#F5A623" stroke="#1A1208" strokeWidth="1.5" />
        {/* eyes */}
        <circle cx="11" cy="14" r="2.5" fill="#1A1208" />
        <circle cx="21" cy="14" r="2.5" fill="#1A1208" />
        {/* shine */}
        <circle cx="12" cy="13" r="0.8" fill="white" />
        <circle cx="22" cy="13" r="0.8" fill="white" />
        {/* mouth — changes when hover */}
        {isHover ? (
          <path d="M11 20 Q16 25 21 20" stroke="#1A1208" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M11 20 Q16 23 21 20" stroke="#1A1208" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        )}
        {/* blush */}
        <circle cx="9" cy="18" r="2" fill="#FF5C35" opacity="0.4" />
        <circle cx="23" cy="18" r="2" fill="#FF5C35" opacity="0.4" />
      </svg>
    </motion.div>
  );
}
