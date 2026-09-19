"use client";

import { motion, MotionConfig, useInView, type Transition } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useIsSmall } from "@/lib/useIsSmall";

/*
  Scroll-reveal helper with a few distinct entrances (used on /kham-pha):
  up    - fade + rise
  left / right - slide in from the side
  scale - pop in
  wipe  - left-to-right clip wipe (labels)
  mask  - text rising out from behind a mask line (headings)
  line  - rule drawing itself from the left
  blur  - soft fade + rise (body copy)
  curtain - image fades up while settling from a slight zoom
  Only opacity/transform (plus a small clip for wipe) are animated so it stays smooth on phones; on small
  screens it plays sooner and ~40% faster.
  Plays once when the element reaches the middle of the screen (at="edge": as soon as it shows at the
  bottom edge, used by the footer). If it stays on screen for ~1.4s without reaching the middle (short pages,
  content right above the footer) it plays anyway, so nothing is left hidden. Plays once; MotionConfig reducedMotion="user" drops the movement for people
  who prefer reduced motion.
*/
type Variant = "up" | "left" | "right" | "scale" | "wipe" | "mask" | "line" | "blur" | "curtain";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const VARIANTS = {
  up: { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -70 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 70 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } },
  wipe: { hidden: { clipPath: "inset(0 100% 0 0)" }, show: { clipPath: "inset(0 0% 0 0)" } },
  mask: { hidden: { y: "105%" }, show: { y: "0%" } },
  line: { hidden: { scaleX: 0 }, show: { scaleX: 1 } },
  blur: { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } },
  curtain: { hidden: { opacity: 0, y: 48, scale: 1.05 }, show: { opacity: 1, y: 0, scale: 1 } },
} as const;

export default function Reveal({
  variant = "up",
  delay = 0,
  duration = 0.9,
  ease = EASE,
  at = "middle",
  className = "",
  style,
  children,
}: {
  variant?: Variant;
  delay?: number;
  duration?: number;
  /** When to play: "middle" of the screen (default) or the bottom "edge". */
  at?: "middle" | "edge";
  /** Easing curve; default is a fast-out expo, pass a gentler curve for a slower feel. */
  ease?: Transition["ease"];
  className?: string;
  /** Applied to the outer box (use it for absolute positioning). */
  style?: CSSProperties;
  children?: ReactNode;
}) {
  // The outer box always keeps its size, so the in-view observer can see it even while the inner
  // element is clipped / collapsed (mask, wipe, line). The inner element carries the motion; its hidden
  // state is set directly (not via a parent variant) so the server already renders it hidden - no flash.
  const ref = useRef<HTMLDivElement>(null);
  const small = useIsSmall();
  const mid = useInView(ref, { once: true, margin: small ? "0px 0px -12% 0px" : "0px 0px -50% 0px" });
  const edge = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const [late, setLate] = useState(false);
  useEffect(() => {
    if (!edge || at === "edge") return;
    const t = setTimeout(() => setLate(true), small ? 400 : 1400);
    return () => clearTimeout(t);
  }, [edge, at, small]);
  const inView = at === "edge" ? edge : mid || late;
  const v = VARIANTS[variant];
  const outer = variant === "mask" ? `overflow-hidden py-2 -my-2 ${className}` : variant === "line" ? "" : className;
  // mask: the 8px of padding (cancelled by the negative margin) keeps Vietnamese diacritics from being clipped
  const inner = variant === "line" ? `origin-left ${className}` : "";

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} className={outer} style={style}>
        <motion.div
          className={inner}
          initial={v.hidden}
          animate={inView ? v.show : v.hidden}
          transition={{ duration: small ? duration * 0.6 : duration, delay: small ? Math.min(delay * 0.4, 0.2) : delay, ease }}
        >
          {children}
        </motion.div>
      </div>
    </MotionConfig>
  );
}
