"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types/database.types";
import {
  Compass,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Globe,
  MapPin,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<1 | 2>(1);

  // Section 1: Account Info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Section 2: Business Info
  const [businessName, setBusinessName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [slugChecking, setSlugChecking] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const [officeAddress, setOfficeAddress] = useState("");
  const [city, setCity] = useState("");
  const [businessWhatsapp, setBusinessWhatsapp] = useState("");
  const [bankName, setBankName] = useState("BCA");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [description, setDescription] = useState("");

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirmPending, setIsConfirmPending] = useState(false);

  // Helper to generate slug from business name
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s-]+/g, "-");
  };

  // Auto-generate slug if not manually edited
  useEffect(() => {
    if (!isSlugManual && businessName.trim()) {
      setSlug(generateSlug(businessName));
    }
  }, [businessName, isSlugManual]);

  // Check slug availability in database
  useEffect(() => {
    if (!slug.trim()) {
      setIsSlugAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      setSlugChecking(true);
      try {
        const { data, error } = await supabase
          .from("travel_agents")
          .select("id")
          .eq("slug", slug.trim())
          .maybeSingle();

        if (error) {
          // If query fails (e.g. offline/mock), assume available for UI flow
          setIsSlugAvailable(true);
        } else {
          setIsSlugAvailable(!data);
        }
      } catch {
        setIsSlugAvailable(true);
      } finally {
        setSlugChecking(false);
      }
    };

    const timeout = setTimeout(checkAvailability, 400);
    return () => clearTimeout(timeout);
  }, [slug]);

  // Step 1 Validation
  const validateStep1 = () => {
    setErrorMessage(null);
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password || !confirmPassword) {
      setErrorMessage("Semua kolom informasi akun wajib diisi.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Format email tidak valid.");
      return false;
    }

    const phoneRegex = /^(\+62|62|0)[0-9]{8,15}$/;
    if (!phoneRegex.test(phoneNumber.trim().replace(/[-\s]/g, ""))) {
      setErrorMessage("Nomor WhatsApp tidak valid (contoh: 081234567890).");
      return false;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal 6 karakter.");
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return false;
    }

    return true;
  };

  // Step 2 Validation & Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (step === 1) {
      if (validateStep1()) {
        // Pre-fill business whatsapp with personal phone number if empty
        if (!businessWhatsapp) {
          setBusinessWhatsapp(phoneNumber);
        }
        if (!bankAccountName) {
          setBankAccountName(fullName);
        }
        setStep(2);
      }
      return;
    }

    // Step 2 Validations
    if (
      !businessName.trim() ||
      !slug.trim() ||
      !officeAddress.trim() ||
      !city.trim() ||
      !businessWhatsapp.trim() ||
      !bankName.trim() ||
      !bankAccountNumber.trim() ||
      !bankAccountName.trim()
    ) {
      setErrorMessage("Semua kolom bertanda bintang (*) pada informasi bisnis wajib diisi.");
      return;
    }

    if (isSlugAvailable === false) {
      setErrorMessage("Slug URL storefront sudah digunakan oleh agen lain. Silakan pilih slug lain.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone_number: phoneNumber.trim(),
          },
        },
      });

      if (authError || !authData.user) {
        if (authError?.message.toLowerCase().includes("user already registered")) {
          setErrorMessage("Email ini sudah terdaftar. Silakan masuk ke akun Anda.");
        } else {
          setErrorMessage(authError?.message || "Pendaftaran akun gagal. Silakan coba lagi.");
        }
        setIsLoading(false);
        return;
      }

      // Check if session was created or if email confirmation is required
      if (!authData.session) {
        // Email confirmation is required by project settings
        setIsLoading(false);
        setErrorMessage(null);
        setIsConfirmPending(true);
        return;
      }

      const userId = authData.user.id;

      // 2. Insert into profiles table
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        full_name: fullName.trim(),
        phone_number: phoneNumber.trim(),
        role: "agent_owner" as UserRole,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        setErrorMessage("Gagal membuat profil pengguna. Silakan coba kembali atau hubungi bantuan.");
        setIsLoading(false);
        return;
      }

      // 3. Insert into travel_agents table
      const { error: agentError } = await supabase.from("travel_agents").insert({
        owner_id: userId,
        business_name: businessName.trim(),
        slug: slug.trim().toLowerCase(),
        office_address: officeAddress.trim(),
        city: city.trim(),
        whatsapp_number: businessWhatsapp.trim(),
        bank_name: bankName.trim(),
        bank_account_number: bankAccountNumber.trim(),
        bank_account_name: bankAccountName.trim(),
        description: description.trim() || null,
        is_verified: false, // Menunggu verifikasi kurasi tim Nusabook
        is_active: true,
      });

      if (agentError) {
        console.error("Travel agent creation error:", agentError);
        setErrorMessage("Akun pengguna berhasil dibuat, namun data agen travel belum tersimpan. Silakan login ke dashboard untuk melengkapi profil bisnis Anda.");
        setIsLoading(false);
        return;
      }

      // 4. Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Registration fatal error:", err);
      setErrorMessage("Terjadi kesalahan sistem saat mendaftar. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-brand-100 transition-colors"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
            <Compass className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold tracking-tight text-brand-700">
              Nusabook
            </span>
            <span className="text-[10px] font-medium tracking-wide uppercase text-slate-500">
              Backoffice Mitra
            </span>
          </div>
        </Link>

        <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pendaftaran Agen Tour & Travel Baru
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Langkah mudah mendigitalkan operasional dan storefront wisata Anda dalam 2 tahap.
        </p>

        {/* Step Indicator */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              step === 1
                ? "bg-brand-700 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            <span>1. Informasi Akun</span>
            {step === 2 && <CheckCircle2 className="h-3.5 w-3.5" />}
          </div>
          <div className="h-0.5 w-8 bg-slate-200" />
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              step === 2
                ? "bg-brand-700 text-white shadow-sm"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            <span>2. Informasi Bisnis</span>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {isConfirmPending ? (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Pendaftaran Berhasil!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Tautan konfirmasi telah dikirim ke alamat email <span className="font-semibold text-slate-800">{email}</span>. Silakan buka kotak masuk email Anda dan klik tautan untuk mengaktifkan akun sebelum masuk ke panel mitra.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-900 transition"
                >
                  <span>Buka Halaman Masuk</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-6">
            {/* STEP 1: Account Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Lengkap Pemilik *
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Budi Santoso"
                      className="block w-full rounded-xl border border-slate-200 pl-11 pr-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Alamat Email *
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="budi@travelanda.com"
                        className="block w-full rounded-xl border border-slate-200 pl-11 pr-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Nomor WhatsApp Pemilik *
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Phone className="h-5 w-5" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="081234567890"
                        className="block w-full rounded-xl border border-slate-200 pl-11 pr-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Kata Sandi *
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="block w-full rounded-xl border border-slate-200 pl-11 pr-11 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Konfirmasi Kata Sandi *
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi kata sandi"
                        className="block w-full rounded-xl border border-slate-200 pl-11 pr-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-900 transition"
                  >
                    <span>Lanjutkan ke Informasi Bisnis</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Business Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Usaha Tour & Travel *
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Pesona Merapi Tour"
                        className="block w-full rounded-xl border border-slate-200 pl-11 pr-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Kota Operasional *
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Sleman / Yogyakarta"
                        className="block w-full rounded-xl border border-slate-200 pl-11 pr-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Slug Input & Live Preview */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Slug URL Storefront *
                    </label>
                    <span className="text-xs text-slate-500">
                      Hanya huruf kecil, angka, dan tanda strip (-)
                    </span>
                  </div>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Globe className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => {
                        setIsSlugManual(true);
                        setSlug(generateSlug(e.target.value));
                      }}
                      placeholder="pesona-merapi"
                      className="block w-full rounded-xl border border-slate-200 pl-11 pr-24 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
                      {slugChecking ? (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      ) : isSlugAvailable === true ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Tersedia
                        </span>
                      ) : isSlugAvailable === false ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                          <AlertCircle className="h-3.5 w-3.5" />
                          Terpakai
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* URL Preview */}
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-accent-500" />
                    <span>Preview Link: </span>
                    <span className="font-mono text-brand-700 font-semibold truncate">
                      nusabook.id/{slug || "nama-agen"}
                    </span>
                  </div>
                </div>

                {/* Office Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Alamat Kantor Operasional *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    placeholder="Jl. Kaliurang KM 21, Hargobinangun, Pakem, Sleman"
                    className="block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                  />
                </div>

                {/* Business WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nomor WhatsApp Khusus Reservasi Tamu *
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={businessWhatsapp}
                      onChange={(e) => setBusinessWhatsapp(e.target.value)}
                      placeholder="081234567890"
                      className="block w-full rounded-xl border border-slate-200 pl-11 pr-4 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                    />
                  </div>
                </div>

                {/* Bank Information for Payout */}
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Informasi Rekening Bank Pencairan Dana
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Nama Bank *
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                      >
                        <option value="BCA">BCA</option>
                        <option value="Bank Mandiri">Bank Mandiri</option>
                        <option value="BNI">BNI</option>
                        <option value="BRI">BRI</option>
                        <option value="BSI">BSI</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Nomor Rekening *
                      </label>
                      <input
                        type="text"
                        required
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="8820192831"
                        className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Nama Pemilik Rekening *
                      </label>
                      <input
                        type="text"
                        required
                        value={bankAccountName}
                        onChange={(e) => setBankAccountName(e.target.value)}
                        placeholder="Budi Santoso"
                        className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Description (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Deskripsi Singkat Usaha (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Spesialis paket wisata alam Merapi, sunrise trip, dan sewa jeep lava tour terpercaya."
                    className="block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setStep(1);
                    }}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Kembali</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || isSlugAvailable === false}
                    className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-900 transition disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Mendaftarkan Agen...</span>
                      </>
                    ) : (
                      <>
                        <span>Selesaikan Pendaftaran</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Sudah memiliki akun mitra?{" "}
              <Link
                href="/login"
                className="font-semibold text-brand-700 hover:text-brand-900 transition-colors"
              >
                Masuk di Sini
              </Link>
            </p>
          </div>
        </>
      )}
        </div>
      </div>
    </div>
  );
}
