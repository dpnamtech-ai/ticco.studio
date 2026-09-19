"use client";

import { motion, MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

const EASE = [0.76, 0, 0.24, 1] as const;

/*
  Route change: an orange and a purple curtain cover the screen and lift upwards one after the other,
  revealing the new page (which also settles in with a small rise). Skipped on the first load so the
  landing paint is never covered. Reduced-motion users get no curtain.
*/
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [firstPath] = useState(pathname);
  const changed = pathname !== firstPath;

  return (
    <MotionConfig reducedMotion="user">
      {changed && (
        <>
          <motion.div
            key={`o-${pathname}`}
            aria-hidden
            className="fixed inset-0 z-[80] origin-top bg-[var(--color-orange)] pointer-events-none"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.05 }}
          />
          <motion.div
            key={`p-${pathname}`}
            aria-hidden
            className="fixed inset-0 z-[79] origin-top bg-[var(--color-purple)] pointer-events-none"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.16 }}
          />
        </>
      )}
      <motion.div
        key={pathname}
        initial={changed ? { opacity: 0, y: 24 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: changed ? 0.35 : 0 }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
