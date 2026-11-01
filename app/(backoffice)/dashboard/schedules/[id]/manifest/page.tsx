import Link from "next/link";
import { PassengerTable, PassengerManifestData } from "@/components/manifest/passenger-table";
import { PrintButton } from "@/components/manifest/print-button";
import { MaterialIcon } from "@/components/ui/icon";

interface ManifestPageProps {
  params: Promise<{ id: string }>;
}

// Mock data manifes penumpang Nusabook untuk visualisasi langsung di browser
const MOCK_PASSENGERS: PassengerManifestData[] = [
  {
    id: "mock-psg-01",
    bookingId: "mock-bk-01",
    fullName: "Budi Santoso",
    gender: "MALE",
    idCardNumber: "3507123456780001",
    phoneNumber: "081234567890",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:15:00Z",
    bookingCode: "NBK-BRM-001",
    customerName: "Budi Santoso",
    specialNotes: "Duduk di baris depan (riwayat mabuk darat)",
  },
  {
    id: "mock-psg-02",
    bookingId: "mock-bk-01",
    fullName: "Siti Nurhaliza",
    gender: "FEMALE",
    idCardNumber: "3507234567890002",
    phoneNumber: "081987654321",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:20:00Z",
    bookingCode: "NBK-BRM-001",
    customerName: "Budi Santoso",
    specialNotes: null,
  },
  {
    id: "mock-psg-03",
    bookingId: "mock-bk-02",
    fullName: "Ahmad Fauzi",
    gender: "MALE",
    idCardNumber: "3507345678900003",
    phoneNumber: "085233445566",
    isCheckedIn: false,
    checkedInAt: null,
    bookingCode: "NBK-BRM-002",
    customerName: "Ahmad Fauzi",
    specialNotes: "Vegetarian (tidak makan olahan daging)",
  },
  {
    id: "mock-psg-04",
    bookingId: "mock-bk-02",
    fullName: "Dewi Lestari",
    gender: "FEMALE",
    idCardNumber: "3507456789010004",
    phoneNumber: "087811223344",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:35:00Z",
    bookingCode: "NBK-BRM-002",
    customerName: "Ahmad Fauzi",
    specialNotes: null,
  },
  {
    id: "mock-psg-05",
    bookingId: "mock-bk-03",
    fullName: "Rian Pratama",
    gender: "MALE",
    idCardNumber: "3507567890120005",
    phoneNumber: "089677889900",
    isCheckedIn: false,
    checkedInAt: null,
    bookingCode: "NBK-BRM-003",
    customerName: "Rian Pratama",
    specialNotes: null,
  },
  {
    id: "mock-psg-06",
    bookingId: "mock-bk-03",
    fullName: "Intan Permatasari",
    gender: "FEMALE",
    idCardNumber: "3507678901230006",
    phoneNumber: "081399887766",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:40:00Z",
    bookingCode: "NBK-BRM-003",
    customerName: "Rian Pratama",
    specialNotes: "Membawa kamera tripod profesional",
  },
  {
    id: "mock-psg-07",
    bookingId: "mock-bk-04",
    fullName: "Eko Prasetyo",
    gender: "MALE",
    idCardNumber: "3507789012340007",
    phoneNumber: "082155667788",
    isCheckedIn: false,
    checkedInAt: null,
    bookingCode: "NBK-BRM-004",
    customerName: "Eko Prasetyo",
    specialNotes: null,
  },
  {
    id: "mock-psg-08",
    bookingId: "mock-bk-04",
    fullName: "Maya Anggraini",
    gender: "FEMALE",
    idCardNumber: "3507890123450008",
    phoneNumber: "081277665544",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:50:00Z",
    bookingCode: "NBK-BRM-004",
    customerName: "Eko Prasetyo",
    specialNotes: null,
  },
  {
    id: "mock-psg-09",
    bookingId: "mock-bk-05",
    fullName: "Bayu Saputra",
    gender: "MALE",
    idCardNumber: "3507901234560009",
    phoneNumber: "085712349876",
    isCheckedIn: false,
    checkedInAt: null,
    bookingCode: "NBK-BRM-005",
    customerName: "Bayu Saputra",
    specialNotes: "Penjemputan di Terminal Arjosari",
  },
  {
    id: "mock-psg-10",
    bookingId: "mock-bk-05",
    fullName: "Citra Anindita",
    gender: "FEMALE",
    idCardNumber: "3507012345670010",
    phoneNumber: "081809876543",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T07:05:00Z",
    bookingCode: "NBK-BRM-005",
    customerName: "Bayu Saputra",
    specialNotes: null,
  },
];

