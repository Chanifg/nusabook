"use client";

import { useState } from "react";
import { Filter, RotateCcw, X, SlidersHorizontal } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  availableOnly: boolean;
  onAvailableOnlyChange: (availableOnly: boolean) => void;
  onResetFilters: () => void;
}

export function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  maxPrice,
  onMaxPriceChange,
  availableOnly,
  onAvailableOnlyChange,
  onResetFilters,
}: FilterSidebarProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-700" />
          Filter Paket Wisata
        </h3>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs text-slate-500 hover:text-brand-700 flex items-center gap-1 font-medium transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Kategori Trip
        </label>
        <div className="space-y-2">
          {[
            { id: "", label: "Semua Kategori" },
            { id: "open_trip", label: "Open Trip (Gabungan)" },
            { id: "private_trip", label: "Private Trip (Privat)" },
          ].map((cat) => (
            <label
              key={cat.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition ${
                selectedCategory === cat.id
                  ? "bg-brand-50 border-brand-200 text-brand-900 font-semibold"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="trip-category"
                  checked={selectedCategory === cat.id}
                  onChange={() => onCategoryChange(cat.id)}
                  className="w-4 h-4 text-brand-700 focus:ring-brand-700 border-slate-300"
                />
                <span>{cat.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Maksimal Harga
          </label>
          <span className="text-xs font-bold text-brand-700">
            {maxPrice >= 5000000 ? "Tanpa Batas" : formatRupiah(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={100000}
          max={5000000}
          step={100000}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-brand-700 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
          <span>Rp 100rb</span>
          <span>Rp 2,5jt</span>
          <span>Rp 5jt+</span>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="pt-4 border-t border-slate-200">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-bold text-slate-700">Hanya Kuota Tersedia</span>
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => onAvailableOnlyChange(e.target.checked)}
            className="w-4 h-4 text-brand-700 rounded border-slate-300 focus:ring-brand-700 cursor-pointer"
          />
        </label>
        <p className="text-[11px] text-slate-500 mt-1">Sembunyikan paket yang statusnya sudah Kuota Penuh</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden mb-4">
        <button
          type="button"
          onClick={() => setIsOpenMobile(true)}
          className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 flex items-center justify-center gap-2 shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-700" />
          Filter & Kategori Paket
        </button>
      </div>

      {/* Mobile Modal Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end md:hidden">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 text-lg">Filter Paket</h3>
                <button
                  type="button"
                  onClick={() => setIsOpenMobile(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
            </div>
            <button
              type="button"
              onClick={() => setIsOpenMobile(false)}
              className="w-full mt-6 py-3 bg-brand-700 text-white rounded-xl font-bold text-sm"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit sticky top-6">
        {filterContent}
      </aside>
    </>
  );
}
