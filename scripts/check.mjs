import { createClient } from "@supabase/supabase-js";
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const o = await db.from("orders").select("code,status,stock_deducted").order("created_at", { ascending: false }).limit(3);
console.log("orders:", o.error ? `ERR ${o.error.message}` : JSON.stringify(o.data));
const p = await db.from("products").select("id,stock,sold_out").like("id", "test-%").order("id");
console.log("products:", JSON.stringify(p.data));
