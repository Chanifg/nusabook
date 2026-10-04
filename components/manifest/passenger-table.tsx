"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Phone, MessageSquare, AlertTriangle, Users, CheckCircle, Clock } from "lucide-react";
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
}

export function PassengerTable({ initialPassengers, scheduleTitle }: PassengerTableProps) {
  const [passengers, setPassengers] = useState<PassengerManifestData[]>(initialPassengers);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<"ALL" | "MALE" | "FEMALE">("ALL");
  const [attendanceFilter, setAttendanceFilter] = useState<"ALL" | "PRESENT" | "ABSENT">("ALL");

  const handleCheckinToggle = (passengerId: string, isCheckedIn: boolean, checkedInAt: string | null) => {
    setPassengers((prev) =>
      prev.map((p) =>
        p.id === passengerId ? { ...p, isCheckedIn, checkedInAt } : p
      )
    );
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
        const matchNotes = (p.specialNotes || "").toLowerCase().includes(q);

        if (!matchName && !matchNik && !matchPhone && !matchBooking && !matchCustomer && !matchNotes) {
          return false;
        }
      }

      // 2. Gender Filter
      if (genderFilter !== "ALL") {
        if (p.gender !== genderFilter) return false;
      }

      // 3. Attendance Filter
      if (attendanceFilter === "PRESENT" && !p.isCheckedIn) return false;
      if (attendanceFilter === "ABSENT" && p.isCheckedIn) return false;

      return true;
    });
  }, [passengers, searchQuery, genderFilter, attendanceFilter]);

  const stats = useMemo(() => {
    const total = passengers.length;
    const present = passengers.filter((p) => p.isCheckedIn).length;
    const absent = total - present;
    return { total, present, absent };
  }, [passengers]);

  const formatCleanPhone = (phone: string | null) => {
    if (!phone) return null;
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.slice(1);
    }
    return clean;
  };

  return (
    <div className="space-y-4">
      {/* Quick Attendance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Penumpang</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.total} Orang</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Sudah Hadir</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.present} Orang</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Belum Hadir</div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{stats.absent} Orang</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Instant Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama penumpang, NIK, kode booking, atau WhatsApp..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
              Gender:
            </span>
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-xs">
              <button
                type="button"
                onClick={() => setGenderFilter("ALL")}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  genderFilter === "ALL"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter("MALE")}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  genderFilter === "MALE"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Laki-laki
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter("FEMALE")}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  genderFilter === "FEMALE"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Perempuan
              </button>
            </div>
          </div>

          {/* Attendance Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
              Status:
            </span>
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-xs">
              <button
                type="button"
                onClick={() => setAttendanceFilter("ALL")}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  attendanceFilter === "ALL"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setAttendanceFilter("PRESENT")}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  attendanceFilter === "PRESENT"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Hadir
              </button>
              <button
                type="button"
                onClick={() => setAttendanceFilter("ABSENT")}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  attendanceFilter === "ABSENT"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Belum
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <span>Menampilkan <strong>{filteredPassengers.length}</strong> dari {passengers.length} peserta terdaftar</span>
          {(searchQuery || genderFilter !== "ALL" || attendanceFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setGenderFilter("ALL");
                setAttendanceFilter("ALL");
              }}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">No</th>
                <th className="py-3 px-4">Nama Peserta</th>
                <th className="py-3 px-3 text-center w-16">L/P</th>
                <th className="py-3 px-4">No. Identitas</th>
                <th className="py-3 px-4">Kontak WhatsApp</th>
                <th className="py-3 px-4">Kontak Darurat</th>
                <th className="py-3 px-4">Catatan Khusus</th>
                <th className="py-3 px-3">Kode Booking</th>
                <th className="py-3 px-4 text-center">Presensi Hari-H</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPassengers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Tidak ada data peserta yang cocok</p>
                    <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau ubah filter di atas.</p>
                  </td>
                </tr>
              ) : (
                filteredPassengers.map((passenger, index) => {
                  const cleanPhone = formatCleanPhone(passenger.phoneNumber);
                  return (
                    <tr
                      key={passenger.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                        passenger.isCheckedIn ? "bg-emerald-50/20 dark:bg-emerald-950/10" : ""
                      }`}
                    >
                      <td className="py-3 px-3 text-center text-xs font-semibold text-slate-400">
                        {index + 1}
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        <div>{passenger.fullName}</div>
                        {passenger.customerName !== passenger.fullName && (
                          <div className="text-[11px] font-normal text-slate-400">
                            Pemesan: {passenger.customerName}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            passenger.gender === "MALE"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                              : passenger.gender === "FEMALE"
                              ? "bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {passenger.gender === "MALE" ? "L" : passenger.gender === "FEMALE" ? "P" : "-"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs font-mono text-slate-600 dark:text-slate-300">
                        {passenger.idCardNumber || "-"}
                      </td>

                      <td className="py-3 px-4 text-xs">
                        {passenger.phoneNumber ? (
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{passenger.phoneNumber}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                        {passenger.emergencyContact || "-"}
                      </td>

                      <td className="py-3 px-4 text-xs">
                        {passenger.specialNotes ? (
                          <div className="inline-flex items-start gap-1 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded text-[11px] font-medium border border-amber-200 dark:border-amber-800/50">
                            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                            <span>{passenger.specialNotes}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-xs">
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 text-[11px]">
                          {passenger.bookingCode}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <CheckinButton
                          passengerId={passenger.id}
                          initialChecked={passenger.isCheckedIn}
                          initialTime={passenger.checkedInAt}
                          onToggle={(checked, time) =>
                            handleCheckinToggle(passenger.id, checked, time)
                          }
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
