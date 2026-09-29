// Admin "Biến thể" textarea <-> stored product options. One option per line:
//   Tên lựa chọn | giá | ảnh số | link
//   Lao động | 30000 | 5          -> costs 30.000đ, shows the product's 5th photo when picked
//   Tím | | 2                     -> base price, 2nd photo
//   Sổ nhật ký | | | so-nhat-ky   -> button opens /san-pham/so-nhat-ky
// Every column after the name is optional. "ảnh số" counts the main photo as 1, then the thumbnails.
// Pure + dependency-free so the server action AND scripts/test-admin.ts use the exact same rules.

export type VariantOption = { price?: number; image?: number; link?: string };
export type VariantOptions = Record<string, VariantOption>;

export const MAX_VARIANTS = 20;
/** Thumbnail slots in the admin form (postcards need 6: one photo per card). */
export const THUMB_SLOTS = 6;
export const MAX_PRICE = 100_000_000;
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ParseResult = { ok: true; variants: string[]; options: VariantOptions | null } | { ok: false; error: string };

export function parseVariantLines(text: string, ctx: { imageCount: number; productIds: Set<string>; selfId: string }): ParseResult {
  const variants: string[] = [];
  const options: VariantOptions = {};
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > MAX_VARIANTS) return { ok: false, error: `Tối đa ${MAX_VARIANTS} biến thể` };

  for (const [n, line] of lines.entries()) {
    const at = `Biến thể dòng ${n + 1}`;
    const [label = "", price = "", image = "", link = "", ...extra] = line.split("|").map((c) => c.trim());
    if (extra.length) return { ok: false, error: `${at}: tối đa 4 cột (tên | giá | ảnh số | link)` };
    if (!label || label.length > 80) return { ok: false, error: `${at}: tên lựa chọn phải có, tối đa 80 ký tự` };
    if (variants.includes(label)) return { ok: false, error: `${at}: trùng tên "${label}"` };
    const o: VariantOption = {};
    if (price) {
      // digits with optional thousand separators only ("30.000", "30,000") — Number() alone would take "1.5e3" or "0x10"
      const digits = price.replace(/[.,\s]/g, "");
      const v = Number(digits);
      if (!/^\d+$/.test(digits) || v > MAX_PRICE) return { ok: false, error: `${at}: giá "${price}" không hợp lệ` };
      o.price = v;
    }
    if (image) {
      const v = Number(image);
      if (!Number.isInteger(v) || v < 1 || v > ctx.imageCount) return { ok: false, error: `${at}: ảnh số ${image} không có (sản phẩm có ${ctx.imageCount} ảnh)` };
      o.image = v;
    }
    if (link) {
      if (!ID_RE.test(link)) return { ok: false, error: `${at}: link "${link}" phải là ID sản phẩm (chữ thường, số, gạch ngang)` };
      if (link !== ctx.selfId && !ctx.productIds.has(link)) return { ok: false, error: `${at}: không có sản phẩm ID "${link}"` };
      o.link = link;
    }
    variants.push(label);
    if (Object.keys(o).length) options[label] = o;
  }
  return { ok: true, variants, options: Object.keys(options).length ? options : null };
}

/** Back to textarea lines for the edit form (round-trips with parseVariantLines). */
export function formatVariantLines(variants: string[], options: VariantOptions | null | undefined): string {
  return variants
    .map((label) => {
      const o = options?.[label];
      if (!o) return label;
      const cols = [label, o.price?.toString() ?? "", o.image?.toString() ?? "", o.link ?? ""];
      while (cols.length > 1 && !cols.at(-1)) cols.pop();
      return cols.join(" | ");
    })
    .join("\n");
}
