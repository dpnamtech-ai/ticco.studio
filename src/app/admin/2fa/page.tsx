"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type Setup = { factorId: string; qr: string; secret: string };

// /admin/2fa — set up the authenticator app (TOTP). Mandatory: an admin without one is held on this page by the proxy
// until it's done (adminSession step "setup"); afterwards every sign-in asks for the 6-digit code. No "turn off" —
// lost phone: delete the factor in Supabase Dashboard → Authentication → Users → the user → MFA, then sign in with
// the password and this page sets up the new phone.
export default function AdminTwoFactor() {
  const [enabled, setEnabled] = useState<string | null | undefined>(undefined); // verified factor id, null = off
  const [setup, setSetup] = useState<Setup | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabaseBrowser()
      .auth.mfa.listFactors()
      .then(({ data }) => setEnabled(data?.totp[0]?.id ?? null));
  }, []);

  async function start() {
    setBusy(true);
    setError(null);
    const mfa = supabaseBrowser().auth.mfa;
    // A setup started earlier and never confirmed blocks a new one: drop it first.
    const { data: list } = await mfa.listFactors();
    for (const f of list?.all ?? []) if (f.status === "unverified") await mfa.unenroll({ factorId: f.id });
    const { data, error } = await mfa.enroll({ factorType: "totp", friendlyName: `Tíc Cơ ${Date.now()}` });
    setBusy(false);
    if (error || !data) return setError(error?.message ?? "Không bật được");
    setSetup({ factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
  }

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (!setup) return;
    setBusy(true);
    setError(null);
    const { error } = await supabaseBrowser().auth.mfa.challengeAndVerify({ factorId: setup.factorId, code: code.trim() });
    if (error) {
      setBusy(false);
      return setError("Mã không đúng, thử lại mã mới nhất trong app.");
    }
    // Session is aal2 now: the rest of admin opens (a first-time admin was held on this page until here). Full page load,
    // not router.push: the menu links prefetched /admin while it still redirected here, and the router reuses that.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full load on purpose, see above
    window.location.assign("/admin");
  }

  const button = "inline-flex items-center gap-2 bg-[var(--color-purple)] text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-wait";
  const spinner = busy && <span className="size-[1em] animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />;

  return (
    <div className="min-h-screen bg-[var(--color-cream)] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)] mb-8">Bảo mật 2 lớp</h1>
        <div className="rounded-2xl bg-white p-6 space-y-4 text-sm">
          {enabled === undefined ? (
            <p>Đang tải…</p>
          ) : enabled ? (
            <>
              <p className="rounded-xl bg-green-100 p-4 font-semibold text-green-800">Đang bật. Mỗi lần đăng nhập cần thêm mã 6 số từ app xác thực.</p>
              <p className="text-black/50">Đổi hoặc mất điện thoại: nhờ người quản lý Supabase xoá app xác thực cũ của tài khoản này, rồi đăng nhập lại để cài máy mới.</p>
            </>
          ) : setup ? (
            <form onSubmit={confirm} className="space-y-4">
              <p>1. Mở app xác thực (Google Authenticator, Authy, 1Password…) → thêm tài khoản → quét mã QR:</p>
              {/* eslint-disable-next-line @next/next/no-img-element -- data: SVG from Supabase */}
              <img src={setup.qr} alt="Mã QR bảo mật 2 lớp" className="w-48 h-48 border border-black/10 rounded-lg" />
              <p>
                Không quét được thì nhập tay khoá này: <code className="break-all bg-black/5 px-2 py-1 rounded">{setup.secret}</code>
              </p>
              <p>2. Nhập mã 6 số app đang hiện để xác nhận:</p>
              <input
                required
                autoFocus
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="border border-black/20 rounded-lg px-3 py-2 w-40 text-center text-xl tracking-[0.4em]"
              />
              <div>
                <button type="submit" disabled={busy} className={button}>
                  {spinner}
                  {busy ? "Đang kiểm tra…" : "Xác nhận và bật"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="rounded-xl bg-amber-100 p-4 font-semibold text-amber-900">
                Tài khoản quản trị bắt buộc bật bảo mật 2 lớp trước khi dùng. Bật xong là vào được trang quản trị ngay.
              </p>
              <p>Đăng nhập sẽ cần mật khẩu + mã 6 số đổi mỗi 30 giây trên điện thoại, nên lộ mật khẩu cũng không vào được.</p>
              <button onClick={start} disabled={busy} className={button}>
                {spinner}
                Bật bảo mật 2 lớp
              </button>
            </>
          )}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
