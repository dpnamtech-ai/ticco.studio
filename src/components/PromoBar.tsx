import { getLang } from "@/lib/lang";
import { t } from "@/lib/t";

const MESSAGE = "MIỄN PHÍ VẬN CHUYỂN VỚI ĐƠN HÀNG TRÊN 500K!";

// Small ticker that slides left -> right (see .marquee-ltr in globals.css). The track is two identical
// groups; it moves by exactly one group, so the loop is seamless. Only the first copy is exposed to screen readers.
export default async function PromoBar() {
  const message = t(MESSAGE, await getLang());
  return (
    <div className="bg-[var(--color-ink)] text-white h-[calc(18*var(--m))] md:h-[calc(24*var(--u))] overflow-hidden text-[calc(8.7*var(--m))] md:text-[calc(10*var(--u))] font-medium tracking-wide">
      <div className="flex w-max h-full items-center marquee-ltr">
        {[0, 1].map((g) => (
          <div key={g} className="flex shrink-0 items-center">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="px-[calc(30*var(--m))] md:px-[calc(40*var(--u))] whitespace-nowrap" aria-hidden={g === 0 && i === 0 ? undefined : true}>
                {message}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
