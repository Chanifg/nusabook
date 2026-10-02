"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Compass, Sparkles, MapPin, ArrowLeft, PackageX } from "lucide-react";
import { SearchBar } from "@/components/marketplace/search-bar";
import { CityChips } from "@/components/marketplace/city-chips";
import { FilterSidebar } from "@/components/marketplace/filter-sidebar";
import { PackageCard, type PackageCardData } from "@/components/marketplace/package-card";

// Fallback high-quality mock dataset for instant demonstration
const INITIAL_PACKAGES: PackageCardData[] = [
  {
    id: "pkg-1",
    title: "Sunrise Lava Tour Merapi & Bunker Kaliadem",
    slug: "sunrise-lava-tour-merapi",
    category: "open_trip",
    durationDays: 1,
    durationNights: 0,
    destinationCity: "Yogyakarta",
    thumbnailUrl: null,
    agentName: "Pesona Merapi Tour & Travel",
    agentSlug: "pesona-merapi",
    isVerified: true,
    nextDepartureDate: "Sabtu, 10 Okt 2026",
    pricePerPax: 250000,
    totalQuota: 12,
    availableQuota: 12,
  },
  {
    id: "pkg-2",
    title: "Midnight Overland Bromo Sunrise & Savana Teletubbies",
    slug: "overland-bromo-sunrise",
    category: "open_trip",
    durationDays: 2,
    durationNights: 1,
    destinationCity: "Malang",
    thumbnailUrl: null,
    agentName: "Bromo Exotica Adventure",
    agentSlug: "bromo-exotica",
    isVerified: true,
    nextDepartureDate: "Minggu, 11 Okt 2026",
    pricePerPax: 450000,
    totalQuota: 15,
    availableQuota: 4,
  },
  {
    id: "pkg-3",
    title: "Private Premium Trip Candi Borobudur & Sunrise Punthuk Setumbu",
    slug: "borobudur-punthuk-setumbu-private",
    category: "private_trip",
    durationDays: 1,
    durationNights: 0,
    destinationCity: "Magelang",
    thumbnailUrl: null,
    agentName: "Borobudur Heritage Tour",
    agentSlug: "borobudur-heritage",
    isVerified: true,
    nextDepartureDate: "Jumat, 16 Okt 2026",
    pricePerPax: 650000,
    totalQuota: 6,
    availableQuota: 6,
  },
  {
    id: "pkg-4",
    title: "Eksplorasi Api Biru Kawah Ijen & Hutan De Djawatan",
    slug: "blue-fire-kawah-ijen",
    category: "open_trip",
    durationDays: 2,
    durationNights: 1,
    destinationCity: "Banyuwangi",
    thumbnailUrl: null,
    agentName: "Osing Paradise Tour",
    agentSlug: "osing-paradise",
    isVerified: true,
    nextDepartureDate: "Sabtu, 17 Okt 2026",
    pricePerPax: 380000,
    totalQuota: 20,
    availableQuota: 0, // Sold out example
  },
  {
    id: "pkg-5",
    title: "Private Island Hopping Labuan Bajo & Komodo Dragon",
    slug: "labuan-bajo-komodo-private",
    category: "private_trip",
    durationDays: 3,
    durationNights: 2,
    destinationCity: "Labuan Bajo",
    thumbnailUrl: null,
    agentName: "Nusa Tenggara Marine",
    agentSlug: "ntt-marine",
    isVerified: true,
    nextDepartureDate: "Kamis, 22 Okt 2026",
    pricePerPax: 2850000,
    totalQuota: 8,
    availableQuota: 3,
  },
  {
    id: "pkg-6",
    title: "Sunset Chasing & Dinner Kecak Dance Uluwatu",
    slug: "uluwatu-sunset-kecak-dance",
    category: "open_trip",
    durationDays: 1,
    durationNights: 0,
    destinationCity: "Bali",
    thumbnailUrl: null,
    agentName: "Dewata Scenic Travel",
    agentSlug: "dewata-scenic",
    isVerified: false,
    nextDepartureDate: "Sabtu, 24 Okt 2026",
    pricePerPax: 320000,
    totalQuota: 25,
    availableQuota: 18,
  },
];

