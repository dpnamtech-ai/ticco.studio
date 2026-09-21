import type { User } from "@supabase/supabase-js";

// Anyone can self-sign-up on Supabase with the (public) anon key, so "logged in" must never mean "admin".
// app_metadata can only be written with the service-role key or SQL, never by the user themselves.
export const isAdmin = (user: User | null | undefined) => user?.app_metadata?.role === "admin";
