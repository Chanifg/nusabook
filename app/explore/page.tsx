"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  Bell,
  ShieldCheck,
  ChevronDown,
  PackageX,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { SearchBar } from "@/components/marketplace/search-bar";
import { FilterSidebar } from "@/components/marketplace/filter-sidebar";
import { PackageCard, type PackageCardData } from "@/components/marketplace/package-card";

const INITIAL_PACKAGES: PackageCardData[] = [
  {
    id: "pkg-1",
    title: "Open Trip Bromo Sunrise & Savana Teletubbies 1D",
    slug: "bromo-sunrise-savana",
    category: "open_trip",
    durationDays: 1,
    durationNights: 0,
    destinationCity: "Malang",
    locationDetails: "TNBTS, Jawa Timur",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcX4F4QbtGOXCOeZQ4KaZdUizrGjplMtolbXn1KUVk0GAgCI6pk7ZaN-hqQbhtq-4yeeXkphBG5LNAPi6n-QqybUe21PrPA155-tfdWzAHm7KQEMOSl2-DwHjDIluIbjNKTbOCPcgCe2eS6b_bHps-qa0dg37yhRmljsIy3EGSRFGC5Lh91nkFkwsqZYPRIpZl4jm5jd0OdnwcGZv-OZSj6yA6TZladJWPrMy-3NV4SVGElyLHsCk",
    agentName: "Pesona Nusantara Tour (Malang)",
    agentSlug: "pesona-merapi",
    isVerified: true,
    nextDepartureDate: "Minggu, 18 Okt 2026",
    originalPrice: 550000,
    pricePerPax: 450000,
    totalQuota: 12,
    availableQuota: 2, // Urgent pessimistic lock
    rating: 4.9,
    reviewCount: 248,
    vehicleType: "Jeep 4x4 Hardtop",
  },
  {
    id: "pkg-2",
    title: "Labuan Bajo Komodo Phinisi Sail 3D2N AC Cabin",
    slug: "labuan-bajo-komodo-phinisi",
    category: "liveaboard",
    durationDays: 3,
    durationNights: 2,
    destinationCity: "Labuan Bajo",
    locationDetails: "Labuan Bajo, NTT",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBivb0bPrQvfD2TrcdjJxqpLb2GepfU8gv4L3xqBzlu5Wj4Y9LeQdIBQoXk4jmiBZggicy4XIubGjZhjP7uHUSH_cmVsZIag8tNrNfqLFORnCzGRb3uedKXIOPLNXRB9kH_4geKG9BrQl6IWrVqT33N1rbJptT4vx6AnFpgwHsb1O-YzxU-E7VnSY5SjDe2VnvNrqaJqLtmamds5wzTqywE2Fz45w6HD7Ep2QAS2yI6j_LQWpGZ-Sk",
    agentName: "Flores Bahari Mandiri (Labuan Bajo)",
    agentSlug: "ntt-marine",
    isVerified: true,
    nextDepartureDate: "Jumat, 23 Okt 2026",
    pricePerPax: 2850000,
    totalQuota: 16,
    availableQuota: 4,
    rating: 4.9,
    reviewCount: 420,
    vehicleType: "Phinisi Superior AC",
  },
  {
    id: "pkg-3",
    title: "Kawah Ijen Blue Fire & Kawah Wurung Midnight",
    slug: "kawah-ijen-blue-fire",
    category: "midnight",
    durationDays: 1,
    durationNights: 0,
    destinationCity: "Banyuwangi",
    locationDetails: "Banyuwangi, Jatim",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLgFs8-wRy35MRB1MmqXtf7lOHb2kq3f6Bp4AFu_m-g5jffFf5Nhk5lxyKwRrTl8T4sREu8v_k8qUJhZ7wjy4aGsv64QZKp6NJDXsWQBp_qmQabp5b8tG8YqO-EQTX3YxFgHFBWAQPN65m6FHIXfflaUmvlZLjlKUMrC8erx00tCp33bQC8rmNVcQBt8E8eDOnculalKBkzJnCncdsfzCB9f0fMvtbbzQbuk9xPOJWf21-qLA47Ic",
    agentName: "Osing Heritage Travel (Banyuwangi)",
    agentSlug: "osing-paradise",
    isVerified: true,
    nextDepartureDate: "Kamis, 22 Okt 2026",
    pricePerPax: 380000,
    totalQuota: 18,
    availableQuota: 5,
    rating: 4.8,
    reviewCount: 189,
    vehicleType: "Microbus AC Executive",
  },
  {
    id: "pkg-4",
    title: "Eksotisme Karimunjawa Bahari 3D2N Full Snorkeling",
    slug: "karimunjawa-bahari-snorkeling",
    category: "open_trip",
    durationDays: 3,
    durationNights: 2,
    destinationCity: "Jepara",
    locationDetails: "Jepara, Jawa Tengah",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDn3zNMCoxWEaGCCJWqM_r8VWXFf5cf99VKdK2pcsO-0xEYoS-VweBH-zxtDpKwp1H5OsFiliWX5E8pSigJepCqXNM1RMUqFwq9Ls4PUSs-IVj24LtpwE0WuQAnK6mQKv7E5m1d9eRpp5aWqkp3kFZ_qDl9uNIo_HaYE53mYiJGb3tWVocaAWKzHUvpx8u8f2Y_tB9hmmbriIZEBYi3xDteHV7dpi66wfZavqCwU-OCRMPGSdvCx1E",
    agentName: "Karimun Wave Explorer (Jepara)",
    agentSlug: "karimun-wave",
    isVerified: true,
    nextDepartureDate: "Rabu, 28 Okt 2026",
    pricePerPax: 1250000,
    totalQuota: 20,
    availableQuota: 8,
    rating: 4.9,
    reviewCount: 312,
    vehicleType: "Kapal Express Bahari",
  },
  {
    id: "pkg-5",
    title: "Dieng Golden Sunrise & Telaga Warna Highlands 1D",
    slug: "dieng-golden-sunrise-highlands",
    category: "open_trip",
    durationDays: 1,
    durationNights: 0,
    destinationCity: "Yogyakarta",
    locationDetails: "Wonosobo, Jawa Tengah",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB18ZHxQoGmBSKU2KmCtG-OyjRLJniCW1TmJUjhUlx6rHfh8nXxmii_XAskAmH5jvbNcVTckIm9IpXExdJTMPw4q83tQ-YTHT_7GZCRQKIRQ8hxnsYXS3M73qVzfmLp1ECxH-n8AyZ4Y-tTCCsQt1-MuK2AlMG4UtquTalUjN-EhHdyl9UpTQOhUqAaaK5V2RLK4gQLDQZBnooYGTMY4_Fl3S2dHTG1o6UqKMlPC3WPpqm0fveY6nM",
    agentName: "Wonoland Dieng Tour",
    agentSlug: "wonoland-dieng",
    isVerified: true,
    nextDepartureDate: "Sabtu, 31 Okt 2026",
    pricePerPax: 320000,
    totalQuota: 15,
    availableQuota: 6,
    rating: 4.7,
    reviewCount: 154,
    vehicleType: "HiAce Commuter AC",
  },
  {
    id: "pkg-6",
    title: "Private Premium Candi Borobudur & Sunrise Punthuk Setumbu",
    slug: "borobudur-punthuk-setumbu-private",
    category: "private_trip",
    durationDays: 1,
    durationNights: 0,
    destinationCity: "Magelang",
    locationDetails: "Magelang, Jawa Tengah",
    thumbnailUrl: null,
    agentName: "Borobudur Heritage Tour",
    agentSlug: "borobudur-heritage",
    isVerified: true,
    nextDepartureDate: "Jumat, 16 Okt 2026",
    pricePerPax: 650000,
    totalQuota: 6,
    availableQuota: 0, // Sold out
    rating: 4.9,
    reviewCount: 92,
    vehicleType: "Innova Zenix VIP",
  },
];

