"use client";

import Link from "next/link";
import { MapPin, Calendar, Clock, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export interface PackageCardData {
  id: string;
  title: string;
  slug: string;
  category: "open_trip" | "private_trip";
  durationDays: number;
  durationNights: number;
  destinationCity: string;
  thumbnailUrl?: string | null;
  agentName: string;
  agentSlug: string;
  isVerified: boolean;
  nextDepartureDate: string;
  pricePerPax: number;
  totalQuota: number;
  availableQuota: number;
}

interface PackageCardProps {
  packageData: PackageCardData;
}

export function PackageCard({ packageData }: PackageCardProps) {
  const isSoldOut = packageData.availableQuota <= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full group">
      {/* Header Banner / Image Container */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        {packageData.thumbnailUrl ? (
          <img
            src={packageData.thumbnailUrl}
            alt={packageData.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-700/80 to-brand-900/90 p-4 flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-white">
                {packageData.category === "open_trip" ? "Open Trip" : "Private Trip"}
              </span>
              {packageData.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-500 text-white text-[11px] font-bold shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-brand-100 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-accent-500" />
              {packageData.destinationCity}
            </div>
          </div>
        )}

        {/* Badges on Image */}
        {packageData.thumbnailUrl && (
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <span className="px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-white">
              {packageData.category === "open_trip" ? "Open Trip" : "Private Trip"}
            </span>
            {packageData.isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-500 text-white text-[11px] font-bold shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Agent info */}
          <div className="text-xs text-slate-500 font-medium mb-1 truncate">
            Mitra Agen: <span className="font-semibold text-slate-700">{packageData.agentName}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-700 transition-colors">
            {packageData.title}
          </h3>

          {/* Meta Details */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span className="truncate">{packageData.destinationCity}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span>
                {packageData.durationDays}D / {packageData.durationNights}N
              </span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <Calendar className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span className="truncate">Keberangkatan: {packageData.nextDepartureDate}</span>
            </div>
          </div>
        </div>

        {/* Footer Price & Quota CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="mb-1">
              {isSoldOut ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                  <AlertCircle className="w-3 h-3" /> Kuota Penuh
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  Tersisa {packageData.availableQuota} kursi
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Mulai dari</p>
            <p className="text-xl font-extrabold text-brand-700">
              {formatRupiah(packageData.pricePerPax)}
              <span className="text-[11px] text-slate-500 font-normal"> / pax</span>
            </p>
          </div>

          <Link
            href={`/${packageData.agentSlug}/packages/${packageData.slug}`}
            className={`py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
              isSoldOut
                ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                : "bg-brand-700 hover:bg-brand-900 text-white shadow-sm"
            }`}
          >
            {isSoldOut ? "Lihat Detail" : "Pesan Trip"}
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
