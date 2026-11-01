"use client";

import React, { useState } from "react";
import { MaterialIcon } from "@/components/ui/icon";

export interface PackageMockOption {
  id: string;
  name: string;
  destination: string;
  pricePerPax: number;
}

export interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bookingData?: any) => void;
  agentId?: string;
  schedules?: any[];
}

// Mock daftar paket wisata Nusabook untuk pilihan dropdown
const MOCK_PACKAGES: PackageMockOption[] = [
  {
    id: "pkg-brm-01",
    name: "Eksplorasi Sunrise Bromo & Midnight Crater 2D1N",
    destination: "TNBTS, Jawa Timur",
    pricePerPax: 450000,
  },
  {
    id: "pkg-ijn-02",
    name: "Open Trip Kawah Ijen Blue Fire & Kawah Belerang",
    destination: "Banyuwangi, Jawa Timur",
    pricePerPax: 375000,
  },
  {
    id: "pkg-kmj-03",
    name: "Snorkeling & Island Hopping Karimunjawa 3D2N",
    destination: "Jepara, Jawa Tengah",
    pricePerPax: 850000,
  },
  {
    id: "pkg-kmd-04",
    name: "Sailing Komodo Liveaboard Phinisi Luxury 3D2N",
    destination: "Labuan Bajo, NTT",
    pricePerPax: 2750000,
  },
];

export function ManualBookingModal({
  isOpen,
  onClose,
  onSuccess,
}: ManualBookingModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState(MOCK_PACKAGES[0].id);
  const [paxCount, setPaxCount] = useState<number>(1);
  const [departureDate, setDepartureDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Dapatkan detail paket yang dipilih untuk estimasi harga
  const selectedPackage = MOCK_PACKAGES.find((pkg) => pkg.id === selectedPackageId);
  const totalAmount = selectedPackage ? selectedPackage.pricePerPax * (paxCount || 1) : 0;

  // Validasi form: tombol submit dinonaktifkan jika ada field wajib yang kosong
  const isFormValid =
    customerName.trim() !== "" &&
    customerPhone.trim() !== "" &&
    selectedPackageId !== "" &&
    departureDate.trim() !== "" &&
    paxCount >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    // Payload pesanan manual / walk-in
    let resultPayload = {
      bookingCode: `MAN-${Date.now().toString().slice(-6)}`,
      is_manual_entry: true,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      packageId: selectedPackageId,
      packageName: selectedPackage?.name || "Paket Wisata Nusabook",
      departureDate,
      paxCount,
      totalAmount,
      status: "PAID",
      createdAt: new Date().toISOString(),
    };

    try {
      // Panggil endpoint /api/bookings/manual
      const response = await fetch("/api/bookings/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultPayload),
      });

      if (response.ok) {
        const json = await response.json();
        if (json?.data) {
          resultPayload = json.data;
        }
      }
    } catch (err) {
      // Mock fallback jika endpoint API lokal belum berjalan
      console.log("Mocking manual walk-in booking API call:", err);
    }

    // Simulasi loading selama 600ms untuk menampilkan spinner
    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsSubmitting(false);
    console.log("Pesanan Walk-in / Manual berhasil dicatat:", resultPayload);
    alert(
      `Pesanan Walk-in berhasil dicatat!\nKode: ${resultPayload.bookingCode}\nPemesan: ${resultPayload.customerName}\nTotal: Rp ${totalAmount.toLocaleString(
        "id-ID"
      )}`
    );

    if (onSuccess) {
      onSuccess(resultPayload);
    }

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-booking-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center shrink-0">
              <MaterialIcon name="receipt_long" className="text-2xl" />
            </span>
            <div>
              <h2
                id="manual-booking-title"
                className="text-base sm:text-lg font-bold text-slate-800"
              >
                Catat Pesanan Walk-in : Manual
              </h2>
              <p className="text-xs text-slate-500">
                Input reservasi langsung tamu tanpa melalui pembayaran online
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Tutup jendela modal"
          >
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Field 1: Nama Pemesan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Pemesan <span className="text-[#F57C00]">*</span>
            </label>
            <div className="relative">
              <MaterialIcon
                name="person"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none"
              />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-all"
              />
            </div>
          </div>

          {/* Field 2: No WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              No WhatsApp <span className="text-[#F57C00]">*</span>
            </label>
            <div className="relative">
              <MaterialIcon
                name="chat"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 text-lg pointer-events-none"
              />
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-all font-mono"
              />
            </div>
          </div>

          {/* Field 3: Pilih Paket Wisata */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pilih Paket Wisata <span className="text-[#F57C00]">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-all appearance-none cursor-pointer"
              >
                {MOCK_PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} (Rp {pkg.pricePerPax.toLocaleString("id-ID")}/pax)
                  </option>
                ))}
              </select>
              <MaterialIcon
                name="expand_more"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl"
              />
            </div>
          </div>

          {/* Field 4 & 5: Jumlah Pax & Tanggal Keberangkatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Jumlah Pax */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Jumlah Pax (Peserta) <span className="text-[#F57C00]">*</span>
              </label>
              <div className="relative">
                <MaterialIcon
                  name="group"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none"
                />
                <input
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={paxCount}
                  onChange={(e) => setPaxCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-all font-mono"
                />
              </div>
            </div>

            {/* Tanggal Keberangkatan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tanggal Keberangkatan <span className="text-[#F57C00]">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Kotak Ringkasan Biaya Walk-in */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#0D47A1] uppercase tracking-wider block">
                Estimasi Total Pembayaran
              </span>
              <span className="text-xs text-slate-500">
                {paxCount} pax x Rp {selectedPackage?.pricePerPax.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-[#0D47A1]">
                Rp {totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Footer Tombol Aksi */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                !isFormValid || isSubmitting
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200"
                  : "bg-[#0D47A1] hover:bg-[#0A3880] text-white cursor-pointer active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <MaterialIcon name="check" className="text-base" />
                  <span>Simpan Pesanan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManualBookingModal;
