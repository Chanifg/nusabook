"use client";

import { Search, MapPin, Calendar, Users, Compass, Flame, Ship, Waves, Mountain } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  departureDate: string;
  onDateChange: (date: string) => void;
  paxCount: number;
  onPaxChange: (pax: number) => void;
  selectedTripType: string;
  onTripTypeChange: (type: string) => void;
  onSearchSubmit: () => void;
  onReset: () => void;
}

const TRENDING_SEARCHES = [
  { label: "🔥 Bromo Sunrise Midnight", query: "Bromo" },
  { label: "⛵ Phinisi Komodo 3D2N", query: "Komodo" },
  { label: "🤿 Snorkeling Menjangan", query: "Menjangan" },
  { label: "🌋 Kawah Ijen Blue Fire", query: "Ijen" },
  { label: "🌊 Karimunjawa Bahari", query: "Karimunjawa" },
];

export function SearchBar({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  departureDate,
  onDateChange,
  paxCount,
  onPaxChange,
  selectedTripType,
  onTripTypeChange,
  onSearchSubmit,
  onReset,
}: SearchBarProps) {
  return (
    <div className="w-full bg-white text-slate-900 rounded-2xl shadow-xl p-5 lg:p-6 border border-slate-200">
      {/* Trip Type Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 border-b border-slate-100 scrollbar-none">
        {[
          { id: "", label: "Semua Tipe", icon: Compass },
          { id: "open_trip", label: "Open Trip (Gabungan)", icon: Users },
          { id: "private_trip", label: "Private Trip (Eksklusif)", icon: Mountain },
          { id: "family", label: "Family & Outing", icon: Ship },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTripType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTripTypeChange(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-brand-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
        {/* Destinasi Input */}
        <div className="lg:col-span-4 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-700" />
            Destinasi Impian
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Labuan Bajo, Bromo, Karimunjawa..."
              className="w-full bg-slate-50 text-slate-900 text-sm font-medium rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition"
            />
            <Search className="absolute right-3.5 top-3 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Meeting Point Dropdown */}
        <div className="lg:col-span-3 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Ship className="w-3.5 h-3.5 text-brand-700" />
            Meeting Point
          </label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 text-sm font-medium rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition appearance-none cursor-pointer"
          >
            <option value="">Semua Kota Asal</option>
            <option value="Yogyakarta">Yogyakarta / Wonosobo</option>
            <option value="Malang">Malang / Surabaya</option>
            <option value="Banyuwangi">Banyuwangi</option>
            <option value="Labuan Bajo">Labuan Bajo</option>
            <option value="Bali">Bali</option>
            <option value="Magelang">Magelang</option>
          </select>
        </div>

        {/* Tanggal Keberangkatan */}
        <div className="lg:col-span-2 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-brand-700" />
            Jadwal Trip
          </label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 text-xs font-medium rounded-xl px-3 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition"
          />
        </div>

        {/* Pax Counter */}
        <div className="lg:col-span-1 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-brand-700" />
            Pax
          </label>
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5">
            <button
              type="button"
              onClick={() => onPaxChange(Math.max(1, paxCount - 1))}
              className="text-brand-700 hover:bg-slate-200 w-6 h-6 rounded-md font-bold text-sm flex items-center justify-center transition"
            >
              -
            </button>
            <span className="text-xs font-bold text-slate-900">{paxCount}</span>
            <button
              type="button"
              onClick={() => onPaxChange(paxCount + 1)}
              className="text-brand-700 hover:bg-slate-200 w-6 h-6 rounded-md font-bold text-sm flex items-center justify-center transition"
            >
              +
            </button>
          </div>
        </div>

        {/* CTA Button */}
        <div className="lg:col-span-2">
          <button
            type="button"
            onClick={onSearchSubmit}
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold text-xs rounded-xl px-4 py-3 flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Cari Kuota</span>
          </button>
        </div>
      </div>

      {/* Trending Quick Filters */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-400 mr-1">Tren Pencarian:</span>
        {TRENDING_SEARCHES.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onSearchChange(item.query)}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

