"use client";

import { useState } from "react";
import {
  TrendingUp,
  Percent,
  Store,
  Ticket,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Send,
  Eye,
  RefreshCw,
  Download,
  AlertCircle,
  X,
  CreditCard,
  Server,
  Lock,
  ArrowUpRight,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

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
        <div className="fixed bottom-6 right-6 z-50 bg-brand-900 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border border-brand-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {modalTitle}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-sm text-slate-600 leading-relaxed">
              {modalContent}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (onConfirmAction) onConfirmAction();
                }}
                className="px-4 py-2 rounded-xl bg-brand-700 text-white hover:bg-brand-800 text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Konfirmasi Tindakan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner & Context Header */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-brand-50 border border-brand-100 text-brand-700 font-bold text-[11px] uppercase rounded-md tracking-wider">
                Kemdikbudristek P2MW 2026
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">Core Engine 3.8.4</span>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Supabase Realtime WSS: Connected (14ms)</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Super Admin Platform Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
              Monitoring Ekosistem SaaS & Marketplace Nusabook • Konsol Manajemen Hibah P2MW Kemdikbudristek (Multi-tenant B2B Engine & Escrow Ledger).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() =>
                showToast("Menyiapkan kompilasi PDF/XLSX Laporan Pertanggungjawaban Hibah P2MW...")
              }
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export LPJ (PDF/XLSX)</span>
            </button>
            <button
              onClick={() =>
                showToast("Menjalankan rekonsiliasi otomatis Midtrans vs PostgreSQL Ledger...")
              }
              className="bg-brand-700 hover:bg-brand-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync Real-time Ledger</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Global Platform KPI Cards (REQ-FUNC-ADM-01) */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* KPI 1: GMV Nasional */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                GMV Nasional (Bruto)
              </span>
              <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Rp 1.428.500.000
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-700 font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>+18.4% MoM</span>
              <span className="text-slate-400 font-normal">vs periode lalu</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
              <span>Target P2MW Tahap I (Rp 1.5M)</span>
              <span className="font-bold text-slate-900">95.2%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: "95.2%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI 2: Komisi Platform (2% Net) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Komisi Platform (2% Net)
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Rp 28.570.000
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center gap-1 border border-slate-200">
                <Lock className="w-3 h-3 text-amber-600" />
                Escrow Terverifikasi
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Potongan Otomatis</span>
            <span className="font-semibold text-brand-700">B2B Cut H+1 Tour</span>
          </div>
        </div>

        {/* KPI 3: Mitra Agen Terdaftar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Mitra Agen Terdaftar
              </span>
              <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              48 Mitra Aktif
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="text-emerald-700 font-semibold">38 Verified</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-700 font-semibold">6 KYC Pending</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">4 Draft</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>100% NIB & KTP Pemilik Tervalidasi RLS</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Volume Transaksi */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Volume Transaksi Sukses
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Ticket className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              2.140 Tiket
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>99.8% Transaksi Tanpa Overbooking</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Algoritma Kursi:</span>
            <span className="font-semibold text-brand-700">Pessimistic Quota Lock</span>
          </div>
        </div>
      </section>

      {/* Two-Column Operational Command Center */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column (Wide - 7/12): Operational Management Tables */}
        <div className="xl:col-span-7 space-y-8">
          {/* Table A: KYC Verification (REQ-FUNC-ADM-02) */}
          <div id="kyc" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-700" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Verifikasi Dokumen & Legalitas Mitra (KYC)
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Otorisasi kepatuhan perizinan tour & travel sebelum agen dapat mempublikasikan paket trip.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold whitespace-nowrap self-start sm:self-auto">
                {kycList.filter((k) => k.status === "PENDING").length} Permohonan Baru
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-5">Mitra / Wilayah</th>
                    <th className="py-3 px-4">Penanggung Jawab</th>
                    <th className="py-3 px-4">Kelengkapan Berkas</th>
                    <th className="py-3 px-4">Status & Tipe</th>
                    <th className="py-3 px-5 text-right">Tindakan SuperAdmin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kycList.map((partner) => (
                    <tr key={partner.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-brand-900 leading-tight">
                          {partner.agencyName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{partner.location}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">
                          {partner.ownerName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
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
                            className="inline-flex items-center gap-1 text-brand-700 text-xs hover:underline text-left font-medium"
                          >
                            <Eye className="w-3 h-3" />
                            <span>KTP Pemilik [Lihat]</span>
                          </button>
                          <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{partner.nibStatus}</span>
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {partner.status === "PENDING" && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
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
                          <p className="text-[11px] text-slate-400">{partner.tripType}</p>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-right space-x-2 whitespace-nowrap">
                        {partner.status === "PENDING" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveKYC(partner)}
                              className="px-3 py-1.5 rounded-lg bg-brand-700 text-white hover:bg-brand-800 text-xs font-semibold transition-colors shadow-sm"
                            >
                              Setujui & Badge
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRevisionKYC(partner)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                            >
                              Revisi
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
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

          {/* Table B: Payout & Escrow Disbursement (REQ-FUNC-ADM-03) */}
          <div id="payout" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-700" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Pencairan Dana Mitra & Escrow (Payout Engine 2% Cut)
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Otomasi pemisahan saldo selesai (H+1 trip terlaksana) dengan pemotongan komisi platform 2% & audit rekening VA.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>BCA & Mandiri Host-to-Host</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-5">ID & Rekening Agen</th>
                    <th className="py-3 px-4">Trip Terselesaikan</th>
                    <th className="py-3 px-4">Kalkulasi Escrow (2%)</th>
                    <th className="py-3 px-4">Net Pencairan</th>
                    <th className="py-3 px-5 text-right">Status / Eksekusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payoutList.map((payout) => (
                    <tr key={payout.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-mono text-xs font-bold text-brand-700">
                          #{payout.id}
                        </div>
                        <div className="font-semibold text-slate-900 mt-0.5">
                          {payout.agencyName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <CreditCard className="w-3 h-3 text-slate-400" />
                          <span>{payout.bankAccount}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-800">
                          {payout.tripTitle}
                        </div>
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-medium mt-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{payout.tripStatus}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-xs text-slate-500">
                          Bruto: Rp {payout.grossAmount.toLocaleString("id-ID")}
                        </div>
                        <div className="text-xs text-amber-700 font-semibold">
                          Cut 2%: -Rp {payout.feeCut.toLocaleString("id-ID")}
                        </div>
                        <div className="text-[11px] text-slate-400">Admin Bank: Rp 0</div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          Rp {payout.netAmount.toLocaleString("id-ID")}
                        </div>
                        {payout.status === "READY" ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mt-1">
                            Siap Dicairkan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mt-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Berhasil Dicairkan</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        {payout.status === "READY" ? (
                          <button
                            type="button"
                            onClick={() => handleProcessPayout(payout)}
                            className="px-3.5 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ml-auto"
                          >
                            <Send className="w-3.5 h-3.5" />
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
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 ml-auto"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
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
          {/* Section C: System Health & Real-time Infra SLA (PRD Sec 6) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-brand-700" />
                  <h3 className="font-bold text-slate-900 text-base">
                    System Health & Infra SLA
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitoring ketersediaan layanan cloud backend 99.95%.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                99.98% Actual
              </span>
            </div>

            <div className="space-y-4">
              {/* VPS Metric */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-900">
                      VPS IdCloudHost ID-JKT01
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">4 vCPU / 8GB RAM</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 text-slate-600">
                      <span>CPU Usage</span>
                      <span className="font-bold text-brand-700">24%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-700 h-full rounded-full" style={{ width: "24%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 text-slate-600">
                      <span>Memory</span>
                      <span className="font-bold text-brand-700">48%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-700 h-full rounded-full" style={{ width: "48%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PostgreSQL Engine */}
              <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200/60">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-900">
                      PostgreSQL 3NF Engine
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    PgBouncer Active • RLS Strict Enforcement
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">38 ms</span>
                  <p className="text-[10px] text-emerald-600 font-semibold">Latency Nominal</p>
                </div>
              </div>

              {/* Midtrans Gateway */}
              <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200/60">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-900">
                      Midtrans Snap Webhook
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    SHA-512 Signature Hash Verifier
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700">0 Error</span>
                  <p className="text-[10px] text-slate-400">HTTP 200 Fast Return</p>
                </div>
              </div>

              {/* WhatsApp Engine */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-900">
                      WhatsApp Cloud API (Wablas)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">14.820 / 20.000 Kuota</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "74.1%" }}></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>E-Ticket PDF Dispatcher: Active</span>
                  <span className="text-brand-700 font-semibold">Fallback: Mailgun SMTP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section D: Recent System Audit Trail & Concurrency Logs (SRS Sec 5.3) */}
          <div id="audit" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-brand-700" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Audit Log & Concurrency Engine
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Jejak pemesanan konkuren & eksekusi isolasi transaksi (Pessimistic Lock).
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast("Memperbarui stream audit log realtime...")}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                title="Muat Ulang Log"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Log Item 1 */}
              <div className="relative pl-4">
                <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    LOCK_QUOTA_ACQUIRED
                  </span>
                  <span className="text-[11px] text-slate-400">09:42:15 WIB</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Pessimistic Lock <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] text-brand-800">reserve_trip_quota</code> sukses: Jadwal #BRM-041 (Bromo Sunrise) 2 pax dikunci untuk checkout wisatawan Budi Santoso.
                </p>
              </div>

              {/* Log Item 2 */}
              <div className="relative pl-4">
                <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-700 ring-4 ring-white"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    MIDTRANS_SETTLEMENT
                  </span>
                  <span className="text-[11px] text-slate-400">09:38:02 WIB</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Webhook Midtrans HTTP 200: Pesanan <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] text-brand-800">NB-2026-9021</code> lunas (Rp 1.250.000). Komisi 2% Rp 25.000 otomatis dialokasikan ke Escrow Nusabook.
                </p>
              </div>

              {/* Log Item 3 */}
              <div className="relative pl-4">
                <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    CRYPTO_PAYLOAD_VERIFIED
                  </span>
                  <span className="text-[11px] text-slate-400">09:15:20 WIB</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Audit Kepatuhan UU PDP: Enkripsi AES-256 NIK penumpang pada tabel <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] text-brand-800">booking_passengers</code> teruji tanpa kebocoran plain-text.
                </p>
              </div>

              {/* Log Item 4 */}
              <div className="relative pl-4">
                <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-white"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    QUOTA_TTL_ROLLBACK
                  </span>
                  <span className="text-[11px] text-slate-400">08:50:11 WIB</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Pembersihan Otomatis: Jadwal #SMB-014 kedaluwarsa batas waktu pembayaran 20 menit. 2 kursi dikembalikan ke kuota publik secara atomic.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-200/60">
              <span className="text-slate-500">Sinkronisasi Log Node</span>
              <span className="text-brand-700 font-bold">Postgres WAL Streaming: 100% Synced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
