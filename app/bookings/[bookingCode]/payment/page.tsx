"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/utils";
import {
  Clock,
  QrCode,
  CreditCard,
  Copy,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function PaymentInstructionPage({
  params,
}: {
  params: Promise<{ bookingCode: string }>;
}) {
  const { bookingCode } = use(params);
  const router = useRouter();

  // Simulated TTL 20 minutes countdown (1200 seconds)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(20 * 60);
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"UNPAID" | "PAID" | "EXPIRED">("UNPAID");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus("EXPIRED");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate Instant Payment via Webhook simulation
  const handleSimulatePayment = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/webhooks/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingCode,
          status: "PAID",
          transactionId: `TRX-${Date.now()}`,
          signature: "SIMULATED_TEST_SIGNATURE",
        }),
      });

      if (res.ok) {
        setPaymentStatus("PAID");
        setTimeout(() => {
          router.push(`/bookings/${bookingCode}`);
        }, 1500);
      }
    } catch {
      setPaymentStatus("PAID");
      setTimeout(() => {
        router.push(`/bookings/${bookingCode}`);
      }, 1500);
    } finally {
      setIsSimulating(false);
    }
  };

  const totalAmount = 250000;
  const mockVaNumber = "882019283100492";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-brand-700 tracking-tight">Nusabook</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-semibold text-slate-600">Instruksi Pembayaran</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Gateway Aman
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 md:p-8 flex-1 w-full space-y-6">
        {/* Countdown Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mb-3">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: "8s" }} />
            Selesaikan Dalam 20 Menit
          </div>
          <h1 className="text-sm text-slate-500 font-medium">Batas Waktu Pembayaran (TTL)</h1>
          <div className="text-4xl md:text-5xl font-extrabold text-brand-700 tracking-wider my-2 font-mono">
            {formatCountdown(timeLeftSeconds)}
          </div>
          <p className="text-xs text-slate-500">
            Kursi perjalanan Anda terkunci otomatis. Pembayaran akan kadaluarsa jika melewati waktu di atas.
          </p>
        </div>

        {/* Invoice Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs text-slate-400">Kode Booking</span>
              <p className="text-lg font-mono font-bold text-slate-900">{bookingCode}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Total Tagihan</span>
              <p className="text-2xl font-extrabold text-brand-700">{formatRupiah(totalAmount)}</p>
            </div>
          </div>

          {/* QRIS / VA Section */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <QrCode className="w-4 h-4 text-brand-700" />
                QRIS Dinamis / Virtual Account
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                Otomatis Terverifikasi
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
              {/* Mock QR */}
              <div className="w-36 h-36 bg-white p-3 rounded-xl border border-slate-300 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-28 h-28 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-mono p-2">
                  <div className="text-center">
                    <p className="text-[10px] text-accent-400 font-bold mb-1">QRIS NUSABOOK</p>
                    <p className="text-[9px] text-slate-300">Scan via BCA/Gopay/OVO/ShopeePay</p>
                  </div>
                </div>
              </div>

              {/* VA & Bank Instructions */}
              <div className="space-y-3 flex-1 w-full">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Nomor Virtual Account / Rekening Bank:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-base font-mono font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-300 text-slate-900 flex-1">
                      {mockVaNumber}
                    </code>
                    <button
                      onClick={() => handleCopy(mockVaNumber)}
                      className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copied ? "Tersalin!" : "Salin"}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>1. Buka aplikasi m-Banking atau e-Wallet pilihan Anda.</p>
                  <p>2. Pilih menu <strong>Transfer Virtual Account</strong> atau <strong>Scan QRIS</strong>.</p>
                  <p>3. Masukkan nominal tagihan tepat <strong>{formatRupiah(totalAmount)}</strong>.</p>
                  <p>4. Setelah berhasil, status pembayaran akan otomatis terverifikasi.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Simulation for Testing/MVP */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => router.refresh()}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Cek Status Pembayaran
            </button>

            <button
              onClick={handleSimulatePayment}
              disabled={isSimulating || paymentStatus === "PAID"}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
            >
              {isSimulating ? (
                <>Memverifikasi Pembayaran...</>
              ) : paymentStatus === "PAID" ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Pembayaran Berhasil!
                </>
              ) : (
                <>
                  Simulasi Pembayaran Berhasil (Uji Coba)
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {paymentStatus === "EXPIRED" && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold">Batas waktu pembayaran telah habis.</p>
              <p className="text-xs mt-0.5">
                Silakan lakukan pemesanan ulang untuk memilih jadwal perjalanan.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
