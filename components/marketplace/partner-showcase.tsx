"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/icon";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const FAQ_ITEMS = [
  {
    q: "Bagaimana skema bagi hasil 2% di Nusabook bekerja?",
    a: "Nusabook menerapkan sistem murni bagi hasil keberhasilan. Tidak ada biaya pendaftaran, tidak ada biaya langganan bulanan, dan tidak ada biaya tersembunyi. Potongan platform 2% hanya dikenakan saat ada wisatawan yang berhasil memesan dan membayar tiket paket wisata Anda.",
  },
  {
    q: "Kapan hasil penjualan tiket ditransfer ke rekening agen?",
    a: "Dana pemesanan tersimpan aman di rekening escrow Nusabook dan otomatis diproses untuk transfer pencairan (98% laba bersih mitra) ke rekening bank Anda (BCA, Mandiri, BRI, BNI) pada H+1 setelah jadwal trip terselenggara dengan sukses.",
  },
  {
    q: "Bagaimana sistem mencegah overbooking kursi pada trip gabungan (open trip)?",
    a: "Nusabook menggunakan sistem concurrency locking pada database PostgreSQL. Begitu wisatawan mengklik booking, kursi langsung ditahan selama 20 menit (pessimistic hold). Jika pembayaran tidak selesai dalam 20 menit, kuota otomatis dilepaskan kembali sehingga kursi tidak pernah terduplikasi.",
  },
  {
    q: "Bisakah agen memasukkan tamu offline yang mendaftar via WhatsApp?",
    a: "Bisa. Dashboard Nusabook menyediakan fitur Pesanan Manual (Walk-in Entry). Agen dapat menginput data tamu WhatsApp langsung ke sistem untuk menerbitkan tiket dan memotong sisa kuota kursi secara seketika.",
  },
  {
    q: "Apakah data manifes penumpang dapat dicetak untuk kebutuhan operasional di lapangan?",
    a: "Ya. Manifes penumpang dapat diekspor langsung dalam format PDF siap cetak dengan kop resmi agen travel, serta format spreadsheet CSV dengan standar keamanan data pribadi KTP terlindungi.",
  },
];

