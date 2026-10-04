"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatRupiah } from "@/lib/utils";
import type { ScheduleStatus, TripSchedule, TourPackage } from "@/types/database.types";
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export type ScheduleWithPackage = TripSchedule & {
  tour_package: Pick<TourPackage, "id" | "title" | "slug" | "category" | "destination_city"> | null;
};

export type PackageOption = Pick<TourPackage, "id" | "title">;

interface SchedulesListProps {
  initialSchedules: ScheduleWithPackage[];
  packages: PackageOption[];
}

export function SchedulesList({
  initialSchedules,
  packages,
}: SchedulesListProps) {
  const router = useRouter();
  const supabase = createClient();

  const [schedules, setSchedules] = useState<ScheduleWithPackage[]>(initialSchedules);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [packageFilter, setPackageFilter] = useState<string>("ALL");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleWithPackage | null>(null);
  const [statusChangingSchedule, setStatusChangingSchedule] = useState<ScheduleWithPackage | null>(null);
  const [deleteSchedule, setDeleteSchedule] = useState<ScheduleWithPackage | null>(null);

  // Form Fields
  const [formPackageId, setFormPackageId] = useState(packages[0]?.id || "");
  const [formDepartureDate, setFormDepartureDate] = useState("");
  const [formReturnDate, setFormReturnDate] = useState("");
  const [formTotalQuota, setFormTotalQuota] = useState(12);
  const [formPricePerPax, setFormPricePerPax] = useState(250000);
  const [formStatus, setFormStatus] = useState<ScheduleStatus>("OPEN");

  // Operation Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Filtered schedules
  const filteredSchedules = schedules.filter((sch) => {
    const pkgTitle = sch.tour_package?.title?.toLowerCase() || "";
    const matchesSearch = pkgTitle.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || sch.status === statusFilter;
    const matchesPackage = packageFilter === "ALL" || sch.package_id === packageFilter;
    return matchesSearch && matchesStatus && matchesPackage;
  });

  const getStatusBadge = (status: ScheduleStatus) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            OPEN (Buka)
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
            <Clock className="h-3 w-3" />
            CLOSED (Tutup)
          </span>
        );
      case "SOLD_OUT":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
            <AlertTriangle className="h-3 w-3" />
            SOLD OUT (Penuh)
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            <XCircle className="h-3 w-3" />
            CANCELLED (Batal)
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setModalError(null);
    setFormPackageId(packages[0]?.id || "");
    const today = new Date().toISOString().split("T")[0];
    setFormDepartureDate(today);
    setFormReturnDate(today);
    setFormTotalQuota(12);
    setFormPricePerPax(250000);
    setFormStatus("OPEN");
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (sch: ScheduleWithPackage) => {
    setModalError(null);
    setEditingSchedule(sch);
    setFormPackageId(sch.package_id);
    setFormDepartureDate(sch.departure_date);
    setFormReturnDate(sch.return_date);
    setFormTotalQuota(sch.total_quota);
    setFormPricePerPax(Number(sch.price_per_pax));
    setFormStatus(sch.status);
  };

  // Handle Create Schedule
  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!formPackageId) {
      setModalError("Silakan pilih paket wisata terlebih dahulu.");
      return;
    }

    if (!formDepartureDate || !formReturnDate) {
      setModalError("Tanggal keberangkatan dan kepulangan wajib diisi.");
      return;
    }

    if (formReturnDate < formDepartureDate) {
      setModalError("Tanggal kepulangan tidak boleh mendahului tanggal keberangkatan.");
      return;
    }

    if (formTotalQuota <= 0) {
      setModalError("Total kuota kursi harus lebih dari 0.");
      return;
    }

    if (formPricePerPax <= 0) {
      setModalError("Harga per peserta harus lebih dari 0.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newSchedulePayload = {
        package_id: formPackageId,
        departure_date: formDepartureDate,
        return_date: formReturnDate,
        total_quota: Number(formTotalQuota),
        reserved_quota: 0,
        booked_quota: 0,
        price_per_pax: Number(formPricePerPax),
        status: formStatus,
        version: 1,
      };

      const { data, error } = await supabase
        .from("trip_schedules")
        .insert(newSchedulePayload)
        .select("*, tour_package:tour_packages(id, title, slug, category, destination_city)")
        .single();

      if (error) {
        setModalError("Gagal menambahkan jadwal: " + error.message);
        setIsSubmitting(false);
        return;
      }

      if (data) {
        setSchedules((prev) => [data as unknown as ScheduleWithPackage, ...prev]);
      }

      setIsAddModalOpen(false);
      router.refresh();
    } catch {
      setModalError("Terjadi kesalahan sistem saat menyimpan jadwal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Schedule
  const handleUpdateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchedule) return;
    setModalError(null);

    if (!formDepartureDate || !formReturnDate) {
      setModalError("Tanggal keberangkatan dan kepulangan wajib diisi.");
      return;
    }

    if (formReturnDate < formDepartureDate) {
      setModalError("Tanggal kepulangan tidak boleh mendahului tanggal keberangkatan.");
      return;
    }

    const currentUsedQuota = editingSchedule.reserved_quota + editingSchedule.booked_quota;
    if (formTotalQuota < currentUsedQuota) {
      setModalError(
        `Total kuota tidak boleh lebih kecil dari kursi yang sedang terisi (${currentUsedQuota} kursi).`
      );
      return;
    }

    if (formPricePerPax <= 0) {
      setModalError("Harga per peserta harus lebih dari 0.");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatePayload = {
        departure_date: formDepartureDate,
        return_date: formReturnDate,
        total_quota: Number(formTotalQuota),
        price_per_pax: Number(formPricePerPax),
        status: formStatus,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("trip_schedules")
        .update(updatePayload)
        .eq("id", editingSchedule.id);

      if (error) {
        setModalError("Gagal memperbarui jadwal: " + error.message);
        setIsSubmitting(false);
        return;
      }

      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingSchedule.id
            ? {
                ...s,
                ...updatePayload,
              }
            : s
        )
      );

      setEditingSchedule(null);
      router.refresh();
    } catch {
      setModalError("Terjadi kesalahan sistem saat memperbarui jadwal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Quick Status Change
  const handleQuickStatusChange = async (newStatus: ScheduleStatus) => {
    if (!statusChangingSchedule) return;

    setIsSubmitting(true);
    setModalError(null);

    try {
      const { error } = await supabase
        .from("trip_schedules")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", statusChangingSchedule.id);

      if (error) {
        setModalError("Gagal mengubah status: " + error.message);
        setIsSubmitting(false);
        return;
      }

      setSchedules((prev) =>
        prev.map((s) =>
          s.id === statusChangingSchedule.id ? { ...s, status: newStatus } : s
        )
      );

      setStatusChangingSchedule(null);
      router.refresh();
    } catch {
      setModalError("Terjadi kesalahan saat mengubah status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Schedule
  const handleDeleteSchedule = async () => {
    if (!deleteSchedule) return;

    if (deleteSchedule.booked_quota > 0 || deleteSchedule.reserved_quota > 0) {
      setModalError("Jadwal ini tidak dapat dihapus karena sudah memiliki kursi yang terisi atau sedang direservasi.");
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const { error } = await supabase
        .from("trip_schedules")
        .delete()
        .eq("id", deleteSchedule.id);

      if (error) {
        setModalError("Gagal menghapus jadwal: " + error.message);
        setIsSubmitting(false);
        return;
      }

      setSchedules((prev) => prev.filter((s) => s.id !== deleteSchedule.id));
      setDeleteSchedule(null);
      router.refresh();
    } catch {
      setModalError("Terjadi kesalahan saat menghapus jadwal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Jadwal Keberangkatan
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Buka tanggal keberangkatan, pantau kapasitas kursi, dan kelola harga tiket trip.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          disabled={packages.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-900 transition disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>Buka Jadwal Baru</span>
        </button>
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
            placeholder="Cari nama paket wisata..."
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Package Filter */}
          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="flex-1 md:flex-none rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20 max-w-[200px] truncate"
          >
            <option value="ALL">Semua Paket Wisata</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.title}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-none rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
          >
            <option value="ALL">Semua Status</option>
            <option value="OPEN">OPEN (Buka)</option>
            <option value="CLOSED">CLOSED (Tutup)</option>
            <option value="SOLD_OUT">SOLD OUT (Penuh)</option>
            <option value="CANCELLED">CANCELLED (Batal)</option>
          </select>
        </div>
      </div>

      {/* Schedules Table / Card List */}
      {filteredSchedules.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center shadow-sm">
          <CalendarDays className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            {schedules.length === 0
              ? "Belum Ada Jadwal Keberangkatan"
              : "Tidak Ada Jadwal yang Sesuai"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {schedules.length === 0
              ? "Buka tanggal keberangkatan pada paket wisata Anda untuk mulai menerima reservasi tiket dari wisatawan."
              : "Coba ubah kata kunci pencarian atau sesuaikan filter paket dan status."}
          </p>
          {schedules.length === 0 && packages.length > 0 && (
            <div className="mt-5">
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-brand-900 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Buka Jadwal Pertama</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Paket Wisata</th>
                  <th className="py-3 px-4">Tanggal Trip</th>
                  <th className="py-3 px-4">Harga / Pax</th>
                  <th className="py-3 px-4">Kapasitas Kursi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchedules.map((sch) => {
                  const sisaKuota = Math.max(
                    0,
                    sch.total_quota - sch.reserved_quota - sch.booked_quota
                  );
                  const bookedPercentage = Math.min(
                    100,
                    Math.round(
                      ((sch.reserved_quota + sch.booked_quota) / sch.total_quota) * 100
                    )
                  );

                  return (
                    <tr key={sch.id} className="hover:bg-slate-50/50 transition">
                      {/* Package Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                        <div className="truncate">
                          {sch.tour_package?.title || "Paket Wisata"}
                        </div>
                        <div className="text-[11px] font-medium text-slate-500">
                          {sch.tour_package?.destination_city || ""}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900">
                            {sch.departure_date}
                          </span>
                        </div>
                        {sch.return_date !== sch.departure_date && (
                          <div className="text-[11px] text-slate-500">
                            s/d {sch.return_date}
                          </div>
                        )}
                      </td>

                      {/* Price per pax */}
                      <td className="py-3.5 px-4 font-semibold text-brand-700 text-xs sm:text-sm">
                        {formatRupiah(Number(sch.price_per_pax))}
                      </td>

                      {/* Quota details */}
                      <td className="py-3.5 px-4 min-w-[180px]">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                          <span>
                            {sch.booked_quota + sch.reserved_quota} / {sch.total_quota} Kursi
                          </span>
                          <span
                            className={
                              sisaKuota === 0
                                ? "text-rose-600 font-bold"
                                : "text-emerald-700 font-semibold"
                            }
                          >
                            {sisaKuota === 0 ? "Penuh" : `Sisa ${sisaKuota}`}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              bookedPercentage >= 100
                                ? "bg-rose-500"
                                : bookedPercentage >= 70
                                ? "bg-accent-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${bookedPercentage}%` }}
                          />
                        </div>
                        {sch.reserved_quota > 0 && (
                          <div className="text-[10px] text-amber-600 mt-1">
                            ({sch.reserved_quota} kursi sedang direservasi)
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => {
                            setModalError(null);
                            setStatusChangingSchedule(sch);
                          }}
                          className="hover:opacity-80 transition cursor-pointer"
                          title="Klik untuk mengubah status"
                        >
                          {getStatusBadge(sch.status)}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/dashboard/schedules/${sch.id}/manifest`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition shadow-xs"
                            title="Lihat manifes penumpang"
                          >
                            <Users className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Manifes</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => openEditModal(sch)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-700 transition shadow-xs"
                            title="Edit jadwal"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setModalError(null);
                              setDeleteSchedule(sch);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition shadow-xs"
                            title="Hapus jadwal"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Tambah Jadwal Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Buka Jadwal Keberangkatan Baru
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pilih paket wisata dan atur kapasitas kursi untuk tanggal trip ini.
            </p>

            {modalError && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateSchedule} className="space-y-4">
              {/* Package Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Pilih Paket Wisata *
                </label>
                <select
                  required
                  value={formPackageId}
                  onChange={(e) => setFormPackageId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Tanggal Berangkat *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDepartureDate}
                    onChange={(e) => {
                      setFormDepartureDate(e.target.value);
                      if (formReturnDate < e.target.value) {
                        setFormReturnDate(e.target.value);
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Tanggal Kembali *
                  </label>
                  <input
                    type="date"
                    required
                    min={formDepartureDate}
                    value={formReturnDate}
                    onChange={(e) => setFormReturnDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Total Quota & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Total Kuota Kursi *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formTotalQuota}
                    onChange={(e) => setFormTotalQuota(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Harga per Peserta (Rp) *
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    required
                    value={formPricePerPax}
                    onChange={(e) => setFormPricePerPax(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Status Awal Jadwal
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as ScheduleStatus)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none"
                >
                  <option value="OPEN">OPEN (Langsung dapat dibooking)</option>
                  <option value="CLOSED">CLOSED (Ditutup sementara)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-900 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Buka Jadwal</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Jadwal */}
      {editingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Edit Jadwal Keberangkatan
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Paket: <span className="font-semibold text-slate-800">{editingSchedule.tour_package?.title}</span>
            </p>

            {modalError && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                {modalError}
              </div>
            )}

            <form onSubmit={handleUpdateSchedule} className="space-y-4">
              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Tanggal Berangkat *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDepartureDate}
                    onChange={(e) => setFormDepartureDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Tanggal Kembali *
                  </label>
                  <input
                    type="date"
                    required
                    min={formDepartureDate}
                    value={formReturnDate}
                    onChange={(e) => setFormReturnDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Total Quota & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Total Kuota Kursi *
                  </label>
                  <input
                    type="number"
                    min={editingSchedule.booked_quota + editingSchedule.reserved_quota}
                    required
                    value={formTotalQuota}
                    onChange={(e) => setFormTotalQuota(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Minimal {editingSchedule.booked_quota + editingSchedule.reserved_quota} kursi (kursi terisi).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Harga per Peserta (Rp) *
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    required
                    value={formPricePerPax}
                    onChange={(e) => setFormPricePerPax(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Status Jadwal
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as ScheduleStatus)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none"
                >
                  <option value="OPEN">OPEN (Dibuka untuk reservasi)</option>
                  <option value="CLOSED">CLOSED (Ditutup sementara)</option>
                  <option value="SOLD_OUT">SOLD OUT (Ditandai penuh)</option>
                  <option value="CANCELLED">CANCELLED (Keberangkatan dibatalkan)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-900 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Perbarui Jadwal</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ubah Status Cepat */}
      {statusChangingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Ubah Status Jadwal
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {statusChangingSchedule.tour_package?.title} ({statusChangingSchedule.departure_date})
            </p>

            {modalError && (
              <div className="mb-3 rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800">
                {modalError}
              </div>
            )}

            <div className="space-y-2">
              {(["OPEN", "CLOSED", "SOLD_OUT", "CANCELLED"] as ScheduleStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    disabled={isSubmitting || statusChangingSchedule.status === st}
                    onClick={() => handleQuickStatusChange(st)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
                      statusChangingSchedule.status === st
                        ? "border-brand-700 bg-brand-50 text-brand-700"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{st}</span>
                    {statusChangingSchedule.status === st && (
                      <CheckCircle2 className="h-4 w-4 text-brand-700" />
                    )}
                  </button>
                )
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setStatusChangingSchedule(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Hapus Jadwal */}
      {deleteSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Hapus Jadwal Keberangkatan?
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Jadwal trip tanggal{" "}
              <span className="font-semibold text-slate-800">
                {deleteSchedule.departure_date}
              </span>{" "}
              untuk paket{" "}
              <span className="font-semibold text-slate-800">
                &quot;{deleteSchedule.tour_package?.title}&quot;
              </span>{" "}
              akan dihapus secara permanen.
            </p>

            {modalError && (
              <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                {modalError}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setDeleteSchedule(null);
                  setModalError(null);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDeleteSchedule}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Jadwal</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
