"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/client";
import { findCatalogPackageByScheduleId } from "@/lib/catalog-data";

function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

function maskNik(nik?: string | null): string {
  if (!nik || nik.length < 16) return "3507************";
  return nik.substring(0, 4) + "********" + nik.substring(12);
}

function formatDateIndo(dateStr?: string | null): string {
  if (!dateStr) return "Sesuai Jadwal Reservasi";
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
}

export default function ETicketPage({
  params,
}: {
  params: Promise<{ bookingCode: string }>;
}) {
  const { bookingCode } = use(params);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Dynamic booking state
  const [customerName, setCustomerName] = useState<string>("Tamu Nusabook");
  const [customerEmail, setCustomerEmail] = useState<string>("tamu@nusabook.id");
  const [customerWhatsapp, setCustomerWhatsapp] = useState<string>("+62 812-0000-0000");
  const [tripTitle, setTripTitle] = useState<string>("Paket Wisata Nusantara");
  const [operatorName, setOperatorName] = useState<string>("Pesona Merapi Adventure");
  const [departureDate, setDepartureDate] = useState<string>("2026-10-18");
  const [meetingPoint, setMeetingPoint] = useState<string>("Pintu Timur Stasiun KA Malang Kota Baru");
  const [totalPax, setTotalPax] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number>(500000);
  const [paymentStatus, setPaymentStatus] = useState<string>("PAID");
  const [passengers, setPassengers] = useState<Array<{ full_name: string; id_card_number?: string | null }>>([]);
  const [agentWhatsapp, setAgentWhatsapp] = useState<string>("6281388229100");

  useEffect(() => {
    let isMounted = true;
    async function loadBooking() {
      try {
        const supabase = createClient();
        const { data: bData } = await supabase
          .from("bookings")
          .select("*, travel_agents(*), trip_schedules(*, tour_packages(*)), booking_passengers(*)")
          .eq("booking_code", bookingCode)
          .maybeSingle();

        if (bData && isMounted) {
          if (bData.customer_name) setCustomerName(bData.customer_name);
          if (bData.customer_email) setCustomerEmail(bData.customer_email);
          if (bData.customer_whatsapp) setCustomerWhatsapp(bData.customer_whatsapp);
          if (bData.total_pax) setTotalPax(Number(bData.total_pax));
          if (bData.total_amount) setTotalAmount(Number(bData.total_amount));
          if (bData.payment_status) setPaymentStatus(bData.payment_status);

          const pkg = (bData as any).trip_schedules?.tour_packages;
          if (pkg?.title) setTripTitle(pkg.title);
          if (pkg?.meeting_point) setMeetingPoint(pkg.meeting_point);

          const sched = (bData as any).trip_schedules;
          if (sched?.departure_date) setDepartureDate(sched.departure_date);

          const agent = (bData as any).travel_agents;
          if (agent) {
            if (agent.business_name) setOperatorName(agent.business_name);
            if (agent.whatsapp_number) {
              const cleanWa = agent.whatsapp_number.replace(/\D/g, "");
              if (cleanWa) setAgentWhatsapp(cleanWa);
            }
          }

          if (bData.booking_passengers && Array.isArray(bData.booking_passengers) && bData.booking_passengers.length > 0) {
            setPassengers(bData.booking_passengers);
          } else if (bData.customer_name) {
            setPassengers([
              {
                full_name: bData.customer_name,
                id_card_number: null,
              },
            ]);
          }
          return;
        }
      } catch {
        // Fallback to local API
      }

      if (isMounted) {
        try {
          const res = await fetch(`/api/bookings/${bookingCode}`);
          if (res.ok) {
            const json = await res.json();
            const b = json.booking;
            if (b) {
              if (b.customer_name) setCustomerName(b.customer_name);
              if (b.customer_email) setCustomerEmail(b.customer_email);
              if (b.customer_whatsapp) setCustomerWhatsapp(b.customer_whatsapp);
              if (b.total_pax) setTotalPax(Number(b.total_pax));
              if (b.total_amount) setTotalAmount(Number(b.total_amount));
              if (b.payment_status) setPaymentStatus(b.payment_status);
              if (b.tripTitle) setTripTitle(b.tripTitle);

              if (b.schedule_id) {
                const catalogMatch = findCatalogPackageByScheduleId(b.schedule_id);
                if (catalogMatch) {
                  setTripTitle(catalogMatch.pkg.title);
                  setMeetingPoint(catalogMatch.pkg.meeting_point);
                  setOperatorName(catalogMatch.pkg.agent.business_name);
                  setAgentWhatsapp(catalogMatch.pkg.agent.whatsapp_number.replace(/\D/g, ""));
                  setDepartureDate(catalogMatch.schedule.departureDate);
                }
              }

              if (b.passengers && Array.isArray(b.passengers) && b.passengers.length > 0) {
                setPassengers(b.passengers.map((p: any) => ({
                  full_name: p.full_name || p.fullName,
                  id_card_number: p.id_card_number || p.idCardNumber,
                })));
              } else if (b.customer_name) {
                setPassengers([{ full_name: b.customer_name, id_card_number: null }]);
              }
            }
          }
        } catch {
          // Keep current state
        }
      }
    }

    loadBooking();
    return () => {
      isMounted = false;
    };
  }, [bookingCode]);

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      window.print();
      setTimeout(() => setDownloadSuccess(false), 2500);
    }, 600);
  };

  const cleanWaNumber = (customerWhatsapp || "").replace(/\D/g, "") || "6281234567890";
  const whatsappUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    `Halo, berikut adalah bukti reservasi dan E-Tiket resmi Nusabook untuk kode booking: ${bookingCode}`
  )}`;

  return (
    <div className="bg-background font-body-regular text-on-surface antialiased min-h-screen flex flex-col print:bg-white">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] print:hidden">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <Link className="flex items-center gap-space-sm" href="/">
              <img
                alt="Nusabook Brand Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1U3Dc9ujBNuM7mgSPnQReIZqJpbXFrgBa8_v7KkLAxGoGg-NCEjy4Aw-pYXp9CiKsNHmqpLEMF2TzdVBIjehkrvhOp1eK3eYIfA64704YK0SOXTQb6gBESs7Xo_FJmMnJpYGla99v_5KwfnRrPX3mOY81yQP8OnvPcRn6zitzBMcBKr14d077mBMYP9cT2gZ37ppBCN_acPq-kd6A4kNOGLXs6_FK5SnaikbZm8kopURdxI0y2YnoftJw"
              />
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                Nusabook
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-space-lg">
            <Link className="font-body-regular text-body-regular text-on-surface-variant hover:text-on-surface transition-colors" href="/explore">
              Jelajah Wisata
            </Link>
            <Link className="font-body-regular text-body-regular text-on-surface-variant hover:text-on-surface transition-colors" href="/pesona-merapi">
              Etalase Paket
            </Link>
            <span className="font-body-semibold text-body-semibold text-primary font-bold">
              E-Tiket Resmi
            </span>
            <Link className="font-body-regular text-body-regular text-on-surface-variant hover:text-on-surface transition-colors" href="/dashboard">
              Operator Backoffice
            </Link>
          </nav>

          <div className="flex items-center gap-space-md">
            <div className="relative">
              <button
                className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
                type="button"
              >
                <MaterialIcon name="notifications" className="text-[22px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container" />
              </button>
            </div>
            <div className="flex items-center gap-space-sm pl-space-xs">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs ring-2 ring-surface-container-high">
                {customerName ? customerName.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="font-body-semibold text-body-semibold text-on-surface leading-tight font-bold">
                  {customerName}
                </span>
                <span className="font-caption text-caption text-outline">{operatorName}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-14rem)] flex-1">
        <div className="flex flex-col w-full">
          {/* Progress Stepper Header */}
          <div className="w-full bg-surface-container-low shadow-sm print:hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-on-primary">
                    <MaterialIcon name="verified" className="text-[16px]" />
                  </span>
                  <div>
                    <h1 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Konfirmasi Reservasi Resmi
                    </h1>
                    <p className="font-caption text-caption text-on-surface-variant">
                      Langkah 4 dari 4: E-Tiket & Konfirmasi
                    </p>
                  </div>
                </div>

                {/* 4-Step Indicator */}
                <div className="flex items-center gap-space-xs sm:gap-space-sm overflow-x-auto py-1">
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-caption text-caption font-semibold">
                      <MaterialIcon name="check" className="text-[14px]" />
                    </span>
                    <span className="font-caption text-caption text-on-surface font-semibold hidden sm:inline">
                      Paket & Jadwal
                    </span>
                  </div>
                  <span className="w-4 h-0.5 bg-outline-variant" />
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-caption text-caption font-semibold">
                      <MaterialIcon name="check" className="text-[14px]" />
                    </span>
                    <span className="font-caption text-caption text-on-surface font-semibold hidden sm:inline">
                      Data Manifes
                    </span>
                  </div>
                  <span className="w-4 h-0.5 bg-outline-variant" />
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-caption text-caption font-semibold">
                      <MaterialIcon name="check" className="text-[14px]" />
                    </span>
                    <span className="font-caption text-caption text-on-surface font-semibold hidden sm:inline">
                      Pembayaran Terkonfirmasi
                    </span>
                  </div>
                  <span className="w-4 h-0.5 bg-secondary-container" />
                  <div className="flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded-full shadow-sm">
                    <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center font-caption text-caption font-bold">
                      4
                    </span>
                    <span className="font-caption text-caption text-primary font-bold">E-Tiket Terbit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Body Content */}
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-lg w-full flex flex-col gap-space-xl">
            {/* Section 1: Success Banner & Action Toolbar */}
            <div className="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-md lg:p-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md print:hidden">
              <div className="flex items-start sm:items-center gap-space-md">
                <div className="w-12 h-12 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center shrink-0">
                  <MaterialIcon name="check_circle" className="text-[32px]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <h2 className="font-headline-md text-headline-md text-primary font-bold">
                      {paymentStatus === "PAID" ? "Pembayaran Berhasil & Reservasi Terkonfirmasi!" : "Reservasi Tiket Terdaftar"}
                    </h2>
                    <span className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#059669] px-2 py-0.5 rounded-full font-micro-badge text-micro-badge font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      TERBIT OTOMATIS
                    </span>
                  </div>
                  <p className="font-body-regular text-body-regular text-on-surface-variant mt-0.5">
                    E-Tiket resmi telah diterbitkan dan dikirimkan secara otomatis ke{" "}
                    <span className="font-body-semibold text-on-surface font-bold">{customerEmail}</span>{" "}
                    serta WhatsApp{" "}
                    <span className="font-body-semibold text-on-surface font-bold">{customerWhatsapp}</span>.
                  </p>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-space-xs sm:gap-space-sm flex-wrap self-end lg:self-center">
                <button
                  className="inline-flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface px-space-sm py-2 rounded-lg font-body-semibold text-body-semibold transition-colors font-bold cursor-pointer"
                  onClick={() => window.print()}
                  type="button"
                >
                  <MaterialIcon name="print" className="text-[18px]" />
                  <span>Cetak</span>
                </button>
                <a
                  className="inline-flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface px-space-sm py-2 rounded-lg font-body-semibold text-body-semibold transition-colors font-bold cursor-pointer"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MaterialIcon name="chat" className="text-[18px] text-[#059669]" />
                  <span>Kirim WhatsApp</span>
                </a>
                <button
                  className="inline-flex items-center gap-1.5 bg-secondary-container hover:bg-secondary text-on-secondary px-space-md py-2 rounded-lg font-body-semibold text-body-semibold shadow-sm transition-colors font-bold cursor-pointer"
                  onClick={handleDownloadPdf}
                  type="button"
                >
                  {downloading ? (
                    <>
                      <MaterialIcon name="progress_activity" className="text-[18px] animate-spin" />
                      <span>Mempersiapkan Dokumen...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <MaterialIcon name="check" className="text-[18px]" />
                      <span>Membuka Jendela Cetak</span>
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="download" className="text-[18px]" />
                      <span>Unduh PDF (E-Tiket & SIMAKSI)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Section 2: Main E-Ticket Pass (Boarding Pass Layout with Perforated Notch Effect) */}
            <div className="w-full relative bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden flex flex-col xl:flex-row print:shadow-none print:border print:border-slate-300">
              {/* Left/Main Section of Pass */}
              <div className="flex-1 p-space-md lg:p-space-lg flex flex-col justify-between">
                {/* Ticket Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-md bg-surface-container-low/40 -mx-space-md -mt-space-md lg:-mx-space-lg lg:-mt-space-lg p-space-md lg:p-space-lg">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold">
                      <MaterialIcon name="sailing" className="text-[24px]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-title-md text-title-md text-primary font-bold">
                          E-Tiket Nusabook
                        </span>
                      </div>
                      <span className="font-caption text-caption text-on-surface-variant">
                        Operator: {operatorName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <div className="inline-flex items-center gap-1.5 bg-[#ecfdf5] text-[#059669] px-space-sm py-1 rounded-full font-micro-badge text-micro-badge font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                      <span>{paymentStatus === "PAID" ? "TERBAYAR LUNAS" : "MENUNGGU VERIFIKASI"}</span>
                    </div>
                  </div>
                </div>

                {/* Tour Info Headline */}
                <div className="py-space-md">
                  <div className="flex items-center gap-space-xs text-secondary-container font-caption text-caption font-bold tracking-wider uppercase">
                    <MaterialIcon name="landscape" className="text-[16px]" />
                    <span>Paket Wisata Terdaftar</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-1 leading-snug font-bold">
                    {tripTitle}
                  </h3>
                  <p className="font-body-regular text-body-regular text-on-surface-variant mt-1">
                    Kode Booking Resmi:{" "}
                    <span className="font-body-semibold text-primary select-all font-bold font-mono">
                      {bookingCode}
                    </span>{" "}
                    • Kategori: Open / Private Trip
                  </p>
                </div>

                {/* Trip Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md p-space-md rounded-xl bg-surface-container-low">
                  {/* Col 1 */}
                  <div className="flex items-start gap-space-sm">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <MaterialIcon name="calendar_today" className="text-[20px]" />
                    </div>
                    <div>
                      <span className="font-caption text-caption text-on-surface-variant block">
                        Jadwal Keberangkatan
                      </span>
                      <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                        {formatDateIndo(departureDate)}
                      </span>
                      <span className="font-caption text-caption text-secondary font-semibold font-bold">
                        Tepat Waktu / Confirmed
                      </span>
                    </div>
                  </div>

                  {/* Col 2 */}
                  <div className="flex items-start gap-space-sm">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <MaterialIcon name="schedule" className="text-[20px]" />
                    </div>
                    <div>
                      <span className="font-caption text-caption text-on-surface-variant block">
                        Waktu Penjemputan
                      </span>
                      <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                        00:15 WIB (Dini Hari)
                      </span>
                      <span className="font-caption text-caption text-error font-semibold font-bold">
                        Standby 15 menit sebelumnya
                      </span>
                    </div>
                  </div>

                  {/* Col 3 */}
                  <div className="flex items-start gap-space-sm">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <MaterialIcon name="group" className="text-[20px]" />
                    </div>
                    <div>
                      <span className="font-caption text-caption text-on-surface-variant block">Kapasitas Kursi</span>
                      <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                        {totalPax} Pax (Dewasa)
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">Allotment Wisata Resmi</span>
                    </div>
                  </div>

                  {/* Col 4 */}
                  <div className="flex items-start gap-space-sm sm:col-span-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <MaterialIcon name="pin_drop" className="text-[20px]" />
                    </div>
                    <div>
                      <span className="font-caption text-caption text-on-surface-variant block">
                        Titik Kumpul / Pickup Station
                      </span>
                      <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                        {meetingPoint}
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        Koordinasi kru berseragam identitas {operatorName} dan bendera Nusabook
                      </span>
                    </div>
                  </div>

                  {/* Col 5 */}
                  <div className="flex items-start gap-space-sm">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <MaterialIcon name="directions_car" className="text-[20px]" />
                    </div>
                    <div>
                      <span className="font-caption text-caption text-on-surface-variant block">
                        Shuttle & Armada
                      </span>
                      <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                        Armada Resmi Mitra
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        Standar Operasional Tour Aman
                      </span>
                    </div>
                  </div>
                </div>

                {/* Passenger Manifest Table */}
                <div className="mt-space-md">
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-space-xs">
                      <MaterialIcon name="badge" className="text-[18px] text-primary" />
                      <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                        Manifes Penumpang Resmi & Asuransi Perjalanan
                      </h4>
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant hidden sm:inline">
                      {passengers.length} Data Terverifikasi
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-lg bg-surface-container-lowest border border-surface-container-high">
                    <table className="w-full text-left font-body-regular text-body-regular">
                      <thead>
                        <tr className="bg-surface-container-high/60 text-on-surface font-body-semibold text-[13px]">
                          <th className="py-2.5 px-3">No</th>
                          <th className="py-2.5 px-3">Nama Penumpang</th>
                          <th className="py-2.5 px-3">Nomor Identitas (NIK)</th>
                          <th className="py-2.5 px-3">Status Asuransi</th>
                          <th className="py-2.5 px-3">ID Boarding / SIMAKSI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-low">
                        {passengers.map((p, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-primary font-bold">
                              {String(idx + 1).padStart(2, "0")}
                            </td>
                            <td className="py-2.5 px-3 font-body-semibold text-on-surface font-bold">
                              {p.full_name}
                              {idx === 0 && (
                                <span className="block font-caption text-caption text-outline font-normal">
                                  Lead Passenger (Kontak Utama)
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-caption text-caption text-on-surface-variant font-mono">
                              {maskNik(p.id_card_number)} (WNI)
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#059669] px-2 py-0.5 rounded text-[11px] font-semibold font-bold">
                                <MaterialIcon name="security" className="text-[12px]" />
                                Tercover Asuransi
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-caption text-caption font-semibold text-primary font-bold font-mono">
                              NUSA/{bookingCode}/{idx + 1}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Perforated Divider Accent Line for Desktop */}
              <div className="relative hidden xl:flex flex-col items-center justify-between w-6 py-6 -my-4 print:hidden">
                <div className="w-6 h-6 rounded-full bg-surface" />
                <div className="w-0.5 h-full bg-surface-container-high border-r-2 border-dashed border-outline-variant my-2" />
                <div className="w-6 h-6 rounded-full bg-surface" />
              </div>

              {/* Right Section: Verification QR Code & Field Boarding Validation */}
              <div className="w-full xl:w-80 bg-surface-container-low p-space-md lg:p-space-lg flex flex-col justify-between items-center text-center">
                <div className="w-full flex flex-col items-center">
                  <div className="inline-flex items-center gap-1 text-primary font-caption text-caption font-bold uppercase tracking-wider mb-space-sm">
                    <MaterialIcon name="qr_code_scanner" className="text-[16px]" />
                    <span>Validasi di Lokasi</span>
                  </div>

                  {/* Clean QR Code Visual Graphic */}
                  <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm inline-block">
                    <svg className="w-44 h-44 text-primary" fill="currentColor" viewBox="0 0 100 100">
                      <rect fill="none" height="28" rx="2" stroke="currentColor" strokeWidth="6" width="28" x="5" y="5" />
                      <rect fill="currentColor" height="12" rx="1" width="12" x="13" y="13" />
                      <rect fill="none" height="28" rx="2" stroke="currentColor" strokeWidth="6" width="28" x="67" y="5" />
                      <rect fill="currentColor" height="12" rx="1" width="12" x="75" y="13" />
                      <rect fill="none" height="28" rx="2" stroke="currentColor" strokeWidth="6" width="28" x="5" y="67" />
                      <rect fill="currentColor" height="12" rx="1" width="12" x="13" y="75" />
                      <rect height="5" width="5" x="38" y="8" />
                      <rect height="5" width="5" x="46" y="8" />
                      <rect height="5" width="5" x="54" y="8" />
                      <rect height="10" width="5" x="38" y="18" />
                      <rect height="5" width="6" x="48" y="22" />
                      <rect height="12" width="5" x="56" y="16" />
                      <rect height="5" width="8" x="10" y="38" />
                      <rect height="6" width="5" x="22" y="46" />
                      <rect height="5" width="12" x="8" y="54" />
                      <rect height="8" rx="1" width="8" x="38" y="38" />
                      <rect height="6" width="12" x="50" y="38" />
                      <rect height="12" width="6" x="38" y="50" />
                      <rect height="14" width="14" x="48" y="48" />
                      <rect height="8" width="6" x="68" y="38" />
                      <rect height="6" width="14" x="78" y="42" />
                      <rect height="6" width="12" x="68" y="52" />
                      <rect height="10" width="8" x="84" y="52" />
                      <rect height="8" width="8" x="38" y="68" />
                      <rect height="6" width="12" x="50" y="70" />
                      <rect height="8" width="18" x="42" y="80" />
                      <rect height="6" width="10" x="68" y="68" />
                      <rect height="12" width="10" x="82" y="72" />
                      <rect height="6" width="20" x="72" y="82" />
                    </svg>
                  </div>

                  <div className="mt-space-sm font-caption text-caption text-on-surface font-semibold tracking-wider font-mono">
                    NUSA-AUTH-{bookingCode}
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mt-space-xs leading-relaxed max-w-xs">
                    Tunjukkan QR Code ini kepada Tour Leader / Crew Lapangan saat penjemputan untuk verifikasi kehadiran.
                  </p>
                </div>

                {/* Offline Guarantee Box */}
                <div className="w-full mt-space-md p-space-sm rounded-lg bg-surface-container text-left flex items-center gap-space-xs">
                  <MaterialIcon name="signal_wifi_off" className="text-[20px] text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-caption text-caption text-on-surface font-semibold font-bold">
                      Valid Tanpa Sinyal (Offline Pass)
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Tersimpan dalam cache aplikasi Nusabook
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 & 4: Two-Column Bento Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg w-full">
              {/* Left Column: Departure Checklist & Crew Coordination (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                {/* WhatsApp Coordination Card */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col sm:flex-row items-center justify-between gap-space-md">
                  <div className="flex items-center gap-space-md">
                    <div className="w-12 h-12 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center shrink-0">
                      <MaterialIcon name="groups" className="text-[28px]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <h4 className="font-title-md text-title-md text-on-surface font-bold">
                          Grup WhatsApp Peserta {tripTitle}
                        </h4>
                        <span className="bg-[#ecfdf5] text-[#059669] text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Resmi Terverifikasi
                        </span>
                      </div>
                      <p className="font-caption text-caption text-on-surface-variant">
                        Koordinasi langsung dengan Driver dan Tour Leader resmi {operatorName}.
                      </p>
                    </div>
                  </div>
                  <a
                    className="shrink-0 bg-[#059669] hover:bg-[#047857] text-white px-space-md py-2.5 rounded-lg font-body-semibold text-body-semibold inline-flex items-center gap-1.5 shadow-sm transition-colors font-bold"
                    href={`https://wa.me/${agentWhatsapp}?text=${encodeURIComponent(
                      `Halo ${operatorName}, saya ingin bergabung ke grup koordinasi untuk booking ${bookingCode}`
                    )}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <MaterialIcon name="forum" className="text-[18px]" />
                    <span>Gabung WhatsApp Grup</span>
                  </a>
                </div>

                {/* Essential Logistics & Gear Checklist */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-md flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <MaterialIcon name="hiking" className="text-[22px] text-secondary-container" />
                      <h3 className="font-title-md text-title-md text-primary font-bold">
                        Panduan Logistik & Perlengkapan Wajib
                      </h3>
                    </div>
                    <span className="font-caption text-caption text-secondary font-semibold font-bold">
                      Suhu Nyaman: Siapkan Pakaian Sesuai
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                    <div className="flex items-start gap-space-xs p-space-sm rounded-lg bg-surface-container-low">
                      <MaterialIcon name="check_box" className="text-[18px] text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                          Jaket Hangat / Windbreaker
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Melindungi dari angin dan hawa dingin pagi hari.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-xs p-space-sm rounded-lg bg-surface-container-low">
                      <MaterialIcon name="check_box" className="text-[18px] text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                          Sepatu Kets / Trekking
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Grip sol yang baik untuk berjalan di area alam terbuka.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-xs p-space-sm rounded-lg bg-surface-container-low">
                      <MaterialIcon name="check_box" className="text-[18px] text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                          Kartu Identitas Asli (KTP / Paspor)
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Wajib dicocokkan dengan manifes reservasi saat penjemputan.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-xs p-space-sm rounded-lg bg-surface-container-low">
                      <MaterialIcon name="check_box" className="text-[18px] text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                          Obat-Obatan Pribadi
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Mencegah mabuk darat dan menjaga daya tahan tubuh.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Basecamp & Transit Address */}
                  <div className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container">
                    <MaterialIcon name="storefront" className="text-[24px] text-primary shrink-0" />
                    <div className="flex-1">
                      <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                        Titik Penjemputan Utama: {meetingPoint}
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        Harap hadir 15 menit sebelum waktu keberangkatan untuk koordinasi logistik.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Field Contacts & Tour Leader Card */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-md flex flex-col gap-space-md">
                  <div className="flex items-center gap-space-xs">
                    <MaterialIcon name="support_agent" className="text-[20px] text-primary" />
                    <h3 className="font-title-md text-title-md text-primary font-bold">Kontak Personel Lapangan</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    {/* Lead Guide */}
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold">
                          {operatorName ? operatorName.charAt(0) : "T"}
                        </div>
                        <div>
                          <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                            {operatorName}
                          </span>
                          <span className="font-caption text-caption text-on-surface-variant">
                            Penyelenggara Wisata Resmi
                          </span>
                        </div>
                      </div>
                      <a
                        className="w-9 h-9 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center hover:bg-[#d1fae5] transition-colors"
                        href={`https://wa.me/${agentWhatsapp}`}
                        title="Hubungi WhatsApp"
                      >
                        <MaterialIcon name="call" className="text-[20px]" />
                      </a>
                    </div>

                    {/* Emergency Concierge */}
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center font-bold">
                          24h
                        </div>
                        <div>
                          <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                            Nusabook Customer Support
                          </span>
                          <span className="font-caption text-caption text-on-surface-variant">
                            Hotline Bantuan 24/7
                          </span>
                        </div>
                      </div>
                      <a
                        className="w-9 h-9 rounded-full bg-surface-container-high text-primary flex items-center justify-center hover:bg-surface-variant transition-colors"
                        href="tel:628113006872"
                        title="Telepon"
                      >
                        <MaterialIcon name="phone_in_talk" className="text-[20px]" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Escrow Financial Proof & Safe Vault Breakdown (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-space-md">
                {/* Ringkasan Pembayaran Card */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-md flex flex-col gap-space-md">
                  <div className="flex items-center gap-space-xs">
                    <MaterialIcon name="receipt_long" className="text-[22px] text-primary" />
                    <h3 className="font-title-md text-title-md text-primary font-bold">
                      Ringkasan Pembayaran
                    </h3>
                  </div>

                  <div className="flex flex-col gap-space-xs text-body-regular">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant">Status Pembayaran</span>
                      <span className="font-body-semibold text-on-surface font-bold">
                        {paymentStatus === "PAID" ? "Terbayar Lunas" : "Menunggu Konfirmasi"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant">No. Referensi Booking</span>
                      <span className="font-mono text-caption text-on-surface font-semibold font-bold">
                        {bookingCode}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant">Jumlah Peserta</span>
                      <span className="font-body-semibold text-on-surface font-bold">
                        {totalPax} Orang
                      </span>
                    </div>

                    {/* Total Tagihan */}
                    <div className="pt-space-sm mt-space-xs bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between border-t border-surface-container-high">
                      <div>
                        <span className="font-caption text-caption text-on-surface-variant block uppercase tracking-wider font-bold">
                          Total Tagihan
                        </span>
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">
                          {formatRupiah(totalAmount)}
                        </span>
                      </div>
                      <span className="bg-[#ecfdf5] text-[#059669] font-body-semibold text-body-semibold px-2.5 py-1 rounded-full font-bold">
                        {paymentStatus === "PAID" ? "Lunas" : "Terkonfirmasi"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Google Maps Meeting Point Card */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <MaterialIcon name="location_on" className="text-[20px] text-primary" />
                      <h4 className="font-body-semibold text-body-semibold text-on-surface font-bold">
                        Peta Titik Kumpul
                      </h4>
                    </div>
                    <a
                      className="font-caption text-caption text-secondary font-bold hover:underline flex items-center gap-0.5"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meetingPoint)}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>Buka di Google Maps</span>
                      <MaterialIcon name="open_in_new" className="text-[14px]" />
                    </a>
                  </div>

                  <div className="w-full p-space-md rounded-lg bg-surface-container text-left flex flex-col gap-1">
                    <span className="font-body-semibold text-body-semibold text-on-surface font-bold">
                      {meetingPoint}
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      Silakan tunjukkan QR Code pada E-Tiket saat berkumpul di lokasi.
                    </span>
                  </div>
                </div>

                {/* Cancellation & Reschedule Terms Summary */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-xs">
                  <div className="flex items-center gap-space-xs text-primary font-caption text-caption font-semibold font-bold">
                    <MaterialIcon name="info" className="text-[16px]" />
                    <span>Ketentuan Perjalanan & Layanan</span>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
                    Reservasi ini dilindungi oleh garansi perjalanan Nusabook. Jika terjadi kendala operasional atau faktor cuaca ekstrem, hubungi operator wisata atau customer support kami untuk penyesuaian jadwal.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Bottom Navigation / Action Links */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-sm pb-space-lg print:hidden">
              <Link
                className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-body-semibold text-body-semibold transition-colors font-bold"
                href="/dashboard"
              >
                <MaterialIcon name="receipt_long" className="text-[18px]" />
                <span>Buka Pesanan Saya & Riwayat Tiket</span>
              </Link>
              <div className="flex items-center gap-space-sm">
                <Link
                  className="inline-flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-variant text-primary px-space-md py-2.5 rounded-lg font-body-semibold text-body-semibold transition-colors font-bold"
                  href="/explore"
                >
                  <MaterialIcon name="explore" className="text-[18px]" />
                  <span>Jelajah Wisata Lainnya</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-low py-space-xl border-t border-slate-200 print:hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant">
          <div className="flex items-center gap-space-sm">
            <img
              alt="Nusabook Brand Logo"
              className="h-6 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1U3Dc9ujBNuM7mgSPnQReIZqJpbXFrgBa8_v7KkLAxGoGg-NCEjy4Aw-pYXp9CiKsNHmqpLEMF2TzdVBIjehkrvhOp1eK3eYIfA64704YK0SOXTQb6gBESs7Xo_FJmMnJpYGla99v_5KwfnRrPX3mOY81yQP8OnvPcRn6zitzBMcBKr14d077mBMYP9cT2gZ37ppBCN_acPq-kd6A4kNOGLXs6_FK5SnaikbZm8kopURdxI0y2YnoftJw"
            />
            <span className="font-body-semibold text-body-semibold text-primary font-bold">
              Nusabook UMKM Pariwisata
            </span>
            <span className="font-caption text-caption text-outline">Program P2MW 2026</span>
          </div>
          <div className="flex gap-space-lg font-caption text-caption">
            <Link className="hover:text-on-surface transition-colors" href="/explore">
              Syarat & Ketentuan
            </Link>
          </div>
          <div className="font-caption text-caption text-outline">© 2026 Nusabook Indonesia. Hak Cipta Dilindungi.</div>
        </div>
      </footer>
    </div>
  );
}
