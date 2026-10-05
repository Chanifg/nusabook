import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import { MaterialIcon } from "@/components/ui/icon";

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Query agent and published packages in parallel to eliminate serial network waterfall
  const [agentRes, pkgRes] = await Promise.all([
    supabase
      .from("travel_agents")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("tour_packages")
      .select("*, trip_schedules(*), travel_agents!inner(slug, is_active)")
      .eq("travel_agents.slug", slug)
      .eq("travel_agents.is_active", true)
      .eq("is_published", true),
  ]);

  const agentData = agentRes.data as any;
  if (!agentData) {
    notFound();
  }

  const packages: any[] = (pkgRes.data as any[]) || [];

  const businessName = agentData.business_name;
  const city = agentData.city || "";
  const description = agentData.description || "";
  const whatsapp = agentData.whatsapp_number || "";

  return (
    <div className="bg-surface font-body-regular text-on-surface antialiased min-h-screen">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <Link href="/" className="flex items-center gap-space-xs">
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
                N
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                Nusabook
              </span>
            </Link>
            <div className="hidden md:inline-flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-micro-badge text-micro-badge text-on-surface-variant font-bold">
                Live Sync Aktif
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-space-lg text-sm font-semibold">
            <Link
              href="/explore"
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Jelajah Wisata
            </Link>
            <Link href="#katalog-trip" className="text-primary">
              Etalase Paket
            </Link>
            <Link
              href="/dashboard"
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Operator Backoffice
            </Link>
          </nav>

          <div className="flex items-center gap-space-sm">
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary-container hover:bg-secondary text-on-primary font-body-semibold text-xs transition-all shadow-sm"
            >
              <MaterialIcon name="chat" className="text-base" />
              <span className="hidden sm:inline">Hubungi Mitra</span>
            </a>
          </div>
        </div>
      </header>

      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-14rem)]">
        {/* Top Breadcrumb Bar */}
        <div className="w-full bg-surface-container-low py-space-sm px-4 sm:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto flex items-center gap-space-xs text-on-surface-variant font-caption text-caption flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <MaterialIcon name="home" className="text-sm" /> Beranda
            </Link>
            <span className="text-outline-variant">/</span>
            <Link href="/explore" className="hover:text-primary transition-colors">
              Mitra Terverifikasi
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface-variant">{city}</span>
            <span className="text-outline-variant">/</span>
            <span className="font-body-semibold text-primary font-bold">{businessName}</span>
          </div>
        </div>

        {/* Agency Hero Section */}
        <section className="relative w-full">
          {/* Cover Banner */}
          <div
            className="w-full h-72 sm:h-80 lg:h-96 relative bg-cover bg-center overflow-hidden"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1600&q=80")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-primary/30 to-black/50" />
            <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-12 flex justify-between items-start pt-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/90 backdrop-blur-md shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-micro-badge text-micro-badge text-primary uppercase font-bold">
                  Official Nusabook Verified Agency
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg font-caption text-caption">
                <MaterialIcon name="photo_camera" className="text-sm text-secondary-fixed" />
                <span>Basecamp: {city}</span>
              </div>
            </div>
          </div>

          {/* Floating Profile Card */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 -mt-20 sm:-mt-24 relative z-10">
            <div className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-xl flex flex-col lg:flex-row gap-6 lg:items-start justify-between border border-outline-variant/20">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-3xl shrink-0 shadow-md">
                  {businessName.slice(0, 2).toUpperCase()}
                  <div
                    className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow"
                    title="Terverifikasi Resmi"
                  >
                    <MaterialIcon name="verified" className="text-base" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
                      {businessName}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-micro-badge text-micro-badge font-bold">
                      <MaterialIcon name="shield_person" className="text-xs" /> Mitra Pilihan
                    </span>
                  </div>

                  {/* Credentials */}
                  <div className="flex items-center gap-2 flex-wrap text-outline font-caption text-caption">
                    <span className="bg-surface-container px-2.5 py-1 rounded font-body-semibold text-on-surface">
                      NIB Terdaftar
                    </span>
                    <span className="bg-surface-container px-2.5 py-1 rounded">
                      Izin Resmi Operasional
                    </span>
                    <span className="bg-surface-container px-2.5 py-1 rounded">
                      Pemandu Bersertifikat
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-on-surface-variant font-caption text-caption pt-1">
                    <MaterialIcon name="location_on" className="text-base text-secondary" />
                    <span>{city}</span>
                    <span className="text-outline-variant">•</span>
                    <span className="text-emerald-700 font-body-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Jam Buka: 24/7 Support
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions & Escrow badge */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-3 shrink-0">
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-secondary-container text-on-primary font-body-semibold text-sm hover:opacity-95 shadow-sm transition-all"
                >
                  <MaterialIcon name="chat" className="text-lg" />
                  <span>WhatsApp Resmi Operator</span>
                </a>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-fixed text-on-primary-fixed font-caption text-caption self-start lg:self-end">
                  <MaterialIcon name="lock" className="text-sm text-primary" />
                  <span>Pembayaran Escrow Terproteksi Nusabook</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3 border border-outline-variant/20">
                <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                  <MaterialIcon name="star" className="text-xl" />
                </div>
                <div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    4.9<span className="text-caption font-caption text-outline"> / 5.0</span>
                  </div>
                  <div className="font-caption text-caption text-outline">428 Ulasan Terverifikasi</div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3 border border-outline-variant/20">
                <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                  <MaterialIcon name="flight_takeoff" className="text-xl" />
                </div>
                <div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    1.450+
                  </div>
                  <div className="font-caption text-caption text-outline">Trip Berhasil Terlaksana</div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3 border border-outline-variant/20">
                <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
                  <MaterialIcon name="groups" className="text-xl" />
                </div>
                <div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    14.800+
                  </div>
                  <div className="font-caption text-caption text-outline">Wisatawan Terlayani</div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3 border border-outline-variant/20">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <MaterialIcon name="schedule" className="text-xl" />
                </div>
                <div>
                  <div className="font-headline-sm text-headline-sm text-emerald-700 font-bold">
                    &lt; 5 Menit
                  </div>
                  <div className="font-caption text-caption text-outline">Rata-rata Respon Chat</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Katalog Paket Wisata */}
        <section id="katalog-trip" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="font-micro-badge text-micro-badge uppercase tracking-wider text-primary font-bold">
                Jadwal &amp; Etalase Resmi
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">
                Paket Wisata &amp; Open Trip Terbuka
              </h2>
              <p className="text-on-surface-variant text-sm mt-1">
                Pilih paket perjalanan dan amankan kuota kursi dengan proteksi Pessimistic Seat Hold.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.length > 0 ? (
              packages.map((pkg: any) => {
                const isPrivate = pkg.category === "private_trip";
                const schedule = pkg.trip_schedules?.[0];
                const price = schedule?.price_per_pax || 375000;
                const quotaRemaining = schedule
                  ? Math.max(0, schedule.total_quota - schedule.reserved_quota - schedule.booked_quota)
                  : 6;

                return (
                  <div
                    key={pkg.id}
                    className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col border border-outline-variant/20 group"
                  >
                    <div className="relative h-48 w-full bg-surface-container overflow-hidden">
                      <img
                        src={
                          pkg.thumbnail_url ||
                          "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-micro-badge text-micro-badge font-bold uppercase shadow-sm">
                          {isPrivate ? "PRIVATE CHARTER" : "OPEN TRIP"}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded font-mono text-[11px]">
                        {pkg.duration_days} Hari
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                          <MaterialIcon name="pin_drop" className="text-sm text-primary" />
                          <span>{pkg.destination_city}</span>
                        </div>
                        <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant line-clamp-2">
                          {pkg.description || "Perjalanan seru dengan fasilitas lengkap dan pemandu profesional."}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-surface-container flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-on-surface-variant">Mulai Dari</span>
                          <span className="font-headline-sm text-headline-sm font-bold text-primary">
                            {formatRupiah(price)}
                          </span>
                        </div>
                        <Link
                          href={`/${slug}/packages/${pkg.slug}`}
                          className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-semibold text-xs transition-colors shadow-sm"
                        >
                          Pesan Tiket
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 col-span-full p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-4">
                  <MaterialIcon name="travel_explore" className="text-3xl" />
                </div>
                <h4 className="font-title-md text-title-md font-bold text-on-surface mb-2">
                  Belum Ada Jadwal Aktif
                </h4>
                <p className="font-body-regular text-body-regular text-on-surface-variant mb-6 text-sm">
                  {businessName} sedang menyiapkan kuota keberangkatan terbaru. Anda dapat langsung menanyakan jadwal khusus melalui pesan resmi atau mengeksplorasi destinasi mitra lainnya.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(businessName)},%20saya%20ingin%20tanya%20jadwal%20trip%20terbaru`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white font-body-semibold text-xs shadow-sm transition-all font-bold"
                  >
                    <MaterialIcon name="chat" className="text-[18px]" />
                    <span>Tanya via WhatsApp</span>
                  </a>
                  <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-semibold text-xs transition-colors"
                  >
                    <MaterialIcon name="explore" className="text-[18px]" />
                    <span>Jelajahi Paket Lain</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Escrow Guarantee Callout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-16">
          <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-outline-variant/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                <MaterialIcon name="verified_user" className="text-2xl" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  Dana Wisatawan Terlindungi Rekening Bersama (Escrow Vault)
                </h3>
                <p className="font-caption text-caption text-on-surface-variant mt-0.5 max-w-2xl">
                  Pembayaran Anda diamankan di sistem NusaBook dan hanya diteruskan ke mitra setelah
                  keberangkatan trip terverifikasi sukses. Bebas risiko penipuan dan overbooking.
                </p>
              </div>
            </div>
            <Link
              href="/explore"
              className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-body-semibold text-xs transition-colors shrink-0 shadow-sm"
            >
              Jelajahi Paket Lainnya
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
