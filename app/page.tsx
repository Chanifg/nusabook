import Link from "next/link";
import {
  Compass,
  ShieldCheck,
  Zap,
  ArrowRight,
  Store,
  Calendar,
  CreditCard,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  BarChart3,
  Users,
  AlertTriangle,
  Receipt,
  FileText,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="h-20 w-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                NB
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-brand-900 tracking-tight leading-none">
                  Nusabook
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded w-fit mt-1">
                  P2MW Kemendikbudristek 2026
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/" className="text-brand-700 font-bold">
              Beranda
            </Link>
            <Link href="/explore" className="hover:text-brand-700 transition-colors">
              Jelajah Wisata
            </Link>
            <Link href="/pesona-merapi" className="hover:text-brand-700 transition-colors">
              Storefront Mitra
            </Link>
            <Link href="/dashboard" className="hover:text-brand-700 transition-colors">
              Operator Backoffice
            </Link>
            <Link href="/admin" className="text-amber-800 hover:text-amber-900 flex items-center gap-1 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold bg-accent-500 hover:bg-accent-600 text-white shadow-sm transition-all"
            >
              Gabung Mitra (0% Biaya Awal)
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white pt-10 pb-20 border-b border-slate-200">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-50 rounded-full blur-3xl opacity-60"></div>
          <div className="pointer-events-none absolute top-40 right-10 w-96 h-96 bg-amber-50 rounded-full blur-2xl opacity-50"></div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            {/* Accreditation Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 backdrop-blur-md shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold tracking-wide text-slate-800">
                  Program Pembinaan Mahasiswa Wirausaha (P2MW 2026) • Kemendikbudristek RI
                </span>
              </div>
            </div>

            {/* Main Heading & Proposition */}
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
                Platform All-in-One Digitalisasi UMKM{" "}
                <span className="text-brand-700">Tour & Travel Nusantara</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Tingkatkan penjualan paket wisata tanpa risiko overbooking. Dilengkapi No-Code Storefront, mesin penguncian kuota otomatis (Real-time Slot Locking), pembayaran otomatis Midtrans, dan notifikasi WhatsApp instan.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
                >
                  <Store className="w-5 h-5" />
                  <span>Buka Toko Tour Gratis (0 Biaya Awal)</span>
                </Link>
                <Link
                  href="/explore"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-sm sm:text-base shadow-sm transition-all"
                >
                  <Compass className="w-5 h-5 text-brand-700" />
                  <span>Jelajah Paket Wisata Nusantara</span>
                </Link>
              </div>
              <p className="text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Skema adil bagi hasil 2% per transaksi berhasil tanpa iuran bulanan</span>
              </p>
            </div>

            {/* Interactive Dual Mockup Preview Grid */}
            <div className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Mockup Left: No-Code Storefront Agen */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-xl border border-slate-200 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-brand-50 border-b border-l border-brand-100 px-3 py-1 rounded-bl-xl text-brand-700 text-[10px] font-extrabold uppercase">
                    Subdomain Toko Wisata
                  </div>
                  <div>
                    {/* Browser Header Bar */}
                    <div className="flex items-center gap-2 mb-4 pb-3 bg-slate-50 -mx-6 -mt-6 px-6 pt-4 border-b border-slate-200">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      </div>
                      <div className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1 text-center text-xs text-slate-500 font-mono truncate">
                        nusabook.id/pesona-merapi
                      </div>
                    </div>

                    {/* Storefront Hero Preview Card */}
                    <div className="rounded-xl overflow-hidden mb-4 bg-slate-100 border border-slate-200 p-4 space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>SISA 3 KURSI HARI INI</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">
                        Paket Wisata Lava Tour Merapi & Sunrise Jeep
                      </h3>
                      <p className="text-xs text-slate-500">
                        Termasuk Tiket Masuk, Driver Jeep 4x4, & Dokumentasi Wisata.
                      </p>
                    </div>

                    {/* Storefront Highlights */}
                    <div className="space-y-2 mb-4 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-brand-700" />
                          <span>Keberangkatan:</span>
                        </span>
                        <span className="font-semibold text-brand-900">Tiap Akhir Pekan</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-brand-700" />
                          <span>Pembayaran:</span>
                        </span>
                        <span className="font-semibold text-slate-800">QRIS Instan & Virtual Account</span>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Booking Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Mulai dari</span>
                      <span className="text-lg font-extrabold text-amber-700">
                        Rp 350.000<span className="text-xs font-normal text-slate-500">/pax</span>
                      </span>
                    </div>
                    <Link
                      href="/pesona-merapi"
                      className="px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                    >
                      <span>Lihat Toko</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Mockup Right: Operator Backoffice Dashboard */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    {/* Dashboard Header Bar */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-sm font-bold text-xs">
                          PM
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                            Pesona Merapi Tour Backoffice
                          </h3>
                          <p className="text-xs text-slate-500">
                            Sinkronisasi Real-Time Slot Kuota Aktif
                          </p>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>PostgreSQL Row-Lock Active</span>
                      </div>
                    </div>

                    {/* Top KPI Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[11px] text-slate-500 block mb-1">
                          Total GMV Bulan Ini
                        </span>
                        <span className="text-base sm:text-lg font-extrabold text-brand-900">
                          Rp 84,5 Jt
                        </span>
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                          <TrendingUp className="w-3 h-3" /> +28%
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[11px] text-slate-500 block mb-1">
                          Kursi Terjual (Paid)
                        </span>
                        <span className="text-base sm:text-lg font-extrabold text-slate-900">
                          142 Kursi
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          9 Trip Aktif
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[11px] text-slate-500 block mb-1">
                          Terkunci (Hold Lock)
                        </span>
                        <span className="text-base sm:text-lg font-extrabold text-amber-700">
                          6 Kursi
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          TTL: 14m 20s
                        </span>
                      </div>
                    </div>

                    {/* Mini Manifest Alert */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-slate-700 font-medium">
                          Manifes trip Merapi Sunrise 18 Penumpang siap dicetak dan diekspor ke PDF/Excel.
                        </span>
                      </div>
                      <Link
                        href="/dashboard"
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition shadow-sm shrink-0"
                      >
                        Buka Backoffice
                      </Link>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Arsitektur SaaS Berbasis Multi-Tenant</span>
                    <span className="font-semibold text-brand-700">Database 3NF Normalized</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof Metrics Bar (PRD 2.804 UMKM) */}
            <div className="mt-16 pt-8 border-t border-slate-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-brand-700">2.800+</span>
                  <span className="text-xs text-slate-500 mt-1">
                    Pelaku Usaha Wisata Terpetakan (24 Kota)
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-amber-600">0%</span>
                  <span className="text-xs text-slate-500 mt-1">
                    Biaya Registrasi & Beban Bulanan
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-brand-700">&lt; 1,2 dtk</span>
                  <span className="text-xs text-slate-500 mt-1">
                    Re-Allotment TTL Auto-Rollback
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-emerald-600">100%</span>
                  <span className="text-xs text-slate-500 mt-1">
                    Kepatuhan UU PDP No. 27/2022
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM VS SOLUTION SECTION (Riset Empiris PRD 1.1) */}
        <section className="w-full py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-2">
                Riset Empiris Lapangan
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Tantangan Nyata Pelaku Tour & Travel Lokal
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
                Lebih dari 80% agen perjalanan wisata daerah di Indonesia masih mengelola reservasi lewat chat WhatsApp manual. Inilah cara Nusabook menghentikan kekacauan operasional Anda:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 border border-rose-100">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="mb-4">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-1">
                      Masalah Umum
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      Risiko Overbooking Kursi Trip saat Pesanan Membludak
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      Dua admin WhatsApp menjanjikan sisa kursi yang sama ke pelanggan berbeda di menit yang sama. Akibatnya tamu terlantar di dermaga atau jeep kekurangan kapasitas.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-5 bg-slate-50 -mx-7 -mb-7 p-6 rounded-b-2xl border-t border-slate-100">
                  <span className="text-xs font-bold text-brand-700 uppercase tracking-wider block mb-1">
                    Solusi Nusabook
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    Concurrency-Safe Pessimistic Quota Locking dengan PostgreSQL Row-Level Lock mencegah kursi ganda terpilih dalam hitungan milidetik secara atomik.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-5 border border-brand-100">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Masalah Umum
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      Rekapitulasi Manual & Rawan Bukti Transfer Palsu
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      Menghabiskan waktu berjam-jam tiap malam mencocokkan mutasi bank, verifikasi struk editan, hingga kasir lupa dicatat ke buku manifes perjalanan.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-5 bg-slate-50 -mx-7 -mb-7 p-6 rounded-b-2xl border-t border-slate-100">
                  <span className="text-xs font-bold text-brand-700 uppercase tracking-wider block mb-1">
                    Solusi Nusabook
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    Multi-payment Otomatis Midtrans (QRIS Dinamis & VA Otomatis) + Rekonsiliasi Kasir terpusat tanpa perlu verifikasi slip manual lagi.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5 border border-amber-100">
                    <Store className="w-6 h-6" />
                  </div>
                  <div className="mb-4">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                      Masalah Umum
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      Biaya Puluhan Juta untuk Membuat Website Custom
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      Agensi mematok Rp 15-30 juta untuk website booking engine, ditambah biaya server mahal dan biaya pemeliharaan bulanan yang membebani kas UMKM.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-5 bg-slate-50 -mx-7 -mb-7 p-6 rounded-b-2xl border-t border-slate-100">
                  <span className="text-xs font-bold text-brand-700 uppercase tracking-wider block mb-1">
                    Solusi Nusabook
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    No-Code Storefront Subdomain Gratis siap pakai hanya dalam 5 menit. Tanpa biaya instalasi, skema bagi hasil murni 2% hanya saat transaksi berhasil.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              NB
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Nusabook Platform
              </p>
              <p className="text-xs text-slate-500">
                Program Pembinaan Mahasiswa Wirausaha (P2MW 2026) Kemendikbudristek RI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-600 font-medium">
            <Link href="/explore" className="hover:text-brand-700 transition">
              Katalog Wisata
            </Link>
            <Link href="/pesona-merapi" className="hover:text-brand-700 transition">
              Storefront Demo
            </Link>
            <Link href="/dashboard" className="hover:text-brand-700 transition">
              Operator Backoffice
            </Link>
            <Link href="/admin" className="hover:text-amber-800 transition">
              Super Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
