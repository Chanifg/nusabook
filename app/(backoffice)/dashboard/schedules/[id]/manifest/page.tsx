import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PassengerTable, PassengerManifestData } from "@/components/manifest/passenger-table";
import {
  CalendarDays,
  FileSpreadsheet,
  Printer,
  ArrowLeft,
  MapPin,
  Compass,
} from "lucide-react";

interface ManifestPageProps {
  params: Promise<{ id: string }>;
}

export default async function ManifestPage({ params }: ManifestPageProps) {
  const { id } = await params;
  if (!id) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Ambil data agent mitra
  const { data: agent } = await supabase
    .from("travel_agents")
    .select("id, business_name, slug")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!agent) {
    redirect("/login");
  }

  // 2. Ambil data jadwal perjalanan & paket wisata
  const { data: schedule, error: scheduleError } = await (supabase.from("trip_schedules") as any)
    .select(`
      id,
      departure_date,
      return_date,
      total_quota,
      reserved_quota,
      booked_quota,
      price_per_pax,
      status,
      tour_packages (
        id,
        title,
        destination_city,
        meeting_point,
        agent_id
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (scheduleError || !schedule) {
    redirect("/dashboard/schedules");
  }

  const pkg = schedule.tour_packages;
  // Multi-tenant isolation: Pastikan jadwal benar-benar milik agen yang login
  if (!pkg || pkg.agent_id !== agent.id) {
    redirect("/dashboard/schedules");
  }

  // 3. Ambil daftar booking PAID beserta manifes penumpangnya
  const { data: bookings } = await (supabase.from("bookings") as any)
    .select(`
      id,
      booking_code,
      customer_name,
      customer_email,
      customer_whatsapp,
      payment_status,
      booking_passengers (
        id,
        booking_id,
        full_name,
        gender,
        id_card_number,
        phone_number,
        emergency_contact,
        special_notes,
        is_checked_in,
        checked_in_at
      )
    `)
    .eq("schedule_id", id)
    .eq("payment_status", "PAID")
    .order("created_at", { ascending: true });

  // 4. Flatten data peserta untuk tabel klien
  const passengerList: PassengerManifestData[] = [];

  for (const b of bookings || []) {
    for (const p of b.booking_passengers || []) {
      passengerList.push({
        id: p.id,
        bookingId: b.id,
        fullName: p.full_name,
        gender: p.gender,
        idCardNumber: p.id_card_number,
        phoneNumber: p.phone_number || b.customer_whatsapp,
        emergencyContact: p.emergency_contact,
        specialNotes: p.special_notes,
        bookingCode: b.booking_code,
        customerName: b.customer_name,
        paymentStatus: b.payment_status,
        isCheckedIn: Boolean(p.is_checked_in),
        checkedInAt: p.checked_in_at || null,
      });
    }
  }

  const formatIdDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const departureFormatted = formatIdDate(schedule.departure_date);
  const returnFormatted = formatIdDate(schedule.return_date);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Link
              href="/dashboard/schedules"
              className="hover:text-emerald-700 transition inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Jadwal</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200">Manifes Penumpang</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Manifes: {pkg.title}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-1">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              <span>{departureFormatted}</span>
              {schedule.departure_date !== schedule.return_date && (
                <span> s.d. {returnFormatted}</span>
              )}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{pkg.destination_city}</span>
            </span>
            {pkg.meeting_point && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kumpul: {pkg.meeting_point}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons: Export PDF & Excel */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`/api/manifest/${schedule.id}/excel`}
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition shadow-xs"
            title="Download spreadsheet Excel (CSV UTF-8 BOM)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Unduh Excel</span>
          </a>

          <a
            href={`/api/manifest/${schedule.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition shadow-xs"
            title="Buka dokumen cetak resmi PDF A4"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF</span>
          </a>
        </div>
      </div>

      {/* Interactive Manifest Table */}
      <PassengerTable
        initialPassengers={passengerList}
        scheduleTitle={pkg.title}
      />
    </div>
  );
}
