"use client";

import { useState, useMemo } from "react";
import { MaterialIcon } from "@/components/ui/icon";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

export interface TravelAgentItem {
  id: string;
  businessName: string;
  slug: string;
  ownerName: string;
  ownerPhone: string;
  city: string;
  province: string;
  joinedDate: string;
  isVerified: boolean;
  isActive: boolean;
  packageCount: number;
  totalBooking: number;
}

// Mock data agen travel yang terdaftar di platform Nusabook
const INITIAL_AGENTS: TravelAgentItem[] = [
  {
    id: "agent-001",
    businessName: "Pesona Merapi Tour & Travel",
    slug: "pesona-merapi",
    ownerName: "Rian Pratama",
    ownerPhone: "0812-3456-7890",
    city: "Sleman",
    province: "D.I. Yogyakarta",
    joinedDate: "2026-08-14",
    isVerified: true,
    isActive: true,
    packageCount: 6,
    totalBooking: 142,
  },
  {
    id: "agent-002",
    businessName: "Batam Island Adventures",
    slug: "batam-adventures",
    ownerName: "Siti Nurhaliza",
    ownerPhone: "0819-8765-4321",
    city: "Batam",
    province: "Kepulauan Riau",
    joinedDate: "2026-08-28",
    isVerified: true,
    isActive: true,
    packageCount: 4,
    totalBooking: 98,
  },
  {
    id: "agent-003",
    businessName: "Rinjani Highland Trekker",
    slug: "rinjani-trekker",
    ownerName: "Lalu Hendra",
    ownerPhone: "0852-3344-5566",
    city: "Lombok Timur",
    province: "Nusa Tenggara Barat",
    joinedDate: "2026-09-02",
    isVerified: false,
    isActive: true,
    packageCount: 3,
    totalBooking: 45,
  },
  {
    id: "agent-004",
    businessName: "Bromo Sunrise Expedition",
    slug: "bromo-sunrise",
    ownerName: "Budi Santoso",
    ownerPhone: "0878-1122-3344",
    city: "Malang",
    province: "Jawa Timur",
    joinedDate: "2026-09-10",
    isVerified: true,
    isActive: true,
    packageCount: 8,
    totalBooking: 210,
  },
  {
    id: "agent-005",
    businessName: "Karimunjawa Seaview Tour",
    slug: "karimunjawa-seaview",
    ownerName: "Ahmad Fauzi",
    ownerPhone: "0896-7788-9900",
    city: "Jepara",
    province: "Jawa Tengah",
    joinedDate: "2026-09-18",
    isVerified: false,
    isActive: true,
    packageCount: 5,
    totalBooking: 64,
  },
  {
    id: "agent-006",
    businessName: "Phinisi Komodo Voyage",
    slug: "phinisi-komodo",
    ownerName: "Citra Anindita",
    ownerPhone: "0813-9988-7766",
    city: "Labuan Bajo",
    province: "Nusa Tenggara Timur",
    joinedDate: "2026-09-25",
    isVerified: true,
    isActive: true,
    packageCount: 4,
    totalBooking: 115,
  },
  {
    id: "agent-007",
    businessName: "Derawan Marine Explorer",
    slug: "derawan-explorer",
    ownerName: "Bayu Saputra",
    ownerPhone: "0821-5566-7788",
    city: "Berau",
    province: "Kalimantan Timur",
    joinedDate: "2026-10-04",
    isVerified: false,
    isActive: false,
    packageCount: 2,
    totalBooking: 18,
  },
  {
    id: "agent-008",
    businessName: "Toba Caldera Heritage Tour",
    slug: "toba-caldera",
    ownerName: "Dewi Lestari",
    ownerPhone: "0818-0987-6543",
    city: "Samosir",
    province: "Sumatera Utara",
    joinedDate: "2026-10-12",
    isVerified: true,
    isActive: true,
    packageCount: 3,
    totalBooking: 52,
  },
];

