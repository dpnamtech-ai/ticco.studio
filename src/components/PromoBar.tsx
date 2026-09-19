const MESSAGE = "MIỄN PHÍ VẬN CHUYỂN VỚI ĐƠN HÀNG TRÊN 500K!";

// Small ticker that slides left -> right (see .marquee-ltr in globals.css). The track is two identical
// groups; it moves by exactly one group, so the loop is seamless. Only the first copy is exposed to screen readers.
export default function PromoBar() {
  return (
    <div className="bg-[var(--color-ink)] text-white h-6 overflow-hidden text-[10px] font-medium tracking-wide">
      <div className="flex w-max h-full items-center marquee-ltr">
        {[0, 1].map((g) => (
          <div key={g} className="flex shrink-0 items-center">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="px-10 whitespace-nowrap" aria-hidden={g === 0 && i === 0 ? undefined : true}>
                {MESSAGE}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
