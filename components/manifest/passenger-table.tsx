"use client";

import { useState, useMemo } from "react";
import { MaterialIcon } from "@/components/ui/icon";
import { CheckinButton } from "./checkin-button";

export interface PassengerManifestData {
  id: string;
  bookingId: string;
  fullName: string;
  gender: "MALE" | "FEMALE" | null;
  idCardNumber: string | null;
  phoneNumber: string | null;
  emergencyContact: string | null;
  specialNotes: string | null;
  bookingCode: string;
  customerName: string;
  paymentStatus: string;
  isCheckedIn: boolean;
  checkedInAt: string | null;
}

interface PassengerTableProps {
  initialPassengers: PassengerManifestData[];
  scheduleTitle: string;
  scheduleDate?: string;
  scheduleId?: string;
}

export function PassengerTable({
  initialPassengers,
  scheduleTitle,
  scheduleDate = "18 Okt 2026",
  scheduleId = "BTM-261018-A",
}: PassengerTableProps) {
  const [passengers, setPassengers] = useState<PassengerManifestData[]>(initialPassengers);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "checked" | "pending" | "manual">("all");
  const [armadaFilter, setArmadaFilter] = useState("ALL");
  const [revealedNiks, setRevealedNiks] = useState<Record<string, boolean>>({});

  const handleCheckinToggle = (
    passengerId: string,
    isCheckedIn: boolean,
    checkedInAt: string | null
  ) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === passengerId ? { ...p, isCheckedIn, checkedInAt } : p))
    );
  };

  const toggleNikReveal = (id: string) => {
    setRevealedNiks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPassengers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return passengers.filter((p) => {
      // 1. Text Search Filter
      if (q) {
        const matchName = p.fullName.toLowerCase().includes(q);
        const matchNik = (p.idCardNumber || "").toLowerCase().includes(q);
        const matchPhone = (p.phoneNumber || "").toLowerCase().includes(q);
        const matchBooking = p.bookingCode.toLowerCase().includes(q);
        const matchCustomer = p.customerName.toLowerCase().includes(q);

        if (!matchName && !matchNik && !matchPhone && !matchBooking && !matchCustomer) {
          return false;
        }
      }

      // 2. Tab Filter
      if (activeTab === "checked" && !p.isCheckedIn) return false;
      if (activeTab === "pending" && p.isCheckedIn) return false;
      if (activeTab === "manual" && !p.specialNotes?.includes("Manual")) {
        // demo/seed filter
      }

      return true;
    });
  }, [passengers, searchQuery, activeTab]);

  const stats = useMemo(() => {
    const total = passengers.length;
    const present = passengers.filter((p) => p.isCheckedIn).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, percentage };
  }, [passengers]);

  const maskNik = (nik: string | null, isRevealed: boolean) => {
    if (!nik) return "NIK Tidak Terisi";
    if (isRevealed) return nik;
    if (nik.length <= 6) return nik;
    return nik.slice(0, 4) + " •••• •••• " + nik.slice(-4);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
      {/* LEFT COLUMN: Manifest Controls, Tabs, and Master Table (8 Columns) */}
      <div className="xl:col-span-8 flex flex-col gap-space-md">
        {/* Filter Controls & Action Bar */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm border border-outline-variant/20">
          {/* Segmented Tab Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-container-low rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-space-sm py-1.5 rounded-md font-body-semibold text-body-semibold transition-all ${
                  activeTab === "all"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Semua Peserta{" "}
                <span className="ml-1 px-1.5 py-0.2 bg-primary text-on-primary rounded-full text-micro-badge">
                  {passengers.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("checked")}
                className={`px-space-sm py-1.5 rounded-md font-body-regular text-body-regular transition-all ${
                  activeTab === "checked"
                    ? "bg-surface-container-lowest text-primary shadow-sm font-body-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Hadir / Terverifikasi{" "}
                <span className="ml-1 px-1.5 py-0.2 bg-surface-container-high text-on-surface rounded-full text-micro-badge">
                  {stats.present}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pending")}
                className={`px-space-sm py-1.5 rounded-md font-body-regular text-body-regular transition-all ${
                  activeTab === "pending"
                    ? "bg-surface-container-lowest text-primary shadow-sm font-body-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Belum Check-in{" "}
                <span className="ml-1 px-1.5 py-0.2 bg-secondary-fixed text-on-secondary-fixed font-bold rounded-full text-micro-badge">
                  {stats.absent}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className={`px-space-sm py-1.5 rounded-md font-body-regular text-body-regular transition-all ${
                  activeTab === "manual"
                    ? "bg-surface-container-lowest text-primary shadow-sm font-body-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Reservasi Offline{" "}
                <span className="ml-1 px-1.5 py-0.2 bg-surface-container text-on-surface rounded-full text-micro-badge">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* Search Bar & Armada Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm pt-space-xs">
            <div className="md:col-span-7 relative flex items-center">
              <MaterialIcon
                name="search"
                className="absolute left-3 text-outline text-lg pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama peserta, NIK, kontak WA, booking..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-container-low text-on-surface placeholder-outline font-body-regular text-body-regular outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all text-sm"
              />
            </div>
            <div className="md:col-span-5 flex items-center gap-space-xs">
              <div className="w-full relative">
                <select
                  value={armadaFilter}
                  onChange={(e) => setArmadaFilter(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-semibold text-body-semibold outline-none cursor-pointer text-sm"
                >
                  <option value="ALL">Semua Armada (HiAce &amp; Jeep)</option>
                  <option value="HIACE">Toyota HiAce Shuttle</option>
                  <option value="JEEP">Jeep Hardtop 4x4</option>
                </select>
                <MaterialIcon
                  name="directions_car"
                  className="absolute right-2.5 top-2.5 text-on-surface-variant pointer-events-none text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Master Passenger Manifest Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
          <div className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-title-md text-title-md text-on-surface font-bold">
                Daftar Manifes Resmi Keberangkatan
              </span>
              <span className="text-caption font-caption text-on-surface-variant">
                ({filteredPassengers.length} Jiwa Terdaftar)
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container font-caption text-caption uppercase text-on-surface-variant tracking-wider">
                <tr>
                  <th className="py-space-sm px-space-md font-semibold">No</th>
                  <th className="py-space-sm px-space-md font-semibold">Nama Peserta &amp; Kontak</th>
                  <th className="py-space-sm px-space-md font-semibold">Dokumen NIK / Paspor</th>
                  <th className="py-space-sm px-space-md font-semibold">Kode Reservasi</th>
                  <th className="py-space-sm px-space-md font-semibold">Presensi Check-in</th>
                </tr>
              </thead>
              <tbody className="divide-none text-body-regular font-body-regular">
                {filteredPassengers.length > 0 ? (
                  filteredPassengers.map((p, index) => {
                    const isRevealed = !!revealedNiks[p.id];
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-surface-container-low transition-colors bg-surface-container-lowest border-b border-surface-container-low"
                      >
                        <td className="py-space-md px-space-md align-top font-bold text-primary font-mono text-sm">
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        <td className="py-space-md px-space-md align-top">
                          <div className="flex flex-col">
                            <span className="font-body-semibold text-body-semibold text-on-surface">
                              {p.fullName}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5 text-caption font-caption text-on-surface-variant">
                              {p.phoneNumber && (
                                <span className="inline-flex items-center gap-1 text-primary">
                                  <MaterialIcon name="call" className="text-xs" /> {p.phoneNumber}
                                </span>
                              )}
                              {p.gender && (
                                <span className="px-1.5 py-0.2 rounded bg-surface-container font-micro-badge text-micro-badge">
                                  {p.gender === "MALE" ? "Laki-laki" : "Perempuan"}
                                </span>
                              )}
                            </div>
                            {p.specialNotes && (
                              <span className="text-[11px] text-amber-700 italic mt-0.5">
                                Catatan: {p.specialNotes}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-space-md px-space-md align-top">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-caption text-on-surface font-medium">
                              {maskNik(p.idCardNumber, isRevealed)}
                            </span>
                            {p.idCardNumber && (
                              <button
                                type="button"
                                onClick={() => toggleNikReveal(p.id)}
                                className="p-1 rounded text-outline hover:text-primary transition-colors"
                                title={isRevealed ? "Sembunyikan NIK" : "Buka NIK (Audit)"}
                              >
                                <MaterialIcon
                                  name={isRevealed ? "visibility_off" : "visibility"}
                                  className="text-sm"
                                />
                              </button>
                            )}
                          </div>
                          <span className="text-[10px] text-primary flex items-center gap-1 mt-0.5">
                            <MaterialIcon name="verified" className="text-xs" /> Terverifikasi Dukcapil
                          </span>
                        </td>

                        <td className="py-space-md px-space-md align-top">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-caption text-primary">
                              {p.bookingCode}
                            </span>
                            <span className="font-caption text-caption text-on-surface-variant">
                              Pemesan: {p.customerName}
                            </span>
                          </div>
                        </td>

                        <td className="py-space-md px-space-md align-top">
                          <CheckinButton
                            passengerId={p.id}
                            initialChecked={p.isCheckedIn}
                            initialTime={p.checkedInAt}
                            onToggle={(checked, time) => handleCheckinToggle(p.id, checked, time)}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto p-4">
                        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline mb-3">
                          <MaterialIcon name="person_search" className="text-2xl" />
                        </div>
                        <p className="font-body-semibold text-body-semibold text-on-surface mb-1">
                          {searchQuery || activeTab !== "all"
                            ? "Tidak ada peserta yang cocok"
                            : "Belum ada manifes penumpang"}
                        </p>
                        <p className="font-caption text-caption text-on-surface-variant text-xs mb-4">
                          {searchQuery || activeTab !== "all"
                            ? "Coba ubah kata kunci pencarian atau reset filter status kehadiran."
                            : "Peserta yang menyelesaikan pemesanan akan otomatis terdata di sini."}
                        </p>
                        {(searchQuery || activeTab !== "all") && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery("");
                              setActiveTab("all");
                            }}
                            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-body-semibold text-xs transition-colors"
                          >
                            Reset Filter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Presence Telemetry & Safety Widgets (4 Columns) */}
      <div className="xl:col-span-4 flex flex-col gap-space-md">
        {/* Telemetry Card */}
        <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-title-md text-title-md text-on-surface font-bold">
              Telemetri Presensi
            </span>
            <span className="font-micro-badge text-micro-badge px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-bold">
              {stats.percentage}% HADIR
            </span>
          </div>

          <div className="p-4 bg-surface-container-low rounded-xl flex items-center justify-around text-center">
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-primary font-bold">
                {stats.present}
              </span>
              <span className="font-caption text-caption text-on-surface-variant">Telah Check-in</span>
            </div>
            <div className="h-10 w-px bg-outline-variant/40" />
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-secondary font-bold">
                {stats.absent}
              </span>
              <span className="font-caption text-caption text-on-surface-variant">Belum Hadir</span>
            </div>
          </div>

          <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
            <div className="bg-primary h-full transition-all" style={{ width: `${stats.percentage}%` }} />
          </div>
        </section>

        {/* Safety & Compliance Checklist */}
        <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
          <span className="font-title-md text-title-md text-on-surface font-bold">
            Status Legalitas &amp; Keselamatan
          </span>

          <div className="flex flex-col gap-2">
            <div className="p-2.5 rounded-lg bg-surface-container-low flex items-start gap-2">
              <MaterialIcon name="verified" className="text-primary text-lg shrink-0 mt-0.5" />
              <div className="flex flex-col text-xs">
                <span className="font-semibold text-on-surface">SIMAKSI TNBTS Resmi</span>
                <span className="text-on-surface-variant">Data NIK sinkron dengan pos pintu masuk</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low flex items-start gap-2">
              <MaterialIcon name="shield" className="text-primary text-lg shrink-0 mt-0.5" />
              <div className="flex flex-col text-xs">
                <span className="font-semibold text-on-surface">Asuransi Jasa Raharja</span>
                <span className="text-on-surface-variant">Polis proteksi kecelakaan aktif otomatis</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low flex items-start gap-2">
              <MaterialIcon name="support_agent" className="text-primary text-lg shrink-0 mt-0.5" />
              <div className="flex flex-col text-xs">
                <span className="font-semibold text-on-surface">Tour Leader Lapangan</span>
                <span className="text-on-surface-variant">Bersertifikat HPI &amp; Standby di meeting point</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
