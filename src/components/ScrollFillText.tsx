"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type CSSProperties } from "react";

/*
  Scroll-linked text fill: letters start dim and light up one by one, left to right, as the text scrolls
  up through the screen (scrolling back dims them again). Reduced motion: plain text.
*/
export default function ScrollFillText({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  // 0 when the text's top reaches 90% down the viewport, 1 at 45%
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.45"] });
  const chars = [...text];
  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {reduce
        ? text
        : chars.map((c, i) => <Char key={i} c={c} p={scrollYProgress} range={[i / chars.length, (i + 1) / chars.length]} />)}
    </p>
  );
}

function Char({ c, p, range }: { c: string; p: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(p, range, [0.2, 1]);
  return (
    <motion.span aria-hidden style={{ opacity }}>
      {c}
    </motion.span>
  );
}
