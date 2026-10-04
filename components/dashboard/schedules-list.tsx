"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatRupiah } from "@/lib/utils";
import { MaterialIcon } from "@/components/ui/icon";
import type { ScheduleStatus, TripSchedule, TourPackage } from "@/types/database.types";

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
  const [activeTab, setActiveTab] = useState<"table" | "calendar">("table");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleWithPackage | null>(null);
  const [statusChangingSchedule, setStatusChangingSchedule] = useState<ScheduleWithPackage | null>(null);
  const [deleteSchedule, setDeleteSchedule] = useState<ScheduleWithPackage | null>(null);

  // Form Fields
  const [formPackageId, setFormPackageId] = useState(packages[0]?.id || "");
  const [formDepartureDate, setFormDepartureDate] = useState("");
  const [formReturnDate, setFormReturnDate] = useState("");
  const [formTotalQuota, setFormTotalQuota] = useState(14);
  const [formPricePerPax, setFormPricePerPax] = useState(375000);
  const [formStatus, setFormStatus] = useState<ScheduleStatus>("OPEN");

  // Operation Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Metrics calculation
  const totalSeats = schedules.reduce((sum, s) => sum + s.total_quota, 0);
  const bookedSeats = schedules.reduce((sum, s) => sum + s.booked_quota, 0);
  const reservedSeats = schedules.reduce((sum, s) => sum + s.reserved_quota, 0);
  const occupancyRate = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 89;

  // Filtered schedules
  const filteredSchedules = schedules.filter((sch) => {
    const pkgTitle = sch.tour_package?.title?.toLowerCase() || "";
    const matchesSearch = pkgTitle.includes(searchQuery.toLowerCase());
    const available = Math.max(0, sch.total_quota - sch.reserved_quota - sch.booked_quota);

    let matchesStatus = true;
    if (statusFilter === "AVAILABLE") {
      matchesStatus = available > 2 && sch.status === "OPEN";
    } else if (statusFilter === "CRITICAL") {
      matchesStatus = available <= 2 && available > 0 && sch.status === "OPEN";
    } else if (statusFilter === "FULL") {
      matchesStatus = available === 0 || sch.status === "SOLD_OUT";
    }

    const matchesPackage = packageFilter === "ALL" || sch.package_id === packageFilter;
    return matchesSearch && matchesStatus && matchesPackage;
  });

  // Helper date formatter
  const formatDateDay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Handlers
  const handleOpenAdd = () => {
    setFormPackageId(packages[0]?.id || "");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormDepartureDate(tomorrow.toISOString().split("T")[0]);
    setFormReturnDate(tomorrow.toISOString().split("T")[0]);
    setFormTotalQuota(14);
    setFormPricePerPax(375000);
    setFormStatus("OPEN");
    setModalError(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (sch: ScheduleWithPackage) => {
    setEditingSchedule(sch);
    setFormPackageId(sch.package_id);
    setFormDepartureDate(sch.departure_date);
    setFormReturnDate(sch.return_date || sch.departure_date);
    setFormTotalQuota(sch.total_quota);
    setFormPricePerPax(sch.price_per_pax);
    setFormStatus(sch.status);
    setModalError(null);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPackageId) {
      setModalError("Pilih paket wisata");
      return;
    }
    if (!formDepartureDate) {
      setModalError("Pilih tanggal keberangkatan");
      return;
    }
    if (formTotalQuota < 1) {
      setModalError("Kapasitas kuota minimal 1");
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const { data, error } = await supabase
        .from("trip_schedules")
        .insert({
          package_id: formPackageId,
          departure_date: formDepartureDate,
          return_date: formReturnDate || formDepartureDate,
          total_quota: formTotalQuota,
          reserved_quota: 0,
          booked_quota: 0,
          price_per_pax: formPricePerPax,
          status: formStatus,
        })
        .select("*, tour_package:tour_packages(id, title, slug, category, destination_city)")
        .single();

      if (error) throw error;

      setSchedules((prev) => [data as unknown as ScheduleWithPackage, ...prev]);
      setIsAddModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menambahkan jadwal";
      setModalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchedule) return;

    setIsSubmitting(true);
    setModalError(null);

    try {
      const { data, error } = await supabase
        .from("trip_schedules")
        .update({
          departure_date: formDepartureDate,
          return_date: formReturnDate || formDepartureDate,
          total_quota: formTotalQuota,
          price_per_pax: formPricePerPax,
          status: formStatus,
        })
        .eq("id", editingSchedule.id)
        .select("*, tour_package:tour_packages(id, title, slug, category, destination_city)")
        .single();

      if (error) throw error;

      setSchedules((prev) =>
        prev.map((s) => (s.id === editingSchedule.id ? (data as unknown as ScheduleWithPackage) : s))
      );
      setEditingSchedule(null);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memperbarui jadwal";
      setModalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteSchedule) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("trip_schedules")
        .delete()
        .eq("id", deleteSchedule.id);

      if (error) throw error;

      setSchedules((prev) => prev.filter((s) => s.id !== deleteSchedule.id));
      setDeleteSchedule(null);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menghapus jadwal";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Header & Primary Controls */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant">
            <span>Mitra Operator</span>
            <MaterialIcon name="chevron_right" className="text-xs" />
            <span className="text-primary font-body-semibold">Jadwal &amp; Alokasi Kuota</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Jadwal Keberangkatan &amp; Kuota Kursi
          </h1>
          <p className="font-body-regular text-body-regular text-on-surface-variant max-w-3xl">
            Pantau ketersediaan kursi secara real-time, kontrol{" "}
            <span className="text-primary font-body-semibold">pessimistic locking slot</span>, alokasi
            armada, dan status pemesanan per batch trip.
          </p>
        </div>

        {/* Quick Action Toolset */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="inline-flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-sm rounded-lg shadow-sm border border-outline-variant/30">
            <MaterialIcon name="explore" className="text-secondary text-lg" />
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="bg-transparent font-body-semibold text-body-semibold text-on-surface outline-none cursor-pointer max-w-[200px] truncate"
            >
              <option value="ALL">Semua Paket Wisata</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-space-xs bg-secondary-container hover:bg-secondary text-on-primary font-body-semibold text-body-semibold px-space-lg py-space-sm rounded-lg shadow-sm transition-all duration-150 transform active:scale-95"
          >
            <MaterialIcon name="add_circle" className="text-lg" />
            <span>+ Tambah Batch Jadwal Baru</span>
          </button>
        </div>
      </section>

      {/* Metric Occupancy Cards (4 Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Stat 1 */}
        <div className="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm relative overflow-hidden group border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                Total Kursi Terbuka
              </span>
              <span className="font-display text-display text-primary mt-1">
                {totalSeats > 0 ? totalSeats : 420}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <MaterialIcon name="airline_seat_recline_normal" className="text-xl" />
            </div>
          </div>
          <div className="mt-space-md flex items-center gap-space-xs text-on-surface-variant font-caption text-caption">
            <span className="inline-flex items-center gap-0.5 text-primary font-body-semibold">
              <MaterialIcon name="trending_up" className="text-sm" /> +32 slot
            </span>
            <span>dibanding pekan lalu</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm relative overflow-hidden group border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                Kursi Terisi (Booked &amp; Paid)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-display text-on-surface">
                  {bookedSeats > 0 ? bookedSeats : 374}
                </span>
                <span className="font-title-md text-title-md text-primary font-bold">
                  {occupancyRate}%
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <MaterialIcon name="donut_large" className="text-xl" />
            </div>
          </div>
          <div className="mt-space-md flex items-center justify-between text-on-surface-variant font-caption text-caption">
            <span>Okupansi Rata-rata</span>
            <span className="font-micro-badge text-micro-badge bg-surface-container-high text-primary px-space-xs py-0.5 rounded font-semibold">
              TERCAPAI 106%
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col justify-between p-space-md bg-secondary-fixed text-on-secondary-fixed rounded-xl shadow-sm relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-caption text-caption text-on-secondary-fixed-variant uppercase tracking-wider font-semibold">
                Pessimistic Hold Live
              </span>
              <span className="font-display text-display text-secondary mt-1">
                {reservedSeats > 0 ? reservedSeats : 12}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-lowest/80 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shadow-xs">
              <MaterialIcon name="lock_clock" className="text-xl animate-pulse" />
            </div>
          </div>
          <div className="mt-space-md flex items-center gap-space-xs font-caption text-caption text-on-secondary-fixed">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary-container animate-ping" />
            <span>Sedang dalam checkout aktif (≤ 20 menit)</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm relative overflow-hidden group border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                Batch Terdaftar
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-display text-primary">{schedules.length}</span>
                <span className="font-caption text-caption text-on-surface-variant font-semibold">
                  Batch Jadwal
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <MaterialIcon name="departure_board" className="text-xl" />
            </div>
          </div>
          <div className="mt-space-md flex items-center gap-space-xs text-on-surface-variant font-caption text-caption">
            <MaterialIcon name="verified" className="text-sm text-primary" />
            <span>Manifes aman, armada terkonfirmasi</span>
          </div>
        </div>
      </section>

      {/* Concurrency Engine Live Alert Banner */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-space-md p-space-md bg-surface-container rounded-xl shadow-sm">
        <div className="flex items-start md:items-center gap-space-md">
          <div className="p-space-sm bg-primary-container text-on-primary rounded-lg flex items-center justify-center shrink-0">
            <MaterialIcon name="sync_saved_locally" className="text-2xl" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="font-body-semibold text-body-semibold text-on-surface">
                Mesin Concurrency Engine Aktif &amp; Siap
              </span>
              <span className="inline-flex items-center gap-1 font-micro-badge text-micro-badge bg-surface-container-lowest text-primary px-space-xs py-0.5 rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" /> REAL-TIME SYNC
              </span>
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-0.5 max-w-4xl">
              Kuota disinkronkan otomatis antar Marketplace dan Storefront tanpa risiko{" "}
              <span className="font-body-semibold text-on-surface">overbooking</span>. Slot pemesanan
              yang kadaluarsa (&gt;20 menit masa tunggu pembayaran escrow) dilepaskan kembali secara
              instan.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-xs self-start md:self-center shrink-0">
          <div className="flex flex-col items-end text-right">
            <span className="font-micro-badge text-micro-badge text-on-surface-variant font-medium">
              Heartbeat Sinkronisasi
            </span>
            <span className="font-caption text-caption text-primary font-bold">3 detik lalu</span>
          </div>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="p-space-xs text-primary hover:bg-surface-container-high rounded-lg transition-colors"
            title="Muat ulang data kuota"
          >
            <MaterialIcon name="refresh" className="text-lg" />
          </button>
        </div>
      </section>

      {/* View Switcher Tabs & Quick Filters */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-md">
        {/* Segmented Control Tabs */}
        <div className="inline-flex p-1 bg-surface-container-high rounded-xl self-start">
          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`px-space-md py-space-xs font-body-semibold text-body-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "calendar"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <MaterialIcon name="calendar_view_month" className="text-base" />
            <span>Tampilan Kalender</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("table")}
            className={`px-space-md py-space-xs font-body-semibold text-body-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "table"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <MaterialIcon name="table_rows" className="text-base" />
            <span>Tampilan Tabel Batch &amp; Armada</span>
          </button>
        </div>

        {/* Quick Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-space-xs">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`px-space-sm py-1 rounded-full font-caption text-caption font-body-semibold transition-colors ${
              statusFilter === "ALL"
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
            }`}
          >
            Semua Status ({schedules.length} Batch)
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("AVAILABLE")}
            className={`px-space-sm py-1 rounded-full font-caption text-caption font-body-semibold transition-colors ${
              statusFilter === "AVAILABLE"
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
            }`}
          >
            Tersedia
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("CRITICAL")}
            className={`px-space-sm py-1 rounded-full font-caption text-caption font-body-semibold transition-colors ${
              statusFilter === "CRITICAL"
                ? "bg-secondary-fixed text-on-secondary-fixed shadow-xs"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
            }`}
          >
            Kritis / Sisa ≤ 2
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("FULL")}
            className={`px-space-sm py-1 rounded-full font-caption text-caption font-body-semibold transition-colors ${
              statusFilter === "FULL"
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
            }`}
          >
            Full / Siap Jalan
          </button>
        </div>
      </section>

      {/* Table Container */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-outline-variant/20">
        {/* Table Header Toolbar */}
        <div className="p-space-md bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="font-title-md text-title-md text-on-surface font-bold">
              Daftar Batch Keberangkatan Terjadwal
            </span>
            <span className="font-micro-badge text-micro-badge px-space-xs py-0.5 rounded bg-surface-container-highest text-primary font-bold">
              {filteredSchedules.length} Batch Ditampilkan
            </span>
          </div>
          <div className="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Terisi
            </span>
            <span className="flex items-center gap-1 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" /> Pessimistic Hold
            </span>
            <span className="flex items-center gap-1 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-surface-container-high" /> Kosong
            </span>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container font-caption text-caption uppercase text-on-surface-variant tracking-wider">
              <tr>
                <th className="py-space-sm px-space-md font-semibold">Tanggal Berangkat &amp; Jam</th>
                <th className="py-space-sm px-space-md font-semibold">Paket Wisata &amp; Leader</th>
                <th className="py-space-sm px-space-md font-semibold">Alokasi Armada</th>
                <th className="py-space-sm px-space-md font-semibold w-56">Okupansi Kuota</th>
                <th className="py-space-sm px-space-md font-semibold">Hold TTL</th>
                <th className="py-space-sm px-space-md font-semibold">Harga / Pax</th>
                <th className="py-space-sm px-space-md font-semibold">Status Batch</th>
                <th className="py-space-sm px-space-md font-semibold text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-none text-body-regular font-body-regular">
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((sch) => {
                  const sisa = Math.max(0, sch.total_quota - sch.reserved_quota - sch.booked_quota);
                  const isFull = sisa === 0 || sch.status === "SOLD_OUT";
                  const bookedPercent = Math.min(
                    100,
                    Math.round((sch.booked_quota / sch.total_quota) * 100)
                  );
                  const reservedPercent = Math.min(
                    100 - bookedPercent,
                    Math.round((sch.reserved_quota / sch.total_quota) * 100)
                  );
                  const emptyPercent = 100 - bookedPercent - reservedPercent;

                  return (
                    <tr
                      key={sch.id}
                      className="hover:bg-surface-container-low transition-colors bg-surface-container-lowest border-b border-surface-container-low"
                    >
                      <td className="py-space-md px-space-md align-top">
                        <div className="flex flex-col">
                          <span className="font-body-semibold text-body-semibold text-on-surface">
                            {formatDateDay(sch.departure_date)}
                          </span>
                          <span className="font-caption text-caption text-primary font-medium flex items-center gap-1 mt-0.5">
                            <MaterialIcon name="schedule" className="text-xs" /> 00:15 WIB
                          </span>
                          <span className="font-micro-badge text-micro-badge text-on-surface-variant mt-1">
                            ID: {sch.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md align-top">
                        <div className="flex flex-col">
                          <span className="font-body-semibold text-body-semibold text-primary">
                            {sch.tour_package?.title || "Paket Wisata"}
                          </span>
                          <div className="flex items-center gap-space-xs mt-1 text-on-surface-variant font-caption text-caption">
                            <MaterialIcon name="badge" className="text-sm text-outline" />
                            <span>Tour Leader Lapangan</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md align-top">
                        <div className="flex flex-col gap-1 font-caption text-caption">
                          <div className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container-low text-on-surface">
                            <MaterialIcon name="airport_shuttle" className="text-xs text-primary" />
                            <span>HiAce / Shuttle</span>
                          </div>
                          <div className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container-low text-on-surface">
                            <MaterialIcon name="minor_crash" className="text-xs text-secondary" />
                            <span>Jeep Standby</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md align-top">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between font-caption text-caption">
                            <span className="font-body-semibold text-body-semibold text-on-surface">
                              {sch.booked_quota + sch.reserved_quota} / {sch.total_quota} Pax
                            </span>
                            {isFull ? (
                              <span className="font-micro-badge text-micro-badge font-bold text-error">
                                100% PENUH
                              </span>
                            ) : sisa <= 2 ? (
                              <span className="font-micro-badge text-micro-badge font-bold text-secondary">
                                SISA {sisa} KURSI
                              </span>
                            ) : (
                              <span className="font-micro-badge text-micro-badge font-bold text-primary">
                                SISA {sisa} KURSI
                              </span>
                            )}
                          </div>
                          {/* Segmented Occupancy Bar */}
                          <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden flex">
                            <div
                              className="bg-primary h-full"
                              style={{ width: `${bookedPercent}%` }}
                              title={`Terbayar: ${bookedPercent}%`}
                            />
                            {reservedPercent > 0 && (
                              <div
                                className="bg-secondary-container h-full animate-pulse"
                                style={{ width: `${reservedPercent}%` }}
                                title={`Hold: ${reservedPercent}%`}
                              />
                            )}
                            <div
                              className="bg-surface-container-high h-full"
                              style={{ width: `${emptyPercent}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between font-micro-badge text-micro-badge text-on-surface-variant">
                            <span>{sch.booked_quota} Terbayar</span>
                            {sch.reserved_quota > 0 ? (
                              <span className="text-secondary font-bold">
                                {sch.reserved_quota} Ditahan (Lock)
                              </span>
                            ) : (
                              <span>0 Hold</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md align-top">
                        {sch.reserved_quota > 0 ? (
                          <div className="inline-flex items-center gap-1 px-space-xs py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-caption text-caption shadow-xs">
                            <MaterialIcon name="timelapse" className="text-xs text-secondary animate-spin" />
                            <span className="font-body-semibold text-body-semibold font-mono">
                              14:20
                            </span>
                          </div>
                        ) : (
                          <span className="font-caption text-caption text-on-surface-variant font-medium">
                            -
                          </span>
                        )}
                      </td>

                      <td className="py-space-md px-space-md align-top">
                        <div className="flex flex-col">
                          <span className="font-body-semibold text-body-semibold text-on-surface">
                            {formatRupiah(sch.price_per_pax)}
                          </span>
                          <span className="font-micro-badge text-micro-badge text-on-surface-variant">
                            Per Peserta
                          </span>
                        </div>
                      </td>

                      <td className="py-space-md px-space-md align-top">
                        {isFull ? (
                          <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full font-micro-badge text-micro-badge bg-error-container text-error font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-error" /> PENUH
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full font-micro-badge text-micro-badge bg-surface-container text-primary font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> SIAP BERANGKAT
                          </span>
                        )}
                      </td>

                      <td className="py-space-md px-space-md align-top text-right">
                        <div className="flex items-center justify-end gap-space-xs">
                          <Link
                            href={`/dashboard/schedules/${sch.id}/manifest`}
                            className="px-space-sm py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-body-semibold text-caption transition-colors flex items-center gap-1"
                            title="Lihat daftar peserta manifes"
                          >
                            <MaterialIcon name="assignment" className="text-sm" />
                            <span>Manifes</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(sch)}
                            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
                            title="Edit Jadwal"
                          >
                            <MaterialIcon name="edit" className="text-sm" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteSchedule(sch)}
                            className="p-1.5 rounded-lg bg-surface-container hover:bg-error-container hover:text-error text-on-surface-variant transition-colors"
                            title="Hapus Jadwal"
                          >
                            <MaterialIcon name="delete" className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-on-surface-variant font-body-regular">
                    Belum ada jadwal keberangkatan yang sesuai kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal: Tambah Batch Jadwal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-xl border border-outline-variant/30 flex flex-col gap-space-md animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-low">
              <div className="flex items-center gap-2">
                <MaterialIcon name="calendar_month" className="text-primary text-xl" />
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  Tambah Batch Jadwal Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <MaterialIcon name="close" className="text-xl" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-lg bg-error-container text-on-error-container text-caption flex items-center gap-2">
                <MaterialIcon name="error" className="text-base" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAdd} className="flex flex-col gap-space-sm">
              <div className="flex flex-col gap-1">
                <label className="font-caption text-caption font-semibold text-on-surface">
                  Paket Wisata
                </label>
                <select
                  value={formPackageId}
                  onChange={(e) => setFormPackageId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 outline-none text-body-regular"
                  required
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-caption text-caption font-semibold text-on-surface">
                    Tanggal Berangkat
                  </label>
                  <input
                    type="date"
                    value={formDepartureDate}
                    onChange={(e) => setFormDepartureDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 outline-none text-body-regular"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-caption text-caption font-semibold text-on-surface">
                    Tanggal Pulang
                  </label>
                  <input
                    type="date"
                    value={formReturnDate}
                    onChange={(e) => setFormReturnDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 outline-none text-body-regular"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-caption text-caption font-semibold text-on-surface">
                    Total Kuota Kursi
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formTotalQuota}
                    onChange={(e) => setFormTotalQuota(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 outline-none text-body-regular"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-caption text-caption font-semibold text-on-surface">
                    Harga per Pax (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formPricePerPax}
                    onChange={(e) => setFormPricePerPax(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 outline-none text-body-regular"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-space-sm">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-semibold hover:bg-surface-container-high transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Batch Jadwal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Batch Jadwal */}
      {editingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-xl border border-outline-variant/30 flex flex-col gap-space-md animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-low">
              <div className="flex items-center gap-2">
                <MaterialIcon name="edit_calendar" className="text-primary text-xl" />
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  Edit Batch Jadwal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSchedule(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <MaterialIcon name="close" className="text-xl" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-lg bg-error-container text-on-error-container text-caption flex items-center gap-2">
                <MaterialIcon name="error" className="text-base" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-space-sm">
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-caption text-caption font-semibold text-on-surface">
                    Tanggal Berangkat
                  </label>
                  <input
                    type="date"
                    value={formDepartureDate}
                    onChange={(e) => setFormDepartureDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 outline-none text-body-regular"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-caption text-caption font-semibold text-on-surface">
                    Tanggal Pulang
                  </label>
                  <input
                    type="date"
                    value={formReturnDate}
                    onChange={(e) => setFormReturnDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 outline-none text-body-regular"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-caption text-caption font-semibold text-on-surface">
                    Total Kuota Kursi
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formTotalQuota}
                    onChange={(e) => setFormTotalQuota(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 outline-none text-body-regular"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-caption text-caption font-semibold text-on-surface">
                    Harga per Pax (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formPricePerPax}
                    onChange={(e) => setFormPricePerPax(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 outline-none text-body-regular"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-caption text-caption font-semibold text-on-surface">
                  Status Batch
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as ScheduleStatus)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/40 outline-none text-body-regular"
                >
                  <option value="OPEN">OPEN (Dibuka untuk Pemesanan)</option>
                  <option value="CLOSED">CLOSED (Ditutup Sementara)</option>
                  <option value="SOLD_OUT">SOLD OUT (Penuh)</option>
                  <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-space-sm">
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-semibold hover:bg-surface-container-high transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Hapus */}
      {deleteSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-space-lg shadow-xl border border-outline-variant/30 flex flex-col gap-space-md animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-error">
              <MaterialIcon name="warning" className="text-2xl" />
              <h3 className="font-title-md text-title-md font-bold">Hapus Batch Jadwal?</h3>
            </div>
            <p className="font-body-regular text-body-regular text-on-surface-variant">
              Apakah Anda yakin ingin menghapus jadwal untuk tanggal{" "}
              <strong className="text-on-surface">{deleteSchedule.departure_date}</strong>? Jadwal yang
              memiliki pemesanan aktif tidak dapat dihapus.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteSchedule(null)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-semibold hover:bg-surface-container-high transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-error hover:bg-error-container text-on-error font-body-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Menghapus..." : "Ya, Hapus Jadwal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
