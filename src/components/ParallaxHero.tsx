"use client";

import { useRef } from "react";
import { motion, MotionConfig, useScroll, useTransform } from "framer-motion";

/* Hero photo: slow zoom-out on load + gentle parallax while scrolling past. */
export default function ParallaxHero({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  return (
    <MotionConfig reducedMotion="user">
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-left-top"
        style={{ y }}
        initial={{ scale: 1.14 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.8, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
    </MotionConfig>
  );
}
