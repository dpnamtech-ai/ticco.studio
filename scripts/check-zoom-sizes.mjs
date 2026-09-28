// run: node scripts/check-zoom-sizes.mjs
// check: zoomSizes scales the image widths by the crop zoom, never the media-query breakpoints
import assert from "node:assert";
import { zoomSizes } from "../src/lib/figmaCrop.ts";
assert.equal(zoomSizes("(max-width: 768px) 50vw, 25vw"), "(max-width: 768px) 50vw, 25vw");
assert.equal(zoomSizes("(max-width: 768px) 50vw, 25vw", [[0.5, 0, 0.1], [0, 0.8, 0]]), "(max-width: 768px) 100vw, 50vw");
assert.equal(zoomSizes("40vw", { m: [[1, 0, 0], [0, 0.5, 0]] }, 1.1), "88vw");
assert.equal(zoomSizes("(min-width: 768px) 74px, 72px", [[0.5, 0, 0], [0, 0.5, 0]]), "(min-width: 768px) 148px, 144px");
assert.equal(zoomSizes("50vw", { src: "/x.webp", fit: "cover" }), "50vw"); // fill without a transform
console.log("zoomSizes ok");
