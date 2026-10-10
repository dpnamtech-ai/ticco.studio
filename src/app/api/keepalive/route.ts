import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// GET /api/keepalive — hit daily by Vercel cron (vercel.json) so the free
// Supabase project sees activity and isn't paused after 7 idle days.
export const dynamic = "force-dynamic";

export async function GET() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { error } = await db.from("products").select("id").limit(1);
  return NextResponse.json({ ok: !error }, { status: error ? 500 : 200 });
}
