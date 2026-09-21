// Proves the PUBLIC anon key cannot write products or read orders. Usage: node --env-file=.env.local scripts/rls-check.mjs
import { createClient } from "@supabase/supabase-js";

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const ins = await db.from("products").insert({ id: "test-hack", name: "x", category: "x" });
console.log("anon insert product :", ins.error ? `blocked (${ins.error.code})` : "!!! ALLOWED");
const upd = await db.from("products").update({ price_from: 1 }).eq("id", "test-so-a").select();
console.log("anon update product :", upd.data?.length ? "!!! ALLOWED" : "blocked");
const del = await db.from("products").delete().eq("id", "test-so-a").select();
console.log("anon delete product :", del.data?.length ? "!!! ALLOWED" : "blocked");
const ord = await db.from("orders").select("code").limit(1);
console.log("anon read orders    :", ord.data?.length ? "!!! ALLOWED" : `blocked (${ord.error?.code ?? "0 rows"})`);
