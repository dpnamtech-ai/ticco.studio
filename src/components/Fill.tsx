import { getLang } from "@/lib/lang";
import { t } from "@/lib/t";

// Highlights "[...]" placeholders in draft copy (src/data/legal.ts) so missing client info stands out on the
// preview. Once every bracket is filled in, this renders plain text and needs no removal.
export default async function Fill({ children }: { children: string }) {
  const hint = t("Cần khách điền", await getLang());
  return (
    <>
      {children.split(/(\[[^\]]*\])/).map((part, i) =>
        part.startsWith("[") ? (
          <mark key={i} title={hint} className="rounded-sm border-b border-dashed border-black/60 bg-[#e5ff00] px-1 text-black">
            {part.slice(1, -1)}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
