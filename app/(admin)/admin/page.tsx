"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/icon";

interface KYCApplicant {
  id: string;
  agencyName: string;
  location: string;
  ownerName: string;
  nikMasked: string;
  ktpStatus: string;
  nibStatus: string;
  status: "PENDING" | "VERIFIED" | "REVISION";
  tripType: string;
}

interface PayoutEntry {
  id: string;
  agencyName: string;
  bankAccount: string;
  tripTitle: string;
  tripStatus: string;
  grossAmount: number;
  feeCut: number;
  netAmount: number;
  status: "READY" | "SETTLED";
  transferRef?: string;
}

const INITIAL_KYC: KYCApplicant[] = [
  {
    id: "kyc-1",
    agencyName: "Pesona Merapi Tour & Travel",
    location: "Sleman, D.I. Yogyakarta",
    ownerName: "Rian Pratama",
    nikMasked: "3404********0002",
    ktpStatus: "Tervalidasi",
    nibStatus: "NIB OSS Valid",
    status: "PENDING",
    tripType: "Trip Merapi & Jeep Adventure",
  },
  {
    id: "kyc-2",
    agencyName: "Batam Island Adventures",
    location: "Batam, Kepulauan Riau",
    ownerName: "Siti Nurhaliza",
    nikMasked: "2171********0008",
    ktpStatus: "Tervalidasi",
    nibStatus: "TDUP Pariwisata Valid",
    status: "PENDING",
    tripType: "Island Hopping & Watersport",
  },
  {
    id: "kyc-3",
    agencyName: "Rinjani Highland Trekker",
    location: "Lombok Timur, NTB",
    ownerName: "Lalu Hendra",
    nikMasked: "5203********0004",
    ktpStatus: "Tervalidasi",
    nibStatus: "Sertifikasi HPI Valid",
    status: "PENDING",
    tripType: "Mountain Expeditions",
  },
];

const INITIAL_PAYOUTS: PayoutEntry[] = [
  {
    id: "PO-2026-089",
    agencyName: "Tour DeJava Official",
    bankAccount: "BCA 0182-991-231 a.n Tour DeJava",
    tripTitle: "Sunrise Bromo 18 Nov",
    tripStatus: "Pelaksanaan Selesai (H+1)",
    grossAmount: 15000000,
    feeCut: 300000,
    netAmount: 14700000,
    status: "READY",
  },
  {
    id: "PO-2026-088",
    agencyName: "Komodo Liveaboard Excursions",
    bankAccount: "Mandiri 1370-002-182 a.n Komodo Liveaboard",
    tripTitle: "3D2N Labuan Bajo Sailing",
    tripStatus: "Pelaksanaan Selesai",
    grossAmount: 42000000,
    feeCut: 840000,
    netAmount: 41160000,
    status: "SETTLED",
    transferRef: "MDT-78213",
  },
];