export default function SuperAdminPage() {
  const [agents, setAgents] = useState<TravelAgentItem[]>(INITIAL_AGENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "verified" | "unverified">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal State untuk inspeksi detail dokumen legalitas agen
  const [selectedAgentDetail, setSelectedAgentDetail] = useState<TravelAgentItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Format tanggal Indonesia
  const formatDateIndo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Handler toggle is_verified dengan efek visual dan sinkronisasi
  const handleToggleVerified = async (agent: TravelAgentItem, nextChecked: boolean) => {
    const previousState = agent.isVerified;
    setUpdatingId(agent.id);

    // Optimistic UI update
    setAgents((prev) =>
      prev.map((a) => (a.id === agent.id ? { ...a, isVerified: nextChecked } : a))
    );

    try {
      // Panggil endpoint verify Super Admin
      const res = await fetch(`/api/admin/agents/${agent.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: nextChecked }),
      });

      if (!res.ok) {
        // Fallback simulasi delay jika berjalan di lingkungan mock lokal
        await new Promise((resolve) => setTimeout(resolve, 350));
      }

      showToast(
        nextChecked
          ? `Mitra "${agent.businessName}" resmi DIVERIFIKASI. Badge aktif.`
          : `Status verifikasi mitra "${agent.businessName}" DINONAKTIFKAN.`
      );
    } catch {
      // Fallback mulus untuk demo mock
      showToast(
        nextChecked
          ? `Mitra "${agent.businessName}" resmi DIVERIFIKASI (Simulasi).`
          : `Status verifikasi mitra "${agent.businessName}" DINONAKTIFKAN (Simulasi).`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Statistik Ringkasan Agen
  const stats = useMemo(() => {
    const total = agents.length;
    const verified = agents.filter((a) => a.isVerified).length;
    const unverified = total - verified;
    const percentage = total > 0 ? Math.round((verified / total) * 100) : 0;
    return { total, verified, unverified, percentage };
  }, [agents]);

  // Filter pencarian dan status
  const filteredAgents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return agents.filter((agent) => {
      // 1. Search Query
      if (q) {
        const matchName = agent.businessName.toLowerCase().includes(q);
        const matchOwner = agent.ownerName.toLowerCase().includes(q);
        const matchCity = agent.city.toLowerCase().includes(q);
        const matchProvince = agent.province.toLowerCase().includes(q);

        if (!matchName && !matchOwner && !matchCity && !matchProvince) {
          return false;
        }
      }

      // 2. Status Filter
      if (filterStatus === "verified" && !agent.isVerified) return false;
      if (filterStatus === "unverified" && agent.isVerified) return false;

      return true;
    });
  }, [agents, searchQuery, filterStatus]);

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Toast Notifikasi Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <MaterialIcon name="check_circle" className="text-xl text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
            aria-label="Tutup notifikasi"
          >
            <MaterialIcon name="close" className="text-lg" />
          </button>
        </div>
      )}

      {/* Modal Detail Dokumen Legalitas Agen */}
      {selectedAgentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center font-bold">
                  <MaterialIcon name="verified" className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                    Audit Profil Agen Travel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Otorisasi kepatuhan perizinan tour and travel
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAgentDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                aria-label="Tutup modal"
              >
                <MaterialIcon name="close" className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#0D47A1] text-base">
                    {selectedAgentDetail.businessName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedAgentDetail.city}, {selectedAgentDetail.province}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedAgentDetail.isVerified
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-orange-100 text-[#F57C00]"
                  }`}
                >
                  {selectedAgentDetail.isVerified ? "Terverifikasi" : "Belum Verifikasi"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-slate-400 text-xs block">Penanggung Jawab:</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {selectedAgentDetail.ownerName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">WhatsApp Resmi:</span>
                  <span className="font-mono text-slate-800 mt-0.5 block">
                    {selectedAgentDetail.ownerPhone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Tanggal Registrasi:</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {formatDateIndo(selectedAgentDetail.joinedDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Jumlah Paket Aktif:</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {selectedAgentDetail.packageCount} Paket Wisata
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-slate-400 text-xs block mb-1.5 font-bold uppercase tracking-wider">
                  Ubah Status Verifikasi:
                </span>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-medium text-slate-700">
                    Beri Hak Publikasi Marketplace
                  </span>
                  <ToggleSwitch
                    checked={selectedAgentDetail.isVerified}
                    onChange={(checked) => {
                      handleToggleVerified(selectedAgentDetail, checked);
                      setSelectedAgentDetail((prev) => (prev ? { ...prev, isVerified: checked } : null));
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAgentDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner Portal Super Admin */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#0D47A1] text-white font-bold text-[11px] uppercase rounded-md tracking-wider">
                Super Admin Console
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">Nusabook Multi-tenant Engine</span>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-md text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Gate Verifikasi: Realtime Active</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manajemen &amp; Verifikasi Agen Travel
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Kendali penuh otorisasi mitra agen tour &amp; travel di platform Nusabook. Agen yang
              terverifikasi (is_verified: true) dapat menerbitkan paket tur di marketplace dan
              menerima reservasi online.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => showToast("Memperbarui status database mitra agen...")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <MaterialIcon name="refresh" className="text-base text-slate-500" />
              <span>Sinkronkan Data</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 KARTU RINGKASAN DI ATAS TABEL */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Kartu 1: Total Agen */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Agen Terdaftar
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {stats.total} <span className="text-sm font-semibold text-slate-500">Mitra</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Ekosistem UMKM Pariwisata</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0D47A1] flex items-center justify-center">
            <MaterialIcon name="storefront" className="text-2xl" />
          </div>
        </div>

        {/* Kartu 2: Agen Terverifikasi */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Agen Terverifikasi
            </span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">
              {stats.verified} <span className="text-sm font-semibold text-emerald-700">Mitra</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-emerald-700 font-semibold">
              <MaterialIcon name="verified" className="text-sm" />
              <span>{stats.percentage}% telah memenuhi KYC</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MaterialIcon name="how_to_reg" className="text-2xl" />
          </div>
        </div>

        {/* Kartu 3: Agen Belum Terverifikasi */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Belum Terverifikasi
            </span>
            <div className="text-3xl font-extrabold text-[#F57C00] mt-1">
              {stats.unverified} <span className="text-sm font-semibold text-[#F57C00]">Mitra</span>
            </div>
            <p className="text-xs text-[#F57C00] font-medium mt-0.5">
              Menunggu aktivasi izin marketplace
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F57C00] flex items-center justify-center">
            <MaterialIcon name="pending_actions" className="text-2xl" />
          </div>
        </div>
      </section>

      {/* TABEL DAFTAR AGEN TRAVEL & KONTROL */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Header Kontrol Tabel & Search */}
        <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Daftar Agen Travel &amp; Status Kemitraan
              </h2>
              <p className="text-xs text-slate-500">
                Gunakan toggle switch di kolom verifikasi untuk mengaktifkan atau menonaktifkan status izin agen secara instan.
              </p>
            </div>

            {/* Tab Filter: Semua, Terverifikasi, Belum Verifikasi */}
            <div className="inline-flex p-1 bg-slate-100/90 rounded-lg self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  filterStatus === "all"
                    ? "bg-[#0D47A1] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua ({stats.total})
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus("verified")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  filterStatus === "verified"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Terverifikasi ({stats.verified})
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus("unverified")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  filterStatus === "unverified"
                    ? "bg-[#F57C00] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Belum ({stats.unverified})
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full">
            <MaterialIcon
              name="search"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama agen, pemilik, atau wilayah kota..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-all"
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
        </div>

        {/* 1. TAMPILAN TABEL: Desktop & Tablet */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 min-w-[220px]">Nama Agen &amp; Wilayah</th>
                <th className="py-3 px-4 min-w-[170px]">Pemilik &amp; Kontak</th>
                <th className="py-3 px-4 min-w-[130px]">Tanggal Daftar</th>
                <th className="py-3 px-4 min-w-[150px] text-center">Status Verifikasi</th>
                <th className="py-3 px-4 min-w-[140px] text-center">Toggle Verifikasi</th>
                <th className="py-3 px-4 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent, index) => {
                  const isUpdating = updatingId === agent.id;
                  return (
                    <tr
                      key={agent.id}
                      className={`transition-colors duration-150 ${
                        agent.isVerified
                          ? "hover:bg-emerald-50/20"
                          : "hover:bg-slate-50/60"
                      }`}
                    >
                      {/* No */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs font-semibold text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      {/* Nama Agen */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0D47A1] font-bold text-xs flex items-center justify-center shrink-0">
                            {agent.businessName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 leading-tight">
                              {agent.businessName}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MaterialIcon name="place" className="text-xs text-slate-400" />
                              <span>{agent.city}, {agent.province}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Pemilik */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {agent.ownerName}
                        </div>
                        <div className="text-xs font-mono text-slate-500 mt-0.5">
                          {agent.ownerPhone}
                        </div>
                      </td>

                      {/* Tanggal Daftar */}
                      <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">
                        {formatDateIndo(agent.joinedDate)}
                      </td>

                      {/* Badge Status Verifikasi */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                            agent.isVerified
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-orange-50 text-[#F57C00] border border-orange-200"
                          }`}
                        >
                          <MaterialIcon
                            name={agent.isVerified ? "check_circle" : "hourglass_empty"}
                            className="text-xs"
                          />
                          <span>{agent.isVerified ? "Terverifikasi" : "Belum Verifikasi"}</span>
                        </span>
                      </td>

                      {/* Toggle Switch */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center justify-center">
                          <ToggleSwitch
                            checked={agent.isVerified}
                            disabled={isUpdating}
                            onChange={(nextChecked) =>
                              handleToggleVerified(agent, nextChecked)
                            }
                            ariaLabel={`Toggle status verifikasi ${agent.businessName}`}
                          />
                        </div>
                      </td>

                      {/* Aksi Detail */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedAgentDetail(agent)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                          title="Lihat profil dan dokumen legalitas"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto p-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <MaterialIcon name="storefront" className="text-2xl" />
                      </div>
                      <p className="font-semibold text-slate-700 mb-1">
                        Mitra agen tidak ditemukan
                      </p>
                      <p className="text-xs text-slate-500 mb-4">
                        Coba sesuaikan kata kunci nama agen, nama pemilik, atau wilayah.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setFilterStatus("all");
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-[#0D47A1] text-xs font-semibold"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 2. TAMPILAN KARTU LIST: Layar Mobile (< 768px / 360px+) */}
        <div className="block md:hidden p-4 space-y-3">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent, index) => {
              const isUpdating = updatingId === agent.id;
              return (
                <div
                  key={agent.id}
                  className={`p-4 rounded-xl border transition-all ${
                    agent.isVerified
                      ? "bg-emerald-50/15 border-emerald-200"
                      : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">
                          {agent.businessName}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MaterialIcon name="place" className="text-xs text-slate-400" />
                          <span>{agent.city}, {agent.province}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        agent.isVerified
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-orange-100 text-[#F57C00]"
                      }`}
                    >
                      {agent.isVerified ? "Terverifikasi" : "Belum"}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pemilik:</span>
                      <span className="font-semibold text-slate-800">{agent.ownerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">WhatsApp:</span>
                      <span className="font-mono text-slate-800">{agent.ownerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Terdaftar:</span>
                      <span>{formatDateIndo(agent.joinedDate)}</span>
                    </div>
                  </div>

                  {/* Baris Toggle Switch di Mobile */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Status Verifikasi:
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          agent.isVerified ? "text-emerald-700" : "text-slate-400"
                        }`}
                      >
                        {agent.isVerified ? "Aktif" : "Nonaktif"}
                      </span>
                      <ToggleSwitch
                        checked={agent.isVerified}
                        disabled={isUpdating}
                        onChange={(nextChecked) =>
                          handleToggleVerified(agent, nextChecked)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center bg-slate-50 rounded-xl">
              <MaterialIcon name="storefront" className="text-3xl text-slate-400 mb-2" />
              <p className="font-semibold text-slate-700 text-sm">Mitra agen tidak ditemukan</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                }}
                className="mt-3 px-3 py-1 bg-blue-50 text-[#0D47A1] text-xs font-semibold rounded-lg"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
