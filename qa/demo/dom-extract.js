async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } await new Promise(r => setTimeout(r, 2000)); scrollTo(0,0); await new Promise(r => setTimeout(r, 300));
  const out = { vw: document.documentElement.clientWidth, H: document.body.scrollHeight, texts: [], imgs: [] };
  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const clip = (el, r) => { let L = r.left, T = r.top, R = r.right, B = r.bottom; for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.overflow !== "visible" || cs.overflowX !== "visible") { const q = p.getBoundingClientRect(); L = Math.max(L, q.left); T = Math.max(T, q.top); R = Math.min(R, q.right); B = Math.min(B, q.bottom); break; } } return { x: Math.round(L + scrollX), y: Math.round(T + scrollY), w: Math.round(R - L), h: Math.round(B - T) }; };
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || el.closest(".sr-only,nextjs-portal")) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (el.tagName === "IMG") { out.imgs.push({ src: el.currentSrc || el.src, ...clip(el, r) }); continue; }
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    out.texts.push({ text: norm(el.innerText || el.textContent), x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height), fs: parseFloat(cs.fontSize), fw: cs.fontWeight, ls: cs.letterSpacing, lh: cs.lineHeight, color: cs.color, ff: cs.fontFamily.split(",")[0] });
  }
  return out; }