export default function MarketplaceExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [paxCount, setPaxCount] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [availableOnly, setAvailableOnly] = useState(false);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCity("");
    setDepartureDate("");
    setPaxCount(1);
    setSelectedCategory("");
    setMaxPrice(5000000);
    setAvailableOnly(false);
  };

  // Filtered dataset evaluation
  const filteredPackages = useMemo(() => {
    return INITIAL_PACKAGES.filter((pkg) => {
      // Search query title/city
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = pkg.title.toLowerCase().includes(query);
        const matchesCity = pkg.destinationCity.toLowerCase().includes(query);
        const matchesAgent = pkg.agentName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCity && !matchesAgent) return false;
      }

      // City filter
      if (selectedCity.trim()) {
        if (pkg.destinationCity.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory) {
        if (pkg.category !== selectedCategory) return false;
      }

      // Price filter
      if (maxPrice < 5000000) {
        if (pkg.pricePerPax > maxPrice) return false;
      }

      // Quota availability filter
      if (availableOnly) {
        if (pkg.availableQuota <= 0) return false;
      }

      // Pax count filter (must have enough remaining seats)
      if (paxCount > 1) {
        if (pkg.availableQuota < paxCount) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCity, selectedCategory, maxPrice, availableOnly, paxCount]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-slate-900">
            <div className="w-8 h-8 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold">
              N
            </div>
            <span>Nusabook</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-100">
              Discovery
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-brand-700 flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-brand-900 via-brand-800 to-brand-900 text-white py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-100 text-xs font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            Katalog Nasional UMKM Tour & Travel Terpercaya
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Jelajahi Pesona Wisata Indonesia
          </h1>

          <p className="text-brand-100 text-sm sm:text-base max-w-2xl mx-auto font-normal">
            Bandingkan paket trip terverifikasi dari mitra lokal resmi, cek sisa kuota realtime, dan pesan tiket langsung tanpa risiko overbooking.
          </p>

          {/* Search bar container */}
          <div className="pt-6 max-w-4xl mx-auto text-left text-slate-900">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              departureDate={departureDate}
              onDateChange={setDepartureDate}
              paxCount={paxCount}
              onPaxChange={setPaxCount}
              onReset={resetAllFilters}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* City Filter Chips */}
        <div className="mb-6">
          <CityChips selectedCity={selectedCity} onSelectCity={setSelectedCity} />
        </div>

        {/* Content Layout: Sidebar + Grid */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Filter Sidebar */}
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            availableOnly={availableOnly}
            onAvailableOnlyChange={setAvailableOnly}
            onResetFilters={resetAllFilters}
          />

          {/* Results Grid */}
          <div className="flex-1 w-full space-y-6">
            {/* Results Header Counter */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 text-sm">
              <span className="text-slate-600">
                Menampilkan <strong className="text-slate-900 font-bold">{filteredPackages.length}</strong> paket wisata
                {selectedCity && <span> di <strong className="text-brand-700">{selectedCity}</strong></span>}
              </span>

              {(searchQuery || selectedCity || selectedCategory || maxPrice < 5000000 || availableOnly || paxCount > 1) && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-semibold text-brand-700 hover:underline"
                >
                  Bersihkan semua filter
                </button>
              )}
            </div>

            {/* Grid display */}
            {filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} packageData={pkg} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <PackageX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Paket Wisata Tidak Ditemukan</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Nusabook Aggregator Marketplace • P2MW Universitas Tidar</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-brand-700 font-medium">Beranda</Link>
            <Link href="/pesona-merapi" className="hover:text-brand-700 font-medium">Contoh Storefront</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
