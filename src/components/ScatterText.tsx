"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Fragment, useRef } from "react";

/*
  Scroll-linked word scatter (client's reference video 2026-09-30 22.24.11): while the text scrolls up into view its
  words fly in from scattered spots — bigger, dimmer, blurred, tilted — and settle into place; scrolling back scatters
  them again. Offsets are seeded by word index so server and client render the same. Reduced motion: plain text.
  Line breaks follow figmaLines: a single break is a real break on desktop and a space on phones.
*/
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x); // 0..1
};

export default function ScatterText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  // 0 when the text's top enters at the bottom of the screen, 1 when it reaches 55% up
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.55"] });
  if (reduce) return <span className="whitespace-pre-line">{text}</span>;

  let n = 0;
  const lines = text.split("\n");
  return (
    <span ref={ref}>
      {lines.map((line, li) => {
        const last = li === lines.length - 1;
        const hard = !line.trim() || (!last && !lines[li + 1].trim());
        return (
          <Fragment key={li}>
            {line.split(/(\s+)/).map((w, wi) => (w.trim() ? <Word key={wi} w={w} i={n++} p={scrollYProgress} /> : w))}
            {!last && (hard ? <br /> : <><br className="max-lg:hidden" /><span className="lg:hidden"> </span></>)}
          </Fragment>
        );
      })}
    </span>
  );
}

function Word({ w, i, p }: { w: string; i: number; p: MotionValue<number> }) {
  // each word lands at its own moment, between 55% and 100% of the scroll range
  const end = 0.55 + rnd(i, 1) * 0.45;
  const range = [0, end];
  const x = useTransform(p, range, [(rnd(i, 2) - 0.5) * 700, 0]);
  const y = useTransform(p, range, [(rnd(i, 3) - 0.3) * 400, 0]);
  const scale = useTransform(p, range, [1.5 + rnd(i, 4) * 1.5, 1]);
  const rotate = useTransform(p, range, [(rnd(i, 5) - 0.5) * 40, 0]);
  const opacity = useTransform(p, [0, end * 0.6, end], [0, 0.45, 1]);
  const filter = useTransform(p, range, ["blur(4px)", "blur(0px)"]);
  return (
    <motion.span className="inline-block will-change-transform" style={{ x, y, scale, rotate, opacity, filter }}>
      {w}
    </motion.span>
  );
}
