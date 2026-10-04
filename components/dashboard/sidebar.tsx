"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MaterialIcon } from "@/components/ui/icon";

interface SidebarProps {
  businessName?: string;
  agentSlug?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  businessName = "Pesona Merapi Tour & Travel",
  agentSlug = "pesona-merapi",
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems = [
    {
      name: "Ikhtisar Dashboard",
      href: "/dashboard",
      icon: "space_dashboard",
      exact: true,
      badge: null,
    },
    {
      name: "Jadwal & Alokasi Kuota",
      href: "/dashboard/schedules",
      icon: "calendar_month",
      exact: false,
      badge: null,
    },
    {
      name: "Manifes & Pemesanan",
      href: "/dashboard/schedules",
      icon: "badge",
      exact: false,
      badge: null,
    },
    {
      name: "Manajemen Paket Wisata",
      href: "/dashboard/packages",
      icon: "beach_access",
      exact: false,
      badge: null,
    },
    {
      name: "Keuangan & Escrow Vault",
      href: "/dashboard/escrow",
      icon: "account_balance_wallet",
      exact: false,
      badge: null,
    },
    {
      name: "Armada & Tour Leader",
      href: "#",
      icon: "directions_car",
      exact: false,
      badge: "Segera hadir",
      disabled: true,
    },
    {
      name: "Pengaturan Akun & Legalitas",
      href: "/dashboard/profile",
      icon: "settings",
      exact: false,
      badge: null,
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
    if (itemHref === "#") return false;
    if (exact) {
      return pathname === itemHref;
    }
    return pathname.startsWith(itemHref);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-on-surface/40 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Stitch Canonical Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col">
          {/* Header Brand */}
          <div className="p-space-lg bg-surface-container-lowest">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-space-sm mb-space-xs">
                <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-lg shadow-sm">
                  N
                </div>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-primary font-bold tracking-tight leading-none">
                    NusaBook
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant font-medium">
                    Operator Engine
                  </span>
                </div>
              </Link>
              {/* Close button on mobile */}
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
                aria-label="Tutup Menu"
              >
                <MaterialIcon name="close" className="text-xl" />
              </button>
            </div>

            {/* Operator Verification Chip */}
            <div className="mt-space-sm inline-flex items-center gap-space-xs bg-surface-container-high px-space-sm py-space-xs rounded-lg w-full">
              <MaterialIcon name="verified" className="text-primary text-base shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="font-micro-badge text-micro-badge text-on-surface font-semibold truncate max-w-[190px]">
                  {businessName}
                </span>
                <span className="font-caption text-caption text-primary font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  Terverifikasi Mitra UMKM
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-space-md mt-space-xs">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);

              if (item.disabled) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between px-space-md py-space-sm rounded-lg text-on-surface-variant/60 cursor-not-allowed select-none"
                  >
                    <div className="flex items-center gap-space-sm">
                      <MaterialIcon name={item.icon} className="text-xl" />
                      <span className="font-body-regular text-body-regular">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="font-micro-badge text-micro-badge px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant/80">
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-colors ${
                    active
                      ? "bg-primary-container text-on-primary font-body-semibold shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                >
                  <MaterialIcon name={item.icon} className="text-xl" />
                  <span className="font-body-regular text-body-regular">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Concurrency Box & Storefront Switcher */}
        <div className="p-space-md bg-surface-container-lowest mt-space-lg">
          <div className="bg-surface-container-low p-space-sm rounded-xl mb-space-sm flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-caption text-caption text-on-surface-variant font-medium">
                Mesin Konkurensi
              </span>
              <span className="inline-flex items-center gap-1 font-micro-badge text-micro-badge text-on-surface font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span> AKTIF
              </span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-caption text-caption">Sinkronisasi Realtime</span>
              <span className="font-micro-badge text-micro-badge text-primary font-bold">0 ms delay</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
              <MaterialIcon name="lock" className="text-sm text-primary" />
              <span className="font-caption text-caption text-on-surface font-medium">
                Pessimistic Quota Locked
              </span>
            </div>
          </div>

          {agentSlug && (
            <Link
              href={`/${agentSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors group"
            >
              <div className="flex items-center gap-space-xs">
                <MaterialIcon
                  name="storefront"
                  className="text-primary text-base group-hover:translate-x-0.5 transition-transform"
                />
                <span className="font-caption text-caption font-semibold">Switch ke Storefront</span>
              </div>
              <MaterialIcon name="open_in_new" className="text-sm text-on-surface-variant" />
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 w-full mt-space-sm py-2 px-space-sm text-caption font-semibold text-error hover:bg-error-container/20 rounded-lg transition-colors"
          >
            <MaterialIcon name="logout" className="text-base" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}
