"use client";

import { MapPin } from "lucide-react";

interface CityChipsProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

const POPULAR_CITIES = [
  "Semua",
  "Yogyakarta",
  "Sleman",
  "Magelang",
  "Malang",
  "Banyuwangi",
  "Bali",
  "Labuan Bajo",
];

export function CityChips({ selectedCity, onSelectCity }: CityChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
        <MapPin className="w-3.5 h-3.5" /> Populer:
      </span>
      {POPULAR_CITIES.map((city) => {
        const isAll = city === "Semua";
        const isActive = isAll ? selectedCity === "" : selectedCity.toLowerCase() === city.toLowerCase();

        return (
          <button
            key={city}
            type="button"
            onClick={() => onSelectCity(isAll ? "" : city)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? "bg-brand-700 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {city}
          </button>
        );
      })}
    </div>
  );
}
