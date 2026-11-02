"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/icon";

export interface BroadcastPassenger {
  id?: string;
  fullName: string;
  phoneNumber?: string | null;
  customerName?: string;
  specialNotes?: string | null;
  isCheckedIn?: boolean;
}

interface BroadcastModalProps {
  scheduleTitle: string;
  departureDate: string;
  departureTime: string;
  meetingPoint: string;
  passengers: BroadcastPassenger[];
}

export function BroadcastModal({
  scheduleTitle,
  departureDate,
  departureTime,
  meetingPoint,
  passengers,
}: BroadcastModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"h-1" | "hari-h" | "gear">("h-1");
  const [copiedNumbers, setCopiedNumbers] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const getTemplateText = (type: "h-1" | "hari-h" | "gear") => {
    if (type === "hari-h") {
      return `[PENGINGAT HARI H TRIP NUSABOOK]\n\nHalo Rekan Wisatawan!\nTour Leader dan armada kami sudah STANDBY di lokasi meeting point:\n\n• Paket: ${scheduleTitle}\n• Lokasi: ${meetingPoint}\n• Jadwal: ${departureDate} (${departureTime})\n\nBagi yang telah tiba, silakan menuju meja presensi untuk scan QR E-Tiket Anda. Jika ada kendala rute atau terlambat, segera hubungi Tour Leader kami di nomor ini. Terima kasih!`;
    }
    if (type === "gear") {
      return `[PERLENGKAPAN WAJIB & REGULASI TRIP NUSABOOK]\n\nHalo Rekan Wisatawan ${scheduleTitle}!\n\nUntuk kelancaran dan keselamatan selama perjalanan, mohon pastikan membawa perlengkapan berikut:\n1. Kartu Identitas Resmi (KTP/Paspor untuk verifikasi SIMAKSI)\n2. Jaket tebal atau windbreaker tahan angin\n3. Sepatu trekking atau sneakers yang nyaman\n4. Obat-obatan pribadi dan botol minum tumbler\n\nTitik kumpul: ${meetingPoint}\nJadwal kumpul: ${departureDate} pukul ${departureTime}.\nSampai bertemu di lokasi!`;
    }
    return `[PENGINGAT H-1 KEBERANGKATAN TRIP NUSABOOK]\n\nHalo Rekan Wisatawan!\n\nKami menginformasikan jadwal keberangkatan untuk paket wisata:\n• Paket: ${scheduleTitle}\n• Jadwal: ${departureDate}\n• Waktu Kumpul: ${departureTime} (Harap hadir 15-30 menit lebih awal untuk briefing & presensi)\n• Titik Kumpul (Meeting Point): ${meetingPoint}\n\nPastikan ponsel Anda dalam kondisi aktif. E-Tiket resmi dapat Anda akses sewaktu-waktu melalui tautan Nusabook Anda. Sampai jumpa besok pagi!`;
  };

  const [message, setMessage] = useState(getTemplateText("h-1"));

  const handleSelectTemplate = (type: "h-1" | "hari-h" | "gear") => {
    setSelectedTemplate(type);
    setMessage(getTemplateText(type));
  };

  // Collect unique valid phone numbers
  const uniquePhones = Array.from(
    new Set(
      passengers
        .map((p) => p.phoneNumber?.replace(/[^0-9]/g, ""))
        .filter((num): num is string => Boolean(num && num.length >= 9))
    )
  );

  const handleCopyNumbers = async () => {
    if (uniquePhones.length === 0) return;
    try {
      await navigator.clipboard.writeText(uniquePhones.join(", "));
      setCopiedNumbers(true);
      setTimeout(() => setCopiedNumbers(false), 3000);
    } catch {
      // fallback
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 3000);
    } catch {
      // fallback
    }
  };

  const formatCleanPhone = (phone?: string | null) => {
    if (!phone) return null;
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.slice(1);
    }
    return clean;
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
        title="Buka Pusat Koordinasi dan Broadcast WhatsApp ke Peserta"
      >
        <MaterialIcon name="chat" className="text-base" />
        <span>Broadcast WA</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <MaterialIcon name="mark_chat_unread" className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    Pusat Koordinasi Peserta &amp; Broadcast WhatsApp
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kirim panduan titik kumpul ke {passengers.length} peserta terdaftar ({uniquePhones.length} nomor aktif).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                aria-label="Tutup modal"
              >
                <MaterialIcon name="close" className="text-xl" />
              </button>
            </div>

            {/* Template Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pilih Format Template Pesan:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectTemplate("h-1")}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    selectedTemplate === "h-1"
                      ? "border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-1 ring-emerald-500"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="font-bold mb-0.5">Pengingat H-1</div>
                  <div className="text-[11px] text-slate-500 font-normal">Titik kumpul &amp; jadwal jam tiba</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTemplate("hari-h")}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    selectedTemplate === "hari-h"
                      ? "border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-1 ring-emerald-500"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="font-bold mb-0.5">Hari H Standby</div>
                  <div className="text-[11px] text-slate-500 font-normal">Posisi Tour Leader di lokasi</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTemplate("gear")}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    selectedTemplate === "gear"
                      ? "border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-1 ring-emerald-500"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="font-bold mb-0.5">Perlengkapan Trip</div>
                  <div className="text-[11px] text-slate-500 font-normal">KTP, jaket, &amp; obat pribadi</div>
                </button>
              </div>
            </div>

            {/* Editable Message Box */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Draf Isi Pesan WhatsApp:
                </label>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <MaterialIcon name={copiedMessage ? "check" : "content_copy"} className="text-sm" />
                  <span>{copiedMessage ? "Tersalin ke Klip" : "Salin Pesan"}</span>
                </button>
              </div>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed font-sans text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            {/* Bulk Actions Bar */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyNumbers}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  <MaterialIcon name={copiedNumbers ? "check_circle" : "copy_all"} className="text-base text-emerald-600" />
                  <span>{copiedNumbers ? "Nomor Disalin!" : `Salin ${uniquePhones.length} Nomor WA`}</span>
                </button>
                <span className="text-[11px] text-slate-500">
                  Format koma untuk broadcast grup
                </span>
              </div>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <MaterialIcon name="open_in_new" className="text-base" />
                <span>Buka WhatsApp Web</span>
              </a>
            </div>

            {/* Individual Contact Directory */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Daftar Peserta &amp; Chat Langsung:
              </span>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {passengers.map((p, idx) => {
                  const cleanPhone = formatCleanPhone(p.phoneNumber);
                  const personalMessage = `Halo ${p.fullName}!\n\n` + message;
                  const personalWaUrl = cleanPhone
                    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(personalMessage)}`
                    : null;

                  return (
                    <div
                      key={p.id || idx}
                      className="p-2.5 flex items-center justify-between gap-2 hover:bg-slate-50 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <span className="font-bold text-slate-900 block truncate">
                            {p.fullName}
                          </span>
                          <span className="text-slate-500 text-[11px] font-mono">
                            {p.phoneNumber || "Tidak ada nomor"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {personalWaUrl ? (
                          <a
                            href={personalWaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-colors"
                          >
                            <MaterialIcon name="chat" className="text-xs" />
                            <span>Chat</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No Phone</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

