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


function getDefaultThumbnail(slug: string, packageSlug: string, title: string): string {
  const text = (slug + " " + packageSlug + " " + title).toLowerCase();
  if (text.includes("merapi")) {
    return "https://images.unsplash.com/photo-1704288038005-d64b6cbbd569?auto=format&fit=crop&w=1200&q=80";
  }
  if (text.includes("borobudur")) {
    return "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80";
  }
  if (text.includes("bromo")) {
    return "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80";
  }
  if (text.includes("komodo") || text.includes("labuan") || text.includes("bajo") || text.includes("phinisi")) {
    return "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1200&q=80";
  }
  if (text.includes("ijen")) {
    return "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80";
  }
  if (text.includes("karimunjawa") || text.includes("karimun")) {
    return "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80";
  }
  if (text.includes("dieng")) {
    return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
  }
  if (text.includes("derawan") || text.includes("maratua")) {
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
  }
  return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
}

function getDestinationGallery(slug: string, packageSlug: string, title: string) {
  const text = (slug + " " + packageSlug + " " + title).toLowerCase();
  if (text.includes("merapi")) {
    return [
      { url: "https://images.unsplash.com/photo-1704288038005-d64b6cbbd569?auto=format&fit=crop&w=800&q=80", label: "Puncak Gunung Merapi" },
      { url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", label: "Armada Jeep 4x4 Offroad" },
      { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80", label: "Panorama Kaliurang" },
      { url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80", label: "Manuver Air Kali Kuning" },
    ];
  }
  if (text.includes("borobudur")) {
    return [
      { url: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80", label: "Stupa Candi Borobudur" },
      { url: "https://images.unsplash.com/photo-1609137144820-2810e75a6c3f?auto=format&fit=crop&w=800&q=80", label: "Sunrise Punthuk Setumbu" },
      { url: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=800&q=80", label: "Relief Ukiran Candi" },
      { url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80", label: "Pemandu Lokal Berlisensi" },
    ];
  }
  if (text.includes("bromo")) {
    return [
      { url: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80", label: "Golden Sunrise Penanjakan" },
      { url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80", label: "Kawah Aktif Bromo" },
      { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", label: "Savana Bukit Teletubbies" },
      { url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", label: "Lautan Pasir Bromo" },
    ];
  }
  if (text.includes("komodo") || text.includes("labuan") || text.includes("bajo") || text.includes("phinisi")) {
    return [
      { url: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80", label: "Trekking Puncak Pulau Padar" },
      { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", label: "Kapal Phinisi Superior AC" },
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", label: "Pantai Pasir Pink Beach" },
      { url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80", label: "Manta Point & Snorkeling" },
    ];
  }
  if (text.includes("ijen")) {
    return [
      { url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80", label: "Fenomena Blue Fire Ijen" },
      { url: "https://images.unsplash.com/photo-1609137144820-2810e75a6c3f?auto=format&fit=crop&w=800&q=80", label: "Danau Kawah Hijau Toska" },
      { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", label: "Jalur Pendakian Paltuding" },
      { url: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80", label: "Savana Kawah Wurung" },
    ];
  }
  if (text.includes("karimunjawa") || text.includes("karimun")) {
    return [
      { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", label: "Terumbu Karang Menjangan" },
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", label: "Pulau Menjangan Cilik" },
      { url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80", label: "Konservasi Penyu & Hiu" },
      { url: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80", label: "Pantai Pasir Putih Gelam" },
    ];
  }
  if (text.includes("dieng")) {
    return [
      { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", label: "Golden Sunrise Bukit Sikunir" },
      { url: "https://images.unsplash.com/photo-1609137144820-2810e75a6c3f?auto=format&fit=crop&w=800&q=80", label: "Telaga Warna & Pengilon" },
      { url: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=800&q=80", label: "Kawah Vulkanik Sikidang" },
      { url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80", label: "Kompleks Candi Arjuna" },
    ];
  }
  if (text.includes("derawan") || text.includes("maratua")) {
    return [
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", label: "Kepulauan Derawan" },
      { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", label: "Danau Ubur-Ubur Kakaban" },
      { url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80", label: "Laguna Pulau Maratua" },
      { url: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80", label: "Hiu Paus Talisayan" },
    ];
  }
  return [
    { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", label: "Destinasi Terverifikasi" },
    { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", label: "Aktivitas Perjalanan" },
    { url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80", label: "Pemandu Resmi" },
    { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", label: "Dokumentasi Lengkap" },
  ];
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
      <main className="flex-1 pt-16 pb-20 lg:pb-0">
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
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-sm h-auto lg:h-[460px] overflow-hidden rounded-2xl">
              {/* Foto Utama */}
              <div className="relative lg:col-span-7 h-72 sm:h-80 lg:h-full rounded-2xl overflow-hidden group shadow-md">
                <img
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={
                    (pkg.thumbnail_url && !pkg.thumbnail_url.includes("photo-1588668214407") && !pkg.thumbnail_url.includes("photo-1537996194471"))
                      ? pkg.thumbnail_url
                      : getDefaultThumbnail(slug, packageSlug, pkg.title)
                  }
                  fetchPriority="high"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-primary text-on-primary font-micro-badge text-micro-badge px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                    Foto Utama
                  </span>
                  <p className="font-title-md text-title-md font-bold mt-1 text-white text-lg sm:text-xl">
                    Destinasi {pkg.destination_city}
                  </p>
                </div>
              </div>

              {/* 4 Foto Grid Proporsional 2x2 */}
              {(() => {
                const dynamicMedia = getDestinationGallery(slug, packageSlug, pkg.title);
                return (
                  <div className="grid grid-cols-2 grid-rows-2 lg:col-span-5 gap-space-sm h-72 sm:h-80 lg:h-full">
                    {dynamicMedia.map((media, mIdx) => (
                      <div key={mIdx} className="relative rounded-xl overflow-hidden group h-full w-full shadow-sm">
                        <img
                          alt={media.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={media.url}
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-white font-caption text-caption text-[11px] font-semibold">
                          {media.label}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
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

                {/* Titik Kumpul (Meeting Point) Card */}
                {pkg.meeting_point && (
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-surface-container-low shadow-sm">
                    <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-sm flex items-center gap-2">
                      <MaterialIcon name="place" className="text-secondary text-xl" />
                      <span>Titik Kumpul (Meeting Point)</span>
                    </h2>
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                      <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <MaterialIcon name="pin_drop" className="text-xl" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                          {pkg.meeting_point}
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant text-xs mt-0.5">
                          Harap tiba di lokasi 15-30 menit sebelum keberangkatan untuk presensi dan briefing perjalanan.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

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

                {/* Rencana Perjalanan (Itinerary Timeline) */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-surface-container-low shadow-sm">
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-md flex items-center gap-2">
                    <MaterialIcon name="schedule" className="text-primary text-xl" />
                    <span>Rencana Perjalanan (Itinerary)</span>
                  </h2>

                  {(() => {
                    const rawItinerary = pkg.itinerary;
                    let parsedDays: Array<{ day?: number; title?: string; activities: Array<{ time?: string; title?: string; activity?: string; description?: string }> }> = [];

                    if (Array.isArray(rawItinerary)) {
                      if (rawItinerary.length > 0 && typeof rawItinerary[0] === "object" && rawItinerary[0] !== null && "activities" in rawItinerary[0]) {
                        parsedDays = rawItinerary as any;
                      } else {
                        parsedDays = [
                          {
                            day: 1,
                            title: "Rangkaian Perjalanan",
                            activities: rawItinerary as any,
                          },
                        ];
                      }
                    }

                    if (parsedDays.length === 0) {
                      return (
                        <p className="font-body-regular text-body-regular text-on-surface-variant text-sm">
                          Rincian kegiatan akan disampaikan langsung oleh tour leader saat berkumpul di titik kumpul.
                        </p>
                      );
                    }

                    return (
                      <div className="space-y-6">
                        {parsedDays.map((dayGroup, dayIdx) => (
                          <div key={dayIdx} className="space-y-3">
                            {parsedDays.length > 1 && (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-body-semibold text-xs font-bold">
                                <span>Hari ke-{dayGroup.day || dayIdx + 1}</span>
                                {dayGroup.title && <span>: {dayGroup.title}</span>}
                              </div>
                            )}
                            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/40">
                              {(dayGroup.activities || []).map((act, actIdx) => (
                                <div key={actIdx} className="relative flex items-start gap-3">
                                  <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-surface flex items-center justify-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  </span>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      {act.time && (
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-container text-primary">
                                          {act.time}
                                        </span>
                                      )}
                                      <span className="font-body-semibold text-body-semibold text-on-surface text-sm font-bold">
                                        {act.title || act.activity || "Kegiatan Wisata"}
                                      </span>
                                    </div>
                                    {act.description && (
                                      <p className="font-body-regular text-on-surface-variant text-xs mt-0.5">
                                        {act.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
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
              <aside className="lg:col-span-5 lg:sticky lg:top-24 self-start z-10 flex flex-col gap-space-md">
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xl flex flex-col gap-5">
                  {/* Pricing Header */}
                  <div className="flex items-baseline justify-between pb-4 border-b border-surface-container">
                    <div>
                      <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider block">Harga Mulai</span>
                      <div className="flex items-baseline gap-2.5 mt-0.5">
                        <span className="font-headline-md text-2xl lg:text-3xl font-extrabold text-[#ea580c]">
                          {formatRupiah(pricePerPax)}
                        </span>
                        <span className="text-sm text-outline line-through">
                          {formatRupiah(originalPrice)}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-orange-50 text-[#ea580c] font-bold text-xs uppercase tracking-wide">
                      Per Pax
                    </span>
                  </div>

                  {/* Schedule Selector */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-bold text-on-surface flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MaterialIcon name="calendar_today" className="text-base text-primary" />
                        Pilih Jadwal Keberangkatan
                      </span>
                      <span className="text-xs font-semibold text-primary">
                        {schedules.length} Pilihan Batch
                      </span>
                    </label>

                    {schedules.length > 0 ? (
                      <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                        {schedules.map((schedule) => {
                          const isSelected = schedule.id === selectedScheduleId;

                          if (schedule.isSoldOut) {
                            return (
                              <div
                                key={schedule.id}
                                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/50 opacity-50 cursor-not-allowed border border-dashed border-outline-variant"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-4 h-4 rounded-full border-2 border-outline" />
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-outline">
                                      {schedule.dateText}
                                    </span>
                                    <span className="text-xs text-outline">
                                      {schedule.departureTime}
                                    </span>
                                  </div>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-outline text-xs font-bold">
                                  {schedule.statusBadge}
                                </span>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={schedule.id}
                              onClick={() => handleSelectSchedule(schedule)}
                              className={`relative flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border shadow-sm ${
                                isSelected
                                  ? "bg-orange-50/70 border-orange-500 ring-2 ring-orange-500/30"
                                  : "bg-surface-container-lowest border-outline-variant/30 hover:border-orange-300 hover:bg-orange-50/20"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  isSelected ? "border-orange-500 bg-orange-500" : "border-outline-variant"
                                }`}>
                                  {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div className="flex flex-col">
                                  <span className={`text-sm font-bold ${isSelected ? "text-orange-950" : "text-on-surface"}`}>
                                    {schedule.dateText}
                                  </span>
                                  <span className="text-xs text-on-surface-variant">
                                    {schedule.departureTime}
                                  </span>
                                </div>
                              </div>

                              {schedule.status === "urgent" ? (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                  <span>{schedule.statusBadge}</span>
                                </div>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                  {schedule.statusBadge}
                                </span>
                              )}
                            </div>
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
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <div>
                      <span className="text-sm font-bold text-on-surface block">
                        Jumlah Peserta (Pax)
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Maksimal {maxAllowedPax} tiket per pemesanan
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleDecrementPax}
                        disabled={paxCount <= 1}
                        type="button"
                        aria-label="Kurangi peserta"
                        className="w-9 h-9 rounded-lg bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center font-bold text-on-surface disabled:opacity-30 hover:bg-surface-container transition-all shadow-sm active:scale-95"
                      >
                        <MaterialIcon name="remove" className="text-base" />
                      </button>
                      <span className="font-headline-sm text-lg font-extrabold w-7 text-center text-primary">
                        {paxCount}
                      </span>
                      <button
                        onClick={handleIncrementPax}
                        disabled={paxCount >= maxAllowedPax}
                        type="button"
                        aria-label="Tambah peserta"
                        className="w-9 h-9 rounded-lg bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center font-bold text-on-surface disabled:opacity-30 hover:bg-surface-container transition-all shadow-sm active:scale-95"
                      >
                        <MaterialIcon name="add" className="text-base" />
                      </button>
                    </div>
                  </div>

                  {/* Total calculation */}
                  <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                    <div>
                      <span className="text-xs text-on-surface-variant font-medium block">Total Pembayaran</span>
                      <div className="font-headline-md text-2xl font-black text-primary">
                        {formatRupiah(subtotal)}
                      </div>
                    </div>
                    <span className="text-xs text-on-surface-variant font-medium bg-surface-container px-2.5 py-1 rounded-md">
                      {paxCount} Pax x {formatRupiah(pricePerPax)}
                    </span>
                  </div>

                  {/* Booking CTA Button (Prominent & High Converting) */}
                  <button
                    onClick={handleBooking}
                    disabled={!selectedSchedule || selectedSchedule.isSoldOut}
                    type="button"
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 text-white font-bold text-base shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <MaterialIcon name="confirmation_number" className="text-xl" />
                    <span>Pesan Sekarang</span>
                    <MaterialIcon name="arrow_forward" className="text-xl ml-1" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant text-center">
                    <MaterialIcon name="verified_user" className="text-sm text-emerald-600 shrink-0" />
                    <span>Garansi Escrow Nusabook. Aman &amp; Bebas Overbooking.</span>
                  </div>
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
          </div>
          <div className="flex gap-space-lg font-caption text-caption">
            <Link className="hover:text-on-surface transition-colors" href="/explore">
              Jelajah Destinasi
            </Link>
            <Link className="hover:text-on-surface transition-colors" href={`/${slug}`}>
              Etalase Mitra
            </Link>
            <a
              className="hover:text-on-surface transition-colors"
              href={waUrl}
              target="_blank"
              rel="noreferrer"
            >
              Bantuan WhatsApp
            </a>
          </div>
          <div className="font-caption text-caption text-outline">
            © 2026 Nusabook Indonesia. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>

      {/* STICKY BOTTOM BAR FOR MOBILE SCREENS (< 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] text-on-surface-variant font-medium">
            Total {paxCount} Peserta
          </span>
          <div className="font-headline-sm text-base sm:text-lg font-bold text-primary">
            {formatRupiah(subtotal)}
          </div>
        </div>

        <button
          onClick={handleBooking}
          disabled={!selectedSchedule || selectedSchedule.isSoldOut}
          type="button"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <MaterialIcon name="confirmation_number" className="text-lg" />
          <span>Pesan Sekarang</span>
          <MaterialIcon name="arrow_forward" className="text-lg" />
        </button>
      </div>
    </div>
  );
}
