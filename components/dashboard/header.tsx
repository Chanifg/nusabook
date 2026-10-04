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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left: Mobile Toggle + Breadcrumb / Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Buka menu navigasi"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex items-center bg-slate-100/80 px-3.5 py-2 rounded-xl w-full gap-2 border border-slate-200 focus-within:border-brand-500 focus-within:bg-white transition-all">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari paket wisata, nomor booking, nama tamu..."
            className="bg-transparent border-none outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 w-full"
          />
        </div>

        {/* Mobile Header Title */}
        <div className="flex flex-col md:hidden">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 truncate max-w-[200px]">
              {businessName}
            </h1>
            {isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200 shrink-0">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span>Verified</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Notifications + Storefront Link + User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title="Notifikasi Pesanan"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {agentSlug && (
          <Link
            href={`/${agentSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-700 hover:border-brand-100 transition-colors shadow-sm"
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
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {userName}
            </span>
            <span className="text-[11px] text-slate-500 leading-tight">
              Admin Mitra
            </span>
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

