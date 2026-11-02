"use client";

import { useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { MaterialIcon } from "@/components/ui/icon";

export interface PayoutRecord {
  id: string;
  requestedAt: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: "REQUESTED" | "APPROVED" | "TRANSFERRED" | "REJECTED";
  processedAt?: string | null;
  bankRefNumber?: string | null;
}

const INITIAL_PAYOUTS: PayoutRecord[] = [
  {
    id: "PO-2610-001",
    requestedAt: "17 Okt 2026, 14:30 WIB",
    amount: 15000000,
    bankName: "BCA",
    accountNumber: "88019500011",
    accountHolder: "Budi Santoso (Mitra Travel)",
    status: "TRANSFERRED",
    processedAt: "17 Okt 2026, 15:45 WIB",
    bankRefNumber: "TRF-BCA-98234190",
  },
  {
    id: "PO-2610-002",
    requestedAt: "18 Okt 2026, 09:15 WIB",
    amount: 25000000,
    bankName: "BCA",
    accountNumber: "88019500011",
    accountHolder: "Budi Santoso (Mitra Travel)",
    status: "TRANSFERRED",
    processedAt: "18 Okt 2026, 10:02 WIB",
    bankRefNumber: "TRF-BCA-98311204",
  },
  {
    id: "PO-2610-003",
    requestedAt: "24 Okt 2026, 16:20 WIB",
    amount: 10000000,
    bankName: "BCA",
    accountNumber: "88019500011",
    accountHolder: "Budi Santoso (Mitra Travel)",
    status: "APPROVED",
    processedAt: "24 Okt 2026, 17:00 WIB",
    bankRefNumber: "TRF-BCA-99014210",
  },
];

export function EscrowView({
  businessName = "Pesona Merapi Tour & Travel",
}: {
  businessName?: string;
}) {
  const [saldoTertahan] = useState(115830000);
  const [saldoSiapCair, setSaldoSiapCair] = useState(32670000);
  const [totalDitransfer, setTotalDitransfer] = useState(218450000);

  const [payouts, setPayouts] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("10000000");
  const [notes, setNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Masukkan nominal pencairan yang valid.");
      return;
    }

    if (amountNum > saldoSiapCair) {
      alert("Nominal penarikan melebihi saldo yang siap dicairkan.");
      return;
    }

    const newPayout: PayoutRecord = {
      id: `PO-${Date.now().toString().slice(-6)}`,
      requestedAt: "Hari ini, baru saja",
      amount: amountNum,
      bankName: "BCA",
      accountNumber: "88019500011",
      accountHolder: "Budi Santoso (Mitra Travel)",
      status: "REQUESTED",
      processedAt: null,
      bankRefNumber: null,
    };

    setPayouts([newPayout, ...payouts]);
    setSaldoSiapCair((prev) => prev - amountNum);
    setIsModalOpen(false);
    showToast(`Pengajuan pencairan ${formatRupiah(amountNum)} berhasil dikirim ke Admin Finance!`);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-2xl text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <MaterialIcon name="check_circle" className="text-emerald-400 text-base" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Breadcrumbs */}
      <section className="flex flex-col gap-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <MaterialIcon name="chevron_right" className="text-sm text-slate-400" />
          <span className="font-semibold text-primary">Keuangan &amp; Escrow Vault</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                Sistem Escrow Terproteksi
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync Aktif
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
              Pengelolaan Rekening Bersama &amp; Pencairan Dana
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Dana wisatawan diproteksi dalam rekening penampung resmi Nusabook. Hak bersih operator (98%) otomatis siap dicairkan segera setelah jadwal trip terselesaikan.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/api/financials/export"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs"
            >
              <MaterialIcon name="file_download" className="text-base text-primary" />
              <span>Ekspor Mutasi (CSV)</span>
            </a>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <MaterialIcon name="account_balance_wallet" className="text-base" />
              <span>Tarik Saldo Cair</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 Core Escrow Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Saldo Escrow Berjalan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Saldo Escrow Tertahan
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
              <MaterialIcon name="lock" className="text-base" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900">
              {formatRupiah(saldoTertahan)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dari 14 batch trip aktif mendatang. Otomatis cair setelah keberangkatan selesai.
            </p>
          </div>
        </div>

        {/* Card 2: Saldo Siap Dicairkan */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-5 rounded-2xl text-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
              Saldo Siap Dicairkan
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <MaterialIcon name="payments" className="text-base" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-white">
              {formatRupiah(saldoSiapCair)}
            </div>
            <p className="text-xs text-emerald-100 mt-1">
              Bebas komplain operasional. Siap ditransfer ke rekening bank mitra hari ini.
            </p>
          </div>
        </div>

        {/* Card 3: Total Berhasil Ditransfer */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Telah Ditransfer
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <MaterialIcon name="verified" className="text-base text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900">
              {formatRupiah(totalDitransfer)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Akumulasi 18 penarikan dana payout yang sukses terverifikasi.
            </p>
          </div>
        </div>
      </section>

      {/* Rekening Tujuan Mitra */}
      <section className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-primary font-black text-lg flex items-center justify-center shadow-xs">
            BCA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">Bank Central Asia (BCA)</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Rekening Utama
              </span>
            </div>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              88019500011 • a.n. Budi Santoso (Mitra Travel)
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/profile"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <MaterialIcon name="edit" className="text-sm" />
          <span>Kelola Rekening Bank</span>
        </Link>
      </section>

      {/* Tabel Riwayat Penarikan Dana Payout */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MaterialIcon name="history" className="text-lg text-primary" />
            <h2 className="font-bold text-slate-900 text-base">
              Riwayat Pengajuan Pencairan Dana (Payout Logs)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {payouts.length} Riwayat Transaksi
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">ID Payout</th>
                <th className="py-3 px-4">Waktu Pengajuan</th>
                <th className="py-3 px-4">Nominal Penarikan</th>
                <th className="py-3 px-4">Rekening Tujuan</th>
                <th className="py-3 px-4">Status Payout</th>
                <th className="py-3 px-4 text-right">No. Referensi Bank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {payouts.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">
                    {row.id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {row.requestedAt}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatRupiah(row.amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold block">{row.bankName} {row.accountNumber}</span>
                    <span className="text-slate-500 text-[11px]">{row.accountHolder}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {row.status === "TRANSFERRED" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <MaterialIcon name="check_circle" className="text-xs" />
                        Ditransfer
                      </span>
                    )}
                    {row.status === "APPROVED" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-primary border border-blue-200">
                        <MaterialIcon name="hourglass_top" className="text-xs" />
                        Disetujui Admin
                      </span>
                    )}
                    {row.status === "REQUESTED" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <MaterialIcon name="schedule" className="text-xs" />
                        Menunggu Proses
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-600">
                    {row.bankRefNumber || "Dalam Antrean"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal Pengajuan Penarikan Saldo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <MaterialIcon name="account_balance" className="text-lg" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Pengajuan Penarikan Saldo Payout
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                <MaterialIcon name="close" className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="flex flex-col gap-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <span className="font-bold block mb-0.5">Saldo Siap Dicairkan:</span>
                <span className="text-lg font-black">{formatRupiah(saldoSiapCair)}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nominal Penarikan (IDR):
                </label>
                <input
                  type="number"
                  min="50000"
                  max={saldoSiapCair}
                  step="50000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <span className="text-[11px] text-slate-500">
                  Minimal penarikan Rp 50.000. Bebas biaya administrasi transfer antarbank.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Rekening Penerima:
                </label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
                  <span className="font-bold block">BCA • 88019500011</span>
                  <span className="text-slate-500 text-[11px]">Budi Santoso (Mitra Travel)</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Catatan untuk Admin Finance (Opsional):
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Misal: Penarikan batch weekend trip 18 Okt"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Konfirmasi Penarikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

