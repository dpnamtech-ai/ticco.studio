import type { SupabaseClient, User } from "@supabase/supabase-js";

// Anyone can self-sign-up on Supabase with the (public) anon key, so "logged in" must never mean "admin".
// app_metadata can only be written with the service-role key or SQL, never by the user themselves.
export const isAdmin = (user: User | null | undefined) => user?.app_metadata?.role === "admin";

// Admin with the 2FA step done: once an authenticator app is set up (/admin/2fa), a password-only session (aal1)
// is not enough until the 6-digit code is entered (aal2). getUser() verifies the token the aal claim is read from.
export async function adminSession(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdmin(user)) return { ok: false, needsCode: false };
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const needsCode = data?.nextLevel === "aal2" && data.currentLevel !== "aal2";
  return { ok: !needsCode, needsCode };
}
