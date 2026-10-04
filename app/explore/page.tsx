"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/icon";

interface ExplorePackage {
  id: string;
  title: string;
  slug: string;
  category: "open_trip" | "private_trip" | "liveaboard" | "midnight";
  categoryLabel: string;
  durationDays: number;
  durationNights: number;
  durationLabel: string;
  destinationCity: string;
  locationDetails: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  agentName: string;
  agentSlug: string;
  isVerified: boolean;
  nextDepartureDate: string;
  originalPrice?: number;
  pricePerPax: number;
  priceNote?: string;
  totalQuota: number;
  availableQuota: number;
  quotaStatus: "urgent" | "safe" | "warning";
  quotaLabel: string;
  quotaBadge: string;
  occupancyPercent: number;
  rating: number;
  reviewCount: number;
  vehicleType: string;
  facility: string;
}

const EXPLORE_PACKAGES: ExplorePackage[] = [
  {
    id: "pkg-1",
    title: "Open Trip Bromo Sunrise & Savana Teletubbies 1D",
    slug: "bromo-sunrise-savana",
    category: "open_trip",
    categoryLabel: "Open Trip",
    durationDays: 1,
    durationNights: 0,
    durationLabel: "1 Hari / Midnight",
    destinationCity: "Malang",
    locationDetails: "TNBTS, Jawa Timur",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcX4F4QbtGOXCOeZQ4KaZdUizrGjplMtolbXn1KUVk0GAgCI6pk7ZaN-hqQbhtq-4yeeXkphBG5LNAPi6n-QqybUe21PrPA155-tfdWzAHm7KQEMOSl2-DwHjDIluIbjNKTbOCPcgCe2eS6b_bHps-qa0dg37yhRmljsIy3EGSRFGC5Lh91nkFkwsqZYPRIpZl4jm5jd0OdnwcGZv-OZSj6yA6TZladJWPrMy-3NV4SVGElyLHsCk",
    thumbnailAlt: "Dramatic sunrise over Mount Bromo with sea of clouds and Mount Semeru erupting",
    agentName: "Pesona Nusantara Tour (Malang)",
    agentSlug: "pesona-merapi",
    isVerified: true,
    nextDepartureDate: "Minggu, 18 Okt 2026",
    originalPrice: 550000,
    pricePerPax: 450000,
    totalQuota: 12,
    availableQuota: 2,
    quotaStatus: "urgent",
    quotaLabel: "Tersisa 2 Kursi Lagi!",
    quotaBadge: "Pessimistic Hold",
    occupancyPercent: 90,
    rating: 4.9,
    reviewCount: 248,
    vehicleType: "Jeep 4x4 Hardtop",
    facility: "Tiket TNBTS Termasuk",
  },
  {
    id: "pkg-2",
    title: "Labuan Bajo Komodo Phinisi Sail 3D2N AC Cabin",
    slug: "labuan-bajo-komodo-phinisi",
    category: "liveaboard",
    categoryLabel: "Liveaboard",
    durationDays: 3,
    durationNights: 2,
    durationLabel: "3 Hari 2 Malam",
    destinationCity: "Labuan Bajo",
    locationDetails: "Labuan Bajo, NTT",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBivb0bPrQvfD2TrcdjJxqpLb2GepfU8gv4L3xqBzlu5Wj4Y9LeQdIBQoXk4jmiBZggicy4XIubGjZhjP7uHUSH_cmVsZIag8tNrNfqLFORnCzGRb3uedKXIOPLNXRB9kH_4geKG9BrQl6IWrVqT33N1rbJptT4vx6AnFpgwHsb1O-YzxU-E7VnSY5SjDe2VnvNrqaJqLtmamds5wzTqywE2Fz45w6HD7Ep2QAS2yI6j_LQWpGZ-Sk",
    thumbnailAlt: "Traditional Indonesian Phinisi wooden schooner cruising in Komodo National Park",
    agentName: "Flores Bahari Mandiri (Labuan Bajo)",
    agentSlug: "flores-bahari",
    isVerified: true,
    nextDepartureDate: "Jumat, 23 Okt 2026",
    pricePerPax: 2850000,
    priceNote: "All-inclusive trip",
    totalQuota: 16,
    availableQuota: 4,
    quotaStatus: "safe",
    quotaLabel: "Tersisa 4 Kabin (Kapasitas 16 Pax)",
    quotaBadge: "Instant Book",
    occupancyPercent: 65,
    rating: 4.9,
    reviewCount: 420,
    vehicleType: "Phinisi Superior AC",
    facility: "Ranger & Drone Included",
  },
  {
    id: "pkg-3",
    title: "Kawah Ijen Blue Fire & Kawah Wurung Midnight",
    slug: "kawah-ijen-blue-fire",
    category: "midnight",
    categoryLabel: "Midnight Tour",
    durationDays: 1,
    durationNights: 0,
    durationLabel: "1 Hari (Midnight)",
    destinationCity: "Banyuwangi",
    locationDetails: "Banyuwangi, Jatim",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLgFs8-wRy35MRB1MmqXtf7lOHb2kq3f6Bp4AFu_m-g5jffFf5Nhk5lxyKwRrTl8T4sREu8v_k8qUJhZ7wjy4aGsv64QZKp6NJDXsWQBp_qmQabp5b8tG8YqO-EQTX3YxFgHFBWAQPN65m6FHIXfflaUmvlZLjlKUMrC8erx00tCp33bQC8rmNVcQBt8E8eDOnculalKBkzJnCncdsfzCB9f0fMvtbbzQbuk9xPOJWf21-qLA47Ic",
    thumbnailAlt: "Rare natural blue fire electric flames burning inside Mount Ijen crater",
    agentName: "Osing Heritage Travel (Banyuwangi)",
    agentSlug: "osing-heritage",
    isVerified: true,
    nextDepartureDate: "Kamis, 22 Okt 2026",
    pricePerPax: 380000,
    priceNote: "Harga Transparan",
    totalQuota: 18,
    availableQuota: 5,
    quotaStatus: "warning",
    quotaLabel: "Tersisa 5 Kursi Tersedia",
    quotaBadge: "Pasti Berangkat",
    occupancyPercent: 72,
    rating: 4.8,
    reviewCount: 189,
    vehicleType: "Transport PP Stasiun",
    facility: "Masker Gas & Guide Resmi",
  },
  {
    id: "pkg-4",
    title: "Eksotisme Karimunjawa Bahari 3D2N Full Snorkeling",
    slug: "karimunjawa-bahari-snorkeling",
    category: "open_trip",
    categoryLabel: "Bahari Trip",
    durationDays: 3,
    durationNights: 2,
    durationLabel: "3 Hari 2 Malam",
    destinationCity: "Jepara",
    locationDetails: "Jepara, Jawa Tengah",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDn3zNMCoxWEaGCCJWqM_r8VWXFf5cf99VKdK2pcsO-0xEYoS-VweBH-zxtDpKwp1H5OsFiliWX5E8pSigJepCqXNM1RMUqFwq9Ls4PUSs-IVj24LtpwE0WuQAnK6mQKv7E5m1d9eRpp5aWqkp3kFZ_qDl9uNIo_HaYE53mYiJGb3tWVocaAWKzHUvpx8u8f2Y_tB9hmmbriIZEBYi3xDteHV7dpi66wfZavqCwU-OCRMPGSdvCx1E",
    thumbnailAlt: "Pristine coral reef and crystal clear turquoise sea in Karimunjawa Jepara",
    agentName: "Karimun Wave Explorer (Jepara)",
    agentSlug: "karimun-wave",
    isVerified: true,
    nextDepartureDate: "Rabu, 28 Okt 2026",
    pricePerPax: 1250000,
    priceNote: "Paket Komplit Bahari",
    totalQuota: 20,
    availableQuota: 8,
    quotaStatus: "safe",
    quotaLabel: "Tersisa 8 Kursi (Express Bahari)",
    quotaBadge: "Pasti Berangkat",
    occupancyPercent: 55,
    rating: 4.9,
    reviewCount: 312,
    vehicleType: "Express Bahari PP",
    facility: "Homestay AC + Makan 6x",
  },
  {
    id: "pkg-5",
    title: "Dieng Golden Sunrise Sikunir & Telaga Warna 2D1N",
    slug: "dieng-golden-sunrise-highlands",
    category: "open_trip",
    categoryLabel: "Culture & Nature",
    durationDays: 2,
    durationNights: 1,
    durationLabel: "2 Hari 1 Malam",
    destinationCity: "Yogyakarta",
    locationDetails: "Wonosobo, Jawa Tengah",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB18ZHxQoGmBSKU2KmCtG-OyjRLJniCW1TmJUjhUlx6rHfh8nXxmii_XAskAmH5jvbNcVTckIm9IpXExdJTMPw4q83tQ-YTHT_7GZCRQKIRQ8hxnsYXS3M73qVzfmLp1ECxH-n8AyZ4Y-tTCCsQt1-MuK2AlMG4UtquTalUjN-EhHdyl9UpTQOhUqAaaK5V2RLK4gQLDQZBnooYGTMY4_Fl3S2dHTG1o6UqKMlPC3WPpqm0fveY6nM",
    thumbnailAlt: "Stunning golden sunrise from Sikunir hill overlooking lush volcanic valleys",
    agentName: "Laras Dieng Adventure (Wonosobo)",
    agentSlug: "wonoland-dieng",
    isVerified: true,
    nextDepartureDate: "Sabtu, 31 Okt 2026",
    pricePerPax: 650000,
    priceNote: "Best Value Weekend",
    totalQuota: 15,
    availableQuota: 3,
    quotaStatus: "urgent",
    quotaLabel: "Tersisa 3 Kursi",
    quotaBadge: "Cepat Habis",
    occupancyPercent: 85,
    rating: 4.7,
    reviewCount: 142,
    vehicleType: "Homestay + Mie Ongklok",
    facility: "Tiket Candi Arjuna",
  },
  {
    id: "pkg-6",
    title: "Derawan & Maratua Island Hopping Paradise 4D3N",
    slug: "derawan-maratua-island-hopping",
    category: "open_trip",
    categoryLabel: "Island Hopping",
    durationDays: 4,
    durationNights: 3,
    durationLabel: "4 Hari 3 Malam",
    destinationCity: "Berau",
    locationDetails: "Berau, Kaltim",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCt6L0eIGDDDHL8-2AFfICpuGpwWbWMe-AtzfMj56vX-JzgMsg0NbdqU3q8qAivhki39IBeo0BCcBpCZn9W2oJwwlyDPqbGVYbtvoE7hJ9HOlAlImERLkgBkY74RnFaElXTyMVDv-0hCcVS_REOLP5ewHWi6L71qcXW9Y81SZdh60yHL2ovsy-c9VX9VabnvUdEcv0KhYOr82Jr6SBbxXK76CCzyMh0nD4-8RFVlJ9fClgA_-ktNIo",
    thumbnailAlt: "Stingless golden jellyfish drifting in marine lake Kakaban Island Derawan",
    agentName: "Borneo Sea Expeditions (Berau)",
    agentSlug: "borneo-sea",
    isVerified: true,
    nextDepartureDate: "Kamis, 05 Nov 2026",
    pricePerPax: 2450000,
    priceNote: "Premium Eksplorasi",
    totalQuota: 16,
    availableQuota: 6,
    quotaStatus: "safe",
    quotaLabel: "Tersisa 6 Kursi",
    quotaBadge: "Jadwal Pasti",
    occupancyPercent: 60,
    rating: 4.9,
    reviewCount: 98,
    vehicleType: "Speedboat & Water Villa",
    facility: "Ubur-ubur Kakaban",
  },
];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function MarketplaceExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [departureDate, setDepartureDate] = useState("18 Okt - 25 Okt");
  const [paxCount, setPaxCount] = useState(2);
  const [selectedTripType, setSelectedTripType] = useState("");

  // Filters
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [guaranteedOnly, setGuaranteedOnly] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [sortBy, setSortBy] = useState("schedule");

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCity("all");
    setDepartureDate("18 Okt - 25 Okt");
    setPaxCount(2);
    setSelectedTripType("");
    setVerifiedOnly(false);
    setAvailableOnly(false);
    setGuaranteedOnly(false);
    setUrgentOnly(false);
    setMaxPrice(5000000);
    setSelectedDuration("");
    setSortBy("schedule");
  };

  const filteredPackages = useMemo(() => {
    let result = EXPLORE_PACKAGES.filter((pkg) => {
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = pkg.title.toLowerCase().includes(query);
        const matchesCity = pkg.destinationCity.toLowerCase().includes(query);
        const matchesAgent = pkg.agentName.toLowerCase().includes(query);
        const matchesLocation = (pkg.locationDetails || "").toLowerCase().includes(query);
        if (!matchesTitle && !matchesCity && !matchesAgent && !matchesLocation) return false;
      }

      // City filter
      if (selectedCity && selectedCity !== "all") {
        const cityMap: Record<string, string[]> = {
          "mlg-sby": ["malang", "surabaya"],
          bwx: ["banyuwangi"],
          "smg-jpr": ["semarang", "jepara"],
          lbj: ["labuan bajo"],
          "yog-wsb": ["yogyakarta", "wonosobo"],
        };
        const targets = cityMap[selectedCity] || [selectedCity.toLowerCase()];
        if (!targets.some((c) => pkg.destinationCity.toLowerCase().includes(c))) {
          return false;
        }
      }

      // Trip type
      if (selectedTripType) {
        if (selectedTripType === "open_trip" && pkg.category !== "open_trip") return false;
        if (selectedTripType === "private_trip" && pkg.category !== "private_trip") return false;
      }

      // Price filter
      if (maxPrice < 5000000) {
        if (pkg.pricePerPax > maxPrice) return false;
      }

      // Quota filters
      if (availableOnly && pkg.availableQuota <= 0) return false;
      if (urgentOnly && pkg.availableQuota > 3) return false;

      // Verified filter
      if (verifiedOnly && !pkg.isVerified) return false;

      // Duration filter
      if (selectedDuration) {
        if (selectedDuration === "1d" && pkg.durationDays !== 1) return false;
        if (selectedDuration === "2d1n" && !(pkg.durationDays === 2 && pkg.durationNights === 1)) return false;
        if (selectedDuration === "3d2n" && !(pkg.durationDays === 3 && pkg.durationNights === 2)) return false;
        if (selectedDuration === "4d3n" && pkg.durationDays < 4) return false;
      }

      // Pax count requirement
      if (paxCount > 1) {
        if (pkg.availableQuota < paxCount) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.pricePerPax - b.pricePerPax);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "quota") {
      result.sort((a, b) => b.availableQuota - a.availableQuota);
    }

    return result;
  }, [
    searchQuery,
    selectedCity,
    selectedTripType,
    maxPrice,
    availableOnly,
    urgentOnly,
    verifiedOnly,
    selectedDuration,
    paxCount,
    sortBy,
  ]);

  return (
    <div className="bg-surface font-body-regular text-on-surface antialiased min-h-screen flex flex-col">
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
              <span className="font-micro-badge text-micro-badge text-on-surface-variant font-bold">
                Live Sync Aktif
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-space-lg">
            <Link
              className="font-body-semibold text-body-semibold text-primary transition-colors"
              href="/explore"
            >
              Jelajah Wisata
            </Link>
            <Link
              className="font-body-regular text-body-regular text-on-surface-variant hover:text-on-surface transition-colors"
              href="/pesona-merapi"
            >
              Etalase Paket
            </Link>
            <Link
              className="font-body-regular text-body-regular text-on-surface-variant hover:text-on-surface transition-colors"
              href="/pesona-merapi/packages/sunrise-lava-tour-merapi"
            >
              Checkout & Reservasi
            </Link>
            <Link
              className="font-body-regular text-body-regular text-on-surface-variant hover:text-on-surface transition-colors"
              href="/dashboard"
            >
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
                <span className="font-body-semibold text-body-semibold text-on-surface leading-tight font-bold">
                  Bambang Pamungkas
                </span>
                <span className="font-caption text-caption text-outline">Pesona Nusantara</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-14rem)] flex-1">
        <div className="flex flex-col w-full">
          {/* HERO & ADVANCED DISCOVERY SEARCH WIDGET */}
          <section className="relative w-full bg-gradient-to-b from-primary via-primary-container to-surface-container-low text-on-primary overflow-hidden">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#ffffff 1.5px, transparent 1.5px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-16">
              {/* Top Badges & Value Pitch */}
              <div className="flex flex-wrap items-center gap-space-sm mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-surface-container-lowest font-micro-badge text-micro-badge">
                  <MaterialIcon
                    name="verified"
                    className="text-[15px] text-secondary-container"
                  />
                  Terverifikasi Kemenparekraf & NIB Resmi
                </span>
              </div>
              <div className="max-w-4xl mb-8">
                <h1 className="font-display text-display tracking-tight text-surface-container-lowest mb-3 font-bold">
                  Eksplorasi Keindahan Nusantara Bersama Operator Lokal Terpercaya
                </h1>
                <p className="font-body-lg text-body-lg text-primary-fixed-dim/90 max-w-3xl leading-relaxed">
                  Jaminan kuota kursi real-time langsung tersinkronisasi dengan sistem operasional agen. Tanpa risiko
                  overbooking, bergaransi escrow aman, dan terverifikasi izin NIB/TDUP.
                </p>
              </div>

              {/* Advanced Search Filter Bar Panel */}
              <div className="w-full bg-surface-container-lowest text-on-surface rounded-xl shadow-xl p-5 lg:p-6">
                {/* Trip Type Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4">
                  {[
                    { id: "", label: "Semua Tipe", icon: "explore" },
                    { id: "open_trip", label: "Open Trip (Gabungan)", icon: "groups" },
                    { id: "private_trip", label: "Private Trip (Eksklusif)", icon: "stars" },
                    { id: "family", label: "Family & Outing", icon: "family_restroom" },
                  ].map((tab) => {
                    const isActive = selectedTripType === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedTripType(tab.id)}
                        className={`px-4 py-2 rounded-lg font-body-semibold text-body-semibold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap ${
                          isActive
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                        }`}
                        type="button"
                      >
                        <MaterialIcon name={tab.icon} className="text-[18px]" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Inputs Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
                  {/* Destinasi Input */}
                  <div className="lg:col-span-4 flex flex-col gap-1.5">
                    <label className="font-micro-badge text-micro-badge text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-bold">
                      <MaterialIcon name="pin_drop" className="text-[15px] text-primary" />
                      Destinasi Impian
                    </label>
                    <div className="relative">
                      <input
                        className="w-full bg-surface-container-low text-on-surface font-body-regular text-body-regular rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                        placeholder="Ketik destinasi tujuan..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <span className="absolute right-3 top-3 material-symbols-outlined text-outline text-[18px]">
                        travel_explore
                      </span>
                    </div>
                  </div>

                  {/* Kota Keberangkatan Dropdown */}
                  <div className="lg:col-span-3 flex flex-col gap-1.5">
                    <label className="font-micro-badge text-micro-badge text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-bold">
                      <MaterialIcon name="directions_boat" className="text-[15px] text-primary" />
                      Meeting Point
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full bg-surface-container-low text-on-surface font-body-regular text-body-regular rounded-lg px-3.5 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all cursor-pointer"
                      >
                        <option value="all">Semua Kota Asal</option>
                        <option value="mlg-sby">Malang / Surabaya</option>
                        <option value="bwx">Banyuwangi</option>
                        <option value="smg-jpr">Semarang / Jepara</option>
                        <option value="lbj">Labuan Bajo</option>
                        <option value="yog-wsb">Yogyakarta / Wonosobo</option>
                      </select>
                      <span className="absolute right-3 top-3 material-symbols-outlined text-outline pointer-events-none text-[18px]">
                        keyboard_arrow_down
                      </span>
                    </div>
                  </div>

                  {/* Tanggal Keberangkatan */}
                  <div className="lg:col-span-2 flex flex-col gap-1.5">
                    <label className="font-micro-badge text-micro-badge text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-bold">
                      <MaterialIcon name="calendar_today" className="text-[15px] text-primary" />
                      Jadwal Trip
                    </label>
                    <input
                      className="w-full bg-surface-container-low text-on-surface font-body-regular text-body-regular rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all cursor-pointer"
                      type="text"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                    />
                  </div>

                  {/* Pax Counter */}
                  <div className="lg:col-span-1 flex flex-col gap-1.5">
                    <label className="font-micro-badge text-micro-badge text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-bold">
                      <MaterialIcon name="person" className="text-[15px] text-primary" />
                      Pax
                    </label>
                    <div className="flex items-center justify-between bg-surface-container-low rounded-lg px-2.5 py-2">
                      <button
                        className="text-primary hover:text-primary-container font-headline-sm leading-none font-bold"
                        onClick={() => setPaxCount((prev) => Math.max(1, prev - 1))}
                        type="button"
                      >
                        -
                      </button>
                      <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                        {paxCount}
                      </span>
                      <button
                        className="text-primary hover:text-primary-container font-headline-sm leading-none font-bold"
                        onClick={() => setPaxCount((prev) => Math.min(20, prev + 1))}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* CTA Cari Jadwal */}
                  <div className="lg:col-span-2">
                    <button
                      className="w-full bg-secondary-container hover:bg-[#e07106] active:scale-[0.98] text-surface-container-lowest font-body-semibold text-body-semibold rounded-lg px-4 py-3 flex items-center justify-center gap-2 shadow-md transition-all font-bold"
                      type="button"
                    >
                      <MaterialIcon name="search" className="text-[20px]" />
                      <span>Cari Kuota</span>
                    </button>
                  </div>
                </div>

                {/* Trending Quick Filters */}
                <div className="mt-4 pt-3 flex flex-wrap items-center gap-2">
                  <span className="font-caption text-caption text-outline mr-1">Tren Pencarian:</span>
                  {[
                    { label: "🔥 Bromo Sunrise Midnight", query: "Bromo" },
                    { label: "⛵ Phinisi Komodo 3D2N", query: "Komodo" },
                    { label: "🤿 Snorkeling Menjangan", query: "Menjangan" },
                    { label: "🌋 Kawah Ijen Blue Fire", query: "Ijen" },
                    { label: "🌊 Karimunjawa Bahari", query: "Karimunjawa" },
                  ].map((trend) => (
                    <button
                      key={trend.label}
                      onClick={() => setSearchQuery(trend.query)}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-caption font-body-regular bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
                      type="button"
                    >
                      {trend.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* P2MW BANNER STRIP */}
          <section className="w-full bg-surface-container py-3">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-on-surface">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary">
                  <MaterialIcon name="verified_user" className="text-[18px]" />
                </span>
                <div className="text-left">
                  <span className="font-body-semibold text-body-semibold block text-primary font-bold">
                    Inisiatif Program Pembinaan Mahasiswa Wirausaha (P2MW) 2026
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant">
                    Didanai Ditjen Diktiristek & Pendampingan Universitas Tidar • Standardisasi Digitalisasi Ekosistem UMKM Maritim.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-primary font-body-semibold text-caption shrink-0 font-bold">
                <span>Transparansi Biaya & Legalitas Terjamin</span>
                <MaterialIcon name="arrow_forward" className="text-[16px]" />
              </div>
            </div>
          </section>

          {/* 2-COLUMN MAIN CONTENT: FILTER SIDEBAR + TOUR PACKAGES GRID */}
          <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* STICKY FILTER SIDEBAR (LEFT) */}
              <aside className="lg:col-span-3 lg:sticky lg:top-20 space-y-6">
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm space-y-6">
                  {/* Filter Header */}
                  <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-2">
                      <MaterialIcon name="tune" className="text-primary text-[20px]" />
                      <span className="font-title-md text-title-md text-on-surface font-bold">Filter Cermat</span>
                    </div>
                    <button
                      onClick={resetAllFilters}
                      className="text-caption font-body-semibold text-secondary hover:underline font-bold"
                      type="button"
                    >
                      Reset Semua
                    </button>
                  </div>

                  {/* Verified Switch Toggle */}
                  <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="font-body-semibold text-caption text-primary flex items-center gap-1 font-bold">
                        <MaterialIcon
                          name="shield"
                          className="text-[15px] text-secondary-container"
                        />
                        Mitra Terverifikasi
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        NIB & TDUP Resmi Saja
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="sr-only peer"
                        type="checkbox"
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                    </label>
                  </div>

                  {/* Real-Time Quota Status Filter */}
                  <div className="space-y-3">
                    <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                      Status Kuota Kursi
                    </span>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          checked={availableOnly}
                          onChange={(e) => setAvailableOnly(e.target.checked)}
                          className="w-4 h-4 rounded text-primary focus:ring-primary"
                          type="checkbox"
                        />
                        <span className="font-body-regular text-body-regular text-on-surface">
                          Tersedia Instan (Auto-Lock)
                        </span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          checked={guaranteedOnly}
                          onChange={(e) => setGuaranteedOnly(e.target.checked)}
                          className="w-4 h-4 rounded text-primary focus:ring-primary"
                          type="checkbox"
                        />
                        <span className="font-body-regular text-body-regular text-on-surface">
                          Pasti Berangkat (Guaranteed)
                        </span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          checked={urgentOnly}
                          onChange={(e) => setUrgentOnly(e.target.checked)}
                          className="w-4 h-4 rounded text-primary focus:ring-primary"
                          type="checkbox"
                        />
                        <span className="font-body-regular text-body-regular text-secondary font-body-semibold flex items-center gap-1 font-bold">
                          <span>Sisa Kursi Menipis (≤ 3 Kursi)</span>
                          <MaterialIcon name="local_fire_department" className="text-[14px]" />
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Budget Range Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-caption font-body-semibold">
                      <span className="text-on-surface">Rentang Anggaran</span>
                      <span className="text-primary font-body-semibold font-bold">
                        Maks: {formatRupiah(maxPrice)}
                      </span>
                    </div>
                    <input
                      className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                      max="5000000"
                      min="200000"
                      step="100000"
                      type="range"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                    <div className="flex justify-between text-caption font-caption text-outline">
                      <span>Rp 200rb</span>
                      <span>Rp 5.0jt+</span>
                    </div>
                  </div>

                  {/* Durasi Wisata Pills */}
                  <div className="space-y-2.5">
                    <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                      Durasi Perjalanan
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "1d", label: "1 Hari / Midnight" },
                        { id: "2d1n", label: "2D 1N" },
                        { id: "3d2n", label: "3D 2N" },
                        { id: "4d3n", label: "4D 3N+" },
                      ].map((dur) => {
                        const isActive = selectedDuration === dur.id;
                        return (
                          <button
                            key={dur.id}
                            onClick={() => setSelectedDuration(isActive ? "" : dur.id)}
                            className={`px-2.5 py-1.5 text-caption font-body-semibold rounded-lg text-center font-bold transition-all ${
                              isActive
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                            }`}
                            type="button"
                          >
                            {dur.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fasilitas Termasuk */}
                  <div className="space-y-2.5">
                    <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                      Fasilitas Termasuk
                    </span>
                    <div className="space-y-2 font-body-regular text-body-regular text-on-surface-variant">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input defaultChecked className="w-4 h-4 rounded text-primary" type="checkbox" />
                        <span>Armada Jeep / Boat Berizin</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input defaultChecked className="w-4 h-4 rounded text-primary" type="checkbox" />
                        <span>Tiket TNBTS / TN Komodo</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input className="w-4 h-4 rounded text-primary" type="checkbox" />
                        <span>Makan & Air Mineral</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input className="w-4 h-4 rounded text-primary" type="checkbox" />
                        <span>Dokumentasi Drone & DSLR</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input className="w-4 h-4 rounded text-primary" type="checkbox" />
                        <span>Asuransi Jasa Raharja</span>
                      </label>
                    </div>
                  </div>

                  {/* Rating Operator */}
                  <div className="space-y-2">
                    <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                      Rating Operator
                    </span>
                    <div className="space-y-1.5">
                      <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low cursor-pointer">
                        <div className="flex items-center gap-1.5 text-caption font-body-semibold text-on-surface font-bold">
                          <MaterialIcon
                            name="star"
                            className="text-[16px] text-secondary-container"
                          />
                          <span>4.8 ke atas (Rekomendasi)</span>
                        </div>
                        <input defaultChecked className="text-primary" name="rating-filter" type="radio" />
                      </label>
                      <label className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low cursor-pointer">
                        <div className="flex items-center gap-1.5 text-caption font-body-semibold text-on-surface font-bold">
                          <MaterialIcon
                            name="star"
                            className="text-[16px] text-secondary-container"
                          />
                          <span>4.5 ke atas</span>
                        </div>
                        <input className="text-primary" name="rating-filter" type="radio" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Help Widget */}
                <div className="bg-primary/5 rounded-xl p-4 text-on-surface space-y-2">
                  <div className="flex items-center gap-2 text-primary font-body-semibold text-body-semibold font-bold">
                    <MaterialIcon name="support_agent" className="text-[18px]" />
                    <span>Butuh Custom Group?</span>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Konsultasikan paket corporate gathering, honeymoon, atau charter kapal khusus melalui konsultan trip Nusabook.
                  </p>
                  <button
                    className="w-full py-2 px-3 text-caption font-body-semibold text-primary bg-surface-container-lowest rounded-lg hover:bg-surface-container transition-all flex items-center justify-center gap-1 font-bold"
                    type="button"
                  >
                    <MaterialIcon name="chat" className="text-[15px]" />
                    Hubungi Konsultan
                  </button>
                </div>
              </aside>

              {/* RESULTS & TOUR CATALOG (RIGHT) */}
              <div className="lg:col-span-9 space-y-6">
                {/* Header Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Menampilkan {filteredPackages.length} Paket Wisata
                      </h2>
                    </div>
                  </div>
                  {/* Sorting Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-caption text-caption text-outline">Urutkan:</span>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-surface-container-low font-body-semibold text-caption text-on-surface rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-bold"
                      >
                        <option value="schedule">Jadwal Terdekat</option>
                        <option value="price_asc">Harga Terendah</option>
                        <option value="rating">Rating Tertinggi</option>
                        <option value="quota">Sisa Kuota Terbanyak</option>
                      </select>
                      <MaterialIcon
                        name="expand_more"
                        className="absolute right-2 top-2 text-outline text-[16px] pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 6 TOUR CARDS GRID */}
                {filteredPackages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="relative h-48 w-full overflow-hidden">
                            <img
                              alt={pkg.thumbnailAlt}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              src={pkg.thumbnailUrl}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                              {pkg.isVerified && (
                                <span className="px-2 py-0.5 rounded-full bg-primary/90 text-on-primary font-micro-badge text-micro-badge backdrop-blur-sm flex items-center gap-1 font-bold">
                                  <MaterialIcon
                                    name="verified"
                                    className="text-[13px] text-secondary-container"
                                  />
                                  Mitra Terverifikasi
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface font-micro-badge text-micro-badge backdrop-blur-sm font-bold">
                                {pkg.categoryLabel}
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-surface-container-lowest">
                              <div className="flex items-center gap-1 font-caption text-caption">
                                <MaterialIcon name="location_on" className="text-[16px]" />
                                <span>{pkg.locationDetails}</span>
                              </div>
                              <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm font-caption text-caption">
                                <MaterialIcon
                                  name="star"
                                  className="text-secondary-container text-[14px]"
                                />
                                <span className="font-body-semibold font-bold">{pkg.rating}</span>
                                <span className="text-outline-variant">({pkg.reviewCount})</span>
                              </div>
                            </div>
                          </div>

                          {/* Card Content Details */}
                          <div className="p-4 space-y-3">
                            <div className="text-caption font-body-semibold text-primary font-bold">
                              {pkg.agentName}
                            </div>
                            <h3 className="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors leading-snug font-bold">
                              {pkg.title}
                            </h3>

                            {/* Quota Progress Widget */}
                            {pkg.quotaStatus === "urgent" ? (
                              <div className="p-2.5 rounded-lg bg-error-container/40 space-y-1.5">
                                <div className="flex items-center justify-between text-caption">
                                  <span className="font-body-semibold text-error flex items-center gap-1 font-bold">
                                    <MaterialIcon
                                      name="local_fire_department"
                                      className="text-[15px] animate-pulse"
                                    />
                                    {pkg.quotaLabel}
                                  </span>
                                  <span className="font-caption text-caption text-on-error-container">
                                    {pkg.quotaBadge}
                                  </span>
                                </div>
                                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-error h-full rounded-full transition-all duration-500"
                                    style={{ width: `${pkg.occupancyPercent}%` }}
                                  />
                                </div>
                              </div>
                            ) : pkg.quotaStatus === "warning" ? (
                              <div className="p-2.5 rounded-lg bg-[#fffbeb] space-y-1.5">
                                <div className="flex items-center justify-between text-caption">
                                  <span className="font-body-semibold text-[#d97706] flex items-center gap-1.5 font-bold">
                                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                                    {pkg.quotaLabel}
                                  </span>
                                  <span className="font-caption text-caption text-[#d97706]">
                                    {pkg.quotaBadge}
                                  </span>
                                </div>
                                <div className="w-full bg-[#fef3c7] h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-[#f59e0b] h-full rounded-full transition-all duration-500"
                                    style={{ width: `${pkg.occupancyPercent}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="p-2.5 rounded-lg bg-[#ecfdf5] space-y-1.5">
                                <div className="flex items-center justify-between text-caption">
                                  <span className="font-body-semibold text-[#059669] flex items-center gap-1.5 font-bold">
                                    <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                                    {pkg.quotaLabel}
                                  </span>
                                  <span className="font-caption text-caption text-[#059669]">
                                    {pkg.quotaBadge}
                                  </span>
                                </div>
                                <div className="w-full bg-[#d1fae5] h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-[#10b981] h-full rounded-full transition-all duration-500"
                                    style={{ width: `${pkg.occupancyPercent}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Excursion Meta List */}
                            <div className="grid grid-cols-2 gap-2 text-caption text-on-surface-variant pt-1">
                              <div className="flex items-center gap-1.5">
                                <MaterialIcon name="schedule" className="text-[16px] text-primary" />
                                <span>{pkg.durationLabel}</span>
                              </div>
                              <div className="flex items-center gap-1.5 truncate">
                                <MaterialIcon name="directions_car" className="text-[16px] text-primary shrink-0" />
                                <span className="truncate">{pkg.vehicleType}</span>
                              </div>
                              <div className="flex items-center gap-1.5 truncate">
                                <MaterialIcon name="confirmation_number" className="text-[16px] text-primary shrink-0" />
                                <span className="truncate">{pkg.facility}</span>
                              </div>
                              <div className="flex items-center gap-1.5 truncate">
                                <MaterialIcon name="event_available" className="text-[16px] text-primary shrink-0" />
                                <span className="truncate">{pkg.nextDepartureDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom Price & CTA */}
                        <div className="p-4 pt-3 bg-surface-container-low flex items-center justify-between mt-2">
                          <div>
                            {pkg.originalPrice ? (
                              <span className="font-caption text-caption text-outline line-through block">
                                {formatRupiah(pkg.originalPrice)}
                              </span>
                            ) : (
                              <span className="font-caption text-caption text-outline block">
                                {pkg.priceNote || "Harga Transparan"}
                              </span>
                            )}
                            <div className="flex items-baseline gap-1">
                              <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                                {formatRupiah(pkg.pricePerPax)}
                              </span>
                              <span className="font-caption text-caption text-on-surface-variant">/pax</span>
                            </div>
                          </div>
                          <Link
                            href={`/${pkg.agentSlug}/packages/${pkg.slug}`}
                            className="px-4 py-2 bg-secondary-container hover:bg-[#e07106] text-surface-container-lowest font-body-semibold text-body-semibold rounded-lg shadow-sm transition-all flex items-center gap-1 font-bold"
                          >
                            <span>Pesan Sekarang</span>
                            <MaterialIcon name="arrow_forward" className="text-[16px]" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-surface-container-lowest rounded-xl p-12 text-center space-y-4 shadow-sm">
                    <MaterialIcon name="search_off" className="text-[48px] text-outline mx-auto" />
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Paket Wisata Tidak Ditemukan
                    </h3>
                    <p className="font-caption text-caption text-on-surface-variant max-w-md mx-auto">
                      Coba ubah kata kunci pencarian, sesuaikan filter harga, atau pilih kota destinasi populer lainnya.
                    </p>
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary-container transition"
                    >
                      Reset Semua Filter
                    </button>
                  </div>
                )}

                {/* PAGINATION BAR */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                  <span className="font-caption text-caption text-outline">
                    Menampilkan <strong className="text-on-surface">1 - {filteredPackages.length}</strong> dari{" "}
                    <strong className="text-on-surface">28</strong> paket wisata aktif
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container disabled:opacity-40 transition-colors"
                      disabled
                      type="button"
                    >
                      <MaterialIcon name="chevron_left" className="text-[18px]" />
                    </button>
                    <button
                      className="w-9 h-9 rounded-lg bg-primary text-on-primary font-body-semibold text-body-semibold flex items-center justify-center shadow-sm font-bold"
                      type="button"
                    >
                      1
                    </button>
                    <button
                      className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface font-body-semibold text-body-semibold flex items-center justify-center hover:bg-surface-container transition-colors font-bold"
                      type="button"
                    >
                      2
                    </button>
                    <button
                      className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface font-body-semibold text-body-semibold flex items-center justify-center hover:bg-surface-container transition-colors font-bold"
                      type="button"
                    >
                      3
                    </button>
                    <button
                      className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface font-body-semibold text-body-semibold flex items-center justify-center hover:bg-surface-container transition-colors font-bold"
                      type="button"
                    >
                      4
                    </button>
                    <button
                      className="w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors"
                      type="button"
                    >
                      <MaterialIcon name="chevron_right" className="text-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE HUB KEBERANGKATAN & PETA RUTE NUSANTARA */}
          <section className="w-full bg-surface-container-low py-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="font-micro-badge text-micro-badge text-secondary font-bold tracking-wider uppercase block mb-1">
                    Jaringan Logistik Maritim & Darat
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    Hub Keberangkatan & Koridor Wisata Nusantara
                  </h2>
                </div>
                <p className="font-body-regular text-body-regular text-on-surface-variant max-w-md">
                  Seluruh armada penyeberangan kapal cepat, speedboat, dan jip 4x4 terintegrasi langsung dengan manifest manifes KSOP & sistem operasional Nusabook.
                </p>
              </div>

              {/* Map & Hub Visual Bento Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Peta Interaktif Mockup Container */}
                <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm relative flex flex-col justify-between p-6">
                  <div
                    className="w-full h-80 bg-cover bg-center rounded-lg relative overflow-hidden"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBANSa1W6VgYnW3uCNDJRmf3B_fRjteJh5-D0iX7MW0E7yTcXGPjKoR1AUBh5So6jis5rcGG6Iu9QquRZInZPJJZfJY0HKfxrWFt9TZPWjo_2KfUEEN-IRUMBSvNHbVcD6i70Rc0Jf3N5m5pWEvPVYPt6to9duA7QxybhqNzoZs34HD88J4M2cc6pPc9y60J5uzY7K89DOxCziS-_38pn_S03y_OnD7H-Rhzt9EmfY3yw5eM6VCi_k")',
                    }}
                  >
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[0.5px]" />
                    {/* Hub Pins */}
                    <div className="absolute top-[52%] left-[28%] group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-secondary-container opacity-75" />
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-secondary-container items-center justify-center text-white text-[10px] font-bold">
                          1
                        </span>
                      </div>
                      <div className="mt-1 bg-surface-container-lowest text-on-surface text-[11px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                        Hub Malang & Bromo
                      </div>
                    </div>
                    <div className="absolute top-[48%] left-[24%] group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary items-center justify-center text-white text-[9px] font-bold">
                          2
                        </span>
                      </div>
                      <div className="mt-1 bg-surface-container-lowest text-on-surface text-[11px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                        Pelabuhan Kartini Jepara
                      </div>
                    </div>
                    <div className="absolute top-[54%] left-[34%] group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary items-center justify-center text-white text-[9px] font-bold">
                          3
                        </span>
                      </div>
                      <div className="mt-1 bg-surface-container-lowest text-on-surface text-[11px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                        Banyuwangi & Ketapang
                      </div>
                    </div>
                    <div className="absolute top-[58%] left-[54%] group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-secondary-container opacity-75" />
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-secondary-container items-center justify-center text-white text-[10px] font-bold">
                          4
                        </span>
                      </div>
                      <div className="mt-1 bg-surface-container-lowest text-on-surface text-[11px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                        Marina Labuan Bajo
                      </div>
                    </div>
                    <div className="absolute top-[35%] left-[45%] group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary items-center justify-center text-white text-[9px] font-bold">
                          5
                        </span>
                      </div>
                      <div className="mt-1 bg-surface-container-lowest text-on-surface text-[11px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                        Tanjung Batu Berau
                      </div>
                    </div>
                  </div>

                  {/* Bottom Operational Live Telemetry */}
                  <div className="grid grid-cols-3 gap-4 pt-4 mt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <MaterialIcon name="sailing" className="text-[20px]" />
                      </div>
                      <div>
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">42 Kapal</span>
                        <span className="font-caption text-caption text-outline block">Phinisi & Fastboat Aktif</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <MaterialIcon name="directions_car" className="text-[20px]" />
                      </div>
                      <div>
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">118 Jeep</span>
                        <span className="font-caption text-caption text-outline block">Armada Bromo & Ijen</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <MaterialIcon name="badge" className="text-[20px]" />
                      </div>
                      <div>
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">100% Legal</span>
                        <span className="font-caption text-caption text-outline block">Terverifikasi KSOP</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hub Detail Cards (Right Column) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-body-semibold text-body-semibold text-primary font-bold">
                        Hub Marina Labuan Bajo
                      </span>
                      <span className="font-micro-badge text-micro-badge px-2 py-0.5 bg-[#ecfdf5] text-[#059669] rounded-full font-bold">
                        Operasional Lancar
                      </span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      Titik kumpul dermaga KP3 / Marina Waterfront. Integrasi tiket digital SIMAKSI Taman Nasional Komodo & manifes syahbandar.
                    </p>
                    <div className="flex items-center gap-2 pt-1 font-caption text-caption text-secondary font-bold">
                      <MaterialIcon name="anchor" className="text-[15px]" />
                      <span>12 Trip Berangkat Minggu Ini</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-body-semibold text-body-semibold text-primary font-bold">
                        Hub Stasiun Kota Malang
                      </span>
                      <span className="font-micro-badge text-micro-badge px-2 py-0.5 bg-[#ecfdf5] text-[#059669] rounded-full font-bold">
                        Operasional Lancar
                      </span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      Titik jemput resmi Stasiun Malang Kotabaru & Bandara Abdulrachman Saleh untuk midnight trip Bromo via Tumpang & Tosari.
                    </p>
                    <div className="flex items-center gap-2 pt-1 font-caption text-caption text-secondary font-bold">
                      <MaterialIcon name="pin_drop" className="text-[15px]" />
                      <span>Penjemputan tepat waktu bergaransi</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-body-semibold text-body-semibold text-primary font-bold">
                        Hub Pelabuhan Jepara
                      </span>
                      <span className="font-micro-badge text-micro-badge px-2 py-0.5 bg-[#fffbeb] text-[#d97706] rounded-full font-bold">
                        Pantauan Ombak 1.2m
                      </span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      Dermaga Express Bahari rute Jepara-Karimunjawa. Live sync jadwal BMKG Maritim langsung ke tiket penumpang.
                    </p>
                    <div className="flex items-center gap-2 pt-1 font-caption text-caption text-primary font-bold">
                      <MaterialIcon name="water" className="text-[15px]" />
                      <span>Aman Berlayar Sesuai Notulen Syahbandar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3 PILAR KEAMANAN WISATAWAN (VALUE BADGES B2C) */}
          <section className="w-full bg-surface-container-lowest py-14">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="font-micro-badge text-micro-badge text-primary uppercase tracking-widest font-bold">
                  Standardisasi Ekosistem Nusabook
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  3 Pilar Keamanan & Transparansi Wisatawan
                </h2>
                <p className="font-body-regular text-body-regular text-on-surface-variant">
                  Perlindungan menyeluruh dari reservasi awal hingga kepulangan Anda dari destinasi Nusantara.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pilar 1 */}
                <div className="bg-surface-container-low p-6 rounded-xl space-y-4 hover:shadow-sm transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
                    <MaterialIcon name="lock_clock" className="text-[26px]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">
                      Slot Kuota Real-Time Tanpa Overbooking
                    </h3>
                    <p className="font-body-regular text-body-regular text-on-surface-variant leading-relaxed">
                      Arsitektur database Nusabook menggunakan mekanisme PostgreSQL atomic row-lock. Begitu Anda memilih tanggal, kursi langsung dikunci sementara hingga pembayaran selesai.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-caption font-body-semibold text-primary font-bold">
                    <MaterialIcon name="check_circle" className="text-[16px]" />
                    <span>Zero Double-Booking Guarantee</span>
                  </div>
                </div>

                {/* Pilar 2 */}
                <div className="bg-surface-container-low p-6 rounded-xl space-y-4 hover:shadow-sm transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container text-surface-container-lowest flex items-center justify-center shadow-sm">
                    <MaterialIcon name="account_balance" className="text-[26px]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">
                      Escrow Rekening Aman (Garansi Berangkat)
                    </h3>
                    <p className="font-body-regular text-body-regular text-on-surface-variant leading-relaxed">
                      Dana DP & pelunasan Anda ditampung di escrow payment gateway terdaftar OJK. Dana baru dicairkan ke operator setelah trip berjalan sesuai kesepakatan itenary.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-caption font-body-semibold text-secondary font-bold">
                    <MaterialIcon name="security" className="text-[16px]" />
                    <span>100% Refund Jika Operator Batal</span>
                  </div>
                </div>

                {/* Pilar 3 */}
                <div className="bg-surface-container-low p-6 rounded-xl space-y-4 hover:shadow-sm transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
                    <MaterialIcon name="qr_code_2" className="text-[26px]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">
                      E-Ticket & Manifes Resmi KSOP / TNBTS
                    </h3>
                    <p className="font-body-regular text-body-regular text-on-surface-variant leading-relaxed">
                      Tiket instan ber-QR Code, polis asuransi kecelakaan Jasa Raharja, dan konfirmasi titik kumpul langsung dikirimkan ke WhatsApp Anda dalam hitungan detik.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-caption font-body-semibold text-primary font-bold">
                    <MaterialIcon name="verified" className="text-[16px]" />
                    <span>Tervalidasi di Pintu Masuk Wisata</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* QUICK OPERATOR ONBOARDING CALLOUT STRIP */}
          <section className="w-full bg-primary text-on-primary py-8">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest font-bold">
                  Apakah Anda Pengelola Tour & Travel Lokal?
                </h3>
                <p className="font-body-regular text-body-regular text-primary-fixed-dim">
                  Tingkatkan penjualan paket wisata dengan sistem kuota digital real-time & sinkronisasi manifest otomatis Nusabook.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-lg bg-surface-container-lowest text-primary font-body-semibold text-body-semibold hover:bg-surface-container transition-all font-bold"
                >
                  Pelajari SaaS Operator
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-lg bg-secondary-container hover:bg-[#e07106] text-surface-container-lowest font-body-semibold text-body-semibold transition-all font-bold"
                >
                  Daftar Sebagai Mitra
                </Link>
              </div>
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
