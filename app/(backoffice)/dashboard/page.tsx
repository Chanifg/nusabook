import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import type { Booking, TourPackage, TripSchedule } from "@/types/database.types";
import {
  Wallet,
  Percent,
  TrendingUp,
  Users,
  Package,
  CalendarDays,
  Receipt,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

type BookingWithSchedule = Booking & {
  schedule?: (TripSchedule & { tour_package?: Pick<TourPackage, "title"> | null }) | null;
};

type TourPackageSummary = Pick<
  TourPackage,
  "id" | "title" | "slug" | "category" | "destination_city" | "is_published" | "created_at"
>;

type TripScheduleWithPackage = TripSchedule & {
  tour_package?: Pick<TourPackage, "title"> | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // 2. Get current travel agent for this user
  const { data: agent } = await supabase
    .from("travel_agents")
    .select("id, business_name, slug")
    .eq("owner_id", user.id)
    .maybeSingle();

  const agentId = agent?.id;

  // 3. Query PAID Bookings for Financial Metrics (Filtered at DB level)
  let paidBookingsData: Array<
    Pick<Booking, "total_amount" | "platform_fee" | "agent_payout_amount" | "total_pax">
  > = [];

  let totalBookingsCount = 0;
  let recentBookings: BookingWithSchedule[] = [];

  if (agentId) {
    // 3a. Metrics query: only PAID bookings, only financial columns
    const { data: metricsRes } = await supabase
      .from("bookings")
      .select("total_amount, platform_fee, agent_payout_amount, total_pax")
      .eq("agent_id", agentId)
      .eq("payment_status", "PAID");

    paidBookingsData = metricsRes || [];

    // 3b. Recent bookings query: limited to top 5
    const { data: recentRes, count } = await supabase
      .from("bookings")
      .select("*, schedule:trip_schedules(departure_date, tour_package:tour_packages(title))", {
        count: "exact",
      })
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(5);

    recentBookings = (recentRes as unknown as BookingWithSchedule[]) || [];
    totalBookingsCount = count || recentBookings.length;
  }

  // 4. Fetch tour packages for this agent
  let packages: TourPackageSummary[] = [];
  if (agentId) {
    const { data: packagesRes } = await supabase
      .from("tour_packages")
      .select("id, title, slug, category, destination_city, is_published, created_at")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false });

    packages = packagesRes || [];
  }

  // 5. Fetch upcoming trip schedules for this agent's packages
  const packageIds = packages.map((p) => p.id);
  const today = new Date().toISOString().split("T")[0];
  let upcomingSchedules: TripScheduleWithPackage[] = [];

  if (packageIds.length > 0) {
    const { data: schedulesRes } = await supabase
      .from("trip_schedules")
      .select(
        "id, package_id, departure_date, return_date, total_quota, reserved_quota, booked_quota, price_per_pax, status, version, created_at, updated_at, tour_package:tour_packages(title)"
      )
      .in("package_id", packageIds)
      .gte("departure_date", today)
      .order("departure_date", { ascending: true })
      .limit(5);

    upcomingSchedules = (schedulesRes as unknown as TripScheduleWithPackage[]) || [];
  }

  // 6. Calculate 4 Primary Financial Metrics from DB-filtered PAID records
  const omzetKotor = paidBookingsData.reduce(
    (sum, b) => sum + Number(b.total_amount || 0),
    0
  );

  const potonganPlatform = paidBookingsData.reduce(
    (sum, b) => sum + Number(b.platform_fee || 0),
    0
  );

  const pendapatanBersih = paidBookingsData.reduce(
    (sum, b) => sum + Number(b.agent_payout_amount || 0),
    0
  );

  const kursiTerjual = paidBookingsData.reduce(
    (sum, b) => sum + Number(b.total_pax || 0),
    0
  );

  // 7. Secondary Metrics
  const activePackagesCount = packages.filter((p) => p.is_published).length;
  const upcomingSchedulesCount = upcomingSchedules.filter(
    (s) => s.status === "OPEN"
  ).length;

  const getStatusBadge = (status: Booking["payment_status"]) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Lunas
          </span>
        );
      case "UNPAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Menunggu Bayar
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3 h-3" />
            Kadaluarsa
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Ringkasan Kinerja Usaha
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Pantau arus transaksi, kapasitas kursi wisata, dan pendapatan bersih secara realtime.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/packages/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 text-white text-xs font-semibold shadow-sm hover:bg-brand-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Paket</span>
          </Link>
          <Link
            href="/dashboard/schedules"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-brand-700 hover:border-brand-100 transition-colors shadow-sm"
          >
            <CalendarDays className="w-4 h-4 text-slate-500" />
            <span>Kelola Jadwal</span>
          </Link>
        </div>
      </div>

      {/* 4 Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Omzet Kotor */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Omzet Kotor
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900">
              {formatRupiah(omzetKotor)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Dari {paidBookingsData.length} transaksi lunas
            </p>
          </div>
        </div>

        {/* Metric 2: Potongan Platform (2%) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Potongan Platform (2%)
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900">
              {formatRupiah(potonganPlatform)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Bagi hasil operasional platform
            </p>
          </div>
        </div>

        {/* Metric 3: Pendapatan Bersih */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm bg-gradient-to-br from-white to-emerald-50/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Pendapatan Bersih
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-emerald-700">
              {formatRupiah(pendapatanBersih)}
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              Siap dicairkan ke rekening mitra
            </p>
          </div>
        </div>

        {/* Metric 4: Kursi Terjual */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kursi Terjual
            </span>
            <div className="w-8 h-8 rounded-xl bg-accent-50 text-accent-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-slate-900">
              {kursiTerjual}{" "}
              <span className="text-sm font-semibold text-slate-500">Pax</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Total peserta terkonfirmasi
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Operational Quick Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-700 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Paket Wisata Aktif</p>
            <p className="text-lg font-bold text-slate-900">{activePackagesCount} Paket</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-500 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Jadwal Mendatang</p>
            <p className="text-lg font-bold text-slate-900">
              {upcomingSchedulesCount} Keberangkatan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Transaksi Masuk</p>
            <p className="text-lg font-bold text-slate-900">{totalBookingsCount} Pesanan</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Transactions & Upcoming Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Transactions List (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Daftar Transaksi Terbaru
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Riwayat pesanan tiket wisatawan terkini
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {totalBookingsCount} Transaksi Total
            </span>
          </div>

          <div className="flex-1 overflow-x-auto">
            {recentBookings.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-800">
                  Belum Ada Transaksi
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Transaksi pesanan dari storefront Anda akan otomatis muncul di sini setelah wisatawan melakukan pemesanan.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Kode Booking</th>
                    <th className="py-3 px-4">Pemesan</th>
                    <th className="py-3 px-4">Pax</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-brand-700">
                        {b.booking_code}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <div>{b.customer_name}</div>
                        <div className="text-[11px] text-slate-400">
                          {b.customer_whatsapp}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {b.total_pax} Kursi
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {formatRupiah(Number(b.total_amount || 0))}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(b.payment_status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Upcoming Schedules & Quota Status (1 Col) */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Status Kuota Jadwal
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Keberangkatan mendatang terdekat
                </p>
              </div>
              <Link
                href="/dashboard/schedules"
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 transition"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="mt-4 space-y-4">
              {upcomingSchedules.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">
                    Belum Ada Jadwal Mendatang
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Tambahkan jadwal keberangkatan untuk membuka kuota pemesanan tiket bagi wisatawan.
                  </p>
                  <Link
                    href="/dashboard/schedules"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-brand-700 hover:underline"
                  >
                    <span>Buka Jadwal Baru</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                upcomingSchedules.map((schedule) => {
                  const sisaKuota = Math.max(
                    0,
                    schedule.total_quota -
                      schedule.reserved_quota -
                      schedule.booked_quota
                  );
                  const bookedPercentage = Math.min(
                    100,
                    Math.round(
                      ((schedule.reserved_quota + schedule.booked_quota) /
                        schedule.total_quota) *
                        100
                    )
                  );

                  return (
                    <div
                      key={schedule.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {schedule.tour_package?.title || "Paket Wisata"}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                            <CalendarDays className="w-3 h-3 text-accent-500" />
                            <span>{schedule.departure_date}</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-brand-700">
                          {formatRupiah(Number(schedule.price_per_pax || 0))}
                        </span>
                      </div>

                      {/* Quota Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                          <span>
                            Terisi: {schedule.booked_quota + schedule.reserved_quota}/{schedule.total_quota} Kursi
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
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
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
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick CTA */}
          <div className="pt-4 mt-4 border-t border-slate-200 text-center">
            <Link
              href="/dashboard/packages"
              className="text-xs font-semibold text-slate-600 hover:text-brand-700 inline-flex items-center gap-1.5 transition"
            >
              <span>Kelola Seluruh Katalog Paket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}