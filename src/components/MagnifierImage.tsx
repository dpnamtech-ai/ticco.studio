"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { pageZoom } from "@/lib/pageZoom";

interface MagnifierImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** Scale factor applied to the image while hovering. */
  zoom?: number;
  /** Side length (px) of the lens square that follows the cursor. */
  lensSize?: number;
}

export default function MagnifierImage({ src, alt, sizes, priority, zoom = 2.2, lensSize = 130 }: MagnifierImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [originPct, setOriginPct] = useState({ x: 50, y: 50 });
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const z = pageZoom(); // rect / client coords are on-screen px, the lens is laid out in (zoomed) css px
    const x = (e.clientX - rect.left) / z;
    const y = (e.clientY - rect.top) / z;
    const w = rect.width / z;
    const h = rect.height / z;

    setOriginPct({ x: (x / w) * 100, y: (y / h) * 100 });
    setLensPos({
      x: Math.min(Math.max(x - lensSize / 2, 0), w - lensSize),
      y: Math.min(Math.max(y - lensSize / 2, 0), h - lensSize),
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-zoom-in"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={handleMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        quality={90}
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-150 ease-out"
        style={active ? { transform: `scale(${zoom})`, transformOrigin: `${originPct.x}% ${originPct.y}%` } : undefined}
      />
      {active && (
        <div
          className="absolute border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)] bg-white/10 pointer-events-none"
          style={{ width: lensSize, height: lensSize, left: lensPos.x, top: lensPos.y }}
        />
      )}
    </div>
  );
}
