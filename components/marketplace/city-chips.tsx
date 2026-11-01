"use client";

import { MaterialIcon } from "@/components/ui/icon";

interface CityChipsProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const POPULAR_CITIES = [
  "Semua Destinasi",
  "Magelang",
  "Bromo",
  "Malang",
  "Banyuwangi",
  "Dieng",
  "Yogyakarta",
  "Labuan Bajo",
];

export function CityChips({ selectedCity, onSelectCity }: CityChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
        <MaterialIcon name="location_on" className="text-[16px] text-primary" />
        Kota Populer:
      </span>
      {POPULAR_CITIES.map((city) => {
        const isAll = city === "Semua Destinasi" || city === "Semua";
        const isActive = isAll
          ? !selectedCity || selectedCity === "all" || selectedCity === ""
          : selectedCity.toLowerCase() === city.toLowerCase();

        return (
          <button
            key={city}
            type="button"
            onClick={() => onSelectCity(isAll ? "all" : city)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs flex items-center gap-1 ${
              isActive
                ? "bg-primary text-on-primary shadow-sm font-bold"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <span>{city}</span>
          </button>
        );
      })}
    </div>
  );
}
