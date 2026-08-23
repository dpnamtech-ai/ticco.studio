"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  productHref: string;
  articleHref: string;
  image?: string;
  index?: number;
  onOrange?: boolean;
}

export default function ProjectCard({ title, productHref, articleHref, image, index = 0, onOrange = false }: ProjectCardProps) {
  const linkClass = onOrange
    ? "text-white/90 hover:text-white"
    : "text-[var(--color-ink)]/70 hover:text-[var(--color-ink)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
    >
      <div className="aspect-square relative overflow-hidden mb-4 bg-[#D9D9D9]">
        {image && <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />}
      </div>
      <h3 className={`font-semibold mb-2 leading-snug ${onOrange ? "text-white" : "text-[var(--color-ink)]"}`}>
        {title}
      </h3>
      <div className="flex gap-6 text-sm">
        <a href={productHref} className={linkClass}>
          › Xem sản phẩm
        </a>
        <a href={articleHref} className={linkClass}>
          › Đọc thêm về dự án
        </a>
      </div>
    </motion.div>
  );
}
