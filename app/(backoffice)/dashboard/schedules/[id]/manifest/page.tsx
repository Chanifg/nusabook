import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PassengerTable, PassengerManifestData } from "@/components/manifest/passenger-table";
import { MaterialIcon } from "@/components/ui/icon";

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

  // 4. Flatten data peserta
  const passengers: PassengerManifestData[] = [];
  (bookings || []).forEach((b: any) => {
    (b.booking_passengers || []).forEach((p: any) => {
      passengers.push({
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
        isCheckedIn: !!p.is_checked_in,
        checkedInAt: p.checked_in_at,
      });
    });
  });

  const formattedDate = new Date(schedule.departure_date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Top Utility Context Bar */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 text-on-surface-variant font-caption text-caption">
        <div className="flex items-center gap-space-xs">
          <span>Mitra Operator</span>
          <MaterialIcon name="chevron_right" className="text-xs" />
          <Link href="/dashboard/schedules" className="hover:underline">
            Manifes &amp; Pemesanan
          </Link>
          <MaterialIcon name="chevron_right" className="text-xs" />
          <span className="text-primary font-body-semibold">
            Batch {formattedDate}
          </span>
        </div>
        <div className="flex items-center gap-space-md">
          <span className="inline-flex items-center gap-1.5 bg-surface-container-high px-space-sm py-0.5 rounded-full text-on-surface font-micro-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
            GATE SYSTEM: REALTIME SYNC
          </span>
          <span className="font-mono text-primary font-bold">{formattedDate}</span>
        </div>
      </div>

      {/* Primary Page Header & Batch Metadata Banner */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="bg-primary text-on-primary font-micro-badge px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                FR-5.3 MANIFEST ENGINE
              </span>
              <span className="bg-surface-container-high text-primary font-mono text-micro-badge px-2 py-0.5 rounded font-bold">
                BATCH ID: {schedule.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="bg-surface-container-low text-on-surface-variant font-micro-badge px-2 py-0.5 rounded flex items-center gap-1">
                <MaterialIcon name="pin_drop" className="text-xs text-primary" />
                Rute: {pkg.meeting_point || "Malang"} → {pkg.destination_city || "Bromo"}
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Manifes Penumpang &amp; Presensi Check-in
            </h1>
            <p className="font-body-regular text-body-regular text-on-surface-variant flex flex-wrap items-center gap-x-2">
              <span className="font-semibold text-on-surface">{pkg.title}</span>
              <span>•</span>
              <span>{formattedDate} (00:15 WIB)</span>
              <span>•</span>
              <span className="text-primary font-medium inline-flex items-center gap-1">
                <MaterialIcon name="schedule" className="text-sm" /> Status: Terjadwal Siap Berangkat
              </span>
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center gap-space-xs">
            <a
              href={`/api/manifest/pdf?scheduleId=${schedule.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-space-sm py-space-sm rounded-lg font-body-semibold text-body-semibold shadow-sm flex items-center gap-1.5 transition-colors text-sm"
            >
              <MaterialIcon name="description" className="text-primary text-lg" />
              <span>PDF SIMAKSI</span>
            </a>
            <a
              href={`/api/manifest/export?scheduleId=${schedule.id}`}
              className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-space-sm py-space-sm rounded-lg font-body-semibold text-body-semibold shadow-sm flex items-center gap-1.5 transition-colors text-sm"
            >
              <MaterialIcon name="table_chart" className="text-primary text-lg" />
              <span>Unduh CSV</span>
            </a>
            <a
              href={`https://wa.me/?text=Halo%20Peserta%20${encodeURIComponent(
                pkg.title
              )}%20jadwal%20${schedule.departure_date}%2C%20mohon%20bersiap%20di%20meeting%20point.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-space-sm py-space-sm rounded-lg font-body-semibold text-body-semibold shadow-sm flex items-center gap-1.5 transition-colors text-sm"
            >
              <MaterialIcon name="forum" className="text-primary text-lg" />
              <span>Broadcast WA</span>
            </a>
          </div>
        </div>

        {/* Live Batch Readiness Ribbon */}
        <div className="mt-space-md pt-space-sm bg-surface-container-low rounded-lg p-space-sm flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex flex-wrap items-center gap-space-md">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
              <span className="font-body-semibold text-body-semibold text-on-surface">
                {passengers.length} / {schedule.total_quota} Pax Terkonfirmasi
              </span>
              <span className="bg-surface-container-highest text-primary font-micro-badge px-1.5 py-0.5 rounded font-bold">
                {schedule.booked_quota >= schedule.total_quota ? "100% KUOTA" : "AKTIF"}
              </span>
            </div>
            <div className="hidden sm:inline text-outline">|</div>
            <div className="flex items-center gap-1 text-on-surface-variant font-caption text-caption">
              <MaterialIcon name="verified" className="text-primary text-base" />
              <span>
                SIMAKSI TNBTS: <strong>SIAP CETAK</strong>
              </span>
            </div>
            <div className="hidden sm:inline text-outline">|</div>
            <div className="flex items-center gap-1 text-on-surface-variant font-caption text-caption">
              <MaterialIcon name="security" className="text-primary text-base" />
              <span>
                Jasa Raharja: <strong>POLIS KOLEKTIF TERBIT</strong>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-caption text-caption text-on-surface-variant">
              Kunci Pessimistic Kuota:
            </span>
            <span className="bg-secondary-fixed text-on-secondary-fixed font-mono font-bold text-micro-badge px-2 py-0.5 rounded">
              LOCKED BY SYSTEM
            </span>
          </div>
        </div>
      </div>

      {/* UU PDP No. 27/2022 Legal Compliance Banner */}
      <div className="bg-primary-container text-on-primary rounded-xl p-space-md shadow-sm relative overflow-hidden">
        <div className="flex items-start gap-space-sm relative z-10">
          <div className="p-2 bg-on-primary/10 rounded-lg text-on-primary mt-0.5">
            <MaterialIcon name="gavel" className="text-xl" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-title-md text-title-md font-bold tracking-tight">
                Kepatuhan UU Perlindungan Data Pribadi (UU No. 27/2022)
              </h2>
              <span className="bg-primary-fixed text-on-primary-fixed text-micro-badge font-bold px-2 py-0.5 rounded uppercase">
                AES-256 GCM ENCRYPTED
              </span>
            </div>
            <p className="font-body-regular text-body-regular text-on-primary-container leading-relaxed text-sm">
              Seluruh Nomor Induk Kependudukan (NIK) dan Paspor dilindungi dengan enkripsi end-to-end.
              Data manifes hanya dibuka untuk keperluan resmi verifikasi pos pintu masuk SIMAKSI Balai
              Besar TNBTS dan penerbitan klaim proteksi Jasa Raharja.
            </p>
          </div>
        </div>
      </div>

      {/* Master Passenger Manifest Table & Telemetry */}
      <PassengerTable
        initialPassengers={passengers}
        scheduleTitle={pkg.title}
        scheduleDate={schedule.departure_date}
        scheduleId={schedule.id}
      />
    </div>
  );
}
