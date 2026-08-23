// Print a compact, greppable outline of one top-level frame from the cached
// Figma file dump: every text node's content + position, every solid-fill
// rectangle's color + position, every image fill. Frame-relative coordinates
// (not Figma's absolute canvas space) so they're directly usable in CSS.
//
// Usage: node scripts/figma-summarize.mjs "trang-chu"
import { readFileSync } from "node:fs";
import path from "node:path";

const frameName = process.argv[2];
if (!frameName) {
  console.error("Usage: node scripts/figma-summarize.mjs <frame-name>");
  process.exit(1);
}

const data = JSON.parse(readFileSync(path.resolve(import.meta.dirname, "..", ".figma-cache", "file.json"), "utf8"));

function findFrame(node, name) {
  if (node.name === name && node.type === "FRAME") return node;
  for (const c of node.children || []) {
    const found = findFrame(c, name);
    if (found) return found;
  }
  return null;
}

const frame = findFrame(data.document, frameName);
if (!frame) {
  console.error(`Frame "${frameName}" not found.`);
  process.exit(1);
}

const originX = frame.absoluteBoundingBox.x;
const originY = frame.absoluteBoundingBox.y;
console.log(`# ${frame.name}  (${frame.absoluteBoundingBox.width}x${frame.absoluteBoundingBox.height})`);

function rel(box) {
  return { x: Math.round(box.x - originX), y: Math.round(box.y - originY), w: Math.round(box.width), h: Math.round(box.height) };
}

function colorOf(node) {
  const fill = (node.fills || []).find((f) => f.visible !== false && f.type === "SOLID");
  if (!fill) return null;
  const { r, g, b } = fill.color;
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function walk(node, depth) {
  if (node.absoluteBoundingBox) {
    const box = rel(node.absoluteBoundingBox);
    if (node.type === "TEXT") {
      const content = (node.characters || "").replace(/\n/g, "\\n").slice(0, 80);
      console.log(`${"  ".repeat(depth)}TEXT  X${box.x} Y${box.y} W${box.w} H${box.h}  font=${node.style?.fontFamily} size=${node.style?.fontSize}  "${content}"`);
    } else if (node.type === "RECTANGLE" || node.type === "ELLIPSE") {
      const hasImage = (node.fills || []).some((f) => f.type === "IMAGE");
      const color = colorOf(node);
      console.log(`${"  ".repeat(depth)}${node.type}  X${box.x} Y${box.y} W${box.w} H${box.h}  ${hasImage ? "fill=IMAGE" : color ? `fill=${color}` : "fill=none"}  name="${node.name}"`);
    } else if (node.type === "FRAME" || node.type === "GROUP" || node.type === "COMPONENT" || node.type === "INSTANCE") {
      console.log(`${"  ".repeat(depth)}[${node.type}] X${box.x} Y${box.y} W${box.w} H${box.h}  "${node.name}"`);
    }
  }
  for (const c of node.children || []) walk(c, depth + 1);
}

walk(frame, 0);
