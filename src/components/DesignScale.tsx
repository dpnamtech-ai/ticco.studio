/*
  The Figma design is 1280px wide. On wider screens the whole page is scaled up (CSS zoom) so every
  element - text, nav, spacing, images - keeps exactly the Figma proportions instead of a few parts
  growing and others staying fixed. Narrow screens (<= 1280px) are left to the responsive layout.

  Runs as a tiny inline script before first paint (no flash); clientWidth is not affected by the
  zoom, so there is no feedback loop. Components that use mouse coordinates read the zoom with
  pageZoom() from "@/lib/pageZoom".
*/
// clientWidth changes when the scrollbar appears, so re-run on load and whenever the root box resizes
const SCRIPT = `(function(){var d=document.documentElement;function f(){var w=d.clientWidth;d.style.zoom=w>1280?String(w/1280):"";}f();window.addEventListener("resize",f);window.addEventListener("load",f);if(window.ResizeObserver){new ResizeObserver(f).observe(d);}})();`;

export default function DesignScale() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
