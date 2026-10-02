"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Package,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  Loader2,
  CheckCircle2,
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
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Katalog Paket Wisata
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Kelola penawaran Open Trip dan Private Trip yang tampil pada etalase online Anda.
          </p>
        </div>
        <Link
          href="/dashboard/packages/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-900 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Paket Wisata</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama paket atau kota..."
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 md:flex-none rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="open_trip">Open Trip</option>
            <option value="private_trip">Private Trip</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-none rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
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
              : "Coba ubah kata kunci pencarian atau sesuaikan filter kategori dan status."}
          </p>
          {packages.length === 0 && (
            <div className="mt-5">
              <Link
                href="/dashboard/packages/new"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-brand-900 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Buat Paket Sekarang</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              {/* Header / Thumbnail Area */}
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                  {pkg.thumbnail_url ? (
                    <img
                      src={pkg.thumbnail_url}
                      alt={pkg.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                      <Package className="h-10 w-10 mb-1 opacity-40" />
                      <span className="text-xs">Tanpa Gambar</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {pkg.is_published ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 text-white px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm shadow-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        Terbit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-700/80 text-white px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm shadow-sm">
                        Draf
                      </span>
                    )}
                  </div>

                  {/* Category Chip */}
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-white/95 text-brand-700 px-2.5 py-0.5 text-xs font-bold shadow-sm backdrop-blur-sm">
                      {pkg.category === "open_trip" ? "Open Trip" : "Private Trip"}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-accent-500" />
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

                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <Calendar className="h-4 w-4 text-brand-700" />
                    <span>
                      {pkg.schedules_count > 0
                        ? `${pkg.schedules_count} Jadwal Terdaftar`
                        : "Belum ada jadwal keberangkatan"}
                    </span>
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
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-brand-700 transition"
                    title="Lihat halaman paket di storefront"
                  >
                    <span>Storefront</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                ) : (
                  <span />
                )}

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1.5">
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
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition disabled:opacity-50"
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
