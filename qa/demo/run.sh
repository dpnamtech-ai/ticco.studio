# usage: sh qa/demo/run.sh <frame-name>  (filters known nav hover-duplicate false positives)
node -e "const r=require('fs').readFileSync('qa/demo/dom-$1.json','utf8');const d=JSON.parse(r.slice(r.indexOf('{')));console.log('H(fig px)',Math.round(d.H*1280/d.vw))"
node scripts/qa-figma-diff.mjs "$1" "qa/demo/dom-$1.json" | grep -v 'MIỄN PHÍ\|^DIFF     "VỀ TÍC CƠ"\|"SẢN PHẨM" pos\|"KHÁM PHÁ" pos\|"MASCOT ĐẦN" pos\|IMG-DIFF "2 1"'
