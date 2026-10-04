import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutGrid,
  ShieldCheck,
  Wallet,
  Receipt,
  ShieldAlert,
  Sliders,
  Search,
  Bell,
  HelpCircle,
  User,
  Server,
  Activity,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Super Admin Portal - Nusabook",
  description:
    "Konsol Super Admin Nusabook P2MW Kemdikbudristek - Monitoring Ekosistem SaaS & Marketplace, Verifikasi Mitra, dan Escrow Ledger.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 z-50 flex flex-col justify-between shadow-sm">
        <div className="flex flex-col">
          {/* Header Branding */}
          <div className="h-16 px-6 flex items-center justify-between bg-slate-50/80 border-b border-slate-200">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center text-white shadow-sm font-bold text-sm">
                NB
              </div>
              <div>
                <span className="font-bold text-base text-brand-900 tracking-tight block leading-none">
                  Nusabook
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  SuperAdmin
                </span>
              </div>
            </Link>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded text-[10px] font-extrabold tracking-wide uppercase">
              P2MW Ops
            </span>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
              Menu Utama
            </p>
            <nav className="flex flex-col gap-1 text-sm font-medium">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-brand-700 text-white font-semibold shadow-sm transition-all"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Platform Overview</span>
              </Link>
              <a
                href="#kyc"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Verifikasi Mitra</span>
              </a>
              <a
                href="#payout"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Wallet className="w-4 h-4 text-slate-400" />
                <span>Ledger & Payout 2%</span>
              </a>
              <a
                href="#transactions"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Receipt className="w-4 h-4 text-slate-400" />
                <span>Manajemen Transaksi</span>
              </a>
              <a
                href="#audit"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                <span>Audit Log & Security</span>
              </a>
              <a
                href="#settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Sliders className="w-4 h-4 text-slate-400" />
                <span>Pengaturan Platform</span>
              </a>
            </nav>
          </div>
        </div>

        {/* SLA & Node Status Footer */}
        <div className="p-4 bg-slate-50 border border-slate-200 m-4 rounded-xl">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3 h-3 text-slate-400" />
              SLA & Node
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Node Pusat Jakarta ID-JKT01
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            99.98% operational uptime.
          </p>
        </div>
      </aside>

      {/* Main Container with Left Margin for Sidebar */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-6 flex-1 max-w-xl">
            <div className="flex items-center bg-slate-100/80 px-3.5 py-2 rounded-xl w-full gap-2 border border-slate-200 focus-within:border-brand-500 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Cari mitra, booking ID, nomor rekening..."
                className="bg-transparent border-none outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 w-full"
              />
            </div>

            <div className="hidden xl:flex items-center gap-3 text-xs text-slate-500 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>DB 3NF: Operational</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Midtrans: Active</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>WA API: Normal</span>
              </div>
            </div>
          </div>

          {/* Right Header: Actions & Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                title="Notifikasi Operasional"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
              <button
                type="button"
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                title="Pusat Bantuan Teknis"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="h-7 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Achmad Chanif
                </p>
                <p className="text-[11px] text-slate-500">
                  CEO / Super Admin
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                AC
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