export default function SuperAdminPage() {
  const [kycList, setKycList] = useState<KYCApplicant[]>(INITIAL_KYC);
  const [payoutList, setPayoutList] = useState<PayoutEntry[]>(INITIAL_PAYOUTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleApproveKYC = (partner: KYCApplicant) => {
    setModalTitle("Verifikasi Dokumen Mitra");
    setModalContent(
      `Apakah Anda yakin ingin menyetujui legalitas "${partner.agencyName}"? Sistem akan menerbitkan Badge Mitra Terverifikasi dan mengaktifkan publikasi paket tur.`
    );
    setOnConfirmAction(() => () => {
      setKycList((prev) =>
        prev.map((k) => (k.id === partner.id ? { ...k, status: "VERIFIED" } : k))
      );
      setModalOpen(false);
      showToast(`Mitra "${partner.agencyName}" resmi berstatus Terverifikasi.`);
    });
    setModalOpen(true);
  };

  const handleRevisionKYC = (partner: KYCApplicant) => {
    setModalTitle("Permintaan Revisi Dokumen");
    setModalContent(
      `Kirim notifikasi revisi berkas legalitas ke penanggung jawab ${partner.ownerName} (${partner.agencyName}) melalui jalur resmi WhatsApp.`
    );
    setOnConfirmAction(() => () => {
      setKycList((prev) =>
        prev.map((k) => (k.id === partner.id ? { ...k, status: "REVISION" } : k))
      );
      setModalOpen(false);
      showToast(`Permintaan revisi berhasil dikirim ke mitra "${partner.agencyName}".`);
    });
    setModalOpen(true);
  };

  const handleProcessPayout = (payout: PayoutEntry) => {
    setModalTitle("Eksekusi Transfer Pencairan Dana (Escrow Payout)");
    setModalContent(
      `Pindahkan dana netto Rp ${payout.netAmount.toLocaleString("id-ID")} ke rekening ${payout.bankAccount}? Potongan komisi platform 2% (Rp ${payout.feeCut.toLocaleString("id-ID")}) telah dicatat ke Ledger Nusabook.`
    );
    setOnConfirmAction(() => () => {
      setPayoutList((prev) =>
        prev.map((p) =>
          p.id === payout.id
            ? { ...p, status: "SETTLED", transferRef: `MDT-${Math.floor(10000 + Math.random() * 90000)}` }
            : p
        )
      );
      setModalOpen(false);
      showToast(`Pencairan dana untuk ${payout.agencyName} sukses dikirim.`);
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-on-surface text-surface px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <MaterialIcon name="check_circle" className="text-xl text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-surface-variant hover:text-surface"
          >
            <MaterialIcon name="close" className="text-lg" />
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-primary flex items-center justify-center">
                  <MaterialIcon name="verified_user" className="text-xl" />
                </div>
                <h3 className="font-bold text-on-surface text-sm sm:text-base">
                  {modalTitle}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              >
                <MaterialIcon name="close" className="text-lg" />
              </button>
            </div>
            <div className="p-6 text-sm text-on-surface-variant leading-relaxed">
              {modalContent}
            </div>
            <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 flex justify-end gap-2.5">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (onConfirmAction) onConfirmAction();
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-hover text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
              >
                <MaterialIcon name="check_circle" className="text-base" />
                <span>Konfirmasi Tindakan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner & Context Header */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-primary-container text-on-primary-container font-bold text-[11px] uppercase rounded-md tracking-wider">
                Kemdikbudristek P2MW 2026
              </span>
              <span className="text-outline-variant">•</span>
              <span className="text-xs text-on-surface-variant font-medium">Core Engine 3.8.4</span>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Supabase Realtime WSS: Connected (14ms)</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Super Admin Platform Overview
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-4xl leading-relaxed">
              Monitoring Ekosistem SaaS & Marketplace Nusabook • Konsol Manajemen Hibah P2MW Kemdikbudristek (Multi-tenant B2B Engine & Escrow Ledger).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() =>
                showToast("Menyiapkan kompilasi PDF/XLSX Laporan Pertanggungjawaban Hibah P2MW...")
              }
              className="bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container-high text-on-surface px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <MaterialIcon name="download" className="text-base text-on-surface-variant" />
              <span>Export LPJ (PDF/XLSX)</span>
            </button>
            <button
              onClick={() =>
                showToast("Menjalankan rekonsiliasi otomatis Midtrans vs PostgreSQL Ledger...")
              }
              className="bg-primary hover:bg-primary-hover text-on-primary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <MaterialIcon name="sync" className="text-base" />
              <span>Sync Real-time Ledger</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Global Platform KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* KPI 1: GMV Nasional */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                GMV Nasional (Bruto)
              </span>
              <div className="w-8 h-8 rounded-xl bg-primary-container text-primary flex items-center justify-center">
                <MaterialIcon name="credit_card" className="text-lg" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Rp 1.428.500.000
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-secondary font-semibold">
              <MaterialIcon name="trending_up" className="text-base" />
              <span>+18.4% MoM</span>
              <span className="text-on-surface-variant font-normal">vs periode lalu</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/20">
            <div className="flex justify-between items-center text-xs text-on-surface-variant mb-1.5">
              <span>Target P2MW Tahap I (Rp 1.5M)</span>
              <span className="font-bold text-on-surface">95.2%</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-500"
                style={{ width: "95.2%" }}
              />
            </div>
          </div>
        </div>

        {/* KPI 2: Komisi Platform (2% Net) */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Komisi Platform (2% Net)
              </span>
              <div className="w-8 h-8 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <MaterialIcon name="percent" className="text-lg" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Rp 28.570.000
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-semibold flex items-center gap-1 border border-outline-variant/30">
                <MaterialIcon name="lock" className="text-xs text-secondary" />
                Escrow Terverifikasi
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Total Potongan Otomatis</span>
            <span className="font-semibold text-primary">B2B Cut H+1 Tour</span>
          </div>
        </div>

        {/* KPI 3: Mitra Agen Terdaftar */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Mitra Agen Terdaftar
              </span>
              <div className="w-8 h-8 rounded-xl bg-primary-container text-primary flex items-center justify-center">
                <MaterialIcon name="storefront" className="text-lg" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              48 Mitra Aktif
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="text-emerald-700 font-semibold">38 Verified</span>
              <span className="text-outline-variant">•</span>
              <span className="text-secondary font-semibold">6 KYC Pending</span>
              <span className="text-outline-variant">•</span>
              <span className="text-on-surface-variant">4 Draft</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/20">
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>100% NIB & KTP Pemilik Tervalidasi RLS</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Volume Transaksi */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Volume Transaksi Sukses
              </span>
              <div className="w-8 h-8 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                <MaterialIcon name="confirmation_number" className="text-lg" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              2.140 Tiket
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-on-surface">
              <MaterialIcon name="verified_user" className="text-sm text-emerald-600" />
              <span>99.8% Transaksi Tanpa Overbooking</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Algoritma Kursi:</span>
            <span className="font-semibold text-primary">Pessimistic Quota Lock</span>
          </div>
        </div>
      </section>

      {/* Two-Column Operational Command Center */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column (Wide - 7/12): Operational Management Tables */}
        <div className="xl:col-span-7 space-y-8">
          {/* Table A: KYC Verification */}
          <div id="kyc" className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 bg-surface-container-low border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <MaterialIcon name="verified_user" className="text-xl text-primary" />
                  <h2 className="text-base sm:text-lg font-bold text-on-surface">
                    Verifikasi Dokumen & Legalitas Mitra (KYC)
                  </h2>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  Otorisasi kepatuhan perizinan tour & travel sebelum agen dapat mempublikasikan paket trip.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-bold whitespace-nowrap self-start sm:self-auto">
                {kycList.filter((k) => k.status === "PENDING").length} Permohonan Baru
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-surface-container-high/60 border-b border-outline-variant/20 text-on-surface-variant uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-5">Mitra / Wilayah</th>
                    <th className="py-3 px-4">Penanggung Jawab</th>
                    <th className="py-3 px-4">Kelengkapan Berkas</th>
                    <th className="py-3 px-4">Status & Tipe</th>
                    <th className="py-3 px-5 text-right">Tindakan SuperAdmin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {kycList.map((partner) => (
                    <tr key={partner.id} className="hover:bg-surface-container-low/80 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-primary leading-tight">
                          {partner.agencyName}
                        </div>
                        <div className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                          <MaterialIcon name="location_on" className="text-xs text-on-surface-variant/70" />
                          <span>{partner.location}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-on-surface">
                          {partner.ownerName}
                        </div>
                        <div className="text-[11px] text-on-surface-variant font-mono mt-0.5">
                          NIK: {partner.nikMasked}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              showToast(`Membuka pratinjau KTP Penanggung Jawab ${partner.ownerName}...`)
                            }
                            className="inline-flex items-center gap-1 text-primary text-xs hover:underline text-left font-medium"
                          >
                            <MaterialIcon name="visibility" className="text-xs" />
                            <span>KTP Pemilik [Lihat]</span>
                          </button>
                          <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-medium">
                            <MaterialIcon name="check_circle" className="text-xs text-emerald-600" />
                            <span>{partner.nibStatus}</span>
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {partner.status === "PENDING" && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
                              Menunggu Review
                            </span>
                          )}
                          {partner.status === "VERIFIED" && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                              Terverifikasi
                            </span>
                          )}
                          {partner.status === "REVISION" && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                              Menunggu Revisi
                            </span>
                          )}
                          <p className="text-[11px] text-on-surface-variant">{partner.tripType}</p>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-right space-x-2 whitespace-nowrap">
                        {partner.status === "PENDING" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveKYC(partner)}
                              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-hover text-xs font-semibold transition-colors shadow-sm"
                            >
                              Setujui & Badge
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRevisionKYC(partner)}
                              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-medium transition-colors"
                            >
                              Revisi
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-on-surface-variant font-medium">
                            Telah Diproses
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table B: Payout & Escrow Disbursement */}
          <div id="payout" className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 bg-surface-container-low border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <MaterialIcon name="credit_card" className="text-xl text-primary" />
                  <h2 className="text-base sm:text-lg font-bold text-on-surface">
                    Pencairan Dana Mitra & Escrow (Payout Engine 2% Cut)
                  </h2>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  Otomasi pemisahan saldo selesai (H+1 trip terlaksana) dengan pemotongan komisi platform 2% & audit rekening VA.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>BCA & Mandiri Host-to-Host</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-surface-container-high/60 border-b border-outline-variant/20 text-on-surface-variant uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-5">ID & Rekening Agen</th>
                    <th className="py-3 px-4">Trip Terselesaikan</th>
                    <th className="py-3 px-4">Kalkulasi Escrow (2%)</th>
                    <th className="py-3 px-4">Net Pencairan</th>
                    <th className="py-3 px-5 text-right">Status / Eksekusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {payoutList.map((payout) => (
                    <tr key={payout.id} className="hover:bg-surface-container-low/80 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-mono text-xs font-bold text-primary">
                          #{payout.id}
                        </div>
                        <div className="font-semibold text-on-surface mt-0.5">
                          {payout.agencyName}
                        </div>
                        <div className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-1">
                          <MaterialIcon name="credit_card" className="text-xs text-on-surface-variant/70" />
                          <span>{payout.bankAccount}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-medium text-on-surface">
                          {payout.tripTitle}
                        </div>
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-medium mt-1">
                          <MaterialIcon name="check_circle" className="text-xs text-emerald-600" />
                          <span>{payout.tripStatus}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-xs text-on-surface-variant">
                          Bruto: Rp {payout.grossAmount.toLocaleString("id-ID")}
                        </div>
                        <div className="text-xs text-secondary font-semibold">
                          Cut 2%: -Rp {payout.feeCut.toLocaleString("id-ID")}
                        </div>
                        <div className="text-[11px] text-on-surface-variant">Admin Bank: Rp 0</div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-on-surface text-sm">
                          Rp {payout.netAmount.toLocaleString("id-ID")}
                        </div>
                        {payout.status === "READY" ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold mt-1">
                            Siap Dicairkan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mt-1">
                            <MaterialIcon name="check_circle" className="text-xs text-emerald-600" />
                            <span>Berhasil Dicairkan</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        {payout.status === "READY" ? (
                          <button
                            type="button"
                            onClick={() => handleProcessPayout(payout)}
                            className="px-3.5 py-2 rounded-xl bg-secondary text-on-secondary hover:bg-secondary/90 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ml-auto"
                          >
                            <MaterialIcon name="send" className="text-xs" />
                            <span>Proses Transfer Disburse</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              showToast(
                                `Menampilkan Surat Perintah Pencairan Dana (SP2D) & Bukti Midtrans Iris: ${payout.transferRef}...`
                              )
                            }
                            className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-medium transition-colors flex items-center gap-1.5 ml-auto"
                          >
                            <MaterialIcon name="description" className="text-xs text-on-surface-variant" />
                            <span>Bukti ({payout.transferRef})</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Compact - 5/12): Infra Health & Security Audit Logs */}
        <div className="xl:col-span-5 space-y-8">
          {/* Section C: System Health & Real-time Infra SLA */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-2">
                  <MaterialIcon name="dns" className="text-xl text-primary" />
                  <h3 className="font-bold text-on-surface text-base">
                    System Health & Infra SLA
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Monitoring ketersediaan layanan cloud backend 99.95%.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                99.98% Actual
              </span>
            </div>

            <div className="space-y-4">
              {/* VPS Metric */}
              <div className="p-4 bg-surface-container-low rounded-xl space-y-2 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-on-surface">
                      VPS IdCloudHost ID-JKT01
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">4 vCPU / 8GB RAM</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 text-on-surface-variant">
                      <span>CPU Usage</span>
                      <span className="font-bold text-primary">24%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "24%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 text-on-surface-variant">
                      <span>Memory</span>
                      <span className="font-bold text-primary">48%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "48%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* PostgreSQL Engine */}
              <div className="p-4 bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/20">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-on-surface">
                      PostgreSQL 3NF Engine
                    </span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    PgBouncer Active • RLS Strict Enforcement
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-on-surface">38 ms</span>
                  <p className="text-[10px] text-emerald-600 font-semibold">Latency Nominal</p>
                </div>
              </div>

              {/* Midtrans Gateway */}
              <div className="p-4 bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/20">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-on-surface">
                      Midtrans Snap Webhook
                    </span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    SHA-512 Signature Hash Verifier
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700">0 Error</span>
                  <p className="text-[10px] text-on-surface-variant">HTTP 200 Fast Return</p>
                </div>
              </div>

              {/* WhatsApp Engine */}
              <div className="p-4 bg-surface-container-low rounded-xl space-y-2 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-on-surface">
                      WhatsApp Cloud API (Wablas)
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">14.820 / 20.000 Kuota</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: "74.1%" }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-0.5">
                  <span>E-Ticket PDF Dispatcher: Active</span>
                  <span className="text-primary font-semibold">Fallback: Mailgun SMTP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section D: Recent System Audit Trail & Concurrency Logs */}
          <div id="audit" className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-2">
                  <MaterialIcon name="lock" className="text-xl text-primary" />
                  <h3 className="font-bold text-on-surface text-base">
                    Audit Log & Concurrency Engine
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Jejak pemesanan konkuren & eksekusi isolasi transaksi (Pessimistic Lock).
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast("Memperbarui stream audit log realtime...")}
                className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-on-surface transition-colors"
                title="Muat Ulang Log"
              >
                <MaterialIcon name="sync" className="text-base" />
              </button>
            </div>

            <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/30">
              {/* Log Item 1 */}
              <div className="relative pl-4">
                <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-surface"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">
                    LOCK_QUOTA_ACQUIRED
                  </span>
                  <span className="text-[11px] text-on-surface-variant">09:42:15 WIB</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Pessimistic Lock <code className="bg-surface-container-high px-1 py-0.5 rounded text-[11px] text-primary font-mono">reserve_trip_quota</code> sukses: Jadwal #BRM-041 (Bromo Sunrise) 2 pax dikunci untuk checkout wisatawan Budi Santoso.
                </p>
              </div>

              {/* Log Item 2 */}
              <div className="relative pl-4">
                <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">
                    MIDTRANS_SETTLEMENT
                  </span>
                  <span className="text-[11px] text-on-surface-variant">09:38:02 WIB</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Webhook Midtrans HTTP 200: Pesanan <code className="bg-surface-container-high px-1 py-0.5 rounded text-[11px] text-primary font-mono">NB-2026-9021</code> lunas (Rp 1.250.000). Komisi 2% Rp 25.000 otomatis dialokasikan ke Escrow Nusabook.
                </p>
              </div>

              {/* Log Item 3 */}
              <div className="relative pl-4">
                <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-surface"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">
                    CRYPTO_PAYLOAD_VERIFIED
                  </span>
                  <span className="text-[11px] text-on-surface-variant">09:15:20 WIB</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Audit Kepatuhan UU PDP: Enkripsi AES-256 NIK penumpang pada tabel <code className="bg-surface-container-high px-1 py-0.5 rounded text-[11px] text-primary font-mono">booking_passengers</code> teruji tanpa kebocoran plain-text.
                </p>
              </div>

              {/* Log Item 4 */}
              <div className="relative pl-4">
                <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-outline-variant ring-4 ring-surface"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">
                    QUOTA_TTL_ROLLBACK
                  </span>
                  <span className="text-[11px] text-on-surface-variant">08:50:11 WIB</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Pembersihan Otomatis: Jadwal #SMB-014 kedaluwarsa batas waktu pembayaran 20 menit. 2 kursi dikembalikan ke kuota publik secara atomic.
                </p>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-xs border border-outline-variant/20">
              <span className="text-on-surface-variant">Sinkronisasi Log Node</span>
              <span className="text-primary font-bold">Postgres WAL Streaming: 100% Synced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
