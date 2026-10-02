import Link from "next/link";
import { Compass, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-16 text-center max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-6 border border-brand-100">
        <Compass className="w-4 h-4 text-brand-700 animate-pulse" />
        P2MW 2026: Digitalisasi UMKM Wisata
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
        Modernisasi Bisnis Tour & Travel dengan{" "}
        <span className="text-brand-700">Nusabook</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
        SaaS-Enabled Marketplace pertama di Indonesia untuk otomatisasi kuota perjalanan, katalog no-code, dan pembukuan transparan tanpa biaya awal.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12 text-left">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No-Code Storefront</h3>
          <p className="text-sm text-slate-600">
            Dapatkan website katalog mandiri dalam hitungan menit untuk menjangkau wisatawan online.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent-500 mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Anti Overbooking</h3>
          <p className="text-sm text-slate-600">
            Mesin penguncian kuota kursi otomatis secara realtime dengan garansi keamanan konkurensi.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Zero Upfront Cost</h3>
          <p className="text-sm text-slate-600">
            Skema komisi 2% per transaksi berhasil tanpa beban biaya berlangganan bulanan di awal.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/explore"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-700 hover:bg-brand-900 text-white font-medium shadow-sm transition"
        >
          Jelajahi Portal Wisata
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/pesona-merapi"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-medium shadow-sm transition"
        >
          Lihat Storefront Mitra
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
