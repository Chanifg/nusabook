"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  Store,
  LogOut,
  ExternalLink,
  X,
  Plus,
} from "lucide-react";


interface SidebarProps {
  businessName?: string;
  agentSlug?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  businessName = "Mitra Tour & Travel",
  agentSlug,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Paket Wisata",
      href: "/dashboard/packages",
      icon: Package,
      exact: false,
    },
    {
      name: "Jadwal & Kuota",
      href: "/dashboard/schedules",
      icon: CalendarDays,
      exact: false,
    },
    {
      name: "Profil Usaha",
      href: "/dashboard/profile",
      icon: Store,
      exact: false,
    },
  ];

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

  const isActive = (itemHref: string, exact: boolean) => {
    if (exact) {
      return pathname === itemHref;
    }
    return pathname.startsWith(itemHref);
  };

  // Generate 2-letter initials
  const initials = businessName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "NB";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-sm",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6 bg-slate-50/50">
          <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-extrabold text-sm border border-brand-100 shrink-0">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold tracking-tight text-slate-900 truncate">
                {businessName}
              </span>
              <span className="text-[11px] font-semibold tracking-wide text-slate-500">
                Agency Dashboard
              </span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Storefront Link Chip */}
        {agentSlug && (
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">Toko Online:</span>
            <Link
              href={`/${agentSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900 transition-colors"
            >
              <span>/{agentSlug}</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150",
                  active
                    ? "bg-brand-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 space-y-2 mt-auto">
          <Link
            href="/dashboard/packages/new"
            className="w-full bg-accent-500 hover:bg-accent-600 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Paket Wisata</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}

