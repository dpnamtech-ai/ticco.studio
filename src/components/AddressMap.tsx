"use client";

import { useEffect, useState } from "react";

// Live Google Maps preview of the address being typed (embed needs no API key), so the customer can
// confirm the pin. Skeleton only: swap for Places Autocomplete + a draggable pin once a Maps key is added.
export default function AddressMap({ query }: { query: string }) {
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 600);
    return () => clearTimeout(t);
  }, [query]);

  if (debounced.length < 8) {
    return (
      <div className="flex aspect-[16/7] items-center justify-center rounded-lg border border-dashed border-[var(--color-ink)]/25 bg-white/60 px-4 text-center text-sm text-[var(--color-ink)]/55">
        Nhập địa chỉ để xem vị trí trên bản đồ
      </div>
    );
  }
  const q = encodeURIComponent(`${debounced}, Việt Nam`);
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-ink)]/15">
      <iframe
        title="Bản đồ địa chỉ giao hàng"
        src={`https://www.google.com/maps?q=${q}&output=embed`}
        className="block aspect-[16/7] w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${q}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white px-4 py-2 text-sm font-semibold text-[var(--color-purple)] hover:underline"
      >
        Mở trong Google Maps ↗
      </a>
    </div>
  );
}
