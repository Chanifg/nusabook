"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Users, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  departureDate: string;
  onDateChange: (date: string) => void;
  paxCount: number;
  onPaxChange: (pax: number) => void;
  onReset: () => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  departureDate,
  onDateChange,
  paxCount,
  onPaxChange,
  onReset,
}: SearchBarProps) {
  const hasActiveFilter = searchQuery || selectedCity || departureDate || paxCount > 1;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-lg p-4 md:p-6 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Query Input */}
        <div className="md:col-span-4 relative">
          <label htmlFor="search-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Cari Paket / Wisata
          </label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Contoh: Lava Tour, Bromo, Sunrise..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition"
            />
          </div>
        </div>

        {/* City Input / Select */}
        <div className="md:col-span-3 relative">
          <label htmlFor="city-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Kota Tujuan
          </label>
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              id="city-input"
              type="text"
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Semua Kota"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition"
            />
          </div>
        </div>

        {/* Departure Date */}
        <div className="md:col-span-3 relative">
          <label htmlFor="date-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Tanggal Keberangkatan
          </label>
          <div className="relative flex items-center">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="date-input"
              type="date"
              value={departureDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition"
            />
          </div>
        </div>

        {/* Pax Counter & Clear */}
        <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2 pt-1 md:pt-6">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Users className="w-4 h-4 text-slate-500" />
            <button
              type="button"
              onClick={() => onPaxChange(Math.max(1, paxCount - 1))}
              className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm transition"
              aria-label="Kurangi pax"
            >
              -
            </button>
            <span className="text-sm font-bold text-slate-900 min-w-[20px] text-center">{paxCount}</span>
            <button
              type="button"
              onClick={() => onPaxChange(paxCount + 1)}
              className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm transition"
              aria-label="Tambah pax"
            >
              +
            </button>
          </div>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={onReset}
              className="p-2.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              title="Reset Filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
