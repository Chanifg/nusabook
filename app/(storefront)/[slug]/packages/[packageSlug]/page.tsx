import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { QuotaCounter } from "@/components/booking/quota-counter";
import {
  Calendar,
  MapPin,
  Clock,
  Check,
  X,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string; packageSlug: string }>;
}) {
  const { slug, packageSlug } = await params;

  // Mock data representing database record (fallback safe)
  const agent = {
    name: "Pesona Merapi Tour & Travel",
    slug: slug,
    city: "Yogyakarta",
    verified: true,
  };

  const tourPackage = {
    id: "22222222-2222-2222-2222-222222222222",
    slug: packageSlug,
    title: "Sunrise Lava Tour Merapi & Bunker Kaliadem",
    category: "Open Trip",
    duration: "1 Hari (Sekitar 6 Jam)",
    destinationCity: "Yogyakarta",
    meetingPoint: "Basecamp Jeep Kaliurang, Sleman",
    description:
      "Saksikan keindahan matahari terbit berlatar megahnya Gunung Merapi dilanjutkan petualangan seru menyusuri jejak erupsi dengan armada Jeep 4x4 terawat dan driver berpengalaman.",
    itinerary: [
      { time: "04:00", title: "Kumpul di Basecamp", desc: "Briefing keselamatan dan pembagian unit jeep 4x4." },
      { time: "04:30", title: "Spot Sunrise Kaliadem", desc: "Menikmati golden sunrise Merapi dari ketinggian Bunker Kaliadem." },
      { time: "06:30", title: "Museum Sisa Hartaku", desc: "Kunjungan edukasi sejarah erupsi 2010 dan spot foto Batu Alien." },
      { time: "08:30", title: "Manuver Air Kali Kuning", desc: "Aksi basah-basahan seru di aliran Kali Kuning dan kembali ke basecamp." },
    ],
    facilitiesIncluded: [
      "Armada Jeep 4x4 + Driver Profesional",
      "BBM & Tiket Masuk Seluruh Objek Wisata",
      "Pemandu Lokal Berlisensi",
      "Air Mineral & Snack Ringan",
      "Asuransi Wisata Dasar",
    ],
    facilitiesExcluded: [
      "Transportasi dari kota asal ke Basecamp",
      "Pengeluaran pribadi di luar paket",
      "Tips sukarela untuk driver",
    ],
    cancellationPolicy:
      "Pembatalan hingga H-3 mendapatkan pengembalian dana 50%. Pembatalan kurang dari 48 jam sebelum jadwal keberangkatan tidak dapat di-refund.",
    schedules: [
      {
        id: "33333333-3333-3333-3333-333333333333",
        dateText: "Sabtu, 4 Oktober 2026",
        departureDate: "2026-10-04",
        price: 250000,
        totalQuota: 12,
        availableQuota: 12,
        status: "OPEN",
      },
      {
        id: "44444444-4444-4444-4444-444444444444",
        dateText: "Minggu, 5 Oktober 2026",
        departureDate: "2026-10-05",
        price: 250000,
        totalQuota: 12,
        availableQuota: 3,
        status: "OPEN",
      },
      {
        id: "55555555-5555-5555-5555-555555555555",
        dateText: "Sabtu, 11 Oktober 2026",
        departureDate: "2026-10-11",
        price: 250000,
        totalQuota: 12,
        availableQuota: 0,
        status: "SOLD_OUT",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-700 font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Katalog {agent.name}
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-500" />
            Terverifikasi
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-8 flex-1 w-full space-y-8">
        {/* Header Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-accent-50 text-accent-600 text-xs font-bold uppercase tracking-wider">
              {tourPackage.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {tourPackage.destinationCity}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {tourPackage.title}
          </h1>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
            {tourPackage.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-brand-700" />
              <span>Durasi: <strong>{tourPackage.duration}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-brand-700" />
              <span>Titik Kumpul: <strong>{tourPackage.meetingPoint}</strong></span>
            </div>
          </div>
        </div>

        {/* Schedules & Quota Selection Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-700" />
              Pilih Tanggal & Jadwal Keberangkatan
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Sistem penguncian kuota kursi otomatis secara realtime menjamin tidak terjadi overbooking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tourPackage.schedules.map((schedule) => {
              const isAvailable = schedule.availableQuota > 0 && schedule.status === "OPEN";

              return (
                <div
                  key={schedule.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                    isAvailable
                      ? "border-slate-200 bg-white hover:border-brand-300 hover:shadow-md"
                      : "border-slate-200 bg-slate-50 opacity-80"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="text-base font-bold text-slate-900">
                      {schedule.dateText}
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Harga per orang</span>
                      <p className="text-2xl font-extrabold text-brand-700">
                        {formatRupiah(schedule.price)}
                      </p>
                    </div>

                    <QuotaCounter
                      totalQuota={schedule.totalQuota}
                      availableQuota={schedule.availableQuota}
                    />
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    {isAvailable ? (
                      <Link
                        href={`/${slug}/booking?trip=${packageSlug}&scheduleId=${schedule.id}`}
                        className="w-full py-3 px-4 rounded-xl bg-brand-700 hover:bg-brand-900 text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-sm"
                      >
                        Pilih Jadwal Ini
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 px-4 rounded-xl bg-slate-200 text-slate-500 font-semibold text-sm cursor-not-allowed"
                      >
                        Kuota Habis
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Itinerary & Facilities Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Itinerary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-700" />
              Rencana Perjalanan (Itinerary)
            </h3>
            <div className="space-y-4">
              {tourPackage.itinerary.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <span className="px-2.5 py-1 rounded bg-brand-50 text-brand-700 font-bold text-xs shrink-0 mt-0.5">
                    {item.time}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Fasilitas Termasuk
              </h3>
              <ul className="space-y-2.5">
                {tourPackage.facilitiesIncluded.map((facility, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{facility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <X className="w-4 h-4 text-rose-500" />
                Fasilitas Tidak Termasuk
              </h3>
              <ul className="space-y-2.5">
                {tourPackage.facilitiesExcluded.map((facility, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <X className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{facility}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Kebijakan Pembatalan & Refund:</span>
            <p className="mt-0.5 text-xs text-amber-800 leading-relaxed">
              {tourPackage.cancellationPolicy}
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        Platform Reservasi Resmi {agent.name} didukung oleh Nusabook
      </footer>
    </div>
  );
}
