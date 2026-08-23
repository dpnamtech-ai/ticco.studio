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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/mascot-dan.png" alt="" width={36} height={36} className="w-9 h-9 object-contain" />
    </motion.div>
  );
}
