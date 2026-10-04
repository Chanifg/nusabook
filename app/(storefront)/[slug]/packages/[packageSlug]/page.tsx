"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/icon";

interface ScheduleOption {
  id: string;
  dateText: string;
  departureTime: string;
  availableSeats: number;
  status: "urgent" | "available" | "sold_out";
  statusBadge: string;
  isSoldOut: boolean;
}

const SCHEDULES: ScheduleOption[] = [
  {
    id: "sched-1",
    dateText: "Minggu, 18 Okt 2026",
    departureTime: "Midnight 00:00 WIB",
    availableSeats: 2,
    status: "urgent",
    statusBadge: "Sisa 2 Kursi!",
    isSoldOut: false,
  },
  {
    id: "sched-2",
    dateText: "Selasa, 20 Okt 2026",
    departureTime: "Midnight 00:00 WIB",
    availableSeats: 6,
    status: "available",
    statusBadge: "Tersedia 6 Kursi",
    isSoldOut: false,
  },
  {
    id: "sched-3",
    dateText: "Kamis, 22 Okt 2026",
    departureTime: "Midnight 00:00 WIB",
    availableSeats: 10,
    status: "available",
    statusBadge: "Tersedia 10 Kursi",
    isSoldOut: false,
  },
  {
    id: "sched-4",
    dateText: "Sabtu, 24 Okt 2026",
    departureTime: "Midnight 00:00 WIB",
    availableSeats: 0,
    status: "sold_out",
    statusBadge: "Habis (Sold Out)",
    isSoldOut: true,
  },
];

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "pesona-merapi";
  const packageSlug = (params?.packageSlug as string) || "bromo-golden-sunrise";

  const pricePerPax = 450000;
  const originalPrice = 550000;

  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("sched-1");
  const [paxCount, setPaxCount] = useState<number>(2);
  const [reviewFilter, setReviewFilter] = useState<"all" | "photo" | "star5">("all");

  const selectedSchedule = SCHEDULES.find((s) => s.id === selectedScheduleId) || SCHEDULES[0];
  const maxAllowedPax = selectedSchedule.isSoldOut ? 1 : selectedSchedule.availableSeats;

  const handleSelectSchedule = (schedule: ScheduleOption) => {
    if (schedule.isSoldOut) return;
    setSelectedScheduleId(schedule.id);
    if (paxCount > schedule.availableSeats) {
      setPaxCount(schedule.availableSeats);
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
    router.push(`/${slug}/booking?trip=${packageSlug}&scheduleId=${selectedScheduleId}&pax=${paxCount}`);
  };

  return (
    <div className="bg-background font-body-regular text-on-surface antialiased min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <Link className="flex items-center gap-space-sm" href="/">
              <img
                alt="Nusabook Brand Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1U3Dc9ujBNuM7mgSPnQReIZqJpbXFrgBa8_v7KkLAxGoGg-NCEjy4Aw-pYXp9CiKsNHmqpLEMF2TzdVBIjehkrvhOp1eK3eYIfA64704YK0SOXTQb6gBESs7Xo_FJmMnJpYGla99v_5KwfnRrPX3mOY81yQP8OnvPcRn6zitzBMcBKr14d077mBMYP9cT2gZ37ppBCN_acPq-kd6A4kNOGLXs6_FK5SnaikbZm8kopURdxI0y2YnoftJw"
              />
              <span className="font-headline-sm text-headline-sm text-primary font-bold">Nusabook</span>
            </Link>
            <div className="hidden md:inline-flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="font-micro-badge text-micro-badge text-on-surface-variant font-bold">Live Sync Aktif</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-space-lg">
            <Link className="font-body-regular text-body-regular text-on-surface-variant hover:text-on-surface transition-colors" href="/explore">
              Jelajah Wisata
            </Link>
            <Link className="font-body-regular text-body-regular text-on-surface-variant hover:text-on-surface transition-colors" href={`/${slug}`}>
              Etalase Paket
            </Link>
            <Link className="font-body-semibold text-body-semibold text-primary transition-colors" href={`/${slug}/packages/${packageSlug}`}>
              Checkout & Reservasi
            </Link>
            <Link className="font-body-regular text-body-regular text-on-surface-variant hover:text-on-surface transition-colors" href="/dashboard">
              Operator Backoffice
            </Link>
          </nav>

          <div className="flex items-center gap-space-md">
            <div className="relative">
              <button
                className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
                type="button"
              >
                <MaterialIcon name="notifications" className="text-[22px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container" />
              </button>
            </div>
            <div className="flex items-center gap-space-sm pl-space-xs">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9zORNB2FPjTW_H98NevCLhXNTN4IUGGfqvD1zb38cqGydAcZU48wcSbV80amSRL8i_DH5E_ANNVnRQ5hVC780G4txUSnM5zYnxX59hHqUPbG3q8hLDgzB6qU6VW4G70E7kwTaZw6RRGkbhYqovfRas5W09tau4zjA7iNaXZYFS4CyUgS1b3lrz0k4sEZJJs6OHpCHs4aMJEIYyIb_CIvpLbu2PnKxrjhPx8uzaQ5vlH1GX4IaRks"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-body-semibold text-body-semibold text-on-surface leading-tight font-bold">Bambang Pamungkas</span>
                <span className="font-caption text-caption text-outline">Pesona Nusantara</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-14rem)] flex-1">
        <div className="flex flex-col w-full">
          {/* Top Navigation & Breadcrumbs Strip */}
          <section className="w-full bg-surface-container-low py-space-sm px-6 lg:px-12">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-space-xs text-on-surface-variant font-caption text-caption">
              <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs flex-wrap">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <MaterialIcon name="home" className="text-[16px]" />
                  <span>Beranda</span>
                </Link>
                <span>/</span>
                <Link className="hover:text-primary transition-colors" href="/explore">
                  Jelajah Wisata
                </Link>
                <span>/</span>
                <Link className="hover:text-primary transition-colors" href="/explore">
                  Jawa Timur
                </Link>
                <span>/</span>
                <Link className="hover:text-primary transition-colors" href="/explore">
                  Bromo Tengger Semeru
                </Link>
                <span>/</span>
                <span className="text-on-surface font-body-semibold truncate max-w-xs sm:max-w-sm font-bold">
                  Open Trip Bromo Golden Sunrise
                </span>
              </nav>
              <div className="flex items-center gap-space-sm text-outline">
                <span className="flex items-center gap-1">
                  <MaterialIcon name="verified_user" className="text-[15px] text-primary" />
                  ID Paket: <span className="font-body-semibold text-on-surface font-bold">NB-BTM-2601</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Terdaftar Kemenparekraf</span>
              </div>
            </div>
          </section>

          {/* Package Header & Metadata Section */}
          <section className="w-full bg-surface-container-lowest px-6 lg:px-12 pt-space-lg pb-space-md">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
              {/* Trust & Verification Badges */}
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-primary-fixed text-primary font-micro-badge text-micro-badge font-bold">
                  <MaterialIcon name="verified" className="text-[15px]" />
                  Verified Partner Nusabook (NIB & TDUP Terdaftar)
                </span>
                <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-high text-on-surface font-micro-badge text-micro-badge font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  Pasti Berangkat (Guaranteed)
                </span>
                <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-micro-badge text-micro-badge font-bold">
                  <MaterialIcon name="shield" className="text-[15px]" />
                  All-in Tiket TNBTS & Asuransi Jasa Raharja
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-headline-lg text-headline-lg text-primary max-w-4xl tracking-tight leading-tight font-bold">
                Open Trip Bromo Golden Sunrise, Kawah Aktif, Pasir Berbisik & Savana Teletubbies
              </h1>

              {/* Sub-bar: Ratings, Operator Link, Share & Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pt-space-xs">
                <div className="flex flex-wrap items-center gap-y-space-xs gap-x-space-md text-on-surface-variant font-body-regular text-body-regular">
                  <div className="flex items-center gap-1.5 bg-surface-container-low px-space-sm py-1 rounded-lg">
                    <MaterialIcon name="star" className="text-[18px] text-[#f59e0b]" />
                    <span className="font-body-semibold text-on-surface font-bold">4.9</span>
                    <span className="text-caption font-caption text-outline">(248 ulasan terverifikasi)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MaterialIcon name="pin_drop" className="text-[18px] text-outline" />
                    <span>TN Bromo Tengger Semeru, Jawa Timur</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MaterialIcon name="storefront" className="text-[18px] text-primary" />
                    <span>Operator:</span>
                    <Link
                      className="font-body-semibold text-primary underline underline-offset-4 hover:text-primary-container font-bold"
                      href={`/${slug}`}
                    >
                      Pesona Nusantara Tour & Travel
                    </Link>
                  </div>
                </div>

                {/* Social Action Buttons */}
                <div className="flex items-center gap-space-xs">
                  <button
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-body-regular font-body-semibold transition-all font-bold"
                    type="button"
                  >
                    <MaterialIcon name="share" className="text-[18px]" />
                    <span className="hidden sm:inline">Bagikan</span>
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-body-regular font-body-semibold transition-all font-bold"
                    type="button"
                  >
                    <MaterialIcon name="favorite_border" className="text-[18px]" />
                    <span className="hidden sm:inline">Simpan</span>
                  </button>
                  <a
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white text-body-regular font-body-semibold shadow-sm transition-all font-bold"
                    href="https://wa.me/6281234567890?text=Halo%20Pesona%20Nusantara,%20saya%20tertarik%20tanya%20Open%20Trip%20Bromo"
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
              {/* Landscape Dominant Photo (Col 7 / 12) */}
              <div className="relative md:col-span-4 lg:col-span-7 h-72 md:h-96 lg:h-full rounded-xl overflow-hidden group shadow-md">
                <img
                  alt="Golden Sunrise Bromo Penanjakan 1"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5G4K5glMsgbJaxCwOa5Dam8AAtls9HSYOV22JouPrfQInmTbkWy2g4-4DoAUvoxEykCz4lhPelwyNFhbOuyMfFvh52hwO4MeEZG1fI1oWhWc4gO7bR6n4Nc3tv7DTMX-ID73WGum9fvOLZc3BTukswPea-oaee0dysNmVGs0GIRKNpHVBJDhIkhURQsMdg6CH5UbFPrwEtpn67nOi_pH4kpzI5KnVIqrCMpIpF9CE_MSQMqEJs4s"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/80 backdrop-blur-md text-on-primary font-caption text-caption shadow-sm font-bold">
                  <MaterialIcon name="photo_camera" className="text-[14px]" />
                  <span>Highlight #1: Spot Golden Sunrise 2.770 mdpl</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-on-primary">
                  <p className="font-body-semibold text-body-semibold font-bold">
                    Lautan Awan & Puncak Kawah Batok dari Penanjakan 1
                  </p>
                  <p className="font-caption text-caption opacity-90">
                    Dokumentasi asli keberangkatan reguler armada Pesona Nusantara
                  </p>
                </div>
              </div>

              {/* Supporting 4-Grid Right Side (Col 5 / 12) */}
              <div className="md:col-span-4 lg:col-span-5 grid grid-cols-2 gap-space-sm h-72 md:h-96 lg:h-full">
                {/* Photo 2: Jeep 4x4 */}
                <div className="relative rounded-xl overflow-hidden group shadow-sm">
                  <img
                    alt="Armada Jeep 4x4 Paguyuban Bromo"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKyyStr6jtkJHgAC8vUjcXJustS7pOXoQI2LEy-xYvVyiV2GJNe-7Yl0OT713hOr-qHLJbSrYYLuWuurWqMi2dsOfeJa4ZT6YPbLjzJz8Jw0xcfebbdkRDy4TSMSYQ-6_XJY7LoZjDjaiwEGlcWtjgvGeIPrrQhVeLaaOazOVSggeXO5EDW1LXnQuB7eHKy-PGA6HEQNjUjk5r3v4EcQq-HyZbQdIiHLXXxiNbLsIgvPyRw6NpTZw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 font-caption text-caption font-body-semibold text-on-primary font-bold">
                    Armada Jeep 4x4
                  </span>
                </div>

                {/* Photo 3: Trekking Tangga Kawah */}
                <div className="relative rounded-xl overflow-hidden group shadow-sm">
                  <img
                    alt="Trekking Tangga Kawah Aktif Bromo"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeHuwEc5lSkCE8tx1HHbWVBoB-eRpbOEfQHqVUtUJGgr-wUDmEkLpXv7C6uOMQxsuicRFceE4G5W-j16ZNL-5dnFwpGmZdgsTHuTN2U3NmKyiJrZrqt8i-acDzcMheHo56cqit7r2iBRr2h0tUjm9dDO_htFVhsdq8VSoPsXH8uEkqMUfU1_gzOC2T8JGFT-g7423p-ClxOU_UBYFsMY1iEppBxnytaaDwBv6OBece7ve6DjGPE1s"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 font-caption text-caption font-body-semibold text-on-primary font-bold">
                    Tangga Kawah Aktif
                  </span>
                </div>

                {/* Photo 4: Savana Teletubbies */}
                <div className="relative rounded-xl overflow-hidden group shadow-sm">
                  <img
                    alt="Bukit Savana Teletubbies Menghijau"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxqoIAJcr4DEM2kzt3Y3VjoharX5oD28-gEcZ2TRCz7a6HSi2rhohY3ZEiNUh0U8yP8Ai0KPkCELsDjafP4RB77efuP3xgEPr8oixk33R_nKCXfDGwPMpFwtdd1ep0oEqTJJLWr3T37U9zw5qMCPklsYzNLEEXLU_4ZNU3psdlJ4v1sTeAhgFIuxO_FAk7lNTmJ8YDzMGG_txh-ZNK7x6po7_wIgmFxb9sr3uXds3fU_Gpc9HDpu4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 font-caption text-caption font-body-semibold text-on-primary font-bold">
                    Savana Teletubbies
                  </span>
                </div>

                {/* Photo 5: Pasir Berbisik with Modal Trigger */}
                <div className="relative rounded-xl overflow-hidden group shadow-sm cursor-pointer">
                  <img
                    alt="Pura Luhur Poten & Pasir Berbisik"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO4tqwg67QZJfxo2e41sfigoTdJwYokcYDCSSZfqz-FVxXiHRY--nJoDd5hMAaxjqbVoypZ042qYddoqfcF8hC8hcmK_zSoS7P2qjewdMbhJ710VZ2pJZMo10Q0zVc6zV7Sck1iQz1WRaA5gvWe4_i0hsr_GNn-LyYlgyFcs4O6SR_AeMqScmv0yRpjq3JqTTHRCsjYQnCkchbOtc1jjJ5O5Mtinenf_W7zpFMaviueNwBkjPz5WY"
                  />
                  <div className="absolute inset-0 bg-primary/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-3 transition-opacity group-hover:bg-primary/75">
                    <MaterialIcon name="photo_library" className="text-[26px] text-on-primary mb-1" />
                    <span className="font-body-semibold text-body-semibold text-on-primary leading-tight font-bold">
                      Lihat Semua
                    </span>
                    <span className="font-caption text-caption text-on-primary-container">32 Foto & Video</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2-Column Split: Main Content (65%) & Sticky Reservation Engine (35%) */}
          <section className="w-full px-6 lg:px-12 py-space-xl bg-surface">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-space-xl items-start">
              {/* LEFT COLUMN: Tour Information & Operational Breakdown (65%) */}
              <div className="w-full lg:w-[65%] flex flex-col gap-space-xl">
                {/* A. Key Highlights / Quick Specs Pills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-1">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-1">
                      <MaterialIcon name="schedule" className="text-[20px]" />
                    </div>
                    <span className="font-caption text-caption text-outline">Durasi Trip</span>
                    <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                      1 Hari (Midnight)
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">00:00 - 13:00 WIB</span>
                  </div>

                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-1">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-1">
                      <MaterialIcon name="groups" className="text-[20px]" />
                    </div>
                    <span className="font-caption text-caption text-outline">Format Trip</span>
                    <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                      Open Trip Publik
                    </span>
                    <span className="font-caption text-caption text-[#10b981] font-body-semibold font-bold">
                      1 Pax Pasti Jalan
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-1">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-1">
                      <MaterialIcon name="directions_car" className="text-[20px]" />
                    </div>
                    <span className="font-caption text-caption text-outline">Kombinasi Armada</span>
                    <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                      Jeep 4x4 Paguyuban
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">+ Shuttle HiAce AC</span>
                  </div>

                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-1">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-1">
                      <MaterialIcon name="security" className="text-[20px]" />
                    </div>
                    <span className="font-caption text-caption text-outline">Perlindungan</span>
                    <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                      Jasa Raharja
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">All-in Tiket TNBTS</span>
                  </div>
                </div>

                {/* B. Nusabook Standard Service Pillars */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
                  <div className="flex items-center gap-space-sm mb-space-md">
                    <div className="w-2 h-6 bg-primary rounded-full" />
                    <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Standar Layanan & Jaminan Nusabook
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="flex items-start gap-space-sm">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                        <MaterialIcon name="lock_reset" className="text-[20px]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                          Anti-Overbooking Guaranteed
                        </span>
                        <span className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                          Pencatatan real-time row-lock engine. Kursi yang Anda bayar 100% dialokasikan ke armada Jeep terdaftar tanpa dobel tiket.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-sm">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                        <MaterialIcon name="badge" className="text-[20px]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                          Tour Leader Berlisensi Resmi HPI
                        </span>
                        <span className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                          Didampingi pemandu wisata bersertifikat BNSP, fasih edukasi budaya Tengger & tanggap prosedur darurat K3 di kaldera.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-sm">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                        <MaterialIcon name="camera" className="text-[20px]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                          Free Dokumentasi DSLR / Mirrorless
                        </span>
                        <span className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                          Fotografer khusus di setiap rombongan. Seluruh file mentah & foto diedit dibagikan via link Google Drive kilat dalam 24 jam.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-sm">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                        <MaterialIcon name="coffee" className="text-[20px]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                          Basecamp Transit Nyaman & Higienis
                        </span>
                        <span className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                          Transit di Basecamp Tumpang dengan toilet bersih, mushola, loker titip koper, dan sajian gratis teh/kopi panas sebelum naik Jeep.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* C. Meeting Point & Free Shuttle Area Malang */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-space-md">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-2 h-6 bg-primary rounded-full" />
                      <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                        Titik Kumpul & Area Penjemputan Fleksibel
                      </h2>
                    </div>
                    <span className="px-space-sm py-1 rounded-full bg-surface-container text-primary font-caption text-caption font-body-semibold font-bold">
                      Gratis Antar-Jemput Malang Kota
                    </span>
                  </div>
                  <p className="font-body-regular text-body-regular text-on-surface-variant mb-space-md leading-relaxed">
                    Peserta tidak perlu bingung mencari transportasi malam hari. Shuttle HiAce kami menjemput langsung di titik lokasi yang Anda tentukan pada pukul 00:00 - 01:30 WIB:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-primary font-body-semibold text-body-semibold font-bold">
                        <MaterialIcon name="train" className="text-[20px]" />
                        <span>Stasiun Kereta Api</span>
                      </div>
                      <p className="font-caption text-caption text-on-surface-variant mt-1">
                        Stasiun Malang Kota Baru (Area Pintu Barat / Pintu Timur) & Stasiun Kota Lama.
                      </p>
                    </div>

                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-primary font-body-semibold text-body-semibold font-bold">
                        <MaterialIcon name="hotel" className="text-[20px]" />
                        <span>Hotel & Penginapan</span>
                      </div>
                      <p className="font-caption text-caption text-on-surface-variant mt-1">
                        Semua Hotel, Guest House, atau Homestay di seluruh penjuru Kota Malang (radius maksimal 5 km).
                      </p>
                    </div>

                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-primary font-body-semibold text-body-semibold font-bold">
                        <MaterialIcon name="directions_bus" className="text-[20px]" />
                        <span>Terminal Arjosari</span>
                      </div>
                      <p className="font-caption text-caption text-on-surface-variant mt-1">
                        Lobi Kedatangan Bus AKAP Arjosari untuk peserta dari Surabaya/Jogja/Jakarta.
                      </p>
                    </div>
                  </div>
                </div>

                {/* D. Hourly Interactive Itinerary Stepper */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-space-lg flex-wrap gap-2">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-2 h-6 bg-primary rounded-full" />
                      <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                        Rencana Perjalanan Detail (Itinerary Midnight)
                      </h2>
                    </div>
                    <span className="text-caption font-caption text-outline">Estimasi total 13 Jam Berpetualang</span>
                  </div>

                  <div className="relative pl-6 space-y-space-lg">
                    {/* Continuous Timeline Line */}
                    <div className="absolute top-3 left-[11px] bottom-3 w-[2px] bg-surface-container-highest" />

                    {/* Item 1 */}
                    <div className="relative flex items-start gap-space-md group">
                      <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm z-10">
                        <span className="font-micro-badge text-[10px] font-bold">1</span>
                      </div>
                      <div className="flex flex-col bg-surface-container-low p-space-md rounded-xl w-full">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <span className="font-body-semibold text-body-semibold text-primary font-bold">
                            00:00 - 01:30 WIB
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-micro-badge text-micro-badge font-bold">
                            Penjemputan Peserta
                          </span>
                        </div>
                        <h3 className="font-body-semibold text-body-semibold text-on-surface mb-1 font-bold">
                          Penjemputan Area Malang & Menuju Basecamp Tumpang
                        </h3>
                        <p className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                          Driver shuttle HiAce menjemput setiap peserta sesuai titik request (stasiun/hotel). Perjalanan 45 menit menuju Basecamp Pesona Nusantara di Tumpang.
                        </p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="relative flex items-start gap-space-md group">
                      <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm z-10">
                        <span className="font-micro-badge text-[10px] font-bold">2</span>
                      </div>
                      <div className="flex flex-col bg-surface-container-low p-space-md rounded-xl w-full">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <span className="font-body-semibold text-body-semibold text-primary font-bold">
                            01:30 - 03:30 WIB
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-micro-badge text-micro-badge font-bold">
                            Oper Jeep 4x4
                          </span>
                        </div>
                        <h3 className="font-body-semibold text-body-semibold text-on-surface mb-1 font-bold">
                          Briefing, Coffee Break & Menembus Lautan Pasir
                        </h3>
                        <p className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                          Pengecekan perlengkapan dingin, toilet break, dan pembagian rombongan Jeep Hardtop 4x4 (maksimal 6 orang/jeep demi kenyamanan). Melintasi lautan pasir gelap menuju Viewpoint Penanjakan 1.
                        </p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="relative flex items-start gap-space-md group">
                      <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-white shadow-sm z-10">
                        <span className="font-micro-badge text-[10px] font-bold">3</span>
                      </div>
                      <div className="flex flex-col bg-surface-container-low p-space-md rounded-xl w-full">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <span className="font-body-semibold text-body-semibold text-secondary font-bold">
                            04:30 - 06:00 WIB
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-micro-badge text-micro-badge font-bold">
                            Golden Hour Moment
                          </span>
                        </div>
                        <h3 className="font-body-semibold text-body-semibold text-on-surface mb-1 font-bold">
                          Puncak Golden Sunrise Bromo & Lautan Awan Penanjakan 1
                        </h3>
                        <p className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                          Menyaksikan kemegahan terbitnya fajar dengan latar kaldera Bromo, Gunung Batok, dan erupsi berkala Mahameru. Sesi dokumentasi foto estetik dipandu fotografer tour leader di sudut eksklusif.
                        </p>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="relative flex items-start gap-space-md group">
                      <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm z-10">
                        <span className="font-micro-badge text-[10px] font-bold">4</span>
                      </div>
                      <div className="flex flex-col bg-surface-container-low p-space-md rounded-xl w-full">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <span className="font-body-semibold text-body-semibold text-primary font-bold">
                            06:30 - 08:30 WIB
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-micro-badge text-micro-badge font-bold">
                            Trekking Kaldera
                          </span>
                        </div>
                        <h3 className="font-body-semibold text-body-semibold text-on-surface mb-1 font-bold">
                          Kawah Aktif Bromo & Pura Luhur Poten
                        </h3>
                        <p className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                          Parkir di kaki kawah, melewati Pura Luhur Poten suku Tengger, lalu mendaki 250 anak tangga menuju bibir kawah aktif yang bergemuruh. Tersedia opsi sewa kuda lokal bagi yang ingin santai.
                        </p>
                      </div>
                    </div>

                    {/* Item 5 */}
                    <div className="relative flex items-start gap-space-md group">
                      <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm z-10">
                        <span className="font-micro-badge text-[10px] font-bold">5</span>
                      </div>
                      <div className="flex flex-col bg-surface-container-low p-space-md rounded-xl w-full">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <span className="font-body-semibold text-body-semibold text-primary font-bold">
                            08:30 - 10:30 WIB
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-micro-badge text-micro-badge font-bold">
                            Lansekap Unik
                          </span>
                        </div>
                        <h3 className="font-body-semibold text-body-semibold text-on-surface mb-1 font-bold">
                          Pasir Berbisik (Whispering Sands) & Savana Teletubbies
                        </h3>
                        <p className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                          Konvoi Jeep melintasi hamparan gurun pasir berbisik dengan aksi foto di atas atap Jeep yang ikonik, berlanjut ke lembah hijau perbukitan Savana Teletubbies.
                        </p>
                      </div>
                    </div>

                    {/* Item 6 */}
                    <div className="relative flex items-start gap-space-md group">
                      <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm z-10">
                        <span className="font-micro-badge text-[10px] font-bold">6</span>
                      </div>
                      <div className="flex flex-col bg-surface-container-low p-space-md rounded-xl w-full">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <span className="font-body-semibold text-body-semibold text-primary font-bold">
                            10:30 - 13:00 WIB
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-micro-badge text-micro-badge font-bold">
                            Drop-off Kota
                          </span>
                        </div>
                        <h3 className="font-body-semibold text-body-semibold text-on-surface mb-1 font-bold">
                          Makan Siang di Basecamp & Drop-off Malang
                        </h3>
                        <p className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                          Kembali ke Basecamp Tumpang, bersih-bersih, santap siang prasmanan masakan rumahan khas Jawa Timur, lalu peserta diantar kembali ke lokasi masing-masing di Malang.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E. Facilities Include & Exclude Matrix */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
                  <div className="flex items-center gap-space-sm mb-space-md">
                    <div className="w-2 h-6 bg-primary rounded-full" />
                    <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Fasilitas Paket Termasuk & Tidak Termasuk
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    {/* Include Box */}
                    <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col">
                      <div className="flex items-center gap-2 text-primary font-body-semibold text-body-semibold mb-space-sm font-bold">
                        <span className="w-6 h-6 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center">
                          <MaterialIcon name="check" className="text-[16px]" />
                        </span>
                        <span>Fasilitas Termasuk (Include)</span>
                      </div>
                      <ul className="space-y-space-xs text-caption font-body-regular text-on-surface">
                        {[
                          "Transportasi Shuttle HiAce PP AC Malang - Basecamp Tumpang",
                          "Sewa Armada Jeep Toyota Hardtop 4x4 Paguyuban Bromo",
                          "Tiket Masuk Resmi TN Bromo Tengger Semeru (Wisnus)",
                          "BBM, Biaya Parkir & Retribusi Jalur Konservasi",
                          "Tour Leader & Driver Berlisensi Pengalaman Gunung",
                          "Air Mineral Botol, Snack Pagi & Makan Siang Basecamp",
                          "Asuransi Jiwa Jasa Raharja TNBTS",
                          "Dokumentasi Foto DSLR/Mirrorless + Folder Cloud Drive",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <MaterialIcon name="check_circle" className="text-[16px] text-[#10b981] mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Exclude Box */}
                    <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col">
                      <div className="flex items-center gap-2 text-on-surface-variant font-body-semibold text-body-semibold mb-space-sm font-bold">
                        <span className="w-6 h-6 rounded-full bg-error-container text-error flex items-center justify-center">
                          <MaterialIcon name="close" className="text-[16px]" />
                        </span>
                        <span>Tidak Termasuk (Exclude)</span>
                      </div>
                      <ul className="space-y-space-xs text-caption font-body-regular text-on-surface-variant">
                        {[
                          "Tiket Pesawat/Kereta Api dari Kota Asal menuju Malang",
                          "Sewa Kuda di Kaki Kawah Bromo (Opsional Rp 150-200rb)",
                          "Surcharge Tambahan Tiket WNA / Paspor Asing (+Rp 300.000)",
                          "Sewa Jaket Tebal / Sarung Tangan pribadi di warung transit",
                          "Tip Sukarela untuk Driver Jeep & Pemandu Lapangan",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <MaterialIcon name="remove_circle_outline" className="text-[16px] text-outline mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* F. Cancellation, Reschedule & Escrow Safety Policy */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
                  <div className="flex items-center gap-space-sm mb-space-md">
                    <div className="w-2 h-6 bg-primary rounded-full" />
                    <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Kebijakan Reschedule, Pembatalan & Rekening Escrow
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm mb-space-md">
                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col">
                      <span className="font-caption text-caption text-[#10b981] font-body-semibold uppercase tracking-wider mb-1 font-bold">
                        H-7 Keberangkatan
                      </span>
                      <span className="font-body-semibold text-body-semibold text-on-surface mb-1 font-bold">
                        100% Refund Penuh
                      </span>
                      <p className="font-caption text-caption text-on-surface-variant">
                        Pembatalan tanpa potongan biaya administrasi, dana dikembalikan otomatis via transfer.
                      </p>
                    </div>

                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col">
                      <span className="font-caption text-caption text-secondary font-body-semibold uppercase tracking-wider mb-1 font-bold">
                        H-6 s/d H-3
                      </span>
                      <span className="font-body-semibold text-body-semibold text-on-surface mb-1 font-bold">
                        Reschedule Gratis 1x
                      </span>
                      <p className="font-caption text-caption text-on-surface-variant">
                        Bebas ubah tanggal trip ke jadwal Open Trip manapun dalam kurun waktu 30 hari kalender.
                      </p>
                    </div>

                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col">
                      <span className="font-caption text-caption text-primary font-body-semibold uppercase tracking-wider mb-1 font-bold">
                        Kondisi Luar Biasa
                      </span>
                      <span className="font-body-semibold text-body-semibold text-on-surface mb-1 font-bold">
                        Proteksi Force Majeure
                      </span>
                      <p className="font-caption text-caption text-on-surface-variant">
                        Jika TNBTS ditutup karena erupsi/cuaca ekstrem, garansi pengembalian dana 100% atau ganti trip.
                      </p>
                    </div>
                  </div>

                  {/* Escrow Guarantee Callout */}
                  <div className="p-space-md rounded-xl bg-surface-container flex items-start gap-space-sm">
                    <MaterialIcon name="account_balance" className="text-[24px] text-primary shrink-0" />
                    <div className="flex flex-col text-caption font-body-regular text-on-surface">
                      <span className="font-body-semibold text-body-semibold text-primary font-bold">
                        Garansi Sistem Pembayaran Nusabook Escrow Safe Vault
                      </span>
                      <span>
                        Uang muka (DP) dan pelunasan Anda disimpan aman di rekening bersama Nusabook hingga perjalanan sukses selesai dan divalidasi oleh check-in manifest Anda.
                      </span>
                    </div>
                  </div>
                </div>

                {/* G. Tour Leader Profile Card */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
                  <div className="flex items-center gap-space-sm mb-space-md">
                    <div className="w-2 h-6 bg-primary rounded-full" />
                    <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Profil Pemandu Tour Leader Lapangan
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-space-md bg-surface-container-low p-space-md rounded-xl">
                    <img
                      alt="Dimas Raharjo Lead Tour Guide"
                      className="w-20 h-20 rounded-full object-cover shadow-sm shrink-0"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMOHwaBqOXNXWShHwpKV7qs6Q4P-Uhb75RGEz5FXj4YakcH640-_kc3dxa8vpcskNFvvHURYcuKfXbocKtGLhW4puefOGUUfSPlnKn1o58HA7KRIvVc3KpnkK2Thi_kLnftjYsvDvzZSQj_Fr-SgrZ-yP0ZC1h6ey25nSf6DNUy9ve4LlrS5sxxnSAkjBdr7daPmARDvz6ajSR8Cysd8neXagITZByVltDU25n_e8ARLuNCu0QkHc"
                    />
                    <div className="flex flex-col text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                        <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                          Mas Dimas Raharjo, S.Par
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-micro-badge text-micro-badge font-bold">
                          Lead Guide Bromo
                        </span>
                      </div>
                      <p className="font-caption text-caption text-outline mb-2">
                        Lisensi BNSP Pemandu Gunung & HPI Jawa Timur (#HPI-ID-9921) • Pengalaman 8+ Tahun
                      </p>
                      <p className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                        &quot;Halo traveler! Saya dan tim Paguyuban Bromo memastikan eksplorasi sunrise Anda aman, nyaman, dan pastinya dapet momen foto terbaik di sudut-sudut sunrise yang belum ramai orang.&quot;
                      </p>
                    </div>
                  </div>
                </div>

                {/* H. Verified Customer Reviews (Social Proof) */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-md">
                    <div>
                      <div className="flex items-center gap-space-sm mb-1">
                        <div className="w-2 h-6 bg-primary rounded-full" />
                        <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                          Ulasan Wisatawan Terverifikasi
                        </h2>
                      </div>
                      <p className="font-caption text-caption text-outline">
                        Berdasarkan data manifest keberangkatan Nusabook
                      </p>
                    </div>
                    {/* Aggregate Score Pill */}
                    <div className="flex items-center gap-3 bg-surface-container-low px-space-md py-space-sm rounded-xl">
                      <div className="text-right">
                        <div className="font-headline-sm text-headline-sm text-primary leading-none font-bold">
                          4.9 / 5.0
                        </div>
                        <span className="font-micro-badge text-micro-badge text-[#10b981] font-bold">
                          Sangat Memuaskan
                        </span>
                      </div>
                      <div className="flex text-[#f59e0b]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <MaterialIcon key={s} name="star" className="text-[20px]" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Review Filter Chips */}
                  <div className="flex items-center gap-space-xs mb-space-md overflow-x-auto pb-1">
                    <button
                      onClick={() => setReviewFilter("all")}
                      className={`px-3 py-1 rounded-full font-caption text-caption font-body-semibold shrink-0 font-bold transition-all ${
                        reviewFilter === "all"
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-high hover:bg-surface-container text-on-surface"
                      }`}
                      type="button"
                    >
                      Semua (248)
                    </button>
                    <button
                      onClick={() => setReviewFilter("photo")}
                      className={`px-3 py-1 rounded-full font-caption text-caption font-body-semibold shrink-0 font-bold transition-all ${
                        reviewFilter === "photo"
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-high hover:bg-surface-container text-on-surface"
                      }`}
                      type="button"
                    >
                      Dengan Foto (112)
                    </button>
                    <button
                      onClick={() => setReviewFilter("star5")}
                      className={`px-3 py-1 rounded-full font-caption text-caption font-body-semibold shrink-0 font-bold transition-all ${
                        reviewFilter === "star5"
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-high hover:bg-surface-container text-on-surface"
                      }`}
                      type="button"
                    >
                      Bintang 5 (234)
                    </button>
                  </div>

                  {/* Review Cards List */}
                  <div className="space-y-space-md">
                    {/* Review 1 */}
                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-body-semibold text-body-semibold flex items-center justify-center font-bold">
                            AP
                          </div>
                          <div>
                            <span className="font-body-semibold text-body-semibold text-on-surface block leading-tight font-bold">
                              Anindya Paramitha
                            </span>
                            <span className="font-caption text-[11px] text-outline">
                              Solo • Trip 12 Okt 2026 (Verified Pax)
                            </span>
                          </div>
                        </div>
                        <div className="flex text-[#f59e0b]">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <MaterialIcon key={s} name="star" className="text-[16px]" />
                          ))}
                        </div>
                      </div>
                      <p className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                        &quot;Solo traveling pertama kali ikut open trip Bromo di Nusabook dan seru banget! Driver jemput on time di hotel Malang jam 00:15 WIB. Mas Dimas guide-nya sangat perhatian, motretin berkali-kali pake kamera DSLR sampai dapat view sunrise lautan awan yang magis!&quot;
                      </p>
                    </div>

                    {/* Review 2 */}
                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-body-semibold text-body-semibold flex items-center justify-center font-bold">
                            RH
                          </div>
                          <div>
                            <span className="font-body-semibold text-body-semibold text-on-surface block leading-tight font-bold">
                              Reza Herdian
                            </span>
                            <span className="font-caption text-[11px] text-outline">
                              Bandung • Trip 08 Okt 2026 (Verified Pax)
                            </span>
                          </div>
                        </div>
                        <div className="flex text-[#f59e0b]">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <MaterialIcon key={s} name="star" className="text-[16px]" />
                          ))}
                        </div>
                      </div>
                      <p className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                        &quot;Jeep-nya prima banget, driver paguyuban sangat lihai bermanuver di pasir berbisik. Sistem Nusabook enak karena begitu bayar langsung dapet e-ticket & masuk grup koordinasi WA resmi H-1. Gak ada pungli atau biaya aneh-aneh di lokasi.&quot;
                      </p>
                    </div>

                    {/* Review 3 */}
                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface font-body-semibold text-body-semibold flex items-center justify-center font-bold">
                            BP
                          </div>
                          <div>
                            <span className="font-body-semibold text-body-semibold text-on-surface block leading-tight font-bold">
                              Budi Pratama
                            </span>
                            <span className="font-caption text-[11px] text-outline">
                              Surabaya • Trip 04 Okt 2026 (Verified Pax)
                            </span>
                          </div>
                        </div>
                        <div className="flex text-[#f59e0b]">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <MaterialIcon key={s} name="star" className="text-[16px]" />
                          ))}
                        </div>
                      </div>
                      <p className="font-body-regular text-caption text-on-surface-variant leading-relaxed">
                        &quot;Sangat direkomendasikan untuk yang ingin liburan singkat akhir pekan. Pilihan cerdas ikut open trip daripada sewa jeep sendiri yang biayanya lumayan mahal kalau cuma berdua.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Sticky Reservation & Slot-Lock Engine Widget (35%) */}
              <aside className="w-full lg:w-[35%] lg:sticky lg:top-20 space-y-space-md">
                {/* Main Booking Card Container */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xl flex flex-col gap-space-md">
                  {/* Pricing Header & Promo Tag */}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-micro-badge text-micro-badge font-bold">
                          Diskon Spesial 18%
                        </span>
                        <span className="text-caption font-caption text-outline line-through">
                          {formatRupiah(originalPrice)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-display text-primary leading-none font-bold">
                          {formatRupiah(pricePerPax)}
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">/ orang</span>
                      </div>
                      <span className="font-caption text-[11px] text-[#10b981] font-body-semibold mt-1 font-bold">
                        ✓ All-in tanpa biaya tersembunyi
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                      <MaterialIcon name="confirmation_number" className="text-[22px]" />
                    </div>
                  </div>

                  {/* Schedule Selector Header with Live Quota Badges */}
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-body-semibold text-body-semibold text-on-surface font-bold">
                        Pilih Tanggal Berangkat
                      </label>
                      <span className="font-caption text-[11px] text-outline">Bulan Oktober 2026</span>
                    </div>

                    {/* Date Selection Options */}
                    <div className="space-y-space-xs">
                      {SCHEDULES.map((schedule) => {
                        const isSelected = selectedScheduleId === schedule.id;

                        if (schedule.isSoldOut) {
                          return (
                            <div
                              key={schedule.id}
                              className="relative flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest opacity-50 cursor-not-allowed border border-outline-variant"
                            >
                              <div className="flex items-center gap-2.5">
                                <input disabled className="w-4 h-4 text-outline" type="radio" checked={false} readOnly />
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
                            className={`relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors shadow-sm ${
                              isSelected
                                ? "bg-surface-container-high border-2 border-primary"
                                : "bg-surface-container-low hover:bg-surface-container"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                checked={isSelected}
                                onChange={() => handleSelectSchedule(schedule)}
                                className="w-4 h-4 text-primary focus:ring-primary"
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
                              <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] font-micro-badge text-micro-badge font-bold">
                                {schedule.statusBadge}
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pax Counter (Interactive) */}
                  <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low">
                    <div className="flex flex-col">
                      <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                        Jumlah Peserta
                      </span>
                      <span className="font-caption text-caption text-outline">
                        Maks. {maxAllowedPax} kursi tersisa
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleDecrementPax}
                        disabled={paxCount <= 1}
                        className="w-9 h-9 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface flex items-center justify-center font-title-md transition-all shadow-sm disabled:opacity-40 font-bold"
                        type="button"
                      >
                        -
                      </button>
                      <span className="font-title-md text-title-md text-primary w-6 text-center font-bold">
                        {paxCount}
                      </span>
                      <button
                        onClick={handleIncrementPax}
                        disabled={paxCount >= maxAllowedPax}
                        className="w-9 h-9 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface flex items-center justify-center font-title-md transition-all shadow-sm disabled:opacity-40 font-bold"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-xs text-caption">
                    <div className="flex justify-between items-center text-on-surface">
                      <span>Open Trip Bromo ({paxCount} Pax)</span>
                      <span className="font-body-semibold font-bold">{formatRupiah(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface-variant">
                      <span>Biaya Layanan Escrow & Asuransi</span>
                      <span className="text-[#10b981] font-body-semibold font-bold">GRATIS</span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface-variant">
                      <span>Tiket TNBTS & Retribusi Paguyuban</span>
                      <span className="text-[#10b981] font-body-semibold font-bold">TERMASUK</span>
                    </div>
                    <div className="pt-space-xs mt-space-xs flex justify-between items-center text-on-surface font-body-semibold text-body-semibold border-t border-surface-container-high">
                      <span className="font-bold">Total Tagihan</span>
                      <span className="text-title-md font-title-md text-primary font-bold">
                        {formatRupiah(subtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Primary Booking Action Button */}
                  <button
                    onClick={handleBooking}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#f57c00] hover:bg-[#ea580c] active:scale-[0.99] text-white font-body-semibold text-body-lg shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer font-bold"
                    type="button"
                  >
                    <MaterialIcon name="lock" className="text-[20px]" />
                    <span>Pesan Sekarang</span>
                  </button>
                </div>

                {/* Secondary Cross-sell: Private Trip / Custom Group Card */}
                <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex items-center justify-between gap-space-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                      <MaterialIcon name="family_restroom" className="text-[22px]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                        Rombongan Khusus / Private?
                      </span>
                      <span className="font-caption text-caption text-outline">
                        Jeep eksklusif 1 keluarga tanpa campur orang lain.
                      </span>
                    </div>
                  </div>
                  <a
                    className="px-3 py-1.5 rounded-lg bg-surface-container text-primary font-body-semibold text-caption hover:bg-surface-container-high transition-colors shrink-0 font-bold"
                    href="https://wa.me/6281234567890?text=Halo%20Nusabook,%20saya%20butuh%20paket%20Private%20Bromo"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Hubungi CS
                  </a>
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
            <img
              alt="Nusabook Brand Logo"
              className="h-6 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1U3Dc9ujBNuM7mgSPnQReIZqJpbXFrgBa8_v7KkLAxGoGg-NCEjy4Aw-pYXp9CiKsNHmqpLEMF2TzdVBIjehkrvhOp1eK3eYIfA64704YK0SOXTQb6gBESs7Xo_FJmMnJpYGla99v_5KwfnRrPX3mOY81yQP8OnvPcRn6zitzBMcBKr14d077mBMYP9cT2gZ37ppBCN_acPq-kd6A4kNOGLXs6_FK5SnaikbZm8kopURdxI0y2YnoftJw"
            />
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
          <div className="font-caption text-caption text-outline">© 2026 Nusabook Indonesia. Hak Cipta Dilindungi.</div>
        </div>
      </footer>
    </div>
  );
}
