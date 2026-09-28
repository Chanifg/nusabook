import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { Calendar, MapPin, Users, Check, Clock, ChevronRight } from "lucide-react";

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Demo fallback data if running before live DB sync
  const agent = {
    name: "Pesona Merapi Tour & Travel",
    slug: slug,
    city: "Yogyakarta",
    verified: true,
    whatsapp: "6281234567890",
    description: "Spesialis paket wisata alam Merapi, sunrise trip, dan sewa jeep lava tour terpercaya di Yogyakarta.",
  };

  const sampleTrip = {
    title: "Sunrise Lava Tour Merapi & Bunker Kaliadem",
    city: "Yogyakarta",
    duration: "1 Hari",
    price: 250000,
    totalQuota: 12,
    availableQuota: 12,
    meetingPoint: "Basecamp Jeep Kaliurang, Sleman",
    date: "Sabtu, 4 Oktober 2026",
    included: ["Jeep 4x4 + Driver", "Tiket Masuk & Retribusi", "Pemandu Lokal", "Air Mineral & Snack"],
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Agent Header Banner */}
      <header className="bg-brand-700 text-white py-12 px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-900/60 text-xs font-medium text-brand-100 mb-3 border border-brand-500/30">
              <Check className="w-3.5 h-3.5 text-accent-500" />
              Mitra Terverifikasi Nusabook
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{agent.name}</h1>
            <p className="text-brand-100 max-w-xl text-sm md:text-base leading-relaxed">{agent.description}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-sm">
            <p className="text-brand-100 text-xs">Lokasi Operasional</p>
            <p className="font-semibold text-white flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-accent-500" />
              {agent.city}
            </p>
          </div>
        </div>
      </header>

      {/* Trip Catalog */}
      <main className="max-w-5xl mx-auto p-6 md:p-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Jadwal Perjalanan Terbuka</h2>
            <p className="text-slate-600 text-sm mt-1">Pilih jadwal trip dan amankan kursi Anda secara instan</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8 justify-between">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-accent-50 text-accent-600 text-xs font-bold uppercase tracking-wider">
                Open Trip
              </span>
              <h3 className="text-2xl font-bold text-slate-900">{sampleTrip.title}</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-700" />
                  <span>{sampleTrip.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-700" />
                  <span>{sampleTrip.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-emerald-700">Sisa Kuota: {sampleTrip.availableQuota} kursi</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Fasilitas Termasuk</p>
                <div className="flex flex-wrap gap-2">
                  {sampleTrip.included.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between items-start lg:items-end border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-8 min-w-[240px]">
              <div>
                <p className="text-xs text-slate-500 font-medium">Harga per Peserta</p>
                <p className="text-3xl font-extrabold text-brand-700 mt-1">{formatRupiah(sampleTrip.price)}</p>
              </div>

              <Link
                href={`/${slug}/booking?trip=sunrise-lava-tour-merapi`}
                className="w-full mt-6 py-3.5 px-6 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition"
              >
                Pesan Kursi Sekarang
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        Powered by <Link href="/" className="font-semibold text-brand-700 hover:underline">Nusabook Platform</Link>
      </footer>
    </div>
  );
}
