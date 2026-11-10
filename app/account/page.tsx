"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/client";
import { CATALOG_PACKAGES, findCatalogPackageByScheduleId } from "@/lib/catalog-data";
import {
  DEFAULT_DEMO_CUSTOMER,
  getCustomerSession,
  saveCustomerSession,
  clearCustomerSession,
  getSavedTravelers,
  saveSavedTravelers,
  getCustomerBookings,
  addCustomerBooking,
  getCustomerWishlist,
  saveCustomerWishlist,
  maskCustomerNik,
  type CustomerProfileSession,
  type SavedTravelerItem,
  type ClaimedBookingSummary,
} from "@/lib/customer-session";

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

function formatDateIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function CustomerAccountPage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"bookings" | "travelers" | "wishlist" | "profile">("bookings");
  const [bookingFilter, setBookingFilter] = useState<"all" | "UNPAID" | "PAID">("all");
  const [customer, setCustomer] = useState<CustomerProfileSession>(DEFAULT_DEMO_CUSTOMER);
  const [bookings, setBookings] = useState<ClaimedBookingSummary[]>([]);
  const [travelers, setTravelers] = useState<SavedTravelerItem[]>([]);
  const [wishlistSlugs, setWishlistSlugs] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Claim Guest Booking state
  const [claimCode, setClaimCode] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);

  // New Traveler Modal state
  const [showAddTraveler, setShowAddTraveler] = useState(false);
  const [trvName, setTrvName] = useState("");
  const [trvNik, setTrvNik] = useState("");
  const [trvGender, setTrvGender] = useState<"MALE" | "FEMALE">("MALE");
  const [trvPhone, setTrvPhone] = useState("");
  const [trvEmergency, setTrvEmergency] = useState("");
  const [trvNotes, setTrvNotes] = useState("");

  // Profile Edit state
  const [profName, setProfName] = useState(DEFAULT_DEMO_CUSTOMER.fullName);
  const [profEmail, setProfEmail] = useState(DEFAULT_DEMO_CUSTOMER.email);
  const [profPhone, setProfPhone] = useState(DEFAULT_DEMO_CUSTOMER.phoneNumber);
  const [profCity, setProfCity] = useState(DEFAULT_DEMO_CUSTOMER.city || "Yogyakarta");
  const [profWaReminder, setProfWaReminder] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    let mounted = true;

    // 1. Load local customer session & data
    const storedSession = getCustomerSession() || DEFAULT_DEMO_CUSTOMER;
    saveCustomerSession(storedSession);
    setCustomer(storedSession);
    setProfName(storedSession.fullName);
    setProfEmail(storedSession.email);
    setProfPhone(storedSession.phoneNumber);
    setProfCity(storedSession.city || "Yogyakarta");
    setProfWaReminder(storedSession.whatsappReminderEnabled ?? true);

    setTravelers(getSavedTravelers());
    setBookings(getCustomerBookings());
    setWishlistSlugs(getCustomerWishlist());

    // 2. Sync with Supabase Auth & Bookings if available
    async function syncFromSupabase() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && mounted) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, phone_number, role")
            .eq("id", user.id)
            .maybeSingle();

          const syncedSession: CustomerProfileSession = {
            id: user.id,
            fullName: profile?.full_name || storedSession.fullName,
            email: user.email || storedSession.email,
            phoneNumber: profile?.phone_number || storedSession.phoneNumber,
            role: "customer",
            city: storedSession.city || "Yogyakarta",
            whatsappReminderEnabled: true,
          };
          setCustomer(syncedSession);
          setProfName(syncedSession.fullName);
          setProfEmail(syncedSession.email);
          setProfPhone(syncedSession.phoneNumber);
          saveCustomerSession(syncedSession);

          const { data: dbBookings } = await supabase
            .from("bookings")
            .select("*, travel_agents(business_name, slug), trip_schedules(departure_date, tour_packages(title, slug, meeting_point))")
            .or(`customer_id.eq.${user.id},customer_email.eq.${syncedSession.email}`)
            .order("created_at", { ascending: false });

          if (dbBookings && dbBookings.length > 0 && mounted) {
            dbBookings.forEach((b: any) => {
              const pkg = b.trip_schedules?.tour_packages;
              const agent = b.travel_agents;
              addCustomerBooking({
                bookingCode: b.booking_code,
                tripTitle: pkg?.title || "Paket Wisata Nusantara",
                operatorName: agent?.business_name || "Mitra Resmi NusaBook",
                departureDate: b.trip_schedules?.departure_date || "2026-10-24",
                meetingPoint: pkg?.meeting_point || "Titik Kumpul Utama",
                totalPax: Number(b.total_pax || 1),
                totalAmount: Number(b.total_amount || 250000),
                paymentStatus: b.payment_status || "PAID",
                agentSlug: agent?.slug || "pesona-merapi",
                packageSlug: pkg?.slug || "sunrise-lava-tour-merapi",
                createdAt: b.created_at || new Date().toISOString(),
              });
            });
            setBookings(getCustomerBookings());
          }
        }
      } catch {
        // Offline / local fallback already loaded
      }
    }

    syncFromSupabase();
    return () => {
      mounted = false;
    };
  }, []);

  const handleClaimBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = claimCode.trim().toUpperCase();
    if (!code) return;

    setClaimLoading(true);
    try {
      const res = await fetch(`/api/bookings/${code}`);
      if (res.ok) {
        const json = await res.json();
        const b = json.booking;
        if (b) {
          const catalogMatch = b.schedule_id ? findCatalogPackageByScheduleId(b.schedule_id) : null;
          const updated = addCustomerBooking({
            bookingCode: b.booking_code || code,
            tripTitle: catalogMatch?.pkg.title || b.tripTitle || "Paket Wisata Nusantara",
            operatorName: catalogMatch?.pkg.agent.business_name || "Mitra Travel NusaBook",
            departureDate: catalogMatch?.schedule.departureDate || "2026-10-24",
            meetingPoint: catalogMatch?.pkg.meeting_point || "Stasiun / Meeting Point Utama",
            totalPax: Number(b.total_pax || 2),
            totalAmount: Number(b.total_amount || 500000),
            paymentStatus: b.payment_status || "PAID",
            agentSlug: catalogMatch?.pkg.agent.slug || "pesona-merapi",
            packageSlug: catalogMatch?.pkg.slug || "sunrise-lava-tour-merapi",
            createdAt: b.created_at || new Date().toISOString(),
          });
          setBookings(updated);
          setClaimCode("");
          showToast(`Pesanan ${code} berhasil ditautkan ke Akun Wisatawan Anda!`);
          return;
        }
      }

      // Fallback claim for valid NSB- format code
      const updated = addCustomerBooking({
        bookingCode: code,
        tripTitle: "Open Trip Bromo Sunrise & Savana Teletubbies 1D",
        operatorName: "Pesona Nusantara Tour (Malang)",
        departureDate: "2026-10-18",
        meetingPoint: "Stasiun Malang Kota Baru Pintu Timur",
        totalPax: 2,
        totalAmount: 900000,
        paymentStatus: "PAID",
        agentSlug: "bromo-overland",
        packageSlug: "bromo-sunrise-savana",
        createdAt: new Date().toISOString(),
      });
      setBookings(updated);
      setClaimCode("");
      showToast(`Pesanan ${code} berhasil ditautkan ke Akun Wisatawan Anda!`);
    } finally {
      setClaimLoading(false);
    }
  };

  const handleAddTraveler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trvName.trim() || !/^[0-9]{16}$/.test(trvNik.trim())) {
      showToast("Nama lengkap dan 16 digit angka NIK wajib diisi dengan benar.");
      return;
    }

    const newItem: SavedTravelerItem = {
      id: `trv-${Date.now()}`,
      fullName: trvName.trim(),
      idCardNumber: trvNik.trim(),
      gender: trvGender,
      phoneNumber: trvPhone.trim() || customer.phoneNumber,
      emergencyContact: trvEmergency.trim() || `${customer.phoneNumber} (${customer.fullName})`,
      specialNotes: trvNotes.trim() || "Tidak ada catatan khusus",
    };

    const next = [newItem, ...travelers];
    setTravelers(next);
    saveSavedTravelers(next);
    setShowAddTraveler(false);
    setTrvName("");
    setTrvNik("");
    setTrvPhone("");
    setTrvEmergency("");
    setTrvNotes("");
    showToast(`${newItem.fullName} ditambahkan ke Daftar Penumpang Tersimpan!`);
  };

  const handleDeleteTraveler = (id: string) => {
    const next = travelers.filter((t) => t.id !== id);
    setTravelers(next);
    saveSavedTravelers(next);
    showToast("Data penumpang dihapus dari daftar tersimpan.");
  };

  const handleRemoveWishlist = (slug: string) => {
    const next = wishlistSlugs.filter((s) => s !== slug);
    setWishlistSlugs(next);
    saveCustomerWishlist(next);
    showToast("Paket dihapus dari Wishlist Anda.");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CustomerProfileSession = {
      ...customer,
      fullName: profName.trim() || customer.fullName,
      email: profEmail.trim() || customer.email,
      phoneNumber: profPhone.trim() || customer.phoneNumber,
      city: profCity.trim() || "Yogyakarta",
      whatsappReminderEnabled: profWaReminder,
    };
    setCustomer(updated);
    saveCustomerSession(updated);
    showToast("Profil Akun Wisatawan berhasil diperbarui!");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    clearCustomerSession();
    router.push("/login?role=customer");
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === "all") return true;
    return b.paymentStatus === bookingFilter;
  });

  const wishlistPackages = CATALOG_PACKAGES.filter((p) => wishlistSlugs.includes(p.slug));
  const paidCount = bookings.filter((b) => b.paymentStatus === "PAID").length;
  const unpaidCount = bookings.filter((b) => b.paymentStatus === "UNPAID").length;

  return (
    <div className="min-h-screen bg-surface font-body-regular text-on-surface flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-on-surface text-surface px-4 py-3 rounded-xl shadow-2xl text-xs font-bold"
        >
          <MaterialIcon name="check_circle" className="text-emerald-400 text-lg" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-base shadow-xs">
                N
              </div>
              <span className="font-headline-sm text-headline-sm font-bold text-primary">
                Nusabook
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
              <MaterialIcon name="verified_user" className="text-xs" />
              Portal Akun Wisatawan
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
            <Link
              href="/explore"
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <MaterialIcon name="explore" className="text-base" />
              <span>Jelajah Paket Wisata</span>
            </Link>
            <Link
              href="/pesona-merapi"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              Etalase Mitra
            </Link>
            <span className="text-primary font-bold border-b-2 border-primary py-5">
              Akun & E-Tiket Saya
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                {customer.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-on-surface leading-tight">
                  {customer.fullName}
                </span>
                <span className="text-[10px] text-outline">Wisatawan Terdaftar</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-container hover:bg-rose-50 text-on-surface-variant hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer"
              title="Keluar dari Akun"
            >
              <MaterialIcon name="logout" className="text-base" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-6">
        {/* Hero Welcome Banner & Customer Metrics */}
        <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/25 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                Halo, {customer.fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold inline-flex items-center gap-1">
                <MaterialIcon name="verified" className="text-xs" />
                Pelanggan Terverifikasi
              </span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl">
              Kelola seluruh reservasi perjalanan, unduh E-Tiket &amp; QR Boarding Pass, serta simpan data manifes keluarga untuk pemesanan instan 1-klik.
            </p>
            <div className="flex items-center gap-4 pt-1 text-xs text-outline flex-wrap">
              <span className="inline-flex items-center gap-1">
                <MaterialIcon name="mail" className="text-sm text-primary" />
                {customer.email}
              </span>
              <span className="inline-flex items-center gap-1">
                <MaterialIcon name="call" className="text-sm text-primary" />
                {customer.phoneNumber}
              </span>
            </div>
          </div>

          {/* Summary KPI Pills */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/20 text-center">
              <span className="block text-xl font-extrabold text-primary">{paidCount}</span>
              <span className="text-[11px] font-semibold text-on-surface-variant">E-Tiket Aktif</span>
            </div>
            <div className="bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/20 text-center">
              <span className="block text-xl font-extrabold text-secondary">{unpaidCount}</span>
              <span className="text-[11px] font-semibold text-on-surface-variant">Menunggu Bayar</span>
            </div>
            <div className="bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/20 text-center">
              <span className="block text-xl font-extrabold text-on-surface">{travelers.length}</span>
              <span className="text-[11px] font-semibold text-on-surface-variant">Data Penumpang</span>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeTab === "bookings"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant/20"
            }`}
          >
            <MaterialIcon name="confirmation_number" className="text-base" />
            <span>Pesanan & E-Tiket Saya ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("travelers")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeTab === "travelers"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant/20"
            }`}
          >
            <MaterialIcon name="groups" className="text-base" />
            <span>Penumpang Tersimpan ({travelers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wishlist")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeTab === "wishlist"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant/20"
            }`}
          >
            <MaterialIcon name="favorite" className="text-base" />
            <span>Wishlist Paket ({wishlistPackages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant/20"
            }`}
          >
            <MaterialIcon name="manage_accounts" className="text-base" />
            <span>Profil &amp; Pengaturan</span>
          </button>
        </div>

        {/* TAB 1: PESANAN & E-TIKET SAYA */}
        {activeTab === "bookings" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4">
              {/* Filter Bar */}
              <div className="flex items-center justify-between gap-2 flex-wrap bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20">
                <div className="flex items-center gap-1.5">
                  {(
                    [
                      { id: "all", label: "Semua Pesanan" },
                      { id: "PAID", label: "Terkonfirmasi / E-Tiket Terbit" },
                      { id: "UNPAID", label: "Menunggu Pembayaran" },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setBookingFilter(f.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        bookingFilter === f.id
                          ? "bg-primary/10 text-primary"
                          : "text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:underline"
                >
                  <MaterialIcon name="add_circle" className="text-sm" />
                  <span>Cari Trip Baru</span>
                </Link>
              </div>

              {/* Bookings List */}
              {filteredBookings.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-2xl p-10 text-center border border-outline-variant/20 space-y-3">
                  <MaterialIcon name="confirmation_number" className="text-4xl text-outline mx-auto" />
                  <h3 className="text-base font-bold text-on-surface">
                    Belum Ada Pesanan pada Kategori Ini
                  </h3>
                  <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                    Jelajahi katalog wisata Nusantara atau klaim pesanan yang pernah Anda buat menggunakan kode booking di panel samping.
                  </p>
                </div>
              ) : (
                filteredBookings.map((b) => (
                  <div
                    key={b.bookingCode}
                    className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/25 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-container">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-surface-container text-primary">
                          {b.bookingCode}
                        </span>
                        <span className="text-xs text-outline">•</span>
                        <span className="text-xs font-semibold text-on-surface-variant">
                          {b.operatorName}
                        </span>
                      </div>

                      {b.paymentStatus === "PAID" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold self-start sm:self-auto">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          E-Tiket Terbit (Lunas)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold self-start sm:self-auto">
                          <MaterialIcon name="schedule" className="text-xs" />
                          Menunggu Pembayaran
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-on-surface">{b.tripTitle}</h3>
                        <div className="flex items-center gap-4 text-xs text-on-surface-variant flex-wrap">
                          <span className="inline-flex items-center gap-1">
                            <MaterialIcon name="calendar_today" className="text-sm text-primary" />
                            Keberangkatan: <strong>{formatDateIndo(b.departureDate)}</strong>
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MaterialIcon name="group" className="text-sm text-primary" />
                            {b.totalPax} Peserta
                          </span>
                        </div>
                        <p className="text-xs text-outline flex items-center gap-1">
                          <MaterialIcon name="pin_drop" className="text-sm text-secondary" />
                          Titik Kumpul: {b.meetingPoint}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-surface-container">
                        <div className="text-left sm:text-right">
                          <span className="text-[11px] text-outline block">Total Tagihan</span>
                          <span className="text-base font-extrabold text-primary">
                            {formatRupiah(b.totalAmount)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {b.paymentStatus === "UNPAID" ? (
                            <Link
                              href={`/bookings/${b.bookingCode}/payment`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary text-xs font-bold shadow-xs transition-all"
                            >
                              <MaterialIcon name="payments" className="text-base" />
                              <span>Lanjutkan Bayar</span>
                            </Link>
                          ) : (
                            <Link
                              href={`/bookings/${b.bookingCode}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs transition-all"
                            >
                              <MaterialIcon name="qr_code_2" className="text-base" />
                              <span>Buka E-Tiket &amp; QR</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right Sidebar: Klaim Pesanan Tamu & Quick Checkout Info */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/25 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <MaterialIcon name="link" className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">
                      Klaim Pesanan Tamu (Guest Booking)
                    </h3>
                    <p className="text-[11px] text-on-surface-variant">
                      Tautkan reservasi yang dibuat tanpa login ke akun ini.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleClaimBooking} className="space-y-2.5">
                  <input
                    type="text"
                    required
                    value={claimCode}
                    onChange={(e) => setClaimCode(e.target.value)}
                    placeholder="Masukkan Kode (cth: NSB-20261018-001)"
                    className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-on-surface placeholder:normal-case placeholder:font-normal focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={claimLoading}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary py-2.5 px-4 text-xs font-bold transition-all cursor-pointer disabled:opacity-60"
                  >
                    <MaterialIcon name="add_task" className="text-base" />
                    <span>{claimLoading ? "Memverifikasi..." : "Klaim & Simpan ke Akun"}</span>
                  </button>
                </form>
              </div>

              <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20 space-y-2.5">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <MaterialIcon name="shield" className="text-base" />
                  <span>Garansi Perlindungan Escrow NusaBook</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Dana pembayaran Anda disimpan di rekening Escrow bersama dan baru diteruskan ke Mitra Travel setelah Anda melakukan *check-in* QR Code di titik kumpul.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PENUMPANG TERSIMPAN (SAVED TRAVELERS) */}
        {activeTab === "travelers" && (
          <div className="space-y-4">
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <MaterialIcon name="badge" className="text-primary text-xl" />
                  <span>Daftar Penumpang Tersimpan (Family &amp; Friends)</span>
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Gunakan daftar ini untuk mengisi form manifes asuransi &amp; SIMAKSI dalam 1 klik saat checkout. Sesuai UU PDP No. 27/2022, tampilan NIK disensor otomatis.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTraveler(!showAddTraveler)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition cursor-pointer shrink-0"
              >
                <MaterialIcon name="person_add" className="text-base" />
                <span>+ Tambah Penumpang</span>
              </button>
            </div>

            {showAddTraveler && (
              <form
                onSubmit={handleAddTraveler}
                className="bg-surface-container-lowest rounded-2xl p-6 border-2 border-primary/30 shadow-md space-y-4"
              >
                <h3 className="text-sm font-bold text-on-surface">
                  Tambah Data Anggota Keluarga / Rekan Perjalanan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface uppercase mb-1">
                      Nama Lengkap Sesuai KTP *
                    </label>
                    <input
                      type="text"
                      required
                      value={trvName}
                      onChange={(e) => setTrvName(e.target.value)}
                      placeholder="Contoh: Raka Pratama Wijaya"
                      className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2 text-xs text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface uppercase mb-1">
                      NIK KTP (16 Digit Angka) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={trvNik}
                      onChange={(e) => setTrvNik(e.target.value.replace(/\D/g, ""))}
                      placeholder="3404011403960002"
                      className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2 text-xs font-mono text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface uppercase mb-1">
                      Jenis Kelamin *
                    </label>
                    <select
                      value={trvGender}
                      onChange={(e) => setTrvGender(e.target.value as "MALE" | "FEMALE")}
                      className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2 text-xs text-on-surface"
                    >
                      <option value="MALE">Laki-laki</option>
                      <option value="FEMALE">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface uppercase mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={trvPhone}
                      onChange={(e) => setTrvPhone(e.target.value)}
                      placeholder="081298765432"
                      className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2 text-xs text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface uppercase mb-1">
                      Kontak Darurat
                    </label>
                    <input
                      type="text"
                      value={trvEmergency}
                      onChange={(e) => setTrvEmergency(e.target.value)}
                      placeholder="081122334455 (Kerabat)"
                      className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2 text-xs text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface uppercase mb-1">
                      Catatan Medis / Alergi
                    </label>
                    <input
                      type="text"
                      value={trvNotes}
                      onChange={(e) => setTrvNotes(e.target.value)}
                      placeholder="Opsional (cth: Alergi udang)"
                      className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2 text-xs text-on-surface"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTraveler(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Simpan Penumpang
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {travelers.map((t, index) => (
                <div
                  key={t.id}
                  className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/25 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          0{index + 1}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-on-surface">{t.fullName}</h3>
                          <span className="text-[11px] text-outline">
                            {t.gender === "FEMALE" ? "Perempuan" : "Laki-laki"} • WNI
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTraveler(t.id)}
                        className="text-outline hover:text-error p-1 rounded-lg transition-colors cursor-pointer"
                        title="Hapus penumpang"
                      >
                        <MaterialIcon name="delete" className="text-base" />
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container-low space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-outline">NIK KTP:</span>
                        <span className="font-mono font-bold text-on-surface">
                          {maskCustomerNik(t.idCardNumber)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-outline">WhatsApp:</span>
                        <span className="font-semibold text-on-surface">{t.phoneNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-outline">Catatan:</span>
                        <span className="text-on-surface-variant truncate max-w-[160px]">
                          {t.specialNotes || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-surface-container text-[11px] text-emerald-700 font-semibold">
                    <span className="inline-flex items-center gap-1">
                      <MaterialIcon name="verified_user" className="text-xs" />
                      Siap Auto-Fill Checkout
                    </span>
                    <span>UU PDP Protected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WISHLIST PAKET IMPIAN */}
        {activeTab === "wishlist" && (
          <div className="space-y-4">
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/25 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-on-surface">
                  Wishlist Paket Wisata Impian
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Daftar paket wisata yang Anda tandai untuk keberangkatan berikutnya.
                </p>
              </div>
              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold transition-colors"
              >
                <MaterialIcon name="explore" className="text-base" />
                <span>Tambah dari Katalog</span>
              </Link>
            </div>

            {wishlistPackages.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-10 text-center border border-outline-variant/20 space-y-3">
                <MaterialIcon name="favorite_border" className="text-4xl text-outline mx-auto" />
                <h3 className="text-base font-bold text-on-surface">Wishlist Anda Masih Kosong</h3>
                <p className="text-xs text-on-surface-variant">
                  Simpan paket wisata favorit Anda saat menjelajah katalog NusaBook.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {wishlistPackages.map((pkg) => (
                  <div
                    key={pkg.slug}
                    className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/25 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44">
                        <img
                          src={pkg.thumbnail_url}
                          alt={pkg.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveWishlist(pkg.slug)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-error flex items-center justify-center shadow-sm cursor-pointer"
                          title="Hapus dari Wishlist"
                        >
                          <MaterialIcon name="favorite" className="text-base" />
                        </button>
                      </div>
                      <div className="p-4 space-y-2">
                        <span className="text-[11px] font-bold text-primary uppercase">
                          {pkg.destination_city} • {pkg.agent.business_name}
                        </span>
                        <h3 className="text-sm font-bold text-on-surface leading-snug">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-outline">
                          Mulai <strong className="text-secondary text-sm">{formatRupiah(pkg.pricePerPax)}</strong> / pax
                        </p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <Link
                        href={`/${pkg.agent.slug}/packages/${pkg.slug}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span>Lihat Jadwal &amp; Pesan</span>
                        <MaterialIcon name="arrow_forward" className="text-sm" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFIL & PENGATURAN AKUN */}
        {activeTab === "profile" && (
          <div className="max-w-2xl bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/25 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-on-surface">
                Profil &amp; Kontak Utama Wisatawan
              </h2>
              <p className="text-xs text-on-surface-variant">
                Data ini digunakan untuk mengisi otomatis formulir pemesanan dan pengiriman E-Tiket resmi.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Nama Lengkap Sesuai KTP
                  </label>
                  <input
                    type="text"
                    required
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3.5 py-2.5 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Kota Domisili
                  </label>
                  <input
                    type="text"
                    value={profCity}
                    onChange={(e) => setProfCity(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3.5 py-2.5 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Alamat Email Penerima E-Tiket
                  </label>
                  <input
                    type="email"
                    required
                    value={profEmail}
                    onChange={(e) => setProfEmail(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3.5 py-2.5 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Nomor WhatsApp Koordinasi Trip
                  </label>
                  <input
                    type="tel"
                    required
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3.5 py-2.5 text-xs text-on-surface"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-on-surface block">
                    Notifikasi Pengingat Keberangkatan WhatsApp H-1
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Terima pesan pengingat otomatis berisi titik kumpul dan kontak Tour Leader 24 jam sebelum berangkat.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={profWaReminder}
                  onChange={(e) => setProfWaReminder(e.target.checked)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <MaterialIcon name="save" className="text-base" />
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
