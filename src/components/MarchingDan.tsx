import Image from "next/image";

/*
  Figma "tinh-than-Dan" (1280x664 from y=703). The base art has the three Đần chains removed.
  Each chain is drawn in two walking poses (A: leg kicked out, B: knee raised) that the designer
  placed as separate layers; here both poses are stacked per slot, aligned on the feet (B is
  A shifted 110 source px), and swapped on the beat (see .step-a/.step-b/.bob in globals.css).
  The middle slot runs half a cycle apart from the outer two so the line marches in alternate step.
  Positions are % of the frame: (Figma x, y-703, w) / (1280, 664, 1280).
*/
const SLOTS = [
    [
      { src: "/images/mascot-dan/traits/chain-1.png", w: 1288, h: 754, left: 25.703, top: 58.283, width: 19.922, cls: "step-a" },
      { src: "/images/mascot-dan/traits/chain-2.png", w: 1536, h: 701, left: 24.002, top: 59.625, width: 23.758, cls: "step-b" },
    ],
    [
      { src: "/images/mascot-dan/traits/chain-1.png", w: 1288, h: 754, left: 58.203, top: 58.584, width: 19.922, cls: "step-a" },
      { src: "/images/mascot-dan/traits/chain-2.png", w: 1536, h: 701, left: 56.502, top: 59.926, width: 23.758, cls: "step-b" },
    ],
    [
      { src: "/images/mascot-dan/traits/chain-1.png", w: 1288, h: 754, left: 42.136, top: 59.077, width: 19.522, cls: "step-a step-alt" },
      { src: "/images/mascot-dan/traits/chain-2.png", w: 1536, h: 701, left: 40.469, top: 60.392, width: 23.281, cls: "step-b step-alt" },
    ],
];

export default function MarchingDan({ alt }: { alt: string }) {
  return (
    <div className="relative w-full aspect-[1280/664]">
      <Image
        src="/images/mascot-dan/tinh-than-base.png"
        alt={alt}
        width={2560}
        height={1328}
        quality={90}
        sizes="100vw"
        className="w-full h-auto"
      />
      {SLOTS.map((frames, i) => (
        <div key={i} className="absolute inset-0 bob pointer-events-none">
          {frames.map((f) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={f.cls}
              src={f.src}
              alt=""
              width={f.w}
              height={f.h}
              className={`absolute h-auto ${f.cls}`}
              style={{ left: `${f.left}%`, top: `${f.top}%`, width: `${f.width}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
