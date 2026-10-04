"use client";

import { MaterialIcon } from "@/components/ui/icon";

interface HeaderProps {
  businessName?: string;
  userName?: string;
  userEmail?: string;
  agentSlug?: string;
  isVerified?: boolean;
  escrowBalanceFormatted?: string;
  onOpenMobileMenu?: () => void;
}

export function Header({
  businessName = "Pesona Merapi Tour & Travel",
  userName = "Mitra Operasional",
  escrowBalanceFormatted = "Rp 42.850.000",
  onOpenMobileMenu,
}: HeaderProps) {
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "MO";

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-md sm:px-space-lg">
      <div className="flex items-center gap-space-md sm:gap-space-lg">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          aria-label="Buka navigasi"
        >
          <MaterialIcon name="menu" className="text-2xl" />
        </button>

        {/* Breadcrumb on large displays */}
        <div className="hidden xl:flex items-center gap-space-xs font-caption text-caption text-on-surface-variant">
          <span className="text-on-surface-variant">Mitra Operator</span>
          <MaterialIcon name="chevron_right" className="text-xs" />
          <span className="text-on-surface-variant truncate max-w-[150px]">{businessName}</span>
          <MaterialIcon name="chevron_right" className="text-xs" />
          <span className="text-primary font-semibold">Ikhtisar Dashboard</span>
        </div>

        {/* Global Search */}
        <div className="relative flex items-center w-48 sm:w-64 md:w-80 lg:w-96">
          <MaterialIcon
            name="search"
            className="absolute left-space-sm text-outline text-lg pointer-events-none"
          />
          <input
            type="text"
            placeholder="Cari booking, jadwal, peserta..."
            className="w-full pl-9 pr-space-sm py-space-xs rounded-lg bg-surface-container-low text-on-surface placeholder-on-surface-variant text-body-regular font-body-regular outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-space-xs sm:gap-space-md">
        {/* Highlight Badge */}
        <div className="hidden md:flex items-center gap-space-xs bg-secondary-fixed text-on-secondary-fixed px-space-sm py-space-xs rounded-full shadow-sm">
          <MaterialIcon name="wb_sunny" className="text-sm text-secondary" />
          <span className="font-micro-badge text-micro-badge font-bold uppercase tracking-wider">
            Musim Ramai
          </span>
        </div>

        {/* Escrow Vault Pill */}
        <div className="hidden sm:flex items-center gap-space-xs bg-primary-fixed text-on-primary-fixed px-space-sm py-space-xs rounded-lg">
          <MaterialIcon name="verified_user" className="text-base text-primary" />
          <div className="flex flex-col text-left">
            <span className="font-micro-badge text-micro-badge uppercase tracking-wider text-on-primary-fixed-variant">
              Escrow Vault
            </span>
            <span className="font-caption text-caption font-bold text-primary">
              {escrowBalanceFormatted}
            </span>
          </div>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifikasi Pemesanan"
          className="relative p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
        >
          <MaterialIcon name="notifications" className="text-xl" />
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-container font-micro-badge text-micro-badge text-on-primary font-bold">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-space-sm pl-space-xs sm:pl-space-sm">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shadow-sm">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-body-semibold text-body-semibold leading-tight text-on-surface">
              {userName}
            </span>
            <span className="font-caption text-caption text-on-surface-variant">Operations Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
}
