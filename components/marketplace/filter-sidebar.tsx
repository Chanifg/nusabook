"use client";

import { useState } from "react";
import { SlidersHorizontal, RotateCcw, ShieldCheck, Flame, Star, MessageSquare, HelpCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  availableOnly: boolean;
  onAvailableOnlyChange: (availableOnly: boolean) => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (verified: boolean) => void;
  selectedDuration: string;
  onDurationChange: (duration: string) => void;
  onResetFilters: () => void;
}

export function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  maxPrice,
  onMaxPriceChange,
  availableOnly,
  onAvailableOnlyChange,
  verifiedOnly,
  onVerifiedOnlyChange,
  selectedDuration,
  onDurationChange,
  onResetFilters,
}: FilterSidebarProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-700" />
          <span className="font-bold text-slate-900 text-sm">Filter Cermat</span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-semibold text-accent-600 hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Semua
        </button>
      </div>

      {/* Verified Switch Toggle */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-bold text-xs text-brand-700 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-500" />
            Mitra Terverifikasi
          </span>
          <span className="text-[11px] text-slate-500 font-medium">NIB & TDUP Resmi Saja</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-700" />
        </label>
      </div>

      {/* Status Kuota Kursi */}
      <div className="space-y-2.5">
        <span className="font-bold text-xs text-slate-900 block">Status Kuota Kursi</span>
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => onAvailableOnlyChange(e.target.checked)}
              className="w-4 h-4 rounded text-brand-700 focus:ring-brand-700"
            />
            <span>Tersedia Instan (Auto-Lock)</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-700 focus:ring-brand-700" />
            <span>Pasti Berangkat (Guaranteed)</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer text-accent-600 font-bold">
            <input type="checkbox" className="w-4 h-4 rounded text-brand-700 focus:ring-brand-700" />
            <span className="flex items-center gap-1">
              Sisa Kursi Menipis (≤ 3 Kursi)
              <Flame className="w-3.5 h-3.5 text-accent-500 animate-pulse" />
            </span>
          </label>
        </div>
      </div>

      {/* Budget Range Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-900">Rentang Anggaran</span>
          <span className="text-brand-700 font-extrabold">{formatRupiah(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={200000}
          max={5000000}
          step={100000}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-brand-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>Rp 200rb</span>
          <span>Rp 5.0jt+</span>
        </div>
      </div>

      {/* Durasi Perjalanan Pills */}
      <div className="space-y-2.5">
        <span className="font-bold text-xs text-slate-900 block">Durasi Perjalanan</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "", label: "Semua Durasi" },
            { id: "1d", label: "1 Hari / Midnight" },
            { id: "2d1n", label: "2D 1N" },
            { id: "3d2n", label: "3D 2N" },
          ].map((dur) => {
            const isActive = selectedDuration === dur.id;
            return (
              <button
                key={dur.id}
                type="button"
                onClick={() => onDurationChange(dur.id)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg text-center transition ${
                  isActive
                    ? "bg-brand-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {dur.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fasilitas Termasuk */}
      <div className="space-y-2.5">
        <span className="font-bold text-xs text-slate-900 block">Fasilitas Termasuk</span>
        <div className="space-y-2 text-xs text-slate-600">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-700" />
            <span>Armada Jeep / Boat Berizin</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-700" />
            <span>Tiket TNBTS / TN Komodo</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded text-brand-700" />
            <span>Makan & Air Mineral</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded text-brand-700" />
            <span>Dokumentasi Drone & DSLR</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded text-brand-700" />
            <span>Asuransi Jasa Raharja</span>
          </label>
        </div>
      </div>

      {/* Rating Operator */}
      <div className="space-y-2">
        <span className="font-bold text-xs text-slate-900 block">Rating Operator</span>
        <div className="space-y-1.5 text-xs">
          <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>4.8 ke atas (Rekomendasi)</span>
            </div>
            <input type="radio" name="rating-filter" defaultChecked className="text-brand-700" />
          </label>
          <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>4.5 ke atas</span>
            </div>
            <input type="radio" name="rating-filter" className="text-brand-700" />
          </label>
        </div>
      </div>

      {/* Help Widget */}
      <div className="bg-brand-50/70 border border-brand-100 rounded-xl p-4 text-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-brand-800 font-bold text-xs">
          <HelpCircle className="w-4 h-4 text-brand-700" />
          <span>Butuh Custom Group?</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
          Konsultasikan paket corporate gathering, honeymoon, atau charter kapal khusus melalui konsultan trip Nusabook.
        </p>
        <button
          type="button"
          className="w-full py-2 px-3 text-xs font-bold text-brand-800 bg-white border border-brand-200 rounded-lg hover:bg-brand-100 transition flex items-center justify-center gap-1.5 shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5 text-brand-700" /> Hubungi Konsultan
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden mb-4 w-full">
        <button
          type="button"
          onClick={() => setIsOpenMobile(true)}
          className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2 shadow-xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-700" />
          Filter & Kategori Paket Wisata
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end md:hidden">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-2 border-b">
                <h3 className="font-bold text-slate-900 text-base">Filter Paket Wisata</h3>
                <button
                  type="button"
                  onClick={() => setIsOpenMobile(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>
              {filterContent}
            </div>
            <button
              type="button"
              onClick={() => setIsOpenMobile(false)}
              className="w-full mt-6 py-3 bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 shrink-0 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs h-fit sticky top-20">
        {filterContent}
      </aside>
    </>
  );
}

