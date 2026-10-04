"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MaterialIcon } from "@/components/ui/icon";
import type { TravelAgent, Profile } from "@/types/database.types";

interface ProfileFormProps {
  profile: Profile | null;
  agent: TravelAgent | null;
  userEmail?: string;
}

export function ProfileForm({ profile, agent, userEmail }: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"identitas" | "branding" | "escrow" | "legalitas">(
    "identitas"
  );

  // Profile
  const [fullName, setFullName] = useState(profile?.full_name || "Bambang Pamungkas");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || "081234567890");

  // Agent
  const [businessName, setBusinessName] = useState(
    agent?.business_name || "Pesona Nusantara Tour & Travel"
  );
  const [officeAddress, setOfficeAddress] = useState(
    agent?.office_address || "Jl. Ijen No. 45, Klojen"
  );
  const [city, setCity] = useState(agent?.city || "Kota Malang, Jawa Timur");
  const [whatsappNumber, setWhatsappNumber] = useState(
    agent?.whatsapp_number || "081234567890"
  );
  const [instagramHandle, setInstagramHandle] = useState(
    agent?.instagram_handle || "@pesona.nusantara"
  );
  const [bankName, setBankName] = useState(agent?.bank_name || "BCA");
  const [bankAccountNumber, setBankAccountNumber] = useState(
    agent?.bank_account_number || "8291038491"
  );
  const [bankAccountName, setBankAccountName] = useState(
    agent?.bank_account_name || "PT PESONA NUSANTARA WISATA"
  );
  const [description, setDescription] = useState(
    agent?.description ||
      "Operator wisata spesialis Kawasan Konservasi Bromo Tengger Semeru dan Kawah Ijen sejak 2018. Mengedepankan keselamatan berstandar K3, pemandu berlisensi HPI, dan armada prima berizin resmi."
  );

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (profile?.id) {
        const { error: pErr } = await supabase
          .from("profiles")
          .update({
            full_name: fullName.trim(),
            phone_number: phoneNumber.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        if (pErr) throw pErr;
      }

      if (agent?.id) {
        const { error: aErr } = await supabase
          .from("travel_agents")
          .update({
            business_name: businessName.trim(),
            office_address: officeAddress.trim(),
            city: city.trim(),
            whatsapp_number: whatsappNumber.trim(),
            instagram_handle: instagramHandle.trim() || null,
            bank_name: bankName.trim(),
            bank_account_number: bankAccountNumber.trim(),
            bank_account_name: bankAccountName.trim(),
            description: description.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", agent.id);

        if (aErr) throw aErr;
      }

      setSuccessMessage("Profil usaha dan informasi rekening berhasil disimpan.");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan perubahan profil.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg pb-16">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant">
            <span>Mitra Operator</span>
            <MaterialIcon name="chevron_right" className="text-xs" />
            <span className="text-primary font-body-semibold">Pengaturan Akun &amp; Legalitas</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Profil Usaha &amp; Pengaturan Toko
          </h1>
          <p className="font-body-regular text-body-regular text-on-surface-variant max-w-3xl">
            Kelola identitas resmi agen tour, branding storefront no-code, nomor rekening pencairan
            escrow, dan sertifikasi legalitas usaha.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start lg:self-center">
          {agent?.slug && (
            <Link
              href={`/${agent.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-all font-body-semibold text-body-semibold shadow-sm text-sm"
            >
              <MaterialIcon name="open_in_new" className="text-primary text-base" />
              <span>Buka Storefront Publik</span>
            </Link>
          )}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSubmit()}
            className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-secondary-container hover:bg-secondary text-on-primary transition-all font-body-semibold text-body-semibold shadow-md active:scale-95 text-sm disabled:opacity-50"
          >
            <MaterialIcon name="cloud_done" className="text-base" />
            <span>{isLoading ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-space-xs shadow-sm overflow-x-auto border border-outline-variant/20">
        <div className="flex items-center min-w-max gap-space-xs">
          <button
            type="button"
            onClick={() => setActiveTab("identitas")}
            className={`flex items-center gap-space-xs px-space-md py-space-sm rounded-lg font-body-semibold text-body-semibold transition-all text-sm ${
              activeTab === "identitas"
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            }`}
          >
            <MaterialIcon name="domain" className="text-base" />
            <span>1. Identitas Usaha &amp; Kontak Resmi</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("branding")}
            className={`flex items-center gap-space-xs px-space-md py-space-sm rounded-lg font-body-semibold text-body-semibold transition-all text-sm ${
              activeTab === "branding"
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            }`}
          >
            <MaterialIcon name="palette" className="text-base" />
            <span>2. Branding Storefront &amp; Subdomain</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("escrow")}
            className={`flex items-center gap-space-xs px-space-md py-space-sm rounded-lg font-body-semibold text-body-semibold transition-all text-sm ${
              activeTab === "escrow"
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            }`}
          >
            <MaterialIcon name="account_balance" className="text-base" />
            <span>3. Rekening Bank &amp; Pencairan Escrow</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("legalitas")}
            className={`flex items-center gap-space-xs px-space-md py-space-sm rounded-lg font-body-semibold text-body-semibold transition-all text-sm ${
              activeTab === "legalitas"
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            }`}
          >
            <MaterialIcon name="verified" className="text-base" />
            <span>4. Legalitas &amp; Dokumen SIMAKSI</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
          <MaterialIcon name="check_circle" className="text-xl text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-error-container text-on-error-container flex items-center gap-2">
          <MaterialIcon name="error" className="text-xl" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Verified UMKM Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-container p-space-lg text-on-primary shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md relative z-10">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-surface-container-lowest/15 backdrop-blur-md flex items-center justify-center text-on-primary">
              <MaterialIcon name="verified" className="text-3xl" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm font-bold">
                  Terverifikasi Mitra UMKM Nusabook
                </span>
                <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-micro-badge text-micro-badge font-bold uppercase">
                  Badge Aktif
                </span>
              </div>
              <p className="font-caption text-caption text-primary-fixed-dim mt-0.5">
                ID Mitra: NSB-ID-{agent?.id ? agent.id.slice(0, 6).toUpperCase() : "88291"} • Lisensi
                Resmi Terdaftar OSS Kemenparekraf • Escrow Instant Payout Diaktifkan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-lowest/20 backdrop-blur-sm px-space-md py-space-xs rounded-lg text-on-primary">
            <MaterialIcon name="shield" className="text-sm" />
            <span className="font-micro-badge text-micro-badge font-bold uppercase tracking-wider">
              Garansi Keamanan 100%
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Section 1: Data Entitas Usaha */}
          <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center justify-between border-b border-surface-container-low pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <MaterialIcon name="badge" className="text-primary text-xl" />
                <h2 className="font-title-md text-title-md text-on-surface font-bold">
                  Data Entitas Usaha
                </h2>
              </div>
              <span className="font-caption text-caption text-on-surface-variant">
                REQ-FUNC-PROF-01
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-body-semibold text-body-semibold text-on-surface">
                  Nama Resmi Usaha Tour &amp; Travel <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular text-sm border border-outline-variant/30 outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-body-semibold text-body-semibold text-on-surface">
                  Deskripsi Profil Bisnis
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular text-sm border border-outline-variant/30 outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-xs text-on-surface-variant">
                  Muncul pada katalog publik dan pratinjau mesin pencari Google.
                </span>
              </div>
            </div>
          </section>

          {/* Section 2: Kontak & Lokasi */}
          <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center gap-space-xs border-b border-surface-container-low pb-space-xs">
              <MaterialIcon name="contact_phone" className="text-primary text-xl" />
              <h2 className="font-title-md text-title-md text-on-surface font-bold">
                Kontak Resmi &amp; Alamat Operasional
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label className="font-body-semibold text-body-semibold text-on-surface">
                  Nomor WhatsApp Hotline <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular text-sm border border-outline-variant/30 outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body-semibold text-body-semibold text-on-surface">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="@pesona.merapi"
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular text-sm border border-outline-variant/30 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body-semibold text-body-semibold text-on-surface">
                  Kota Operasional
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular text-sm border border-outline-variant/30 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body-semibold text-body-semibold text-on-surface">
                  Alamat Kantor Fisik
                </label>
                <input
                  type="text"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular text-sm border border-outline-variant/30 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Rekening Bank Pencairan Escrow */}
          <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center gap-space-xs border-b border-surface-container-low pb-space-xs">
              <MaterialIcon name="account_balance" className="text-primary text-xl" />
              <h2 className="font-title-md text-title-md text-on-surface font-bold">
                Rekening Bank Pencairan Escrow Vault
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label className="font-body-semibold text-body-semibold text-on-surface">
                  Nama Bank
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular text-sm border border-outline-variant/30 outline-none cursor-pointer"
                >
                  <option value="BCA">PT Bank Central Asia Tbk (BCA)</option>
                  <option value="Mandiri">PT Bank Mandiri (Persero) Tbk</option>
                  <option value="BRI">PT Bank Rakyat Indonesia (BRI)</option>
                  <option value="BNI">PT Bank Negara Indonesia (BNI)</option>
                  <option value="BSI">PT Bank Syariah Indonesia (BSI)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body-semibold text-body-semibold text-on-surface">
                  Nomor Rekening Bank
                </label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular text-sm border border-outline-variant/30 outline-none focus:ring-1 focus:ring-primary font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-body-semibold text-body-semibold text-on-surface">
                  Atas Nama Pemilik Rekening
                </label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-regular text-sm border border-outline-variant/30 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="p-space-sm rounded-lg bg-surface-container text-on-surface flex items-start gap-2 text-xs">
              <MaterialIcon name="info" className="text-primary text-base shrink-0 mt-0.5" />
              <span>
                Pencairan otomatis diproses ke rekening di atas secara instan H+1 setelah trip selesai
                dan manifes presensi QR diverifikasi oleh kru lapangan.
              </span>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Card: Pratinjau Identitas Toko */}
          <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
            <span className="font-caption text-caption uppercase text-on-surface-variant font-bold tracking-wider">
              Pratinjau Storefront
            </span>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
                  {businessName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-title-md font-bold text-on-surface truncate">
                    {businessName}
                  </span>
                  <span className="text-xs text-primary font-semibold flex items-center gap-1">
                    <MaterialIcon name="verified" className="text-xs" /> Terverifikasi UMKM
                  </span>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                {description}
              </p>

              <div className="pt-2 border-t border-surface-container flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">{city}</span>
                <span className="text-primary font-semibold font-mono">
                  {agent?.slug || "pesona"}.nusabook.id
                </span>
              </div>
            </div>
          </section>

          {/* Card: Escrow Guarantee */}
          <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
            <div className="flex items-center gap-2">
              <MaterialIcon name="lock" className="text-primary text-xl" />
              <span className="font-title-md text-title-md text-on-surface font-bold">
                Safe Vault™ Protection
              </span>
            </div>
            <p className="text-caption text-caption text-on-surface-variant leading-relaxed">
              Semua transaksi wisatawan dilindungi sistem rekening bersama (Escrow). NusaBook menjamin
              dana mitra aman tanpa risiko gagal bayar.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
