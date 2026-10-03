// Lists every Vietnamese string in the public site's source (string literals + JSX text, comments excluded) that
// src/i18n/en.json doesn't translate yet:
//   node scripts/i18n-extract.mjs            # -> qa/i18n-todo.json { "<source text>": "" } (fill, then merge into en.json)
// Admin pages stay Vietnamese and are skipped. Keys are whitespace-normalised like src/lib/t.ts.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const VN = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
const SKIP = /[\\/](admin|supabase)[\\/]|\.d\.ts$/;
const key = (s) => s.replace(/\s+/g, " ").trim();
const en = JSON.parse(readFileSync("src/i18n/en.json", "utf8"));

const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|json)$/.test(f) && !SKIP.test(p) && !p.includes("i18n")) files.push(p);
  }
})("src");

const found = new Map(); // key -> first file
const add = (s, file) => {
  const k = key(s);
  if (k && VN.test(k) && !(k in en) && !found.has(k)) found.set(k, file);
};
for (const file of files) {
  const text = readFileSync(file, "utf8");
  if (file.endsWith(".json")) {
    (function walk(v) {
      if (typeof v === "string") add(v, file);
      else if (v && typeof v === "object") Object.values(v).forEach(walk);
    })(JSON.parse(text));
    continue;
  }
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  (function visit(n) {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isJsxText(n)) add(n.text, file);
    else if (ts.isTemplateExpression(n)) [n.head, ...n.templateSpans.map((s) => s.literal)].forEach((p) => add(p.text, file));
    ts.forEachChild(n, visit);
  })(sf);
}

const todo = Object.fromEntries([...found.keys()].map((k) => [k, ""]));
writeFileSync("qa/i18n-todo.json", JSON.stringify(todo, null, 1) + "\n");
const byFile = {};
for (const f of found.values()) byFile[f] = (byFile[f] ?? 0) + 1;
console.log(`${found.size} untranslated source string(s) -> qa/i18n-todo.json`, byFile);
