"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MaterialIcon } from "@/components/ui/icon";
import {
  DEFAULT_DEMO_CUSTOMER,
  saveCustomerSession,
} from "@/lib/customer-session";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loginMode, setLoginMode] = useState<"customer" | "agent">("customer");
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get("role");
      if (roleParam === "agent" || roleParam === "mitra") {
        setLoginMode("agent");
      } else if (roleParam === "customer") {
        setLoginMode("customer");
      }
      const redirectParam = params.get("redirect");
      if (redirectParam && redirectParam.startsWith("/")) {
        setRedirectTarget(redirectParam);
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showForgotModal) {
        setShowForgotModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showForgotModal]);

  const handleDemoCustomerLogin = () => {
    saveCustomerSession(DEFAULT_DEMO_CUSTOMER);
    router.push(redirectTarget || "/account");
    router.refresh();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Silakan masukkan email dan kata sandi Anda.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Format email tidak valid.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (loginMode === "customer") {
          // Hybrid customer session fallback for demo/local environment
          saveCustomerSession({
            id: `cust-${Date.now()}`,
            fullName: email.trim().split("@")[0].replace(/[._-]/g, " "),
            email: email.trim(),
            phoneNumber: "081234567890",
            role: "customer",
            city: "Yogyakarta",
            whatsappReminderEnabled: true,
          });
          router.push(redirectTarget || "/account");
          router.refresh();
          return;
        }

        if (
          error.message.toLowerCase().includes("invalid login credentials") ||
          error.message.toLowerCase().includes("invalid_grant")
        ) {
          setErrorMessage("Email atau kata sandi yang Anda masukkan salah.");
        } else if (error.message.toLowerCase().includes("email not confirmed")) {
          setErrorMessage(
            "Email Anda belum dikonfirmasi. Silakan periksa kotak masuk email Anda."
          );
        } else {
          setErrorMessage(
            "Gagal masuk ke akun. Silakan periksa koneksi atau coba beberapa saat lagi."
          );
        }
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone_number, role")
          .eq("id", data.user.id)
          .maybeSingle();

        const resolvedRole = profile?.role || (loginMode === "customer" ? "customer" : "agent_owner");

        if (resolvedRole === "superadmin") {
          router.push("/admin");
        } else if (resolvedRole === "customer") {
          saveCustomerSession({
            id: data.user.id,
            fullName: profile?.full_name || data.user.email?.split("@")[0] || "Pelanggan NusaBook",
            email: data.user.email || email.trim(),
            phoneNumber: profile?.phone_number || "081234567890",
            role: "customer",
            whatsappReminderEnabled: true,
          });
          router.push(redirectTarget || "/account");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch {
      if (loginMode === "customer") {
        saveCustomerSession({
          ...DEFAULT_DEMO_CUSTOMER,
          email: email.trim(),
        });
        router.push(redirectTarget || "/account");
        router.refresh();
        return;
      }
      setErrorMessage("Terjadi kesalahan sistem saat mencoba masuk. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (!forgotEmail.trim()) {
      setForgotError("Silakan masukkan alamat email akun Anda.");
      return;
    }

    setForgotLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        setForgotError("Permintaan reset kata sandi gagal. Pastikan email terdaftar.");
      } else {
        setForgotSuccess(true);
      }
    } catch {
      setForgotError("Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-regular text-on-surface antialiased flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:border-primary/40 transition-colors"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm font-bold text-base">
            N
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold tracking-tight text-primary">
              Nusabook
            </span>
            <span className="text-[10px] font-bold tracking-wide uppercase text-on-surface-variant">
              {loginMode === "customer" ? "Portal Wisatawan" : "Backoffice Mitra"}
            </span>
          </div>
        </Link>

        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          {loginMode === "customer" ? "Masuk ke Akun Wisatawan" : "Masuk ke Panel Mitra"}
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          {loginMode === "customer"
            ? "Akses E-Tiket resmi, riwayat perjalanan, dan daftar penumpang tersimpan untuk checkout 1-klik."
            : "Kelola katalog paket wisata, jadwal keberangkatan, dan pembukuan usaha Anda."}
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-lowest py-8 px-6 shadow-sm border border-outline-variant/30 rounded-2xl sm:px-10">
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-xl bg-surface-container mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginMode("customer");
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                loginMode === "customer"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <MaterialIcon name="confirmation_number" className="text-base" />
              <span>Wisatawan (Pelanggan)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode("agent");
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                loginMode === "agent"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <MaterialIcon name="storefront" className="text-base" />
              <span>Mitra Agen Travel</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 flex items-start gap-3">
              <MaterialIcon name="error" className="text-xl text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-1.5"
              >
                Alamat Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant/60">
                  <MaterialIcon name="mail" className="text-xl" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    loginMode === "customer"
                      ? "anindya.paramitha@gmail.com"
                      : "nama@travelanda.com"
                  }
                  className="block w-full rounded-xl border border-outline-variant/40 bg-surface pl-11 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-on-surface uppercase tracking-wider"
                >
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotSuccess(false);
                    setForgotError(null);
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant/60">
                  <MaterialIcon name="lock" className="text-xl" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="block w-full rounded-xl border border-outline-variant/40 bg-surface pl-11 pr-11 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-on-surface-variant hover:text-on-surface focus:outline-none"
                  aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                >
                  <MaterialIcon
                    name={showPassword ? "visibility_off" : "visibility"}
                    className="text-xl"
                  />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 transition duration-150 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <MaterialIcon name="progress_activity" className="text-xl animate-spin" />
                    <span>Memverifikasi akun...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {loginMode === "customer"
                        ? "Masuk ke Portal Wisatawan"
                        : "Masuk ke Dashboard Mitra"}
                    </span>
                    <MaterialIcon name="arrow_forward" className="text-base" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Instant Demo Access for Customer */}
          {loginMode === "customer" && (
            <div className="mt-4 pt-4 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={handleDemoCustomerLogin}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary-fixed/40 hover:bg-secondary-fixed/70 text-secondary px-4 py-2.5 text-xs font-bold border border-secondary/20 transition cursor-pointer"
              >
                <MaterialIcon name="bolt" className="text-base" />
                <span>Masuk Instan Akun Demo Wisatawan (Anindya Paramitha)</span>
              </button>
            </div>
          )}

          {/* Registration Link */}
          <div className="mt-6 border-t border-outline-variant/20 pt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              {loginMode === "customer"
                ? "Belum memiliki akun wisatawan?"
                : "Belum memiliki akun mitra tour & travel?"}{" "}
              <Link
                href={`/register?role=${loginMode}`}
                className="font-bold text-secondary hover:underline transition-colors"
              >
                {loginMode === "customer" ? "Daftar Akun Pelanggan" : "Daftar Agen Baru"}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-xl border border-outline-variant/30">
            <h3 className="text-lg font-bold text-on-surface mb-2">
              Atur Ulang Kata Sandi
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
            </p>

            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-start gap-3">
                  <MaterialIcon name="check_circle" className="text-xl text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    Tautan reset kata sandi telah dikirim ke email Anda. Silakan periksa folder inbox atau spam.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover transition"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {forgotError && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                    {forgotError}
                  </div>
                )}
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-xs font-semibold text-on-surface mb-1"
                  >
                    Email Akun
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="rounded-xl border border-outline-variant/30 px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-hover transition disabled:opacity-60"
                  >
                    {forgotLoading ? (
                      <MaterialIcon name="progress_activity" className="text-base animate-spin" />
                    ) : (
                      "Kirim Tautan"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