export default function MarketplaceExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [paxCount, setPaxCount] = useState(1);
  const [selectedTripType, setSelectedTripType] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [sortBy, setSortBy] = useState("schedule");

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCity("");
    setDepartureDate("");
    setPaxCount(1);
    setSelectedTripType("");
    setSelectedCategory("");
    setMaxPrice(5000000);
    setAvailableOnly(false);
    setVerifiedOnly(false);
    setSelectedDuration("");
    setSortBy("schedule");
  };

  const filteredPackages = useMemo(() => {
    let result = INITIAL_PACKAGES.filter((pkg) => {
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = pkg.title.toLowerCase().includes(query);
        const matchesCity = pkg.destinationCity.toLowerCase().includes(query);
        const matchesAgent = pkg.agentName.toLowerCase().includes(query);
        const matchesLocation = (pkg.locationDetails || "").toLowerCase().includes(query);
        if (!matchesTitle && !matchesCity && !matchesAgent && !matchesLocation) return false;
      }

      // City / Meeting Point Filter
      if (selectedCity.trim()) {
        if (pkg.destinationCity.toLowerCase() !== selectedCity.toLowerCase()) return false;
      }

      // Trip Type / Category
      const targetCategory = selectedTripType || selectedCategory;
      if (targetCategory) {
        if (targetCategory === "open_trip" && pkg.category !== "open_trip") return false;
        if (targetCategory === "private_trip" && pkg.category !== "private_trip") return false;
      }

      // Price Filter
      if (maxPrice < 5000000) {
        if (pkg.pricePerPax > maxPrice) return false;
      }

      // Available Only
      if (availableOnly) {
        if (pkg.availableQuota <= 0) return false;
      }

      // Verified Only
      if (verifiedOnly) {
        if (!pkg.isVerified) return false;
      }

      // Duration Filter
      if (selectedDuration) {
        if (selectedDuration === "1d" && pkg.durationDays !== 1) return false;
        if (selectedDuration === "2d1n" && !(pkg.durationDays === 2 && pkg.durationNights === 1)) return false;
        if (selectedDuration === "3d2n" && !(pkg.durationDays === 3 && pkg.durationNights === 2)) return false;
      }

      // Pax count filter
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
    selectedCategory,
    selectedTripType,
    maxPrice,
    availableOnly,
    verifiedOnly,
    selectedDuration,
    paxCount,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-900 flex flex-col font-sans antialiased">
      {/* Fixed Navigation Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                N
              </div>
              <span className="font-extrabold text-xl text-brand-700 tracking-tight">Nusabook</span>
            </Link>

            <div className="hidden md:inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Sync Aktif</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/explore" className="text-brand-700 font-bold">
              Jelajah Wisata
            </Link>
            <Link href="/pesona-merapi" className="hover:text-slate-900 transition">
              Etalase Paket
            </Link>
            <Link href="/pesona-merapi/packages/sunrise-lava-tour-merapi" className="hover:text-slate-900 transition">
              Checkout & Reservasi
            </Link>
            <Link href="/dashboard" className="hover:text-slate-900 transition">
              Operator Backoffice
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 relative transition"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-500" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center">
                BP
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">Bambang Pamungkas</span>
                <span className="text-[10px] text-slate-400 font-medium">Pesona Nusantara</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="w-full pt-16 flex-1">
        {/* Hero Section & Search Filter Bar */}
        <section className="relative w-full bg-gradient-to-b from-brand-900 via-brand-800 to-brand-950 text-white overflow-hidden py-10">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                <ShieldCheck className="w-4 h-4 text-accent-400" />
                Terverifikasi Kemenparekraf & NIB Resmi
              </span>
            </div>

            {/* Title & Description */}
            <div className="max-w-4xl mb-8 space-y-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Eksplorasi Keindahan Nusantara Bersama Operator Lokal Terpercaya
              </h1>
              <p className="text-brand-100 text-sm sm:text-base max-w-3xl leading-relaxed font-normal">
                Jaminan kuota kursi real-time langsung tersinkronisasi dengan sistem operasional agen. Tanpa risiko
                overbooking, bergaransi escrow aman, dan terverifikasi izin NIB/TDUP.
              </p>
            </div>

            {/* Search Filter Panel */}
            <div className="w-full text-slate-900">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                departureDate={departureDate}
                onDateChange={setDepartureDate}
                paxCount={paxCount}
                onPaxChange={setPaxCount}
                selectedTripType={selectedTripType}
                onTripTypeChange={setSelectedTripType}
                onSearchSubmit={() => {}}
                onReset={resetAllFilters}
              />
            </div>
          </div>
        </section>

        {/* P2MW Banner Strip */}
        <section className="w-full bg-slate-100 border-y border-slate-200 py-3">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-700">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-700 text-white shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <div className="text-left text-xs">
                <strong className="block text-brand-900 font-bold">
                  Inisiatif Program Pembinaan Mahasiswa Wirausaha (P2MW) 2026
                </strong>
                <span className="text-slate-500 font-medium">
                  Didanai Ditjen Diktiristek & Pendampingan Universitas Tidar — Standardisasi Digitalisasi Ekosistem UMKM Maritim.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-brand-700 font-bold text-xs shrink-0 hover:underline cursor-pointer">
              <span>Transparansi Biaya & Legalitas Terjamin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </section>

        {/* 2-Column Main Content: Filter Sidebar + Tour Packages Grid */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Filter Sidebar (Left) */}
            <FilterSidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              availableOnly={availableOnly}
              onAvailableOnlyChange={setAvailableOnly}
              verifiedOnly={verifiedOnly}
              onVerifiedOnlyChange={setVerifiedOnly}
              selectedDuration={selectedDuration}
              onDurationChange={setSelectedDuration}
              onResetFilters={resetAllFilters}
            />

            {/* Results & Tour Catalog (Right) */}
            <div className="flex-1 w-full space-y-6">
              {/* Header Info & Sort Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-base text-slate-900">
                    Menampilkan <span className="text-brand-700 font-extrabold">{filteredPackages.length}</span> Paket Wisata
                  </h2>
                  {selectedCity && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100">
                      di {selectedCity}
                    </span>
                  )}
                </div>

                {/* Sorting Controls */}
                <div className="flex items-center gap-2 shrink-0 text-xs">
                  <span className="text-slate-500 font-medium">Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 font-bold text-xs text-slate-800 rounded-lg px-3 py-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-700 cursor-pointer"
                  >
                    <option value="schedule">Jadwal Terdekat</option>
                    <option value="price_asc">Harga Terendah</option>
                    <option value="rating">Rating Tertinggi</option>
                    <option value="quota">Sisa Kuota Terbanyak</option>
                  </select>
                </div>
              </div>

              {/* Grid Display */}
              {filteredPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPackages.map((pkg) => (
                    <PackageCard key={pkg.id} packageData={pkg} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <PackageX className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Paket Wisata Tidak Ditemukan</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Coba ubah kata kunci pencarian, sesuaikan filter harga, atau pilih kota destinasi populer lainnya.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 text-white text-xs font-bold shadow-sm hover:bg-brand-900 transition"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Nusabook Aggregator Marketplace • P2MW Universitas Tidar</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-brand-700 font-medium">
              Beranda
            </Link>
            <Link href="/pesona-merapi" className="hover:text-brand-700 font-medium">
              Contoh Storefront
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

