"use client";

import { use } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  Printer,
  Compass,
  ArrowLeft,
  ShieldCheck,
  QrCode,
} from "lucide-react";

export default function ETicketPage({
  params,
}: {
  params: Promise<{ bookingCode: string }>;
}) {
  const { bookingCode } = use(params);

  // Mock e-ticket data
  const ticketData = {
    bookingCode: bookingCode,
    status: "PAID",
    agentName: "Pesona Merapi Tour & Travel",
    agentContact: "0812-3456-7890",
    tripTitle: "Sunrise Lava Tour Merapi & Bunker Kaliadem",
    departureDate: "Sabtu, 4 Oktober 2026",
    meetingPoint: "Basecamp Jeep Kaliurang, Sleman (04:00 WIB)",
    customerName: "Budi Santoso",
    customerWhatsapp: "081234567890",
    customerEmail: "budi@gmail.com",
    totalPax: 2,
    totalAmount: 500000,
    paidAt: "28 September 2026, 11:25 WIB",
    passengers: [
      { name: "Budi Santoso", gender: "Laki-laki (L)", idCard: "3304192801920001", seatNo: "01" },
      { name: "Siti Rahmawati", gender: "Perempuan (P)", idCard: "3304192801920002", seatNo: "02" },
    ],
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col print:bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-700 font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Halaman Utama
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-900 text-white text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            Cetak / Simpan E-Ticket
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 md:p-8 flex-1 w-full space-y-6">
        {/* Ticket Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
          {/* Ticket Header */}
          <div className="bg-brand-700 text-white p-6 sm:p-8 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/60 text-xs font-semibold text-brand-100 mb-2 border border-brand-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-500" />
                  E-Ticket Resmi Terverifikasi
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {ticketData.tripTitle}
                </h1>
                <p className="text-sm text-brand-100 mt-1">Dikelola oleh {ticketData.agentName}</p>
              </div>

              <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-4 py-2 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider block">Status</span>
                <span className="text-sm font-extrabold text-white flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" /> LUNAS (PAID)
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100 text-sm">
              <div>
                <span className="text-xs text-slate-400">Kode Booking</span>
                <p className="font-mono font-bold text-slate-900 text-base mt-0.5">
                  {ticketData.bookingCode}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Tanggal Keberangkatan</span>
                <p className="font-semibold text-slate-900 mt-0.5">{ticketData.departureDate}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Jumlah Peserta</span>
                <p className="font-semibold text-slate-900 mt-0.5">{ticketData.totalPax} Orang</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Total Pembayaran</span>
                <p className="font-bold text-brand-700 mt-0.5">{formatRupiah(ticketData.totalAmount)}</p>
              </div>
            </div>

            {/* Meeting Point Box */}
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                  Titik Kumpul & Jam Berangkat:
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {ticketData.meetingPoint}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Kontak Operasional Agen: {ticketData.agentContact}
                </p>
              </div>
            </div>

            {/* Passenger Manifest */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-brand-700" />
                <h3 className="font-bold text-sm text-slate-900">Manifes Peserta Terdaftar</h3>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">Nama Lengkap</th>
                      <th className="py-2.5 px-3">Jenis Kelamin</th>
                      <th className="py-2.5 px-3">Identitas (NIK)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ticketData.passengers.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-500">{p.seatNo}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{p.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{p.gender}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{p.idCard}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Barcode & QR Verification Mockup */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0">
                  <QrCode className="w-10 h-10 text-brand-100" />
                </div>
                <div className="text-xs text-slate-500">
                  <p className="font-semibold text-slate-800">Verifikasi Presensi Lapangan</p>
                  <p>Tunjukkan QR Code ini kepada kru agen saat jadwal keberangkatan.</p>
                </div>
              </div>

              <div className="text-center sm:text-right text-xs text-slate-400">
                <p>Nusabook Security Verified</p>
                <p className="font-mono text-[10px] text-slate-500 mt-0.5">{ticketData.paidAt}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
