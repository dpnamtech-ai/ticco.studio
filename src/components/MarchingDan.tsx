import Image from "next/image";
import { mascotPage } from "@/data/content";
import { cropFillStyle, zoomSizes, type ImageTransform } from "@/lib/figmaCrop";

/*
  Figma DEMO "tinh-than-Dan" (671:218 frame, 1280x664 visible from y=703), rebuilt from its layers:
  #e5e5e5 band, the three Đần (image fills with their Figma crop), the 4 trait captions as white live text on
  orange #e85f08 boxes, and the purple tagline. Only the three walking Đần chains are pre-rendered art:
  each chain is drawn in two walking poses (A: leg kicked out, B: knee raised) that the designer placed as
  separate layers; here both poses are stacked per slot, aligned on the feet (B is A shifted 110 source px),
  and swapped on the beat (see .step-a/.step-b/.bob in globals.css). The middle slot runs half a cycle apart
  from the outer two so the line marches in alternate step. Chain positions are % of the frame:
  (Figma x, y-703, w) / (1280, 664, 1280); everything else is Figma px -> cqw (1280px = 100cqw).
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

const cq = (px: number) => `${(px / 12.8).toFixed(3)}cqw`;

const DAN: { src: string; x: number; y: number; w: number; h: number; crop: ImageTransform; mirror?: boolean }[] = [
  { src: "5581a1ae8591dca5ecec2f3bd4e2fadf2576f9db", x: 304, y: 81, w: 233, h: 316, crop: [[0.454545, 0, 0.328671], [0, 0.461538, 0.358392]] },
  { src: "6bcdf4277b92deca259d99e616a5e86f6a4b5c59", x: 556, y: 103, w: 309, h: 286, crop: [[0.699229, 0, 0.169666], [0, 0.485861, 0.349614]] },
  // Figma reports rot=180 (REST folds a horizontal flip into rotation); the exported art shows it mirrored, upright.
  { src: "1eba2bd1a0ba662b427823069d2f7d2816f38402", x: 850, y: 92, w: 303, h: 293, crop: [[0.663342, 0, 0.13217], [0, 0.512718, 0.289526]], mirror: true },
];

// Caption boxes (Figma "Vector", #e85f08) + their text boxes; `tr` = right-aligned text whose box ends at X310.
// ponytail: the vector outlines aren't in the cached file (no geometry), so the boxes are plain rectangles.
const CAPTIONS = [
  { box: [815, 44, 172, 102], tx: 818, ty: 47 },
  { box: [490, 103, 103, 73], tx: 495, ty: 108 },
  { box: [169, 290, 152, 73], tx: 172, ty: 294 },
  { box: [169, 193, 147, 68], tr: 310, ty: 193 },
] as const;

export default function MarchingDan({ alt }: { alt: string }) {
  return (
    <div className="[container-type:inline-size]">
      <div className="relative w-full aspect-[1280/664] overflow-hidden bg-[#e5e5e5]" role="img" aria-label={alt}>
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

        {DAN.map((d) => (
          <div
            key={d.src}
            className="absolute overflow-hidden"
            style={{ left: cq(d.x), top: cq(d.y), width: cq(d.w), height: cq(d.h), transform: d.mirror ? "scaleX(-1)" : undefined }}
          >
            <Image src={`/images/figma/${d.src}.webp`} alt="" fill sizes={zoomSizes("40vw", d.crop)} style={cropFillStyle(d.crop)} />
          </div>
        ))}

        <div aria-hidden className="font-semibold text-white max-lg:hidden" style={{ fontSize: cq(24), lineHeight: cq(30), letterSpacing: cq(-1.68) }}>
          {CAPTIONS.map((c, i) => (
            <div key={i}>
              <div className="absolute bg-[#e85f08]" style={{ left: cq(c.box[0]), top: cq(c.box[1]), width: cq(c.box[2]), height: cq(c.box[3]) }} />
              <p
                className="absolute whitespace-pre"
                style={{ top: cq(c.ty), ...("tr" in c ? { right: cq(1280 - c.tr), textAlign: "right" } : { left: cq(c.tx) }) }}
              >
                {mascotPage.traits.captions[i]}
              </p>
            </div>
          ))}
        </div>

        <p
          aria-hidden
          className="absolute text-center font-semibold text-[var(--color-purple)] whitespace-nowrap max-lg:hidden"
          style={{ left: cq(335), top: cq(553), width: cq(611), fontSize: cq(27), lineHeight: cq(30), letterSpacing: cq(-1.89) }}
        >
          {mascotPage.traits.tagline}
        </p>
      </div>
      {/* phones: the tags are ~7px inside the scaled scene, so list them below as readable chips */}
      <div className="lg:hidden bg-[#e5e5e5] px-6 pb-8 -mt-px text-center">
        <ul className="flex flex-wrap justify-center gap-2 text-[13px] font-semibold text-white">
          {mascotPage.traits.captions.map((c) => <li key={c} className="bg-[#e85f08] px-2.5 py-1">{c.replace(/\n/g, " ")}</li>)}
        </ul>
        <p className="mt-4 text-[15px] font-semibold text-[var(--color-purple)]">{mascotPage.traits.tagline}</p>
      </div>
    </div>
  );
}
