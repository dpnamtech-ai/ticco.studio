"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  productHref?: string;
  articleHref?: string;
  image?: string;
  index?: number;
  onOrange?: boolean;
  /** Compact variant used in the homepage collab preview row: 309/448 image, no link row. */
  compact?: boolean;
}

export default function ProjectCard({
  title,
  productHref,
  articleHref,
  image,
  index = 0,
  onOrange = false,
  compact = false,
}: ProjectCardProps) {
  const linkClass = onOrange
    ? "text-white/90 hover:text-white"
    : "text-[var(--color-ink)]/70 hover:text-[var(--color-ink)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -35% 0px" }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
    >
      <div className={`${compact ? "aspect-[309/448]" : "aspect-[436/486]"} relative overflow-hidden bg-[#D9D9D9] ${compact ? "" : "mb-4"}`}>
        {image && <Image src={image} alt={title} fill quality={90} className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />}
      </div>
      <h3
        className={
          compact
            ? "mt-[21px] lg:mt-[1.641cqw] text-center text-[15px] leading-[19px] lg:text-[1.172cqw] lg:leading-[1.484cqw] font-semibold tracking-[-0.6px] lg:tracking-[-0.047cqw] whitespace-pre-line text-white"
            : `font-semibold mb-2 leading-snug ${onOrange ? "text-white" : "text-[var(--color-ink)]"}`
        }
      >
        {title}
      </h3>
      {!compact && (
        <div className="flex gap-6 text-sm">
          <a href={productHref} className={linkClass}>
            › Xem sản phẩm
          </a>
          {articleHref && articleHref !== "#" && (
            <a href={articleHref} className={linkClass}>
              › Đọc thêm về dự án
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}
