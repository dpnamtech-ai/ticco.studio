"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/* Brand-purple bar at the very top that fills as the page is scrolled. 3px on phones, 4px at 1280 and scaled with the
   page above that (a fixed 3px was a hairline on big screens, client 08/10). */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[3px] md:h-[calc(4*var(--u))] origin-left bg-[var(--color-purple)] pointer-events-none"
      style={{ scaleX }}
    />
  );
}
