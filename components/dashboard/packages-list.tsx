"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Package,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Sparkles,
  Percent,
  Download,
  Flame,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export interface PackageItem {
  id: string;
  title: string;
  slug: string;
  category: "open_trip" | "private_trip";
  destination_city: string;
  duration_days: number;
  duration_nights: number;
  thumbnail_url: string | null;
  is_published: boolean;
  created_at: string;
  schedules_count: number;
}

interface PackagesListProps {
  initialPackages: PackageItem[];
  agentSlug?: string;
  agentId: string;
}

export function PackagesList({
  initialPackages,
  agentSlug,
  agentId,
}: PackagesListProps) {
  const router = useRouter();
  const supabase = createClient();

  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [packageToDelete, setPackageToDelete] = useState<PackageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Statistics calculation for Bento stats
  const totalPackages = packages.length;
  const openTripCount = packages.filter((p) => p.category === "open_trip").length;
  const privateTripCount = packages.filter((p) => p.category === "private_trip").length;
  const publishedCount = packages.filter((p) => p.is_published).length;
  const draftCount = totalPackages - publishedCount;

  // Find top performer (the one with the most schedules or the first one)
  const topPackage = packages.reduce<PackageItem | null>(
    (top, current) => (!top || current.schedules_count > top.schedules_count ? current : top),
    packages[0] || null
  );

  // Filter packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination_city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || pkg.category === categoryFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && pkg.is_published) ||
      (statusFilter === "DRAFT" && !pkg.is_published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase
        .from("tour_packages")
        .delete()
        .eq("id", deleteId)
        .eq("agent_id", agentId);

      if (error) {
        setErrorMessage("Gagal menghapus paket. Pastikan tidak ada pesanan aktif pada paket ini.");
        setIsDeleting(false);
        return;
      }

      setPackages((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
      setPackageToDelete(null);
      router.refresh();
    } catch {
      setErrorMessage("Terjadi kesalahan sistem saat menghapus paket.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Bar & Breadcrumb (Stitch Style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <span>Mitra Operator</span>
            <span>/</span>
            <span className="text-brand-700 font-semibold">Manajemen Paket Wisata</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manajemen & Katalog Paket
            </h1>
            <span className="bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold px-3 py-0.5 rounded-full">
              {publishedCount} Produk Aktif
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Kelola katalog paket open trip, private trip, alokasi kuota batch, serta status sinkronisasi ke marketplace publik NusaBook.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <Link
            href="/dashboard/packages/new"
            className="bg-accent-500 hover:bg-accent-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Paket Baru</span>
          </Link>
        </div>
      </div>

      {/* Operational Stat Cards (Stitch Bento 3-Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stat 1: Total Paket Wisata */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Paket Wisata
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalPackages}</span>
            <span className="text-xs font-semibold text-brand-700">Paket Terdaftar</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-700"></span>
              {openTripCount} Open Trip
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {privateTripCount} Private Trip
            </span>
            <span className="text-slate-400 font-medium">{draftCount} Draf</span>
          </div>
        </div>

        {/* Stat 2: Top Performer Product */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Paket Paling Aktif
            </span>
            <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
              {topPackage ? `${topPackage.schedules_count} Jadwal` : "0 Jadwal"}
            </span>
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 truncate">
              {topPackage?.title || "Belum ada paket"}
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xs font-semibold text-slate-500">
                Destinasi: {topPackage?.destination_city || "Indonesia"}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-slate-800">Tingkat Minat Tinggi</span>
            <span>pada etalase digital</span>
          </div>
        </div>

        {/* Stat 3: Conversion & Rating */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Kualitas Etalase Digital
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">100%</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Pessimistic Quota Lock
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>SLA Anti-Overbooking</span>
            <span className="text-brand-700 font-semibold">Zero Double-Booking</span>
          </div>
        </div>
      </div>

      {/* Fair Commission Callout Banner (PRD Requirement) */}
      <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900">
                Skema Transparan Zero Upfront Listing
              </span>
              <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded uppercase">
                Komisi 2% Flat
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              NusaBook tidak membebankan biaya langganan bulanan maupun listing fee. Komisi 2% hanya dipotong secara otomatis saat transaksi pesanan telah terverifikasi lunas.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama paket atau kota tujuan..."
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 md:flex-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20 bg-white"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="open_trip">Open Trip</option>
            <option value="private_trip">Private Trip</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20 bg-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">Terbit (Live)</option>
            <option value="DRAFT">Draf (Disimpan)</option>
          </select>
        </div>
      </div>

      {/* Packages Grid / List */}
      {filteredPackages.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center shadow-sm">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            {packages.length === 0
              ? "Belum Ada Paket Wisata"
              : "Tidak Ada Paket yang Sesuai"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {packages.length === 0
              ? "Mulai dengan membuat paket wisata pertama Anda agar wisatawan dapat melakukan pemesanan di storefront resmi Anda."
              : "Coba sesuaikan kata kunci pencarian atau ganti filter kategori dan status."}
          </p>
          {packages.length === 0 && (
            <div className="mt-5">
              <Link
                href="/dashboard/packages/new"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-accent-600 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Buat Paket Sekarang</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              {/* Header / Thumbnail Area */}
              <div>
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                  {pkg.thumbnail_url ? (
                    <img
                      src={pkg.thumbnail_url}
                      alt={pkg.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                      <Package className="h-10 w-10 mb-1 opacity-40" />
                      <span className="text-xs">Tanpa Foto</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {pkg.is_published ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 text-white px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm shadow-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        Terbit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 text-white px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm shadow-sm">
                        Draf
                      </span>
                    )}
                  </div>

                  {/* Category Chip */}
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-white/95 text-brand-900 px-3 py-0.5 text-xs font-bold shadow-sm backdrop-blur-sm border border-slate-100">
                      {pkg.category === "open_trip" ? "Open Trip" : "Private Trip"}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-amber-600" />
                      {pkg.destination_city}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {pkg.duration_days}H{pkg.duration_nights > 0 ? ` ${pkg.duration_nights}M` : ""}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                    {pkg.title}
                  </h3>

                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-brand-700" />
                      <span>
                        {pkg.schedules_count > 0
                          ? `${pkg.schedules_count} Jadwal Terbuka`
                          : "Belum ada jadwal"}
                      </span>
                    </div>
                    <Link
                      href="/dashboard/schedules"
                      className="text-brand-700 hover:text-brand-900 font-bold inline-flex items-center gap-1"
                    >
                      <span>Jadwal</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                {/* Storefront Link */}
                {agentSlug ? (
                  <Link
                    href={`/${agentSlug}/packages/${pkg.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-brand-700 transition"
                    title="Lihat halaman paket di storefront"
                  >
                    <span>Storefront</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </Link>
                ) : (
                  <span />
                )}

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/packages/${pkg.id}/edit`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-700 transition shadow-sm"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteId(pkg.id);
                      setPackageToDelete(pkg);
                    }}
                    className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition shadow-sm"
                    title="Hapus paket wisata"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && packageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Hapus Paket Wisata?
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus paket{" "}
              <span className="font-semibold text-slate-800">
                &quot;{packageToDelete.title}&quot;
              </span>
              ? Seluruh jadwal keberangkatan terkait juga akan ikut terhapus.
            </p>

            {errorMessage && (
              <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                {errorMessage}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setDeleteId(null);
                  setPackageToDelete(null);
                  setErrorMessage(null);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Paket</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
