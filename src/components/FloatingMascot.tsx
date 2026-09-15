"use client";

import { motion } from "framer-motion";
import Image, { ImageProps } from "next/image";

/** Wraps a mascot Image with a gentle continuous bob, so Đần feels alive instead of static. */
export default function FloatingMascot(props: ImageProps) {
  return (
    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      <Image {...props} />
    </motion.div>
  );
}
