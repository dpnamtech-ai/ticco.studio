import { DEFAULT_SHIP_RULE, type ShipRule } from "./checkout";
import { supabaseAdmin } from "./supabase/server";

// The shipping rule the client set in /admin/phi-ship (Supabase `settings` row "shipping").
// Falls back to the default (policy sheet) when Supabase isn't configured, the table is missing or the row is bad,
// so checkout never breaks on a settings problem.
export async function getShipRule(): Promise<ShipRule> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return DEFAULT_SHIP_RULE;
  try {
    const { data } = await supabaseAdmin().from("settings").select("value").eq("key", "shipping").maybeSingle();
    const v = data?.value as ShipRule | undefined;
    return v && Array.isArray(v.tiers) && v.tiers.length > 0 ? v : DEFAULT_SHIP_RULE;
  } catch {
    return DEFAULT_SHIP_RULE;
  }
}
