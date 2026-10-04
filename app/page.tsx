import Link from "next/link";
import { MaterialIcon } from "@/components/ui/icon";

export default function HomePage() {
  return (
    <div className="bg-surface font-body-regular text-body-regular text-on-surface antialiased min-h-screen">
      {/* Top Header Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-primary font-bold tracking-tight leading-none">
                  Nusabook
                </span>
                <span className="font-micro-badge text-micro-badge uppercase text-secondary px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed inline-block w-fit mt-0.5 font-bold">
                  P2MW Kemendikbudristek 2026
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden xl:flex items-center gap-space-md">
            <Link href="/" className="text-primary font-body-semibold">
              Beranda
            </Link>
            <Link
              href="/explore"
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Jelajah Wisata
            </Link>
            <Link
              href="/pesona-merapi"
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Storefront Mitra
            </Link>
            <Link
              href="/dashboard"
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Operator Backoffice
            </Link>
            <Link
              href="/admin"
              className="text-secondary font-body-semibold flex items-center gap-1 hover:underline"
            >
              <MaterialIcon name="admin_panel_settings" className="text-sm" />
              <span>Super Admin</span>
            </Link>
          </nav>

          <div className="flex items-center gap-space-sm shrink-0">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center px-3 py-2 rounded-lg font-body-semibold text-caption text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors text-xs"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg font-body-semibold text-caption bg-secondary-container text-on-primary hover:bg-secondary transition-colors text-xs shadow-sm"
            >
              Gabung Mitra (0%)
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full pt-20 bg-surface">
        {/* HERO SECTION */}
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface via-surface-container-low to-surface pt-6 pb-20">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-70" />
          <div className="pointer-events-none absolute top-40 right-10 w-96 h-96 bg-secondary-container/10 rounded-full blur-2xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
            {/* Top Accreditation Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-highest/60 backdrop-blur-md shadow-sm border border-outline-variant/30">
                <span className="flex h-2 w-2 rounded-full bg-secondary-container animate-pulse" />
                <span className="font-micro-badge text-micro-badge uppercase tracking-wider text-primary font-bold">
                  Program Pembinaan Mahasiswa Wirausaha (P2MW 2026) • Kemendikbudristek RI
                </span>
              </div>
            </div>

            {/* Main Heading & Value Proposition */}
            <div className="text-center max-w-4xl mx-auto mb-10">
              <h1 className="font-display text-display md:text-headline-lg lg:text-[44px] lg:leading-[52px] text-primary tracking-tight font-bold mb-4">
                Platform All-in-One Digitalisasi UMKM Tour &amp; Travel Nusantara
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
                Tingkatkan penjualan paket wisata tanpa risiko overbooking. Dilengkapi No-Code
                Storefront, mesin penguncian kuota otomatis (
                <span className="font-body-semibold text-primary">Real-time Slot Locking</span>),
                pembayaran otomatis Midtrans, dan notifikasi WhatsApp instan.
              </p>

              {/* CTA Buttons Group */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-secondary-container hover:bg-secondary text-on-primary font-body-semibold text-body-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <MaterialIcon name="storefront" className="text-xl" />
                    <span>Buka Toko Tour Gratis (0 Biaya Awal)</span>
                  </Link>
                  <span className="font-caption text-caption text-on-surface-variant mt-1.5 flex items-center gap-1">
                    <MaterialIcon name="verified" className="text-xs text-primary" />
                    Skema komisi 2% per transaksi berhasil
                  </span>
                </div>

                <Link
                  href="/explore"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-primary font-body-semibold text-body-lg shadow-sm hover:shadow transition-all border border-outline-variant/30"
                >
                  <MaterialIcon name="explore" className="text-xl text-primary" />
                  <span>Jelajah Paket Wisata Nusantara</span>
                </Link>
              </div>
            </div>

            {/* Interactive Dual Mockup Preview Grid */}
            <div className="mt-4 relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Mockup Left: No-Code Storefront */}
                <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden border border-outline-variant/20">
                  <div className="absolute top-0 right-0 bg-primary/10 px-3 py-1 rounded-bl-xl text-primary font-micro-badge text-micro-badge uppercase font-bold">
                    Subdomain Toko Wisata
                  </div>
                  <div>
                    {/* Browser Header */}
                    <div className="flex items-center gap-2 mb-4 pb-3 bg-surface-container-low -mx-5 -mt-5 px-5 pt-3">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-error" />
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim" />
                        <span className="w-2.5 h-2.5 rounded-full bg-surface-tint" />
                      </div>
                      <div className="flex-1 bg-surface-container-lowest rounded-md px-3 py-1 text-center font-caption text-caption text-on-surface-variant truncate">
                        pesona-merapi.nusabook.id
                      </div>
                    </div>

                    {/* Storefront Hero Card */}
                    <div className="relative h-44 rounded-xl overflow-hidden mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80"
                        alt="Bromo Scenery"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex flex-col justify-end p-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md w-fit mb-1">
                          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
                          <span className="font-micro-badge text-micro-badge text-secondary font-bold">
                            SISA 3 KURSI HARI INI
                          </span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-on-primary font-bold">
                          Midnight Sunrise Bromo Jeep 4x4
                        </h3>
                        <p className="font-caption text-caption text-inverse-on-surface">
                          Termasuk Tiket TNBTS, Driver, &amp; Foto Dokumentasi
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                        <span className="text-on-surface-variant flex items-center gap-1.5">
                          <MaterialIcon name="calendar_month" className="text-sm text-primary" />{" "}
                          Keberangkatan Terdekat:
                        </span>
                        <span className="font-body-semibold text-primary font-bold">
                          Sabtu, 18 Okt 2026
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                        <span className="text-on-surface-variant flex items-center gap-1.5">
                          <MaterialIcon name="credit_card" className="text-sm text-primary" /> Metode
                          Bayar:
                        </span>
                        <span className="font-body-semibold text-on-surface">
                          QRIS Instan, BCA, Mandiri VA
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-surface-container">
                    <div>
                      <span className="font-caption text-caption text-on-surface-variant block">
                        Mulai dari
                      </span>
                      <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                        Rp 375.000<span className="text-caption text-xs font-normal">/pax</span>
                      </span>
                    </div>
                    <Link
                      href="/pesona-merapi"
                      className="px-4 py-2 rounded-xl bg-secondary-container text-on-primary font-body-semibold text-xs shadow-md flex items-center gap-1.5"
                    >
                      <span>Lihat Toko</span>
                      <MaterialIcon name="arrow_forward" className="text-sm" />
                    </Link>
                  </div>
                </div>

                {/* Mockup Right: Operator Backoffice */}
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-5 shadow-xl flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-container-low">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
                          <MaterialIcon name="admin_panel_settings" className="text-xl" />
                        </div>
                        <div>
                          <h3 className="font-title-md text-title-md text-primary font-bold">
                            Operator Backoffice Engine
                          </h3>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Sinkronisasi Real-Time Slot Kuota Aktif
                          </p>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-caption text-caption font-semibold">
                        <span className="w-2 h-2 rounded-full bg-secondary-container" />
                        PostgreSQL Row-Lock Active
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="bg-surface-container-low p-3.5 rounded-xl">
                        <span className="font-caption text-caption text-on-surface-variant block mb-1">
                          Total GMV Bulan Ini
                        </span>
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">
                          Rp 84,5 Juta
                        </span>
                        <span className="font-caption text-caption text-secondary flex items-center gap-0.5 mt-0.5 font-bold">
                          <MaterialIcon name="trending_up" className="text-xs" /> +28% vs bln lalu
                        </span>
                      </div>
                      <div className="bg-surface-container-low p-3.5 rounded-xl">
                        <span className="font-caption text-caption text-on-surface-variant block mb-1">
                          Kursi Terjual (Paid)
                        </span>
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          142 Kursi
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant mt-0.5">
                          9 Open Trip Aktif
                        </span>
                      </div>
                      <div className="bg-surface-container-low p-3.5 rounded-xl">
                        <span className="font-caption text-caption text-on-surface-variant block mb-1">
                          Terkunci (Hold Lock)
                        </span>
                        <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                          6 Kursi
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant mt-0.5 font-mono text-xs">
                          TTL: 14m 20s
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container text-xs">
                      <div className="flex items-center gap-2">
                        <MaterialIcon name="checklist" className="text-primary text-base" />
                        <span>Manifes trip Bromo 18 Okt siap diekspor ke KSOP &amp; TNBTS.</span>
                      </div>
                      <Link
                        href="/dashboard"
                        className="px-3 py-1 rounded bg-surface-container-lowest text-primary font-body-semibold hover:bg-surface-container-high transition-colors"
                      >
                        Buka Dashboard
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof Metrics Bar */}
            <div className="mt-14 pt-8 border-t border-surface-container-high">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <span className="font-display text-display text-primary font-bold">2.800+</span>
                  <span className="font-caption text-caption text-on-surface-variant mt-1">
                    Pelaku Usaha Wisata Terpetakan
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-display text-display text-secondary font-bold">0%</span>
                  <span className="font-caption text-caption text-on-surface-variant mt-1">
                    Biaya Registrasi &amp; Beban Bulanan
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-display text-display text-primary font-bold">&lt; 1,2 dtk</span>
                  <span className="font-caption text-caption text-on-surface-variant mt-1">
                    Re-Allotment TTL Auto-Rollback
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-display text-display text-secondary font-bold">100%</span>
                  <span className="font-caption text-caption text-on-surface-variant mt-1">
                    Kepatuhan UU PDP No. 27/2022
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM VS SOLUTION SECTION */}
        <section className="w-full py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="font-micro-badge text-micro-badge uppercase text-secondary tracking-widest font-bold block mb-2">
                Riset Empiris Lapangan
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
                Tantangan Nyata Pelaku Tour &amp; Travel Lokal
              </h2>
              <p className="font-body-regular text-body-regular text-on-surface-variant mt-3">
                Lebih dari 80% agen perjalanan wisata daerah di Indonesia masih mengelola reservasi
                lewat chat WhatsApp manual. Inilah cara Nusabook menghentikan kekacauan operasional
                Anda:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-surface-container-lowest rounded-2xl p-7 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow border border-outline-variant/20">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center mb-5">
                    <MaterialIcon name="event_busy" className="text-2xl" />
                  </div>
                  <div className="mb-4">
                    <span className="font-caption text-caption font-bold text-error uppercase tracking-wider block mb-1">
                      Masalah Umum
                    </span>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold leading-snug">
                      Risiko Overbooking Kursi Trip saat Pesanan Membludak
                    </h3>
                    <p className="font-body-regular text-body-regular text-on-surface-variant mt-2 text-sm leading-relaxed">
                      Dua admin WhatsApp menjanjikan sisa kursi yang sama ke pelanggan berbeda di menit
                      yang sama. Akibatnya tamu terlantar di dermaga atau jeep kekurangan kapasitas.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-5 bg-surface-container-low -mx-7 -mb-7 p-6 rounded-b-2xl">
                  <span className="font-caption text-caption font-bold text-primary uppercase tracking-wider block mb-1">
                    Solusi Nusabook
                  </span>
                  <p className="font-body-semibold text-caption text-primary leading-relaxed text-xs">
                    Concurrency-Safe Pessimistic Quota Locking dengan PostgreSQL Row-Level Lock
                    mencegah kursi ganda terpilih dalam hitungan milidetik secara atomik.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-container-lowest rounded-2xl p-7 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow border border-outline-variant/20">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface-container-highest text-primary flex items-center justify-center mb-5">
                    <MaterialIcon name="receipt_long" className="text-2xl" />
                  </div>
                  <div className="mb-4">
                    <span className="font-caption text-caption font-bold text-outline uppercase tracking-wider block mb-1">
                      Masalah Umum
                    </span>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold leading-snug">
                      Rekapitulasi Manual &amp; Rawan Bukti Transfer Palsu
                    </h3>
                    <p className="font-body-regular text-body-regular text-on-surface-variant mt-2 text-sm leading-relaxed">
                      Menghabiskan waktu 3 jam tiap malam mencocokkan mutasi bank, verifikasi struk
                      editan, hingga kasir walk-in lupa dicatat ke buku manifes perjalanan.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-5 bg-surface-container-low -mx-7 -mb-7 p-6 rounded-b-2xl">
                  <span className="font-caption text-caption font-bold text-primary uppercase tracking-wider block mb-1">
                    Solusi Nusabook
                  </span>
                  <p className="font-body-semibold text-caption text-primary leading-relaxed text-xs">
                    Multi-payment Otomatis Midtrans (QRIS Dinamis &amp; VA Otomatis) + Rekonsiliasi
                    Kasir terpusat tanpa perlu verifikasi slip manual lagi.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-surface-container-lowest rounded-2xl p-7 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow border border-outline-variant/20">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center mb-5">
                    <MaterialIcon name="web_asset_off" className="text-2xl" />
                  </div>
                  <div className="mb-4">
                    <span className="font-caption text-caption font-bold text-secondary uppercase tracking-wider block mb-1">
                      Masalah Umum
                    </span>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold leading-snug">
                      Biaya Puluhan Juta untuk Membuat Website Custom
                    </h3>
                    <p className="font-body-regular text-body-regular text-on-surface-variant mt-2 text-sm leading-relaxed">
                      Agensi software house mematok biaya belasan juta untuk booking engine, ditambah
                      server mahal dan pemeliharaan bulanan yang membebani kas UMKM.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-5 bg-surface-container-low -mx-7 -mb-7 p-6 rounded-b-2xl">
                  <span className="font-caption text-caption font-bold text-primary uppercase tracking-wider block mb-1">
                    Solusi Nusabook
                  </span>
                  <p className="font-body-semibold text-caption text-primary leading-relaxed text-xs">
                    No-Code Storefront Subdomain Gratis siap pakai hanya dalam 5 menit. Tanpa biaya
                    instalasi, skema bagi hasil murni 2% hanya saat transaksi berhasil.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="w-full py-20 bg-surface-container-low">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-14">
              <span className="font-micro-badge text-micro-badge uppercase text-primary tracking-widest font-bold block mb-2">
                Tanya Jawab
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
                Pertanyaan yang Sering Diajukan
              </h2>
            </div>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/20">
                <h3 className="font-title-md text-title-md text-primary font-bold flex items-center justify-between gap-4">
                  <span>Apakah ada biaya langganan bulanan atau registrasi awal?</span>
                  <MaterialIcon name="check_circle" className="text-secondary text-xl shrink-0" />
                </h3>
                <p className="font-body-regular text-body-regular text-on-surface-variant mt-3 leading-relaxed text-sm">
                  Sama sekali <span className="font-body-semibold text-primary">TIDAK ADA</span> biaya
                  langganan bulanan maupun setup pendaftaran. Nusabook menerapkan skema murni 2% komisi
                  yang hanya dipotong saat transaksi tiket berhasil lolos dari Escrow Vault.
                </p>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/20">
                <h3 className="font-title-md text-title-md text-primary font-bold flex items-center justify-between gap-4">
                  <span>Bagaimana jika ada tamu rombongan yang membayar tunai di kantor?</span>
                  <MaterialIcon name="check_circle" className="text-secondary text-xl shrink-0" />
                </h3>
                <p className="font-body-regular text-body-regular text-on-surface-variant mt-3 leading-relaxed text-sm">
                  Operator dapat memanfaatkan fitur Manual Booking Entry di dashboard backoffice. Data
                  penumpang offline langsung disinkronkan ke manifes tanpa risiko kuota bentrok.
                </p>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/20">
                <h3 className="font-title-md text-title-md text-primary font-bold flex items-center justify-between gap-4">
                  <span>Apakah data KTP/NIK wisatawan aman dan patuh regulasi?</span>
                  <MaterialIcon name="check_circle" className="text-secondary text-xl shrink-0" />
                </h3>
                <p className="font-body-regular text-body-regular text-on-surface-variant mt-3 leading-relaxed text-sm">
                  Seluruh data pribadi wisatawan dilindungi enkripsi AES-256 dan mematuhi amanat UU
                  Perlindungan Data Pribadi (UU PDP No. 27/2022). Data hanya dipakai untuk validasi
                  SIMAKSI dan asuransi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="w-full py-20 bg-surface relative overflow-hidden" id="daftar-mitra">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="bg-gradient-to-br from-primary via-primary to-primary-container rounded-3xl p-8 md:p-14 text-on-primary shadow-2xl relative overflow-hidden text-center">
              <div className="relative z-10 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-on-primary/10 backdrop-blur-md mb-6">
                  <span className="w-2 h-2 rounded-full bg-secondary-container" />
                  <span className="font-micro-badge text-micro-badge uppercase tracking-wider text-on-primary font-bold">
                    Mulai Dalam 3 Menit
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg md:text-display text-on-primary font-bold tracking-tight mb-4">
                  Siap Mentransformasi Bisnis Tour &amp; Travel Anda ke Level Berikutnya?
                </h2>
                <p className="font-body-lg text-body-lg text-inverse-on-surface mb-8 leading-relaxed">
                  Daftar sekarang tanpa biaya langganan, tanpa instalasi rumit, dan tanpa kartu kredit.
                  Bangun storefront resmi biro wisata Anda dan terima pembayaran QRIS otomatis hari ini.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="px-8 py-4 rounded-xl bg-secondary-container hover:bg-secondary text-on-primary font-body-semibold text-body-lg shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Buka Storefront Operator Gratis</span>
                    <MaterialIcon name="arrow_forward" className="text-xl" />
                  </Link>
                  <Link
                    href="/explore"
                    className="px-6 py-4 rounded-xl bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-on-primary font-body-semibold text-body-lg transition-all"
                  >
                    <span>Jelajahi Paket Wisata</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low text-on-surface-variant mt-space-xl border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-space-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-space-lg">
            <div className="md:col-span-2 flex flex-col gap-space-sm">
              <div className="flex items-center gap-space-xs">
                <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                  N
                </div>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  Nusabook
                </span>
              </div>
              <p className="font-body-regular text-body-regular text-on-surface-variant max-w-md text-sm">
                Nusantara Tour &amp; Travel SaaS Ecosystem. Platform digitalisasi operasional UMKM biro
                perjalanan wisata nusantara berbasis real-time allotment dan manifest digital.
              </p>
              <p className="font-caption text-caption text-on-surface-variant text-xs">
                Program Pembinaan Mahasiswa Wirausaha (P2MW 2026) • Universitas Tidar
              </p>
            </div>

            <div className="flex flex-col gap-space-xs text-sm">
              <h4 className="font-title-md text-title-md text-on-surface mb-space-xs font-bold">
                Ekosistem Solusi
              </h4>
              <Link href="/dashboard" className="hover:text-primary transition-colors">
                Solusi Operator Tour
              </Link>
              <Link href="/explore" className="hover:text-primary transition-colors">
                Marketplace Wisata Nusantara
              </Link>
              <Link href="/pesona-merapi" className="hover:text-primary transition-colors">
                Katalog Storefront Mitra
              </Link>
            </div>

            <div className="flex flex-col gap-space-xs text-sm">
              <h4 className="font-title-md text-title-md text-on-surface mb-space-xs font-bold">
                Kepatuhan &amp; Integrasi
              </h4>
              <span className="text-on-surface-variant">API Midtrans Gateway</span>
              <span className="text-on-surface-variant">Keamanan Data UU PDP</span>
              <span className="text-on-surface-variant">Escrow Safe Vault 2%</span>
            </div>
          </div>

          <div className="mt-space-lg pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm font-caption text-caption text-xs border-t border-surface-container">
            <p>© 2026 Nusabook. Inisiatif P2MW Kemendikbudristek RI. Seluruh Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-space-md">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary-container" />
                Escrow Safe Lock
              </span>
              <span>Kemendikbudristek P2MW Terdaftar</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
