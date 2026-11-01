"use client";

import { useState, useMemo } from "react";
import { MaterialIcon } from "@/components/ui/icon";
import { CheckinButton } from "./checkin-button";

export interface PassengerManifestData {
  id: string;
  bookingId?: string;
  fullName: string;
  phoneNumber: string | null;
  idCardNumber: string | null;
  isCheckedIn: boolean;
  checkedInAt?: string | null;
  gender?: "MALE" | "FEMALE" | null;
  bookingCode?: string;
  customerName?: string;
  specialNotes?: string | null;
}

export interface PassengerTableProps {
  initialPassengers: PassengerManifestData[];
  scheduleTitle?: string;
  scheduleDate?: string;
  scheduleId?: string;
}

export function PassengerTable({
  initialPassengers,
  scheduleTitle = "Paket Wisata Nusabook",
  scheduleDate = "18 Okt 2026",
  scheduleId = "SCH-001",
}: PassengerTableProps) {
  const [passengers, setPassengers] = useState<PassengerManifestData[]>(initialPassengers);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "checked" | "pending">("all");
  const [revealedNiks, setRevealedNiks] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"auto" | "table" | "card">("auto");

  // Handler toggle presensi saat tombol CheckinButton diklik
  const handleCheckinToggle = (
    passengerId: string,
    isCheckedIn: boolean,
    checkedInAt: string | null
  ) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === passengerId ? { ...p, isCheckedIn, checkedInAt } : p))
    );
  };

  // Toggle sensor NIK untuk perlindungan data privasi
  const toggleNikReveal = (id: string) => {
    setRevealedNiks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Format sensor NIK (16 digit)
  const maskNik = (nik: string | null, isRevealed: boolean) => {
    if (!nik) return "NIK belum diisi";
    if (isRevealed) return nik;
    if (nik.length <= 6) return nik;
    return nik.slice(0, 4) + " •••• •••• " + nik.slice(-4);
  };

  // Format jam check-in
  const formatTime = (isoString: string | null | undefined) => {
    if (!isoString) return "-";
    try {
      const date = new Date(isoString);
      return (
        date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB"
      );
    } catch {
      return "-";
    }
  };

  // Filter pencarian instan sisi klien (Nama atau No HP) dan tab filter
  const filteredPassengers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return passengers.filter((p) => {
      // 1. Filter Pencarian Nama atau No HP (serta NIK / Booking Code jika cocok)
      if (q) {
        const matchName = p.fullName.toLowerCase().includes(q);
        const matchPhone = (p.phoneNumber || "").toLowerCase().includes(q);
        const matchNik = (p.idCardNumber || "").toLowerCase().includes(q);
        const matchBooking = (p.bookingCode || "").toLowerCase().includes(q);

        if (!matchName && !matchPhone && !matchNik && !matchBooking) {
          return false;
        }
      }

      // 2. Tab Filter Kehadiran
      if (activeTab === "checked" && !p.isCheckedIn) return false;
      if (activeTab === "pending" && p.isCheckedIn) return false;

      return true;
    });
  }, [passengers, searchQuery, activeTab]);

  // Statistik kehadiran
  const stats = useMemo(() => {
    const total = passengers.length;
    const present = passengers.filter((p) => p.isCheckedIn).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, percentage };
  }, [passengers]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Kartu Ringkasan & Statistik Presensi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Peserta */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Peserta
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total} Pax</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Kapasitas kuota terkonfirmasi</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-[#0D47A1] flex items-center justify-center">
            <MaterialIcon name="groups" className="text-2xl" />
          </div>
        </div>

        {/* Sudah Hadir */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Sudah Hadir
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.present} Pax</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              {stats.percentage}% telah presensi
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MaterialIcon name="how_to_reg" className="text-2xl" />
          </div>
        </div>

        {/* Belum Hadir */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Belum Hadir
            </p>
            <p className="text-2xl font-bold text-[#F57C00] mt-1">{stats.absent} Pax</p>
            <p className="text-[11px] text-[#F57C00] font-medium mt-0.5">
              Menunggu tiba di meeting point
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-orange-50 text-[#F57C00] flex items-center justify-center">
            <MaterialIcon name="pending_actions" className="text-2xl" />
          </div>
        </div>

        {/* Progres Presensi */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Tingkat Kehadiran
            </p>
            <span className="text-xs font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-full">
              {stats.percentage}%
            </span>
          </div>
          <div className="my-2">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#0D47A1] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            {stats.present} dari {stats.total} peserta siap berangkat
          </p>
        </div>
      </div>

      {/* Bagian Utama: Tab Filter, Search Bar, & Opsi Tampilan */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Header Kontrol */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col gap-4">
          {/* Baris Tab Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Tab Filter: Semua, Sudah Hadir, Belum Hadir */}
            <div className="inline-flex p-1 bg-slate-100/90 rounded-lg self-start">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "all"
                    ? "bg-[#0D47A1] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                    activeTab === "all"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {stats.total}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("checked")}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "checked"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sudah Hadir
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                    activeTab === "checked"
                      ? "bg-white/20 text-white"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {stats.present}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("pending")}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "pending"
                    ? "bg-[#F57C00] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Belum Hadir
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                    activeTab === "pending"
                      ? "bg-white/20 text-white"
                      : "bg-orange-100 text-[#F57C00]"
                  }`}
                >
                  {stats.absent}
                </span>
              </button>
            </div>

            {/* Toggle Tampilan (Mobile Friendly) */}
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500">
              <span className="hidden sm:inline">Mode Tampilan:</span>
              <div className="inline-flex p-0.5 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                    viewMode === "table"
                      ? "bg-white text-[#0D47A1] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Tampilan Tabel"
                >
                  <MaterialIcon name="table_rows" className="text-sm" />
                  <span className="hidden md:inline">Tabel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("card")}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                    viewMode === "card"
                      ? "bg-white text-[#0D47A1] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Tampilan Kartu"
                >
                  <MaterialIcon name="grid_view" className="text-sm" />
                  <span className="hidden md:inline">Kartu</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("auto")}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                    viewMode === "auto"
                      ? "bg-white text-[#0D47A1] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Otomatis Sesuai Layar"
                >
                  <MaterialIcon name="devices" className="text-sm" />
                  <span className="hidden md:inline">Auto</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar instan sisi klien */}
          <div className="relative w-full">
            <MaterialIcon
              name="search"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama peserta atau no HP secara instan..."
              className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                title="Hapus pencarian"
              >
                <MaterialIcon name="close" className="text-sm" />
              </button>
            )}
          </div>

          {/* Info Status Filter */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Menampilkan <strong>{filteredPassengers.length}</strong> dari {passengers.length} peserta
            </span>
            {searchQuery && (
              <span className="text-slate-500">
                Filter: &quot;{searchQuery}&quot;
              </span>
            )}
          </div>
        </div>

        {/* 1. TAMPILAN TABEL: Desktop / Tablet atau saat viewMode = 'table' */}
        <div
          className={`w-full overflow-x-auto ${
            viewMode === "card"
              ? "hidden"
              : viewMode === "table"
              ? "block"
              : "hidden md:block"
          }`}
        >
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 min-w-[200px]">Nama Peserta</th>
                <th className="py-3 px-4 min-w-[150px]">No HP</th>
                <th className="py-3 px-4 min-w-[190px]">NIK</th>
                <th className="py-3 px-4 min-w-[160px] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPassengers.length > 0 ? (
                filteredPassengers.map((p, index) => {
                  const isRevealed = !!revealedNiks[p.id];
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Kolom No */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs font-semibold text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      {/* Kolom Nama Peserta */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">
                              {p.fullName}
                            </span>
                            {p.gender && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                {p.gender === "MALE" ? "Laki-laki" : "Perempuan"}
                              </span>
                            )}
                          </div>
                          {p.bookingCode && (
                            <span className="text-xs font-mono text-slate-400 mt-0.5">
                              Booking: {p.bookingCode}
                            </span>
                          )}
                          {p.specialNotes && (
                            <span className="text-[11px] text-amber-700 mt-0.5 italic">
                              Catatan: {p.specialNotes}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Kolom No HP */}
                      <td className="py-3.5 px-4">
                        {p.phoneNumber ? (
                          <a
                            href={`https://wa.me/${p.phoneNumber.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#0D47A1] font-mono text-xs hover:underline"
                            title="Hubungi via WhatsApp"
                          >
                            <MaterialIcon name="chat" className="text-emerald-600 text-sm" />
                            <span>{p.phoneNumber}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs italic">-</span>
                        )}
                      </td>

                      {/* Kolom NIK */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs text-slate-700">
                            {maskNik(p.idCardNumber, isRevealed)}
                          </span>
                          {p.idCardNumber && (
                            <button
                              type="button"
                              onClick={() => toggleNikReveal(p.id)}
                              className="p-1 rounded text-slate-400 hover:text-[#0D47A1] hover:bg-slate-100 transition-colors"
                              title={isRevealed ? "Sembunyikan NIK" : "Tampilkan NIK lengkap"}
                            >
                              <MaterialIcon
                                name={isRevealed ? "visibility_off" : "visibility"}
                                className="text-sm"
                              />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Kolom Status (Hadir / Belum) */}
                      <td className="py-3.5 px-4 text-center">
                        <CheckinButton
                          passengerId={p.id}
                          initialChecked={p.isCheckedIn}
                          initialTime={p.checkedInAt}
                          onToggle={(checked, time) =>
                            handleCheckinToggle(p.id, checked, time)
                          }
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto p-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <MaterialIcon name="person_search" className="text-2xl" />
                      </div>
                      <p className="font-semibold text-slate-700 mb-1">
                        {searchQuery || activeTab !== "all"
                          ? "Peserta tidak ditemukan"
                          : "Belum ada manifes penumpang"}
                      </p>
                      <p className="text-xs text-slate-500 mb-4">
                        {searchQuery || activeTab !== "all"
                          ? "Coba periksa kembali kata kunci nama atau no HP Anda."
                          : "Data manifes peserta akan tampil otomatis setelah pemesanan dikonfirmasi."}
                      </p>
                      {(searchQuery || activeTab !== "all") && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setActiveTab("all");
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-[#0D47A1] hover:bg-blue-100 text-xs font-semibold transition-colors"
                        >
                          Reset Pencarian &amp; Filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 2. TAMPILAN KARTU LIST: Mobile Viewport (< 768px / minimal 360px) */}
        <div
          className={`p-3 sm:p-4 space-y-3 ${
            viewMode === "table"
              ? "hidden"
              : viewMode === "card"
              ? "block"
              : "block md:hidden"
          }`}
        >
          {filteredPassengers.length > 0 ? (
            filteredPassengers.map((p, index) => {
              const isRevealed = !!revealedNiks[p.id];
              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    p.isCheckedIn
                      ? "bg-emerald-50/20 border-emerald-200"
                      : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  {/* Baris Atas: Nomor, Nama, dan Badge Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">
                          {p.fullName}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {p.gender && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              {p.gender === "MALE" ? "Laki-laki" : "Perempuan"}
                            </span>
                          )}
                          {p.bookingCode && (
                            <span className="text-[11px] font-mono text-slate-400">
                              {p.bookingCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        p.isCheckedIn
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-orange-100 text-[#F57C00]"
                      }`}
                    >
                      {p.isCheckedIn ? "Hadir" : "Belum Hadir"}
                    </span>
                  </div>

                  {/* Detail: No HP & NIK */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
                    {/* No HP */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">No HP / WA:</span>
                      {p.phoneNumber ? (
                        <a
                          href={`https://wa.me/${p.phoneNumber.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[#0D47A1] hover:underline flex items-center gap-1"
                        >
                          <MaterialIcon name="chat" className="text-emerald-600 text-xs" />
                          <span>{p.phoneNumber}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">-</span>
                      )}
                    </div>

                    {/* NIK */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">NIK:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-slate-700">
                          {maskNik(p.idCardNumber, isRevealed)}
                        </span>
                        {p.idCardNumber && (
                          <button
                            type="button"
                            onClick={() => toggleNikReveal(p.id)}
                            className="p-0.5 text-slate-400 hover:text-[#0D47A1]"
                            title={isRevealed ? "Sembunyikan" : "Buka"}
                          >
                            <MaterialIcon
                              name={isRevealed ? "visibility_off" : "visibility"}
                              className="text-xs"
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Waktu Presensi jika sudah hadir */}
                    {p.isCheckedIn && p.checkedInAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Waktu Presensi:</span>
                        <span className="font-mono text-emerald-700 font-medium">
                          {formatTime(p.checkedInAt)}
                        </span>
                      </div>
                    )}

                    {p.specialNotes && (
                      <div className="text-[11px] text-amber-700 italic pt-1">
                        Catatan: {p.specialNotes}
                      </div>
                    )}
                  </div>

                  {/* Tombol Aksi CheckinButton di Bawah Kartu */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end">
                    <CheckinButton
                      passengerId={p.id}
                      initialChecked={p.isCheckedIn}
                      initialTime={p.checkedInAt}
                      onToggle={(checked, time) =>
                        handleCheckinToggle(p.id, checked, time)
                      }
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center bg-slate-50 rounded-xl">
              <MaterialIcon name="person_search" className="text-3xl text-slate-400 mb-2" />
              <p className="font-semibold text-slate-700 text-sm">Peserta tidak ditemukan</p>
              <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian.</p>
              {(searchQuery || activeTab !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("all");
                  }}
                  className="mt-3 px-3 py-1 bg-blue-50 text-[#0D47A1] text-xs font-semibold rounded-lg"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
