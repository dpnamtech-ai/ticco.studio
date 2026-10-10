"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

// Signed in with the password but 2FA is set up and the code isn't entered yet (aal1 → aal2 pending)?
async function needsCode() {
  const { data } = await supabaseBrowser().auth.mfa.getAuthenticatorAssuranceLevel();
  return data?.nextLevel === "aal2" && data.currentLevel !== "aal2";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"password" | "code">("password");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // The proxy sends a half-signed-in admin (password ok, code missing) back here: go straight to the code step.
  useEffect(() => {
    needsCode().then((yes) => yes && setStep("code"));
  }, []);

  function enter() {
    router.push("/admin");
    router.refresh();
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }
    if (await needsCode()) {
      setLoading(false);
      setStep("code");
      return;
    }
    enter();
  }

  async function handleCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const sb = supabaseBrowser();
    const { data } = await sb.auth.mfa.listFactors();
    const factor = data?.totp[0];
    const { error } = factor
      ? await sb.auth.mfa.challengeAndVerify({ factorId: factor.id, code: code.trim() })
      : { error: { message: "Không tìm thấy ứng dụng xác thực" } };
    if (error) {
      setLoading(false);
      setError("Mã không đúng hoặc đã hết hạn, thử lại mã mới nhất trong app.");
      return;
    }
    enter();
  }

  async function backToPassword() {
    await supabaseBrowser().auth.signOut();
    setStep("password");
    setCode("");
    setError(null);
  }

  const inputClass = "w-full border border-black/15 rounded-lg px-3 py-2";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] px-6">
      <form onSubmit={step === "password" ? handlePassword : handleCode} className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--color-purple)] mb-6">
          {step === "password" ? "Đăng nhập quản trị" : "Nhập mã xác thực"}
        </h1>
        {step === "password" ? (
          <>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} mb-4`} />
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} mb-6`} />
          </>
        ) : (
          <>
            <p className="text-sm text-black/60 mb-4">Mở app xác thực (Google Authenticator, Authy…) và nhập mã 6 số của Tíc Cơ.</p>
            <input
              required
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className={`${inputClass} mb-6 text-center text-2xl tracking-[0.5em]`}
            />
          </>
        )}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-purple)] text-white font-semibold py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Đang kiểm tra..." : step === "password" ? "Đăng nhập" : "Xác nhận"}
        </button>
        {step === "code" && (
          <button type="button" onClick={backToPassword} className="w-full mt-3 text-sm text-black/50 underline">
            Đăng nhập tài khoản khác
          </button>
        )}
      </form>
    </div>
  );
}
