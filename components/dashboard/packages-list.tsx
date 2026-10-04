"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatRupiah } from "@/lib/utils";
import { MaterialIcon } from "@/components/ui/icon";

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
  agentSlug = "pesona-merapi",
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
        .eq("id", deleteId);

      if (error) throw error;

      setPackages((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
      setPackageToDelete(null);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menghapus paket wisata";
      setErrorMessage(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (pkg: PackageItem) => {
    const nextStatus = !pkg.is_published;
    setPackages((prev) =>
      prev.map((p) => (p.id === pkg.id ? { ...p, is_published: nextStatus } : p))
    );

    try {
      const { error } = await supabase
        .from("tour_packages")
        .update({ is_published: nextStatus })
        .eq("id", pkg.id);

      if (error) {
        // Rollback
        setPackages((prev) =>
          prev.map((p) => (p.id === pkg.id ? { ...p, is_published: !nextStatus } : p))
        );
        alert("Gagal memperbarui status publikasi");
      } else {
        router.refresh();
      }
    } catch {
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, is_published: !nextStatus } : p))
      );
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Bar & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant">
            <span>Mitra Operator</span>
            <MaterialIcon name="chevron_right" className="text-xs" />
            <span className="text-primary font-semibold">Manajemen Paket Wisata</span>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Manajemen &amp; Katalog Paket
            </h1>
            <span className="bg-primary-fixed text-on-primary-fixed font-micro-badge text-micro-badge px-space-sm py-0.5 rounded-full flex items-center gap-1 font-bold">
              <MaterialIcon name="storefront" className="text-xs" /> {publishedCount} Produk Aktif
            </span>
          </div>
          <p className="font-body-regular text-body-regular text-on-surface-variant max-w-3xl">
            Kelola katalog paket open trip, private trip, alokasi kuota batch, tiering harga B2C, serta
            status sinkronisasi ke marketplace publik NusaBook.
          </p>
        </div>

        {/* Quick Action CTA */}
        <div className="flex items-center gap-space-sm self-start md:self-auto shrink-0">
          <Link
            href="/dashboard/packages/new"
            className="bg-secondary-container hover:bg-secondary text-on-primary px-space-lg py-space-sm rounded-lg font-body-semibold text-body-semibold flex items-center gap-space-xs transition-colors shadow-md"
          >
            <MaterialIcon name="add_circle" className="text-xl" />
            <span>Tambah Paket Baru</span>
          </Link>
        </div>
      </div>

      {/* Operational Stat Cards (Bento 3-grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-xl">
        {/* Stat 1 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-caption text-caption text-on-surface-variant font-medium uppercase tracking-wider">
              Total Paket Wisata
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <MaterialIcon name="inventory_2" className="text-lg" />
            </div>
          </div>
          <div className="flex items-baseline gap-space-sm">
            <span className="font-display text-display text-on-surface">{totalPackages}</span>
            <span className="font-body-semibold text-body-semibold text-primary">Paket Terdaftar</span>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant font-caption text-caption">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" /> {openTripCount} Open Trip
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary-container" /> {privateTripCount} Private Trip
            </span>
            <span className="text-outline font-medium">{draftCount} Draf</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-caption text-caption text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
              <MaterialIcon name="local_fire_department" className="text-sm" /> Top Performer Bulan Ini
            </span>
            <span className="font-micro-badge text-micro-badge bg-secondary-fixed text-on-secondary-fixed px-space-xs py-0.5 rounded font-bold">
              248 Pax
            </span>
          </div>
          <div>
            <p className="font-title-md text-title-md text-on-surface truncate font-bold">
              {topPackage?.title || "Open Trip Bromo Sunrise"}
            </p>
            <div className="flex items-baseline gap-space-xs mt-1">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Rp 111,6 Jt
              </span>
              <span className="font-caption text-caption text-on-surface-variant">Est. GMV Kotor</span>
            </div>
          </div>
          <div className="mt-space-sm flex items-center gap-space-xs text-on-surface-variant font-caption text-caption">
            <MaterialIcon name="trending_up" className="text-sm text-secondary-container" />
            <span className="text-on-surface font-medium">+18.4%</span>
            <span>dari bulan sebelumnya</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-caption text-caption text-on-surface-variant font-medium uppercase tracking-wider">
              Rata-rata Konversi Etalase
            </span>
            <MaterialIcon name="analytics" className="text-primary text-xl" />
          </div>
          <div className="flex items-baseline gap-space-sm">
            <span className="font-display text-display text-on-surface">6.8%</span>
            <span className="font-caption text-caption text-primary font-semibold flex items-center gap-0.5">
              <MaterialIcon name="verified" className="text-sm" /> Mitra Terverifikasi
            </span>
          </div>
          <div className="mt-space-md flex items-center justify-between font-caption text-caption text-on-surface-variant">
            <span>Benchmark Industri: 3.2%</span>
            <span className="text-secondary font-semibold flex items-center gap-1">
              <MaterialIcon name="star" className="text-sm text-secondary-container" /> 4.92 Rata-rata Ulasan
            </span>
          </div>
        </div>
      </div>

      {/* Fair Commission Callout Banner */}
      <div className="bg-surface-container-low rounded-xl p-space-md mb-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md shadow-sm border border-outline-variant/20">
        <div className="flex items-start sm:items-center gap-space-md">
          <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
            <MaterialIcon name="price_check" className="text-xl" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="font-body-semibold text-body-semibold text-on-surface">
                Skema Transparan Zero Upfront Listing
              </span>
              <span className="font-micro-badge text-micro-badge bg-primary text-on-primary px-space-xs rounded font-bold uppercase">
                Komisi 2% Flat
              </span>
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-0.5">
              NusaBook tidak membebankan biaya langganan bulanan maupun listing fee. Komisi 2% hanya
              ditarik secara otomatis saat dana hasil pesanan berhasil lolos dari Escrow Vault.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm mb-space-lg flex flex-col gap-space-md border border-outline-variant/20">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
          <div className="relative flex-1">
            <MaterialIcon
              name="search"
              className="absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama paket, destinasi, atau kode ID..."
              className="w-full pl-10 pr-space-md py-space-sm bg-surface-container-low rounded-lg text-body-regular font-body-regular text-on-surface placeholder-on-surface-variant outline-none focus:bg-surface-container-lowest transition-colors text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-space-sm">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-surface-container-low text-on-surface font-body-regular text-body-regular px-space-md py-space-sm rounded-lg outline-none cursor-pointer text-sm"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="open_trip">Open Trip (Reguler)</option>
              <option value="private_trip">Private Charter</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container-low text-on-surface font-body-regular text-body-regular px-space-md py-space-sm rounded-lg outline-none cursor-pointer text-sm"
            >
              <option value="ALL">Semua Status</option>
              <option value="PUBLISHED">Aktif di Marketplace</option>
              <option value="DRAFT">Draf Paket</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 text-caption font-caption">
          <button
            type="button"
            onClick={() => {
              setCategoryFilter("ALL");
              setStatusFilter("ALL");
            }}
            className={`px-space-md py-1.5 rounded-full shrink-0 transition-colors ${
              categoryFilter === "ALL" && statusFilter === "ALL"
                ? "bg-primary text-on-primary font-body-semibold shadow-sm"
                : "bg-surface-container-low hover:bg-surface-container-high text-on-surface"
            }`}
          >
            Semua Paket ({packages.length})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("open_trip")}
            className={`px-space-md py-1.5 rounded-full shrink-0 transition-colors ${
              categoryFilter === "open_trip"
                ? "bg-primary text-on-primary font-body-semibold shadow-sm"
                : "bg-surface-container-low hover:bg-surface-container-high text-on-surface"
            }`}
          >
            Open Trip ({openTripCount})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("private_trip")}
            className={`px-space-md py-1.5 rounded-full shrink-0 transition-colors ${
              categoryFilter === "private_trip"
                ? "bg-primary text-on-primary font-body-semibold shadow-sm"
                : "bg-surface-container-low hover:bg-surface-container-high text-on-surface"
            }`}
          >
            Private Trip ({privateTripCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("PUBLISHED")}
            className={`px-space-md py-1.5 rounded-full shrink-0 transition-colors ${
              statusFilter === "PUBLISHED"
                ? "bg-primary text-on-primary font-body-semibold shadow-sm"
                : "bg-surface-container-low hover:bg-surface-container-high text-on-surface"
            }`}
          >
            Publik di Marketplace ({publishedCount})
          </button>
        </div>
      </div>

      {/* Package Inventory List */}
      <div className="flex flex-col gap-space-md mb-space-xl">
        {filteredPackages.length > 0 ? (
          filteredPackages.map((pkg) => {
            const isPrivate = pkg.category === "private_trip";
            return (
              <div
                key={pkg.id}
                className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col xl:flex-row gap-space-md items-start xl:items-center justify-between border border-outline-variant/20"
              >
                {/* Media & Core Details */}
                <div className="flex flex-col sm:flex-row gap-space-md items-start sm:items-center w-full xl:w-7/12">
                  <div className="relative w-full sm:w-44 h-32 rounded-lg overflow-hidden shrink-0 shadow-inner bg-surface-container">
                    <img
                      src={
                        pkg.thumbnail_url ||
                        "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                      <span className="bg-secondary-container text-on-primary font-micro-badge text-micro-badge px-2 py-0.5 rounded shadow-sm font-bold">
                        {isPrivate ? "PRIVATE" : "TOP SELLER"}
                      </span>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-on-surface/80 backdrop-blur-md text-surface font-caption text-caption px-1.5 py-0.5 rounded font-mono text-white text-[10px]">
                      {pkg.duration_days}D{pkg.duration_nights > 0 ? `${pkg.duration_nights}N` : ""}
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-xs min-w-0">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span
                        className={`font-micro-badge text-micro-badge px-2 py-0.5 rounded uppercase font-semibold ${
                          isPrivate
                            ? "bg-secondary-fixed text-on-secondary-fixed"
                            : "bg-primary-fixed text-on-primary-fixed"
                        }`}
                      >
                        {isPrivate ? "PRIVATE TRIP" : "OPEN TRIP"}
                      </span>
                      {pkg.is_published ? (
                        <span className="inline-flex items-center gap-1 font-micro-badge text-micro-badge text-primary bg-surface-container-high px-2 py-0.5 rounded font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> PUBLISHED
                        </span>
                      ) : (
                        <span className="font-micro-badge text-micro-badge text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                          DRAF
                        </span>
                      )}
                      <span className="font-caption text-caption text-outline font-mono">
                        ID: {pkg.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>

                    <Link
                      href={`/dashboard/packages/${pkg.id}/edit`}
                      className="font-title-md text-title-md text-on-surface truncate hover:text-primary font-bold transition-colors"
                    >
                      {pkg.title}
                    </Link>

                    <div className="flex items-center gap-space-md text-caption font-caption text-on-surface-variant flex-wrap">
                      <span className="flex items-center gap-1">
                        <MaterialIcon name="groups" className="text-sm text-primary" />
                        Kota: <strong>{pkg.destination_city}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <MaterialIcon name="event_available" className="text-sm text-secondary" />
                        <strong>{pkg.schedules_count} Batch Jadwal</strong>
                      </span>
                      <span className="flex items-center gap-1 text-secondary font-semibold">
                        <MaterialIcon name="star" className="text-sm text-secondary-container" />
                        4.9 (Ulasan Terverifikasi)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financials & Operational Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between xl:justify-end gap-space-lg w-full xl:w-5/12 pt-space-md xl:pt-0">
                  <div className="flex flex-col sm:text-right">
                    <span className="font-caption text-caption text-on-surface-variant">
                      Katalog Etalase
                    </span>
                    <div className="flex items-baseline sm:justify-end gap-1">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {isPrivate ? "Private Charter" : "Tiket Open Trip"}
                      </span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1 font-caption text-caption text-outline mt-0.5">
                      <span>Komisi Nusabook:</span>
                      <span className="font-mono text-on-surface font-medium">2% Transparan</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-xs self-end sm:self-center shrink-0">
                    <Link
                      href="/dashboard/schedules"
                      className="p-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary transition-colors flex items-center gap-1 font-caption text-caption font-semibold"
                      title="Kelola Jadwal Batch"
                    >
                      <MaterialIcon name="calendar_month" className="text-lg" />
                      <span className="hidden sm:inline">Jadwal</span>
                    </Link>

                    <Link
                      href={`/dashboard/packages/${pkg.id}/edit`}
                      className="p-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors"
                      title="Edit Rincian Paket"
                    >
                      <MaterialIcon name="edit" className="text-lg" />
                    </Link>

                    <Link
                      href={`/${agentSlug}/packages/${pkg.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors"
                      title="Lihat Tampilan Storefront Publik"
                    >
                      <MaterialIcon name="open_in_new" className="text-lg" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleTogglePublish(pkg)}
                      className={`p-space-sm rounded-lg transition-colors font-caption text-caption font-semibold flex items-center gap-1 ${
                        pkg.is_published
                          ? "bg-surface-container text-primary hover:bg-surface-container-high"
                          : "bg-primary text-on-primary"
                      }`}
                      title={pkg.is_published ? "Tarik dari Marketplace" : "Publikasikan ke Marketplace"}
                    >
                      <MaterialIcon
                        name={pkg.is_published ? "visibility" : "visibility_off"}
                        className="text-lg"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteId(pkg.id);
                        setPackageToDelete(pkg);
                      }}
                      className="p-space-sm rounded-lg bg-surface-container hover:bg-error-container hover:text-error text-on-surface-variant transition-colors"
                      title="Hapus Paket"
                    >
                      <MaterialIcon name="delete" className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-space-lg">
            <p className="text-on-surface-variant font-body-regular">
              Tidak ada paket wisata yang cocok dengan pencarian atau filter.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && packageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-space-lg shadow-xl border border-outline-variant/30 flex flex-col gap-space-md animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-error">
              <MaterialIcon name="warning" className="text-2xl" />
              <h3 className="font-title-md text-title-md font-bold">Hapus Paket Wisata?</h3>
            </div>
            <p className="font-body-regular text-body-regular text-on-surface-variant">
              Apakah Anda yakin ingin menghapus paket{" "}
              <strong className="text-on-surface">{packageToDelete.title}</strong>? Paket yang
              memiliki riwayat booking aktif tidak dapat dihapus.
            </p>
            {errorMessage && (
              <div className="p-3 rounded-lg bg-error-container text-on-error-container text-caption">
                {errorMessage}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteId(null);
                  setPackageToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-semibold hover:bg-surface-container-high transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-error hover:bg-error-container text-on-error font-body-semibold transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Paket"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
