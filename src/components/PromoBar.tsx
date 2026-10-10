import { getLang } from "@/lib/lang";
import { getShipRule } from "@/lib/ship-rule";

// Free-ship threshold comes from /admin/phi-ship; no threshold = just the nationwide-delivery line.
const k = (n: number) => `${(n / 1000).toLocaleString("vi-VN")}K`;
const messageFor = (freeFrom: number | null, en: boolean) =>
  freeFrom == null
    ? en ? "NATIONWIDE DELIVERY!" : "GIAO HÀNG TOÀN QUỐC!"
    : en ? `FREE SHIPPING ON ORDERS OVER ${k(freeFrom)}!` : `MIỄN PHÍ VẬN CHUYỂN VỚI ĐƠN HÀNG TRÊN ${k(freeFrom)}!`;

// Small ticker that slides left -> right (see .marquee-ltr in globals.css). The track is two identical
// groups; it moves by exactly one group, so the loop is seamless. Only the first copy is exposed to screen readers.
export default async function PromoBar() {
  const message = messageFor((await getShipRule()).freeFrom, (await getLang()) === "en");
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
