/** Current page scale set by <DesignScale /> (1 when the page is not scaled). Client-only. */
export function pageZoom(): number {
  if (typeof document === "undefined") return 1;
  return parseFloat(document.documentElement.style.zoom) || 1;
}
