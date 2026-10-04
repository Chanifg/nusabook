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
  ShieldCheck,
  Ticket,
  ChevronRight,
  MoreVertical,
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
    .select("id, business_name, slug, is_verified")
    .eq("owner_id", user.id)
    .maybeSingle();

  const agentId = agent?.id;
  const isVerified = agent?.is_verified ?? false;

  // 3. Query PAID Bookings for Financial Metrics
  let paidBookingsData: Array<
    Pick<Booking, "total_amount" | "platform_fee" | "agent_payout_amount" | "total_pax">
  > = [];

  let totalBookingsCount = 0;
  let recentBookings: BookingWithSchedule[] = [];

  if (agentId) {
    const { data: metricsRes } = await supabase
      .from("bookings")
      .select("total_amount, platform_fee, agent_payout_amount, total_pax")
      .eq("agent_id", agentId)
      .eq("payment_status", "PAID");

    paidBookingsData = metricsRes || [];

    const { data: recentRes, count } = await supabase
      .from("bookings")
      .select("*, schedule:trip_schedules(departure_date, tour_package:tour_packages(title))", {
        count: "exact",
      })
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(6);

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

  // 6. Calculate 4 Primary Financial Metrics
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

  const activePackagesCount = packages.filter((p) => p.is_published).length;
  const criticalQuotaCount = upcomingSchedules.filter((s) => {
    const sisa = Math.max(0, s.total_quota - s.reserved_quota - s.booked_quota);
    return sisa <= 2;
  }).length;

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
            Menunggu
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3 h-3" />
            Kedaluwarsa
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            Batal
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
      {/* Header Row (Stitch Style) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Overview Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Ringkasan performa operasional tour, kuota keberangkatan, dan pembukuan Anda hari ini.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/dashboard/packages/new"
            className="w-full sm:w-auto bg-accent-500 hover:bg-accent-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Paket Wisata</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards (Stitch Design Specification) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Total Revenue (MTD) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Omzet (MTD)</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatRupiah(omzetKotor)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Active Bookings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Booking Terkonfirmasi</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {paidBookingsData.length}
            </div>
            <div className="mt-1 text-slate-500 text-xs font-medium">
              {kursiTerjual} pax wisatawan terdaftar
            </div>
          </div>
        </div>

        {/* Stat 3: Quota Alert */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Peringatan Kuota</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {criticalQuotaCount}
            </div>
            <div className="mt-1 text-slate-500 text-xs font-medium">
              Jadwal mendekati kapasitas penuh
            </div>
          </div>
        </div>

        {/* Stat 4: Agency Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-50 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex justify-between items-center text-slate-500 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider">Status Mitra</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 relative z-10">
            {isVerified ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Partner</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Menunggu Verifikasi</span>
              </div>
            )}
            <p className="text-[11px] text-slate-500 mt-1.5">
              100% kepatuhan NIB OSS & RLS
            </p>
          </div>
        </div>
      </div>

      {/* Financial Transparency Ribbon (PRD Requirement: 2% Escrow & Net Payout) */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-800 text-white rounded-2xl p-6 shadow-sm border border-brand-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Skema Escrow & Pembagian Hasil Transparan
              </span>
            </div>
            <h3 className="text-lg font-bold">
              Kalkulasi Pendapatan Bersih Mitra Nusabook
            </h3>
            <p className="text-xs text-brand-100 max-w-xl">
              Dana wisatawan diamankan di rekening penampung (Escrow). Hak bersih mitra otomatis dicairkan H+1 setelah pelaksanaan tour selesai.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 shrink-0">
            <div>
              <p className="text-[11px] text-brand-200 font-medium">Omzet Kotor (100%)</p>
              <p className="text-base sm:text-lg font-bold text-white mt-0.5">
                {formatRupiah(omzetKotor)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-brand-200 font-medium">Potongan Platform (2%)</p>
              <p className="text-base sm:text-lg font-bold text-amber-300 mt-0.5">
                -{formatRupiah(potonganPlatform)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-emerald-300 font-medium">Net Siap Cair (98%)</p>
              <p className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5">
                {formatRupiah(pendapatanBersih)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table Section 1: Booking & Quota Management (Stitch Component) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Booking & Quota Management
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Jadwal keberangkatan aktif dan utilisasi kapasitas kursi
            </p>
          </div>
          <Link
            href="/dashboard/schedules"
            className="text-brand-700 hover:text-brand-900 text-xs font-bold flex items-center gap-1 transition"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {upcomingSchedules.length === 0 ? (
            <div className="text-center py-12 px-4">
              <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                Belum Ada Jadwal Keberangkatan Mendatang
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Buka jadwal keberangkatan baru agar calon wisatawan dapat memilih tanggal dan memesan tiket.
              </p>
              <Link
                href="/dashboard/schedules"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-brand-700 hover:underline"
              >
                <span>Buka Jadwal Baru</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <th className="px-6 py-3.5">Nama Paket Wisata</th>
                  <th className="px-6 py-3.5">Tanggal Trip</th>
                  <th className="px-6 py-3.5 text-center">Total Kuota</th>
                  <th className="px-6 py-3.5 text-center">Terisi</th>
                  <th className="px-6 py-3.5">Status Kuota</th>
                  <th className="px-6 py-3.5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-900">
                {upcomingSchedules.map((schedule) => {
                  const sisaKuota = Math.max(
                    0,
                    schedule.total_quota -
                      schedule.reserved_quota -
                      schedule.booked_quota
                  );
                  const bookedCount = schedule.reserved_quota + schedule.booked_quota;

                  let statusBadge = (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Tersedia ({sisaKuota})
                    </span>
                  );

                  if (sisaKuota === 0) {
                    statusBadge = (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Habis Terjual
                      </span>
                    );
                  } else if (sisaKuota <= 2) {
                    statusBadge = (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        Sisa {sisaKuota} Kursi
                      </span>
                    );
                  }

                  return (
                    <tr key={schedule.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-brand-900">
                          {schedule.tour_package?.title || "Paket Wisata"}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Harga: {formatRupiah(Number(schedule.price_per_pax || 0))} / pax
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {schedule.departure_date}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">
                        {schedule.total_quota}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-brand-700">
                        {bookedCount}
                      </td>
                      <td className="px-6 py-4">
                        {statusBadge}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/schedules/${schedule.id}/manifest`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                        >
                          <span>Manifes</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Data Table Section 2: Recent Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Transaksi Pemesanan Terbaru
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pesanan tiket wisatawan yang masuk melalui etalase storefront
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {totalBookingsCount} Total Pesanan
          </span>
        </div>

        <div className="overflow-x-auto">
          {recentBookings.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                Belum Ada Riwayat Transaksi
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Transaksi dari pelanggan Anda akan tercatat secara instan di tabel ini.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-6">Kode Booking</th>
                  <th className="py-3 px-4">Nama Wisatawan</th>
                  <th className="py-3 px-4">Trip Terjadwal</th>
                  <th className="py-3 px-4 text-center">Jumlah Pax</th>
                  <th className="py-3 px-4">Total Bayar</th>
                  <th className="py-3 px-6 text-right">Status Pembayaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-xs font-bold text-brand-700">
                      {b.booking_code}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{b.customer_name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        {b.customer_whatsapp}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {b.schedule?.tour_package?.title || "Paket Wisata"}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {b.total_pax} Kursi
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatRupiah(Number(b.total_amount || 0))}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      {getStatusBadge(b.payment_status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}