"use client";

import React, { useState } from "react";
import { MaterialIcon } from "@/components/ui/icon";

export interface ScheduleOptionItem {
  id: string;
  packageId?: string;
  packageName?: string;
  dateText: string;
  quotaRemaining: number;
  price: number;
}

export interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bookingCode: string) => void;
  agentId: string;
  schedules?: ScheduleOptionItem[];
}

export function ManualBookingModal({
  isOpen,
  onClose,
  onSuccess,
  agentId,
  schedules = [],
}: ManualBookingModalProps) {
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(
    schedules[0]?.id || ""
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paxCount, setPaxCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "DIRECT_TRANSFER">("CASH");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSchedule = schedules.find((s) => s.id === selectedScheduleId);
  const totalAmount = currentSchedule ? currentSchedule.price * paxCount : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedScheduleId) {
      setErrorMsg("Pilih jadwal trip terlebih dahulu");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg("Nama pemesan dan nomor WhatsApp wajib diisi");
      return;
    }
    if (paxCount < 1) {
      setErrorMsg("Jumlah peserta minimal 1 orang");
      return;
    }
    if (currentSchedule && paxCount > currentSchedule.quotaRemaining) {
      setErrorMsg(`Kuota tidak cukup. Sisa kuota hanya ${currentSchedule.quotaRemaining} kursi`);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/bookings/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId: selectedScheduleId,
          packageId: currentSchedule?.packageId || "pkg-default",
          agentId,
          customerName,
          customerPhone,
          customerEmail: customerEmail || `${customerPhone}@walkin.nusabook.id`,
          paxCount,
          paymentMethod,
          paymentNotes: paymentNotes || "Pencatatan Pesanan Walk-in / Manual",
          totalAmount,
          passengers: [{ fullName: customerName, phone: customerPhone }],
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mencatat pesanan manual");
      }

      if (onSuccess) {
        onSuccess(json.data.bookingCode);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan sistem saat menyimpan pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg border border-outline-variant overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-lowest">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <MaterialIcon name="receipt_long" size={20} />
            </span>
            <div>
              <h3 className="font-title-md text-title-md text-on-surface font-bold">
                Catat Pesanan Manual / Walk-in
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Input pesanan offline, tunai, atau transfer langsung ke rekening agen
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-high transition"
            aria-label="Tutup Modal"
          >
            <MaterialIcon name="close" size={22} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error font-body-sm flex items-center gap-2">
              <MaterialIcon name="error_outline" size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Schedule Select */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface font-bold mb-1.5">
              Pilih Jadwal & Paket Trip <span className="text-error">*</span>
            </label>
            <select
              value={selectedScheduleId}
              onChange={(e) => setSelectedScheduleId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            >
              {schedules.length === 0 ? (
                <option value="">Tidak ada jadwal keberangkatan aktif</option>
              ) : (
                schedules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.packageName ? `[${s.packageName}] ` : ""}
                    {s.dateText} (Sisa: {s.quotaRemaining} pax) - Rp {s.price.toLocaleString("id-ID")}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-bold mb-1.5">
                Nama Tamu Utama <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-bold mb-1.5">
                WhatsApp Tamu <span className="text-error">*</span>
              </label>
              <input
                type="tel"
                placeholder="Contoh: 081234567890"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          {/* Email & Pax Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-bold mb-1.5">
                Email Tamu (Opsional)
              </label>
              <input
                type="email"
                placeholder="tamu@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-bold mb-1.5">
                Jumlah Pax (Orang) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={currentSchedule ? currentSchedule.quotaRemaining : 20}
                value={paxCount}
                onChange={(e) => setPaxCount(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          {/* Payment Method & Total */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer font-body-sm">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH"
                  checked={paymentMethod === "CASH"}
                  onChange={() => setPaymentMethod("CASH")}
                  className="text-primary"
                />
                <span>Tunai (Cash)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-body-sm">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="DIRECT_TRANSFER"
                  checked={paymentMethod === "DIRECT_TRANSFER"}
                  onChange={() => setPaymentMethod("DIRECT_TRANSFER")}
                  className="text-primary"
                />
                <span>Transfer Manual</span>
              </label>
            </div>
            <div className="text-right">
              <span className="font-caption text-caption text-on-surface-variant block">Total Bayar:</span>
              <span className="font-title-md text-title-md text-primary font-bold">
                Rp {totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-label-md text-on-surface-variant hover:bg-surface-container-high transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl font-label-md bg-primary text-on-primary font-bold hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <MaterialIcon name="check_circle" size={18} />
                  <span>Konfirmasi & Cetak Pesanan</span>
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