export default async function ManifestPage({ params }: ManifestPageProps) {
  const { id } = await params;
  const scheduleId = id || "SCH-261018-A";

  // Data travel agent & jadwal
  const agentDetails = {
    businessName: "Nusantara Tour & Travel",
    officeAddress: "Jl. Ijen No. 45, Kota Malang, Jawa Timur",
    contact: "0812-3456-7890 / cs@nusantaratour.id",
  };

  const scheduleDetails = {
    id: scheduleId,
    title: "Eksplorasi Sunrise Bromo & Midnight Crater 2D1N",
    destination: "Taman Nasional Bromo Tengger Semeru",
    departureDate: "Sabtu, 18 Oktober 2026",
    departureTime: "00:15 WIB",
    meetingPoint: "Stasiun Malang Kota Baru (Pintu Timur)",
    totalQuota: 12,
    bookedQuota: MOCK_PASSENGERS.length,
    status: "Siap Berangkat",
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-10">
      {/* ============================================================ */}
      {/* 1. TAMPILAN INTERAKTIF LAYAR (DISEMBUNYIKAN SAAT PRINT)       */}
      {/* ============================================================ */}
      <div className="flex flex-col w-full gap-5 print:hidden">
        {/* Breadcrumb Navigasi */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/dashboard" className="hover:text-[#0D47A1] transition-colors">
            Dashboard
          </Link>
          <MaterialIcon name="chevron_right" className="text-sm text-slate-400" />
          <Link href="/dashboard/schedules" className="hover:text-[#0D47A1] transition-colors">
            Jadwal Keberangkatan
          </Link>
          <MaterialIcon name="chevron_right" className="text-sm text-slate-400" />
          <span className="font-semibold text-[#0D47A1]">Manifes Penumpang</span>
        </nav>

        {/* Header Utama Manifes & Informasi Batch */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              {/* Tag Batch & Status */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#0D47A1] text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Manifes Gate Resmi
                </span>
                <span className="bg-blue-50 text-[#0D47A1] font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-blue-200/60">
                  BATCH: {scheduleDetails.id.toUpperCase()}
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {scheduleDetails.status}
                </span>
              </div>

              {/* Judul Paket Tour */}
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Manifes Penumpang &amp; Presensi Keberangkatan
              </h1>

              {/* Sub-informasi Rute & Jadwal */}
              <p className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-semibold text-slate-800">{scheduleDetails.title}</span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <MaterialIcon name="calendar_today" className="text-sm text-slate-400" />
                  {scheduleDetails.departureDate} ({scheduleDetails.departureTime})
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <MaterialIcon name="place" className="text-sm text-[#F57C00]" />
                  {scheduleDetails.meetingPoint}
                </span>
              </p>
            </div>

            {/* Tombol Aksi Dokumen & Komunikasi */}
            <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
              {/* Tombol Cetak Langsung (Browser Print Dialog) */}
              <PrintButton />

              {/* Tombol Pratinjau Dokumen HTML Khusus Print */}
              <a
                href={`/api/manifest/${scheduleDetails.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
                title="Buka pratinjau lembar cetak standar A4 Landscape"
              >
                <MaterialIcon name="description" className="text-base text-[#0D47A1]" />
                <span>Format SIMAKSI</span>
              </a>

              {/* Tombol Unduh CSV dengan UTF-8 BOM */}
              <a
                href={`/api/manifest/export?scheduleId=${scheduleDetails.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
                title="Unduh data manifes dalam format spreadsheet CSV"
              >
                <MaterialIcon name="download" className="text-base text-[#0D47A1]" />
                <span>Unduh CSV</span>
              </a>

              {/* Tombol Broadcast WhatsApp */}
              <a
                href={`https://wa.me/?text=Halo%20Peserta%20${encodeURIComponent(
                  scheduleDetails.title
                )}%2C%20mohon%20bersiap%20di%20meeting%20point%20${encodeURIComponent(
                  scheduleDetails.meetingPoint
                )}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <MaterialIcon name="chat" className="text-base" />
                <span>Broadcast WA</span>
              </a>
            </div>
          </div>

          {/* Pita Informasi Kesiapan Armada & Kuota */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-2 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F57C00]" />
                <span className="font-semibold text-slate-800">
                  {scheduleDetails.bookedQuota} / {scheduleDetails.totalQuota} Kursi Terisi
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1 text-slate-600">
                <MaterialIcon name="verified_user" className="text-sm text-[#0D47A1]" />
                <span>SIMAKSI TNBTS: Siap Verifikasi</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1 text-slate-600">
                <MaterialIcon name="shield" className="text-sm text-[#0D47A1]" />
                <span>Asuransi Jasa Raharja: Aktif</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <span>Sistem Gate:</span>
              <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                REALTIME LOCAL MOCK
              </span>
            </div>
          </div>
        </div>

        {/* Banner Kepatuhan Perlindungan Data Pribadi (UU PDP No. 27/2022) */}
        <div className="bg-[#0D47A1] text-white rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/10 rounded-lg text-white shrink-0 mt-0.5">
              <MaterialIcon name="security" className="text-xl" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight">
                  Kepatuhan UU Perlindungan Data Pribadi (UU No. 27/2022)
                </h2>
                <span className="bg-white/20 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  AES-256 Terproteksi
                </span>
              </div>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Nomor Induk Kependudukan (NIK) penumpang disensor secara default demi menjaga
                kerahasiaan data identitas. Tampilkan data lengkap hanya untuk kebutuhan audit resmi
                di pos retribusi pos pintu masuk SIMAKSI.
              </p>
            </div>
          </div>
        </div>

        {/* Komponen Interaktif: Tabel Manifes, Filter Tabs, & Search Bar */}
        <PassengerTable
          initialPassengers={MOCK_PASSENGERS}
          scheduleTitle={scheduleDetails.title}
          scheduleDate={scheduleDetails.departureDate}
          scheduleId={scheduleDetails.id}
        />
      </div>

      {/* ============================================================ */}
      {/* 2. LAYOUT KHUSUS PRINT (MUNCUL OTOMATIS SAAT CETAK / CTRL+P) */}
      {/* ============================================================ */}
      <div className="hidden print:block w-full text-slate-900 bg-white">
        {/* Kop Surat Agen Resmi */}
        <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-slate-900">
              {agentDetails.businessName}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {agentDetails.officeAddress}
            </p>
            <p className="text-xs text-slate-600">
              Kontak Layanan: {agentDetails.contact}
            </p>
          </div>

          <div className="text-right">
            <h3 className="text-base font-bold uppercase tracking-wider text-[#0D47A1]">
              MANIFES PENUMPANG
            </h3>
            <p className="text-xs font-mono font-semibold text-slate-700 mt-0.5">
              BATCH ID: #{scheduleDetails.id.toUpperCase()}
            </p>
            <p className="text-[11px] text-slate-500">
              Tanggal Cetak: {new Date().toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>

        {/* Ringkasan Informasi Trip & Rute */}
        <div className="grid grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Paket Wisata:
            </span>
            <span className="font-bold text-slate-900 block mt-0.5">
              {scheduleDetails.title}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Tanggal Keberangkatan:
            </span>
            <span className="font-semibold text-slate-900 block mt-0.5">
              {scheduleDetails.departureDate} ({scheduleDetails.departureTime})
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Titik Kumpul (Meeting Point):
            </span>
            <span className="font-semibold text-slate-900 block mt-0.5">
              {scheduleDetails.meetingPoint}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Kapasitas Peserta:
            </span>
            <span className="font-bold text-slate-900 block mt-0.5">
              {scheduleDetails.bookedQuota} / {scheduleDetails.totalQuota} Pax Terdaftar
            </span>
          </div>
        </div>

        {/* Tabel Peserta Format Cetak */}
        <table className="w-full text-left border-collapse border border-slate-300 text-xs mb-6">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 uppercase text-[10px]">
              <th className="py-2 px-2 border-r border-slate-300 text-center w-10">No</th>
              <th className="py-2 px-3 border-r border-slate-300 min-w-[150px]">Nama Peserta</th>
              <th className="py-2 px-3 border-r border-slate-300 min-w-[140px]">NIK</th>
              <th className="py-2 px-3 border-r border-slate-300 min-w-[120px]">No HP</th>
              <th className="py-2 px-3 border-r border-slate-300 w-24 text-center">Status</th>
              <th className="py-2 px-3 min-w-[110px] text-center">Tanda Tangan / Paraf</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {MOCK_PASSENGERS.map((p, idx) => (
              <tr key={p.id} className="border-b border-slate-200">
                <td className="py-2 px-2 text-center font-bold border-r border-slate-200">
                  {idx + 1}
                </td>
                <td className="py-2 px-3 border-r border-slate-200">
                  <div className="font-bold text-slate-900">{p.fullName}</div>
                  <div className="text-[10px] text-slate-500">
                    {p.gender === "MALE" ? "Laki-laki" : "Perempuan"} | Booking: {p.bookingCode}
                  </div>
                </td>
                <td className="py-2 px-3 font-mono border-r border-slate-200">
                  {p.idCardNumber || "-"}
                </td>
                <td className="py-2 px-3 font-mono border-r border-slate-200">
                  {p.phoneNumber || "-"}
                </td>
                <td className="py-2 px-3 text-center border-r border-slate-200">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.isCheckedIn
                        ? "text-emerald-700 bg-emerald-50 border border-emerald-300"
                        : "text-slate-600 bg-slate-100"
                    }`}
                  >
                    {p.isCheckedIn ? "Hadir" : "Belum"}
                  </span>
                </td>
                {/* Kolom Tanda Tangan / Paraf Kosong untuk Pengisian Fisik */}
                <td className="py-2 px-3 text-center h-10"></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bagian Bawah: Catatan Hukum & Kolom Tanda Tangan Tour Leader di Kanan Bawah */}
        <div className="flex items-end justify-between pt-2">
          {/* Catatan Verifikasi Fisik */}
          <div className="max-w-md text-[10px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700 uppercase">
              Catatan Petugas Lapangan:
            </p>
            <p>
              1. Lembar manifes fisik wajib ditandatangani peserta saat briefing di meeting point.
            </p>
            <p>
              2. Data NIK digunakan untuk verifikasi e-SIMAKSI TNBTS dan penerbitan asuransi resmi.
            </p>
          </div>

          {/* Kolom Tanda Tangan Tour Leader di Kanan Bawah */}
          <div className="text-center w-64 border border-slate-300 rounded-lg p-3 bg-slate-50">
            <p className="text-[11px] text-slate-600">
              Malang, {scheduleDetails.departureDate}
            </p>
            <p className="text-xs font-bold text-slate-800 mt-1">
              Tour Leader / Koordinator Lapangan
            </p>
            {/* Ruang Tanda Tangan */}
            <div className="h-16"></div>
            <div className="border-t border-slate-800 mx-auto w-44 pt-1">
              <span className="text-xs font-bold text-slate-900 block">
                ( ..................................................... )
              </span>
              <span className="text-[10px] text-slate-500 block">
                Petugas Verifikasi Mitra Nusabook
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
