"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/icon";

export interface ScheduleOption {
  id: string;
  dateText: string;
  departureTime: string;
  availableSeats: number;
  status: "urgent" | "available" | "sold_out";
  statusBadge: string;
  isSoldOut: boolean;
  pricePerPax: number;
}

export interface PackageDetailViewProps {
  slug: string;
  packageSlug: string;
  agent: {
    id: string;
    business_name: string;
    city?: string | null;
    whatsapp_number?: string | null;
    slug: string;
  };
  pkg: {
    id: string;
    title: string;
    slug: string;
    category: string;
    destination_city: string;
    duration_days: number;
    duration_nights: number;
    description: string | null;
    meeting_point?: string | null;
    facilities_included?: string[] | null;
    facilities_excluded?: string[] | null;
    itinerary?: any;
    thumbnail_url?: string | null;
    gallery_urls?: string[] | null;
  };
  schedules: ScheduleOption[];
}

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export function PackageDetailView({
  slug,
  packageSlug,
  agent,
  pkg,
  schedules,
}: PackageDetailViewProps) {
  const router = useRouter();

  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(
    schedules[0]?.id || ""
  );
  const [paxCount, setPaxCount] = useState<number>(2);
  const [reviewFilter, setReviewFilter] = useState<"all" | "photo" | "star5">("all");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedSchedule =
    schedules.find((s) => s.id === selectedScheduleId) || schedules[0] || null;

  const pricePerPax = selectedSchedule?.pricePerPax || 450000;
  const originalPrice = Math.round(pricePerPax * 1.22);
  const maxAllowedPax = selectedSchedule
    ? selectedSchedule.isSoldOut
      ? 1
      : Math.max(1, selectedSchedule.availableSeats)
    : 1;

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined" && navigator?.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setToastMessage("Tautan paket berhasil disalin ke papan klip!");
      } else {
        setToastMessage("Tautan paket siap dibagikan.");
      }
    } catch {
      setToastMessage("Tautan paket siap dibagikan.");
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      setToastMessage(
        next ? "Paket disimpan ke daftar impian Anda." : "Paket dihapus dari daftar impian."
      );
      setTimeout(() => setToastMessage(null), 3500);
      return next;
    });
  };

  const handleSelectSchedule = (schedule: ScheduleOption) => {
    if (schedule.isSoldOut) return;
    setSelectedScheduleId(schedule.id);
    if (paxCount > schedule.availableSeats) {
      setPaxCount(Math.max(1, schedule.availableSeats));
    }
  };

  const handleIncrementPax = () => {
    if (paxCount < maxAllowedPax) {
      setPaxCount((prev) => prev + 1);
    }
  };

  const handleDecrementPax = () => {
    if (paxCount > 1) {
      setPaxCount((prev) => prev - 1);
    }
  };

  const subtotal = paxCount * pricePerPax;

  const handleBooking = () => {
    router.push(
      `/${slug}/booking?trip=${packageSlug}&scheduleId=${selectedScheduleId}&pax=${paxCount}`
    );
  };

  const waPhone = agent.whatsapp_number?.replace(/[^0-9]/g, "") || "6281234567890";
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Halo ${agent.business_name}, saya tertarik tanya paket ${pkg.title}`
  )}`;

  return (
    <div className="bg-background font-body-regular text-on-surface antialiased min-h-screen flex flex-col">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-on-surface text-surface shadow-2xl text-body-regular font-body-semibold"
        >
          <MaterialIcon name="info" className="text-secondary text-[20px]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <Link className="flex items-center gap-space-sm" href="/">
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
                N
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                Nusabook
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-space-xs text-caption text-on-surface-variant font-caption">
              <span>/</span>
              <Link className="hover:text-primary transition-colors" href="/explore">
                Katalog Wisata
              </Link>
              <span>/</span>
              <Link className="hover:text-primary transition-colors" href={`/${slug}`}>
                {agent.business_name}
              </Link>
              <span>/</span>
              <span className="text-on-surface font-body-semibold truncate max-w-xs">
                {pkg.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <Link
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-body-semibold text-caption transition-colors font-bold"
              href={`/${slug}`}
            >
              <MaterialIcon name="storefront" className="text-sm" />
              <span>Etalase Operator</span>
            </Link>
            <Link
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-semibold text-caption shadow-sm transition-all font-bold"
              href="/dashboard"
            >
              <MaterialIcon name="dashboard" className="text-sm" />
              <span>Portal Mitra</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 pt-16">
        <div className="flex flex-col gap-0">
          {/* Breadcrumb & Title Hero Header */}
          <section className="w-full bg-surface-container-lowest border-b border-surface-container-low px-6 lg:px-12 py-space-md">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-micro-badge text-micro-badge font-bold uppercase tracking-wider">
                      {pkg.category === "private_trip" ? "PRIVATE CHARTER" : "OPEN TRIP RESMI"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-micro-badge text-micro-badge font-bold">
                      <MaterialIcon name="verified" className="text-[14px]" />
                      Operator Terverifikasi
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-micro-badge text-micro-badge font-mono">
                      {pkg.duration_days} Hari {pkg.duration_nights > 0 ? `${pkg.duration_nights} Malam` : ""}
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                    {pkg.title}
                  </h1>
                  <div className="flex items-center gap-space-md mt-1.5 text-caption text-on-surface-variant flex-wrap">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <MaterialIcon name="star" className="text-[18px] fill-current" />
                      <span>4.9</span>
                      <span className="text-on-surface-variant font-normal">(128 Ulasan Terverifikasi)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MaterialIcon name="pin_drop" className="text-[18px] text-outline" />
                      <span>{pkg.destination_city}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MaterialIcon name="storefront" className="text-[18px] text-primary" />
                      <span>Operator:</span>
                      <Link
                        className="font-body-semibold text-primary underline underline-offset-4 hover:text-primary-container font-bold"
                        href={`/${slug}`}
                      >
                        {agent.business_name}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Social Action Buttons */}
                <div className="flex items-center gap-space-xs">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none text-on-surface text-body-regular font-body-semibold transition-all font-bold cursor-pointer"
                    type="button"
                    title="Bagikan tautan paket"
                  >
                    <MaterialIcon name="share" className="text-[18px]" />
                    <span className="hidden sm:inline">Bagikan</span>
                  </button>
                  <button
                    onClick={handleToggleSave}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-surface-container-high focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none text-on-surface text-body-regular font-body-semibold transition-all font-bold cursor-pointer ${
                      isSaved ? "bg-error/10 text-error" : "bg-surface-container text-on-surface"
                    }`}
                    type="button"
                    title={isSaved ? "Hapus dari paket tersimpan" : "Simpan paket ke daftar impian"}
                  >
                    <MaterialIcon
                      name={isSaved ? "favorite" : "favorite_border"}
                      className={`text-[18px] ${isSaved ? "text-error" : ""}`}
                    />
                    <span className="hidden sm:inline">{isSaved ? "Tersimpan" : "Simpan"}</span>
                  </button>
                  <a
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#10b981] hover:bg-[#059669] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none text-white text-body-regular font-body-semibold shadow-sm transition-all font-bold"
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MaterialIcon name="chat" className="text-[18px]" />
                    <span>Tanya Operator</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Hero Bento Gallery Section */}
          <section className="w-full bg-surface-container-lowest px-6 lg:px-12 pb-space-lg">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-space-sm h-auto lg:h-[480px]">
              <div className="relative md:col-span-4 lg:col-span-7 h-72 md:h-96 lg:h-full rounded-xl overflow-hidden group shadow-md">
                <img
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={
                    pkg.thumbnail_url ||
                    "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80"
                  }
                  fetchPriority="high"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-primary/90 text-on-primary font-micro-badge text-micro-badge px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Foto Utama
                  </span>
                  <p className="font-title-md text-title-md font-bold mt-1">
                    Panorama {pkg.destination_city}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:col-span-5 gap-space-sm h-full">
                <div className="relative rounded-xl overflow-hidden group h-36 md:h-44 lg:h-full shadow-sm">
                  <img
                    alt="Gallery 1"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-white font-caption text-caption text-[11px]">
                    Armada Jeep 4x4
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden group h-36 md:h-44 lg:h-full shadow-sm">
                  <img
                    alt="Gallery 2"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-white font-caption text-caption text-[11px]">
                    Destinasi Terverifikasi
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden group h-36 md:h-44 lg:h-full shadow-sm">
                  <img
                    alt="Gallery 3"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-white font-caption text-caption text-[11px]">
                    Pemandu Lisensi HPI
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden group h-36 md:h-44 lg:h-full shadow-sm cursor-pointer">
                  <img
                    alt="Gallery 4"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                    <MaterialIcon name="photo_library" className="text-2xl" />
                    <span className="font-caption text-caption font-bold mt-1">Dokumentasi</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main 2-Column Split Details Section */}
          <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-space-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              {/* LEFT COLUMN: Package Narrative, Inclusions & Itinerary */}
              <div className="lg:col-span-7 flex flex-col gap-space-xl">
                {/* Description */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-surface-container-low shadow-sm">
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-sm flex items-center gap-2">
                    <MaterialIcon name="article" className="text-primary text-xl" />
                    <span>Deskripsi &amp; Sorotan Perjalanan</span>
                  </h2>
                  <p className="font-body-regular text-body-regular text-on-surface-variant leading-relaxed">
                    {pkg.description ||
                      "Nikmati pengalaman petualangan alam terbaik dengan pemandu berlisensi resmi, armada teruji, dan sistem perlindungan dana escrow NusaBook. Setiap rute perjalanan dirancang untuk kenyamanan dan keamanan peserta."}
                  </p>
                </div>

                {/* Inclusions / Exclusions */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-surface-container-low shadow-sm">
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-md flex items-center gap-2">
                    <MaterialIcon name="fact_check" className="text-primary text-xl" />
                    <span>Fasilitas &amp; Perlengkapan</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div>
                      <h3 className="font-body-semibold text-body-semibold text-emerald-700 font-bold flex items-center gap-1.5 mb-2">
                        <MaterialIcon name="check_circle" className="text-lg text-emerald-600" />
                        Termasuk (Included):
                      </h3>
                      <ul className="space-y-1.5 font-body-regular text-on-surface-variant text-sm">
                        {(pkg.facilities_included && pkg.facilities_included.length > 0
                          ? pkg.facilities_included
                          : [
                              "Transportasi pulang-pergi ber-AC prima",
                              "Tiket masuk retribusi Taman Nasional",
                              "Pemandu wisata (Tour Leader) lisensi HPI",
                              "Asuransi keselamatan perjalanan",
                              "Dokumentasi foto & video perjalanan",
                            ]
                        ).map((inc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <MaterialIcon name="done" className="text-emerald-600 text-sm mt-0.5 shrink-0" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-body-semibold text-body-semibold text-error font-bold flex items-center gap-1.5 mb-2">
                        <MaterialIcon name="cancel" className="text-lg text-error" />
                        Tidak Termasuk (Excluded):
                      </h3>
                      <ul className="space-y-1.5 font-body-regular text-on-surface-variant text-sm">
                        {(pkg.facilities_excluded && pkg.facilities_excluded.length > 0
                          ? pkg.facilities_excluded
                          : [
                              "Pengeluaran pribadi & suvenir",
                              "Sewa perlengkapan opsional di lokasi",
                              "Tips sukarela untuk pemandu",
                            ]
                        ).map((exc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <MaterialIcon name="close" className="text-error text-sm mt-0.5 shrink-0" />
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Escrow Guarantee Highlight */}
                <div className="bg-surface-container-low rounded-2xl p-space-md flex items-center gap-4 border border-outline-variant/30">
                  <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                    <MaterialIcon name="verified_user" className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-body-semibold text-body-semibold font-bold text-on-surface">
                      Proteksi Rekening Bersama (Escrow Vault)
                    </h3>
                    <p className="font-caption text-caption text-on-surface-variant text-xs mt-0.5">
                      Dana pembayaran Anda disimpan aman dalam sistem Nusabook dan baru dicairkan ke operator
                      setelah trip selesai terlaksana tanpa komplain operasional.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Interactive Booking Card (5 Columns) */}
              <aside className="lg:col-span-5 sticky top-24 flex flex-col gap-space-md">
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-surface-container-low shadow-lg flex flex-col gap-space-md">
                  {/* Pricing Header */}
                  <div className="flex items-end justify-between pb-space-sm border-b border-surface-container-low">
                    <div>
                      <span className="font-caption text-caption text-on-surface-variant">Harga Mulai</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-headline-md text-headline-md font-bold text-primary">
                          {formatRupiah(pricePerPax)}
                        </span>
                        <span className="font-caption text-caption text-outline line-through text-xs">
                          {formatRupiah(originalPrice)}
                        </span>
                      </div>
                    </div>
                    <span className="font-micro-badge text-micro-badge text-on-surface-variant uppercase font-mono">
                      Per Orang
                    </span>
                  </div>

                  {/* Schedule Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="font-body-semibold text-body-semibold text-on-surface flex items-center justify-between font-bold">
                      <span>Pilih Jadwal Keberangkatan</span>
                      <span className="font-caption text-caption text-primary font-normal text-xs">
                        {schedules.length} Pilihan Batch
                      </span>
                    </label>

                    {schedules.length > 0 ? (
                      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                        {schedules.map((schedule) => {
                          const isSelected = schedule.id === selectedScheduleId;

                          if (schedule.isSoldOut) {
                            return (
                              <div
                                key={schedule.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/50 opacity-60 cursor-not-allowed border border-dashed border-outline-variant"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-4 h-4 rounded-full border border-outline" />
                                  <div className="flex flex-col">
                                    <span className="font-body-semibold text-body-semibold text-outline font-bold">
                                      {schedule.dateText}
                                    </span>
                                    <span className="font-caption text-[11px] text-outline">
                                      {schedule.departureTime}
                                    </span>
                                  </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-outline font-micro-badge text-micro-badge font-bold">
                                  {schedule.statusBadge}
                                </span>
                              </div>
                            );
                          }

                          return (
                            <label
                              key={schedule.id}
                              onClick={() => handleSelectSchedule(schedule)}
                              className={`relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
                                isSelected
                                  ? "bg-surface-container-high border-2 border-primary"
                                  : "bg-surface-container-low hover:bg-surface-container"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <input
                                  checked={isSelected}
                                  onChange={() => handleSelectSchedule(schedule)}
                                  className="w-4 h-4 text-primary focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary"
                                  name="trip_date"
                                  type="radio"
                                />
                                <div className="flex flex-col">
                                  <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                                    {schedule.dateText}
                                  </span>
                                  <span className="font-caption text-[11px] text-on-surface-variant">
                                    {schedule.departureTime}
                                  </span>
                                </div>
                              </div>

                              {schedule.status === "urgent" ? (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-error-container text-error font-micro-badge text-micro-badge font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
                                  <span>{schedule.statusBadge}</span>
                                </div>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-micro-badge text-micro-badge">
                                  {schedule.statusBadge}
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-surface-container-low text-center text-on-surface-variant text-xs">
                        Belum ada jadwal keberangkatan untuk paket ini. Silakan hubungi operator via WhatsApp.
                      </div>
                    )}
                  </div>

                  {/* Pax Counter */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
                    <div>
                      <span className="font-body-semibold text-body-semibold text-on-surface font-bold block">
                        Jumlah Peserta (Pax)
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant text-[11px]">
                        Maksimal {maxAllowedPax} tiket per pemesanan
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleDecrementPax}
                        disabled={paxCount <= 1}
                        type="button"
                        className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-bold text-on-surface disabled:opacity-40 hover:bg-surface-container-high transition-colors"
                      >
                        -
                      </button>
                      <span className="font-headline-sm text-headline-sm font-bold w-6 text-center">
                        {paxCount}
                      </span>
                      <button
                        onClick={handleIncrementPax}
                        disabled={paxCount >= maxAllowedPax}
                        type="button"
                        className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-bold text-on-surface disabled:opacity-40 hover:bg-surface-container-high transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total calculation */}
                  <div className="pt-2 border-t border-surface-container-low flex items-center justify-between">
                    <div>
                      <span className="font-caption text-caption text-on-surface-variant">Estimasi Total</span>
                      <div className="font-headline-sm text-headline-sm font-bold text-primary">
                        {formatRupiah(subtotal)}
                      </div>
                    </div>
                    <span className="text-xs text-on-surface-variant">
                      {paxCount} Peserta x {formatRupiah(pricePerPax)}
                    </span>
                  </div>

                  {/* Booking CTA */}
                  <button
                    onClick={handleBooking}
                    disabled={!selectedSchedule || selectedSchedule.isSoldOut}
                    type="button"
                    className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-container disabled:bg-surface-container disabled:text-outline text-on-primary font-body-semibold text-body-md shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
                  >
                    <MaterialIcon name="book_online" className="text-xl" />
                    <span>Lanjut Pemesanan &amp; Kunci Kursi</span>
                  </button>

                  <p className="text-[11px] text-center text-on-surface-variant">
                    Pembayaran aman dengan QRIS &amp; Transfer Bank. Garansi uang kembali bila trip dibatalkan.
                  </p>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-low py-space-xl border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant">
          <div className="flex items-center gap-space-sm">
            <div className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
              N
            </div>
            <span className="font-body-semibold text-body-semibold text-primary font-bold">
              Nusabook UMKM Pariwisata
            </span>
            <span className="font-caption text-caption text-outline">Program P2MW 2026</span>
          </div>
          <div className="flex gap-space-lg font-caption text-caption">
            <Link className="hover:text-on-surface transition-colors" href="/guide">
              Panduan Operator
            </Link>
            <Link className="hover:text-on-surface transition-colors" href="/terms">
              Syarat Escrow DP
            </Link>
            <Link className="hover:text-on-surface transition-colors" href="/safety">
              Standar Keselamatan Bahari
            </Link>
          </div>
          <div className="font-caption text-caption text-outline">
            © 2026 Nusabook Indonesia. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}
