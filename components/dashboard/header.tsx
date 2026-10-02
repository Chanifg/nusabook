"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Menu,
  ShieldCheck,
  ExternalLink,
  LogOut,
  User,
  Compass,
} from "lucide-react";

interface HeaderProps {
  businessName?: string;
  userName?: string;
  userEmail?: string;
  agentSlug?: string;
  isVerified?: boolean;
  onOpenMobileMenu?: () => void;
}

export function Header({
  businessName = "Pesona Merapi Tour & Travel",
  userName = "Mitra Nusabook",
  userEmail,
  agentSlug,
  isVerified = true,
  onOpenMobileMenu,
}: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  // Generate 2-letter initials
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "MB";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Toggle + Breadcrumb/Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Buka menu navigasi"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {businessName}
            </h1>
            {isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60 shrink-0">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span className="hidden sm:inline">Terverifikasi</span>
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500 hidden sm:block">
            Panel Pengelolaan Operasional Tour & Travel
          </span>
        </div>
      </div>

      {/* Right: Quick Storefront Link + User Profile + Logout */}
      <div className="flex items-center gap-2 sm:gap-4">
        {agentSlug && (
          <Link
            href={`/${agentSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-700 hover:border-brand-100 transition-colors shadow-sm"
          >
            <span>Lihat Storefront</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        )}

        {/* User Card */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-xs font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">
              {userName}
            </span>
            {userEmail && (
              <span className="text-[11px] text-slate-500 leading-tight max-w-[140px] truncate">
                {userEmail}
              </span>
            )}
          </div>

          {/* Quick Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar Akun"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            aria-label="Keluar akun"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
