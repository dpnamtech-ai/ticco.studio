import type { SupabaseClient, User } from "@supabase/supabase-js";

// Anyone can self-sign-up on Supabase with the (public) anon key, so "logged in" must never mean "admin".
// app_metadata can only be written with the service-role key or SQL, never by the user themselves.
export const isAdmin = (user: User | null | undefined) => user?.app_metadata?.role === "admin";

// 2FA is mandatory for admins: only a session that passed the 6-digit code (aal2) is in. Otherwise `step` says what
// is missing — "code" (app set up, code not entered yet → /admin/login) or "setup" (no app yet → /admin/2fa, the one
// page such a session may open). getUser() verifies the token the aal claim is read from.
export async function adminSession(supabase: SupabaseClient): Promise<{ ok: boolean; step: "code" | "setup" | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { ok: false, step: null };
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (data?.currentLevel === "aal2") return { ok: true, step: null };
  return { ok: false, step: data?.nextLevel === "aal2" ? "code" : "setup" };
}