export function PartnerShowcase() {
  // Calculator state
  const [paxCount, setPaxCount] = useState<number>(60);
  const [ticketPrice, setTicketPrice] = useState<number>(500000);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Calculations
  const grossRevenue = paxCount * ticketPrice;
  const platformFee = Math.round(grossRevenue * 0.02);
  const netEarnings = grossRevenue - platformFee;

  return (
    <section className="w-full bg-surface-container-low border-t border-outline-variant/15 py-14 sm:py-20 text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        {/* SECTION 1: VALUE PROPOSITION */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary font-caption text-xs font-bold">
            <MaterialIcon name="storefront" className="text-sm" />
            <span>Kanal Distribusi Resmi Nusabook</span>
          </div>
          <h2 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Etalase Digital Mandiri untuk Tour & Travel Lokal
          </h2>
          <p className="font-body-regular text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Nusabook membantu pelaku usaha travel wisata daerah mempublikasikan paket wisata ke wisatawan nasional,
            mengelola kuota kursi secara otomatis, dan membagikan e-ticket berstandar resmi.
          </p>
        </div>

        {/* 3 VALUE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <MaterialIcon name="percent" className="text-xl" />
            </div>
            <h3 className="font-title-md text-base font-bold text-on-surface">
              Skema Bagi Hasil 2% Fleksibel
            </h3>
            <p className="font-body-regular text-xs text-on-surface-variant leading-relaxed">
              Nol biaya pendaftaran dan nol iuran bulanan. Platform fee 2% hanya dikenakan saat transaksi tiket berhasil
              dan terbayar lunas.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
              <MaterialIcon name="lock" className="text-xl" />
            </div>
            <h3 className="font-title-md text-base font-bold text-on-surface">
              Perlindungan Kuota Anti-Overbooking
            </h3>
            <p className="font-body-regular text-xs text-on-surface-variant leading-relaxed">
              Sistem concurrency locking otomatis menahan kuota 20 menit saat checkout, mencegah risiko kelebihan kursi
              armada wisata Anda.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <MaterialIcon name="fact_check" className="text-xl" />
            </div>
            <h3 className="font-title-md text-base font-bold text-on-surface">
              Manifes & Presensi Lapangan
            </h3>
            <p className="font-body-regular text-xs text-on-surface-variant leading-relaxed">
              Tour leader dapat membuka daftar peserta di smartphone, menandai presensi check-in satu-klik, serta mengunduh
              PDF resmi manifes trip.
            </p>
          </div>
        </div>

        {/* SECTION 2: KALKULATOR SIMULASI PENDAPATAN MITRA */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 border border-outline-variant/20 shadow-md">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/15 text-secondary font-bold text-xs">
                <MaterialIcon name="calculate" className="text-sm" />
                Simulasi Keuntungan Mitra
              </div>
              <h3 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
                Kalkulator Pendapatan Agen Wisata
              </h3>
              <p className="font-body-regular text-xs sm:text-sm text-on-surface-variant">
                Geser slider di bawah untuk memperkirakan laba bersih yang Anda bawa pulang setiap bulan.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders (Left) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Slider 1: Jumlah Peserta */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-on-surface flex items-center gap-1.5">
                      <MaterialIcon name="groups" className="text-base text-primary" />
                      Estimasi Peserta per Bulan
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-bold">
                      {paxCount} Orang (Pax)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="300"
                    step="5"
                    value={paxCount}
                    onChange={(e) => setPaxCount(Number(e.target.value))}
                    className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[11px] text-on-surface-variant">
                    <span>5 pax/bln</span>
                    <span>150 pax</span>
                    <span>300 pax/bln</span>
                  </div>
                </div>

                {/* Slider 2: Rata-rata Harga Tiket */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-on-surface flex items-center gap-1.5">
                      <MaterialIcon name="confirmation_number" className="text-base text-primary" />
                      Harga Tiket per Pax
                    </span>
                    <span className="px-3 py-1 bg-secondary-container/15 text-secondary rounded-lg font-bold">
                      {formatRupiah(ticketPrice)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="150000"
                    max="3000000"
                    step="50000"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(Number(e.target.value))}
                    className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <div className="flex justify-between text-[11px] text-on-surface-variant">
                    <span>Rp 150.000</span>
                    <span>Rp 1.500.000</span>
                    <span>Rp 3.000.000</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low text-xs text-on-surface-variant space-y-1">
                  <div className="flex items-center gap-1.5 text-primary font-bold">
                    <MaterialIcon name="verified" className="text-sm" />
                    <span>Transparansi Finansial Nusabook</span>
                  </div>
                  <p>
                    Tidak ada potongan biaya pendaftaran awal, hosting, atau biaya bulanan tetap. Anda hanya berbagi hasil saat ada wisatawan yang membayar.
                  </p>
                </div>
              </div>

              {/* Result Summary Card (Right) */}
              <div className="lg:col-span-5 bg-primary text-on-primary rounded-2xl p-6 space-y-5 shadow-lg">
                <div className="text-xs font-bold uppercase tracking-wider text-primary-fixed-dim">
                  Estimasi Rekapitulasi Bulanan
                </div>

                <div className="space-y-3 pb-4 border-b border-white/15">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/80">Total Omzet Kotor ({paxCount} pax)</span>
                    <span className="font-bold">{formatRupiah(grossRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-amber-200">
                    <span>Bagi Hasil Nusabook (2%)</span>
                    <span className="font-bold">- {formatRupiah(platformFee)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-emerald-200">
                    <span>Biaya Pendaftaran & Bulanan</span>
                    <span className="font-bold">Rp 0 (Gratis)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-primary-fixed-dim block">
                    Pendapatan Bersih Mitra (98%)
                  </span>
                  <div className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-secondary-container">
                    {formatRupiah(netEarnings)}
                  </div>
                  <span className="text-[11px] text-white/70 block">
                    Dana langsung cair ke rekening bank Anda setelah trip selesai.
                  </span>
                </div>

                <Link
                  href="/register"
                  className="w-full py-3 px-4 rounded-xl bg-secondary-container hover:bg-[#e07106] text-surface-container-lowest text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MaterialIcon name="how_to_reg" className="text-base" />
                  <span>Daftar Mitra Sekarang</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: FAQ ACCORDION INTERAKTIF */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
              Pertanyaan yang Sering Diajukan
            </h3>
            <p className="font-body-regular text-xs sm:text-sm text-on-surface-variant">
              Segala hal yang perlu Anda ketahui tentang kemitraan dan operasional digital di Nusabook.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={item.q}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-body-semibold text-xs sm:text-sm font-bold text-on-surface hover:text-primary transition-colors"
                  >
                    <span>{item.q}</span>
                    <MaterialIcon
                      name={isOpen ? "expand_less" : "expand_more"}
                      className={`text-xl text-on-surface-variant shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-on-surface-variant font-body-regular leading-relaxed border-t border-outline-variant/10 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct link to Explore */}
          <div className="pt-6 text-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 transition-all"
            >
              <MaterialIcon name="travel_explore" className="text-base" />
              <span>Jelajah Seluruh Paket Wisata Nusantara</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

