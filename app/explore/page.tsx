"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/icon";

const HERO_SLIDES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=2000&q=80",
    title: "Gunung Bromo & Savana Teletubbies",
    location: "Malang & Probolinggo, Jawa Timur",
    badge: "DESTINASI TERPOPULER",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=80",
    title: "Labuan Bajo & Taman Nasional Komodo",
    location: "Nusa Tenggara Timur",
    badge: "LIVEABOARD PHINISI",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=2000&q=80",
    title: "Eksotisme Karimunjawa & Island Hopping",
    location: "Jepara, Jawa Tengah",
    badge: "SNORKELING & BAHARI",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
    title: "Kawah Ijen Blue Fire & Kawah Wurung",
    location: "Banyuwangi, Jawa Timur",
    badge: "MIDNIGHT TOUR",
  },
];

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Auto-play slide effect every 5 seconds with smooth crossfade blend
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <Link className="flex items-center gap-space-xs" href="/">
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
                N
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">Nusabook</span>
            </Link>
            <div className="hidden md:inline-flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-micro-badge text-micro-badge text-on-surface-variant font-bold">
                Live Sync Aktif
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-space-lg text-sm font-semibold">
            <Link
              className="text-primary font-bold transition-colors"
              href="/explore"
            >
              Jelajah Wisata
            </Link>
            <Link
              className="text-on-surface-variant hover:text-on-surface transition-colors"
              href="/pesona-merapi"
            >
              Etalase Paket
            </Link>
            <Link
              className="text-on-surface-variant hover:text-on-surface transition-colors"
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

            {/* Profile Dropdown Container */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-space-sm pl-space-xs cursor-pointer hover:bg-surface-container-low p-1.5 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-container text-primary font-bold text-xs flex items-center justify-center shadow-sm">
                  PN
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-body-semibold text-body-semibold text-on-surface leading-tight font-bold">
                    Mitra Agen
                  </span>
                  <span className="font-caption text-caption text-outline">Pesona Nusantara</span>
                </div>
                <MaterialIcon
                  name="expand_more"
                  className={`text-lg text-on-surface-variant transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/20 py-2 z-50 text-xs">
                  <div className="px-4 py-2.5 border-b border-outline-variant/15">
                    <p className="font-body-semibold text-on-surface font-bold text-xs">
                      Pesona Nusantara Tour
                    </p>
                    <p className="text-on-surface-variant text-[11px]">Mitra Agen Terverifikasi</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-on-surface hover:bg-surface-container-low font-body-semibold transition-colors"
                    >
                      <MaterialIcon name="dashboard" className="text-base text-primary" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-error font-body-semibold hover:bg-error-container/20 transition-colors"
                    >
                      <MaterialIcon name="logout" className="text-base text-error" />
                      <span>Logout</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-14rem)] flex-1">
        {/* Top Breadcrumb Bar (Matching Etalase Paket) */}
        <div className="w-full bg-surface-container-low py-space-sm px-6 lg:px-12 border-b border-outline-variant/15">
          <div className="max-w-7xl mx-auto flex items-center gap-space-xs text-on-surface-variant font-caption text-caption flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <MaterialIcon name="home" className="text-sm" /> Beranda
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="font-body-semibold text-primary font-bold">Jelajah Wisata Nusantara</span>
          </div>
        </div>

        <div className="flex flex-col w-full">
          {/* HERO BANNER SECTION (EXACT MATCH WITH ETALASE BANNER DIMENSIONS & GRADIENT) */}
          <section className="relative w-full">
            {/* Cover Banner with Slider */}
            <div className="w-full h-72 sm:h-80 lg:h-96 relative bg-cover bg-center overflow-hidden">
              {/* Crossfade Background Carousel */}
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = currentSlide === idx;
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
                    }`}
                  >
                    <img
                      src={slide.url}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}

              {/* Exact Gradient Overlay from Etalase: Fades image into surface background */}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-surface via-primary/30 to-black/50 pointer-events-none" />

              {/* Top Banner Overlay Controls & Badges */}
              <div className="relative z-30 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-12 flex justify-between items-start pt-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/90 backdrop-blur-md shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-micro-badge text-micro-badge text-primary uppercase font-bold">
                    Official Nusabook Verified Agency
                  </span>
                </div>

                {/* Slider Navigation Controls */}
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg font-caption text-caption">
                  <div className="flex items-center gap-1.5 mr-2">
                    {HERO_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentSlide === idx ? "w-6 bg-secondary-container" : "w-2 bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                    className="w-6 h-6 rounded-full hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <MaterialIcon name="chevron_left" className="text-base" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                    className="w-6 h-6 rounded-full hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <MaterialIcon name="chevron_right" className="text-base" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Card Content (Overlapping the banner, matching Etalase -mt-20 sm:-mt-24) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 -mt-20 sm:-mt-24 relative z-30">
              <div className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-xl border border-outline-variant/20 mb-8">
                {/* Advanced Search Filter Bar Panel */}
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
                    { label: "Bromo Sunrise Midnight", query: "Bromo" },
                    { label: "Phinisi Komodo 3D2N", query: "Komodo" },
                    { label: "Snorkeling Menjangan", query: "Menjangan" },
                    { label: "Kawah Ijen Blue Fire", query: "Ijen" },
                    { label: "Karimunjawa Bahari", query: "Karimunjawa" },
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
                        { id: "1d", label: "1 Hari / Tengah Malam" },
                        { id: "2d1n", label: "2H 1M" },
                        { id: "3d2n", label: "3H 2M" },
                        { id: "4d3n", label: "4H 3M" },
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
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                            {/* Category Label Badge (Top Right, Transparent Backdrop) */}
                            <div className="absolute top-3 right-3">
                              <span className="px-2.5 py-1 rounded-full bg-black/40 text-surface-container-lowest font-caption text-caption backdrop-blur-sm font-semibold">
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
                    <strong className="text-on-surface">{filteredPackages.length}</strong> paket wisata aktif
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
          </div>
          <div className="flex gap-space-lg font-caption text-caption">
          </div>
          <div className="font-caption text-caption text-outline">© 2026 Nusabook Indonesia. Hak Cipta Dilindungi.</div>
        </div>
      </footer>
    </div>
  );
}
