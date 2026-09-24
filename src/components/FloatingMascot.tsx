"use client";

import { motion } from "framer-motion";
import Image, { ImageProps } from "next/image";

/** Wraps a mascot Image with a gentle continuous bob, so Đần feels alive instead of static. */
export default function FloatingMascot(props: ImageProps) {
  return (
    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is required by ImageProps (next/image), enforced at the call site by TS */}
      <Image {...props} />
    </motion.div>
  );
}
