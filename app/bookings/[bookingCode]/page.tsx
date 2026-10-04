"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/icon";

export default function ETicketPage({
  params,
}: {
  params: Promise<{ bookingCode: string }>;
}) {
  const { bookingCode } = use(params);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }, 1200);
  };

  const handleWhatsApp = () => {
    alert("Tautan E-Tiket dan kartu SIMAKSI resmi berhasil dikirimkan ulang ke nomor WhatsApp (+62 812-3456-7890)!");
  };

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
            <div className="hidden md:inline-flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="font-micro-badge text-micro-badge text-on-surface-variant font-semibold uppercase tracking-wider font-bold">
                Live Sync Aktif
              </span>
            </div>
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
            <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1.5 rounded-full text-on-surface-variant">
              <MaterialIcon name="lock" className="text-[16px] text-primary" />
              <span className="font-caption text-caption font-semibold text-primary font-bold">
                Escrow Terproteksi
              </span>
            </div>
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
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container-high"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9zORNB2FPjTW_H98NevCLhXNTN4IUGGfqvD1zb38cqGydAcZU48wcSbV80amSRL8i_DH5E_ANNVnRQ5hVC780G4txUSnM5zYnxX59hHqUPbG3q8hLDgzB6qU6VW4G70E7kwTaZw6RRGkbhYqovfRas5W09tau4zjA7iNaXZYFS4CyUgS1b3lrz0k4sEZJJs6OHpCHs4aMJEIYyIb_CIvpLbu2PnKxrjhPx8uzaQ5vlH1GX4IaRks"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="font-body-semibold text-body-semibold text-on-surface leading-tight font-bold">
                  Bambang Pamungkas
                </span>
                <span className="font-caption text-caption text-outline">Pesona Nusantara</span>
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
                      Langkah 4 dari 4: Penerbitan E-Tiket Sah & SIMAKSI Digital
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
                      Escrow Terkunci
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
                      Pembayaran Berhasil & Reservasi Terkonfirmasi!
                    </h2>
                    <span className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#059669] px-2 py-0.5 rounded-full font-micro-badge text-micro-badge font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      TERBIT OTOMATIS
                    </span>
                  </div>
                  <p className="font-body-regular text-body-regular text-on-surface-variant mt-0.5">
                    E-Tiket resmi telah diterbitkan dan dikirimkan secara otomatis ke{" "}
                    <span className="font-body-semibold text-on-surface font-bold">anindya.paramitha@gmail.com</span>{" "}
                    serta WhatsApp{" "}
                    <span className="font-body-semibold text-on-surface font-bold">+62 812-3456-7890</span>.
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
                <button
                  className="inline-flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface px-space-sm py-2 rounded-lg font-body-semibold text-body-semibold transition-colors font-bold cursor-pointer"
                  onClick={handleWhatsApp}
                  type="button"
                >
                  <MaterialIcon name="chat" className="text-[18px] text-[#059669]" />
                  <span>Kirim WhatsApp</span>
                </button>
                <button
                  className="inline-flex items-center gap-1.5 bg-secondary-container hover:bg-secondary text-on-secondary px-space-md py-2 rounded-lg font-body-semibold text-body-semibold shadow-sm transition-colors font-bold cursor-pointer"
                  onClick={handleDownloadPdf}
                  type="button"
                >
                  {downloading ? (
                    <>
                      <MaterialIcon name="progress_activity" className="text-[18px] animate-spin" />
                      <span>Membuat Dokumen SIMAKSI PDF...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <MaterialIcon name="check" className="text-[18px]" />
                      <span>PDF Berhasil Diunduh!</span>
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
                          Nusabook Boarding Pass
                        </span>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                          Official SIMAKSI
                        </span>
                      </div>
                      <span className="font-caption text-caption text-on-surface-variant">
                        Operator: Pesona Nusantara Tour & Travel (NIB: 1209380029102)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <div className="inline-flex items-center gap-1.5 bg-[#ecfdf5] text-[#059669] px-space-sm py-1 rounded-full font-micro-badge text-micro-badge font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                      <span>TERBAYAR LUNAS (ESCROW SECURED)</span>
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
                    Open Trip Bromo Golden Sunrise, Kawah Aktif, Pasir Berbisik & Savana Teletubbies
                  </h3>
                  <p className="font-body-regular text-body-regular text-on-surface-variant mt-1">
                    Kode Booking Resmi:{" "}
                    <span className="font-body-semibold text-primary select-all font-bold font-mono">
                      {bookingCode}
                    </span>{" "}
                    • Kategori: Ekskursi Wisata Alam Terproteksi
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
                        Minggu, 18 Okt 2026
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
                        2 Pax (Dewasa)
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">Allotment Jeep Bromo #07</span>
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
                        Pintu Timur Stasiun KA Malang Kota Baru
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        Depan Indomaret Point, koordinasi kru berseragam rompi oranye & bendera Nusabook
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
                        Shuttle & Armada Jeep
                      </span>
                      <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                        Jeep 4x4 #Bromo-07
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        HiAce Plat N 7102 UB (Driver: Mas Joko)
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
                        Manifes Penumpang Resmi TNBTS & Asuransi Jasa Raharja
                      </h4>
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant hidden sm:inline">
                      2 Data Terverifikasi Dukcapil
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
                          <th className="py-2.5 px-3">ID SIMAKSI TNBTS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-low">
                        <tr className="hover:bg-surface-container-low transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-primary font-bold">01</td>
                          <td className="py-2.5 px-3 font-body-semibold text-on-surface font-bold">
                            Anindya Paramitha
                            <span className="block font-caption text-caption text-outline font-normal">
                              Lead Passenger (Kontak Utama)
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-caption text-caption text-on-surface-variant font-mono">
                            3578015509950003 (WNI)
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#059669] px-2 py-0.5 rounded text-[11px] font-semibold font-bold">
                              <MaterialIcon name="security" className="text-[12px]" />
                              #JR-98214-BTM
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-caption text-caption font-semibold text-primary font-bold font-mono">
                            TNBTS/2026/X/0842-1
                          </td>
                        </tr>
                        <tr className="hover:bg-surface-container-low transition-colors bg-surface-container-low/20">
                          <td className="py-2.5 px-3 font-semibold text-primary font-bold">02</td>
                          <td className="py-2.5 px-3 font-body-semibold text-on-surface font-bold">
                            Reza Herdian
                            <span className="block font-caption text-caption text-outline font-normal">
                              Penumpang Pendamping
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-caption text-caption text-on-surface-variant font-mono">
                            3273021403940001 (WNI)
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#059669] px-2 py-0.5 rounded text-[11px] font-semibold font-bold">
                              <MaterialIcon name="security" className="text-[12px]" />
                              #JR-98214-BTM
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-caption text-caption font-semibold text-primary font-bold font-mono">
                            TNBTS/2026/X/0842-2
                          </td>
                        </tr>
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
                    <span>Validasi Lapangan</span>
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
                    NUSA-AUTH-9a8f4c2b-e10842
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mt-space-xs leading-relaxed max-w-xs">
                    Tunjukkan QR Code ini kepada Tour Leader / Crew Lapangan saat penjemputan untuk verifikasi kehadiran & aktivasi pelepasan Escrow.
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
                          Grup WhatsApp Peserta Bromo 18 Okt
                        </h4>
                        <span className="bg-[#ecfdf5] text-[#059669] text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Resmi Terverifikasi
                        </span>
                      </div>
                      <p className="font-caption text-caption text-on-surface-variant">
                        12 Peserta lain & Driver telah bergabung. Dapatkan live update koordinasi posisi Jeep secara langsung.
                      </p>
                    </div>
                  </div>
                  <a
                    className="shrink-0 bg-[#059669] hover:bg-[#047857] text-white px-space-md py-2.5 rounded-lg font-body-semibold text-body-semibold inline-flex items-center gap-1.5 shadow-sm transition-colors font-bold"
                    href="https://chat.whatsapp.com"
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
                      Suhu Ekstrem: 5° - 10° C
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                    <div className="flex items-start gap-space-xs p-space-sm rounded-lg bg-surface-container-low">
                      <MaterialIcon name="check_box" className="text-[18px] text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                          Jaket Tebal / Windbreaker
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Kawasan Penanjakan 1 berangin kencang sebelum terbit fajar.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-xs p-space-sm rounded-lg bg-surface-container-low">
                      <MaterialIcon name="check_box" className="text-[18px] text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                          Sarung Tangan & Kupluk Wol
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Melindungi jemari tangan dari gigitan dingin subuh.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-xs p-space-sm rounded-lg bg-surface-container-low">
                      <MaterialIcon name="check_box" className="text-[18px] text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                          Masker Penutup Debu Belerang
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Wajib di bibir kawah aktif & area Pasir Berbisik.
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
                          Grip sol yang baik untuk menapaki 250 anak tangga kawah.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-xs p-space-sm rounded-lg bg-surface-container-low">
                      <MaterialIcon name="check_box" className="text-[18px] text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                          Powerbank & Kamera
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Baterai smartphone cepat drop pada suhu dingin.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-xs p-space-sm rounded-lg bg-surface-container-low">
                      <MaterialIcon name="check_box" className="text-[18px] text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                          Obat-Obatan Pribadi / Tolak Angin
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Mencegah mabuk darat pada rute kelok pegunungan.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Basecamp & Transit Address */}
                  <div className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container">
                    <MaterialIcon name="storefront" className="text-[24px] text-primary shrink-0" />
                    <div className="flex-1">
                      <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                        Basecamp Transit & Rest Area Tumpang
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        Jl. Raya Bromo No. 42 Tumpang, Malang (Tempat oper jeep, toilet bersih, dan sarapan pagi)
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
                          DR
                        </div>
                        <div>
                          <span className="font-body-semibold text-body-semibold text-on-surface block font-bold">
                            Dimas Raharjo, S.Par
                          </span>
                          <span className="font-caption text-caption text-on-surface-variant">
                            Tour Leader Resmi (Lisensi HPI #9921)
                          </span>
                        </div>
                      </div>
                      <a
                        className="w-9 h-9 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center hover:bg-[#d1fae5] transition-colors"
                        href="https://wa.me/6281388229100"
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
                            Nusabook Emergency Hotdesk
                          </span>
                          <span className="font-caption text-caption text-on-surface-variant">
                            +62 811-300-NUSA (Eskalasi 24/7)
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
                {/* Escrow Protection Badge Highlight */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-md flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <MaterialIcon name="verified_user" className="text-[22px] text-primary" />
                      <h3 className="font-title-md text-title-md text-primary font-bold">
                        Nusabook Safe Vault™ Escrow
                      </h3>
                    </div>
                    <span className="bg-[#ecfdf5] text-[#059669] px-2 py-0.5 rounded text-[11px] font-bold">
                      100% TERPROTEKSI
                    </span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-low text-on-surface-variant font-caption text-caption leading-relaxed">
                    Pembayaran Anda ditahan secara aman di Rekening Penampung Resmi Nusabook (BCA Escrow Account). Dana baru akan diteruskan ke rekening operator{" "}
                    <span className="font-semibold text-on-surface font-bold">Pesona Nusantara Tour</span> setelah kepulangan trip dinyatakan selesai & bebas komplain.
                  </div>

                  {/* Transaction Summary Breakdown */}
                  <div className="flex flex-col gap-space-xs text-body-regular">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant">Metode Pembayaran</span>
                      <span className="font-body-semibold text-on-surface font-bold">
                        BCA Virtual Account (Midtrans)
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant">Waktu Penyelesaian</span>
                      <span className="font-body-semibold text-on-surface font-bold">
                        14 Okt 2026, 14:42 WIB
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant">No. Referensi Transaksi</span>
                      <span className="font-mono text-caption text-on-surface font-semibold font-bold">
                        TRX-BCA-20261014-991823
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant">Harga Paket (2 Pax @ Rp 425.000)</span>
                      <span className="text-on-surface font-body-semibold font-bold">Rp 850.000</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant">Tiket Masuk TNBTS & Asuransi</span>
                      <span className="text-secondary font-semibold font-bold">Termasuk (Gratis)</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-on-surface-variant">Biaya Layanan Platform & Escrow</span>
                      <span className="text-[#059669] font-semibold font-bold">Rp 0 (Subsidi Program P2MW)</span>
                    </div>

                    {/* Total Paid Line */}
                    <div className="pt-space-sm mt-space-xs bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between border-t border-surface-container-high">
                      <div>
                        <span className="font-caption text-caption text-on-surface-variant block uppercase tracking-wider font-bold">
                          Total Pelunasan
                        </span>
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">
                          Rp 850.000
                        </span>
                      </div>
                      <span className="bg-[#ecfdf5] text-[#059669] font-body-semibold text-body-semibold px-2.5 py-1 rounded-full font-bold">
                        Lunas 100%
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
                        Peta Lokasi Titik Kumpul
                      </h4>
                    </div>
                    <a
                      className="font-caption text-caption text-secondary font-bold hover:underline flex items-center gap-0.5"
                      href="https://maps.google.com"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>Buka di Google Maps</span>
                      <MaterialIcon name="open_in_new" className="text-[14px]" />
                    </a>
                  </div>

                  <div
                    className="w-full h-44 rounded-lg bg-surface-container flex flex-col items-center justify-center p-space-md relative overflow-hidden bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBIPf9jLpQYVxL_Wu4NBM-t8cxsiNnUthJCr5XNgvBYr6EvWDdF84su-TxBA_vf-FfZ2xHGTSBMkwjA9v9HD_Ikj-zkMD3hR6N0TRoLld4v4J4Itz4VI3fcyUOWPG3L6Zo9PUzZAf_X2u6vuIfmslzg4mCvzKx8nLGu8FQkW5tgFuiSzgJMAo_csxZc_mSqYl_YPe5RdHzvS_Lapxw_iZ2rd_z_fk6DC3jN3teQoPvXMq_XqqqIpe0')",
                    }}
                  >
                    <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-on-primary p-space-sm text-center">
                      <MaterialIcon name="navigation" className="text-[32px] text-secondary-container" />
                      <span className="font-body-semibold text-body-semibold mt-1 font-bold">
                        Stasiun KA Malang Kota Baru
                      </span>
                      <span className="font-caption text-caption opacity-90">
                        Pintu Keluar Timur • Titik Jemput Utama
                      </span>
                    </div>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    Tips: Jika tiba lebih awal dengan kereta api (Gajayana / Jayabaya), silakan menunggu di ruang tunggu ber-AC lantai dasar.
                  </span>
                </div>

                {/* Cancellation & Reschedule Terms Summary */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-xs">
                  <div className="flex items-center gap-space-xs text-primary font-caption text-caption font-semibold font-bold">
                    <MaterialIcon name="info" className="text-[16px]" />
                    <span>Ketentuan Perubahan & Force Majeure</span>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
                    Dalam hal erupsi vulkanik Bromo / penutupan resmi Balai Besar TNBTS karena cuaca ekstrem, reservasi ini dilindungi jaminan pengembalian dana penuh (100% Refund Escrow) atau penjadwalan ulang bebas biaya hingga 90 hari ke depan.
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
            <Link className="hover:text-on-surface transition-colors" href="/guide">
              Panduan Operator
            </Link>
            <Link className="hover:text-on-surface transition-colors" href="/terms">
              Syarat Escrow DP
            </Link>
            <Link className="hover:text-on-surface transition-colors" href="/safety">
              Standar Keselamatan Bahari
            </Link>
          </div>
          <div className="font-caption text-caption text-outline">© 2026 Nusabook Indonesia. Hak Cipta Dilindungi.</div>
        </div>
      </footer>
    </div>
  );
}
