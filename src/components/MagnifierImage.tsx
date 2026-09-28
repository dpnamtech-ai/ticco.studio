"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";

interface MagnifierImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** Scale factor applied to the image while hovering. */
  zoom?: number;
  /** Side length (px) of the lens square that follows the cursor. */
  lensSize?: number;
  /** Style for the <img> itself (e.g. a Figma crop transform); the hover zoom is applied on a wrapper. */
  imgStyle?: CSSProperties;
}

export default function MagnifierImage({ src, alt, sizes, priority, zoom = 2.2, lensSize = 130, imgStyle }: MagnifierImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [originPct, setOriginPct] = useState({ x: 50, y: 50 });
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

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
      <div
        className="absolute inset-0 transition-transform duration-150 ease-out"
        style={active ? { transform: `scale(${zoom})`, transformOrigin: `${originPct.x}% ${originPct.y}%` } : undefined}
      >
        <Image src={src} alt={alt} fill quality={90} priority={priority} sizes={sizes} style={imgStyle ?? { objectFit: "cover" }} />
      </div>
      {active && (
        <div
          className="absolute border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)] bg-white/10 pointer-events-none"
          style={{ width: lensSize, height: lensSize, left: lensPos.x, top: lensPos.y }}
        />
      )}
    </div>
  );
}
