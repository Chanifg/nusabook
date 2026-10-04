import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MaterialIcon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Super Admin Portal • Nusabook P2MW",
  description:
    "Konsol Super Admin Nusabook P2MW Kemdikbudristek • Monitoring Ekosistem SaaS & Marketplace, Verifikasi Mitra, dan Escrow Ledger.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone_number, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "superadmin") {
    redirect("/dashboard");
  }

  const adminName = profile?.full_name || "Achmad Chanif";
  const initials =
    adminName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SA";

  return (
    <div className="min-h-screen bg-surface font-body-regular text-on-surface antialiased flex">
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-surface-container-low border-r border-outline-variant/30 z-50 flex flex-col justify-between shadow-sm">
        <div className="flex flex-col">
          {/* Header Branding */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-outline-variant/20 bg-surface/50 backdrop-blur-md">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm font-bold text-base">
                N
              </div>
              <div>
                <span className="font-bold text-base text-primary tracking-tight block leading-none">
                  Nusabook
                </span>
                <span className="text-[11px] text-on-surface-variant font-medium">
                  Super Admin Console
                </span>
              </div>
            </Link>
            <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container border border-secondary/20 rounded text-[10px] font-bold tracking-wide uppercase">
              P2MW Ops
            </span>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-5">
            <p className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-wider mb-2 px-3">
              Menu Utama
            </p>
            <nav className="flex flex-col gap-1 text-sm font-medium">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary text-on-primary font-semibold shadow-sm transition-all"
              >
                <MaterialIcon name="dashboard" className="text-xl" />
                <span>Platform Overview</span>
              </Link>
              <a
                href="#kyc"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
              >
                <MaterialIcon name="verified_user" className="text-xl text-on-surface-variant/70" />
                <span>Verifikasi Mitra</span>
              </a>
              <a
                href="#payout"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
              >
                <MaterialIcon name="account_balance_wallet" className="text-xl text-on-surface-variant/70" />
                <span>Ledger & Payout 2%</span>
              </a>
              <a
                href="#transactions"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
              >
                <MaterialIcon name="receipt_long" className="text-xl text-on-surface-variant/70" />
                <span>Manajemen Transaksi</span>
              </a>
              <a
                href="#audit"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
              >
                <MaterialIcon name="security" className="text-xl text-on-surface-variant/70" />
                <span>Audit Log & Keamanan</span>
              </a>
              <a
                href="#settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
              >
                <MaterialIcon name="tune" className="text-xl text-on-surface-variant/70" />
                <span>Pengaturan Platform</span>
              </a>
            </nav>
          </div>
        </div>

        {/* SLA & Node Status Footer */}
        <div className="p-4 bg-surface-container border border-outline-variant/30 m-4 rounded-xl">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <MaterialIcon name="dns" className="text-sm text-primary" />
              SLA & Node
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs text-on-surface font-semibold">
            Node Pusat Jakarta ID-JKT01
          </p>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            99.98% operational uptime.
          </p>
        </div>
      </aside>

      {/* Main Container with Left Margin for Sidebar */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-40 h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-6 flex-1 max-w-xl">
            <div className="flex items-center bg-surface-container-low px-3.5 py-2 rounded-xl w-full gap-2 border border-outline-variant/30 focus-within:border-primary focus-within:bg-surface transition-all">
              <MaterialIcon name="search" className="text-xl text-on-surface-variant/60 shrink-0" />
              <input
                type="text"
                placeholder="Cari mitra, booking ID, nomor rekening..."
                className="bg-transparent border-none outline-none text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 w-full"
              />
            </div>

            <div className="hidden xl:flex items-center gap-3 text-xs text-on-surface-variant shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>DB 3NF: Operational</span>
              </div>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Midtrans: Active</span>
              </div>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>WA Engine: Ready</span>
              </div>
            </div>
          </div>

          {/* Right Header: Actions & Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
                title="Notifikasi Operasional"
              >
                <MaterialIcon name="notifications" className="text-xl" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              </button>
              <button
                type="button"
                className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
                title="Pusat Bantuan Teknis"
              >
                <MaterialIcon name="help_outline" className="text-xl" />
              </button>
            </div>

            <div className="h-7 w-px bg-outline-variant/30" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-on-surface leading-tight">
                  {adminName}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  CEO / Super Admin
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-sm">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8 bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
}
