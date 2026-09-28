# DEMO Figma ↔ DOM QA

Dev server: http://localhost:3100 (started with the Supabase URL disabled so the static catalog in
src/data/content.ts is used — the live Supabase `products` table only holds test rows).

1. chrome-devtools: open your OWN tab (new_page), `emulate` viewport `1280x900x1`, navigate to the route.
2. `evaluate_script` with the function in qa/demo/dom-extract.js, `filePath` = qa/demo/dom-<frame-name>.json
   (frame-name = file name in .figma-cache/demo/, e.g. trang-chu, mascot-Dan).
3. `sh qa/demo/run.sh <frame-name>` → prints page height in Figma px, and per Figma layer:
   MISSING (text not found in DOM), DIFF (position Δx,Δy / font size / weight / color off by > 4px),
   IMG-MISS / IMG-DIFF (no <img> at that box / box off). Coordinates are Figma px (DOM scaled by 1280/clientWidth).
Known false positives: nav items/cart (hover duplicate), texts intentionally baked as images.
