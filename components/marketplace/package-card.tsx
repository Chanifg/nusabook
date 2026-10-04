"use client";

import Link from "next/link";
import { MapPin, Clock, Star, Flame, ShieldCheck, ArrowRight, Car, Ticket, Calendar } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export interface PackageCardData {
  id: string;
  title: string;
  slug: string;
  category: "open_trip" | "private_trip" | "liveaboard" | "midnight";
  durationDays: number;
  durationNights: number;
  destinationCity: string;
  locationDetails?: string;
  thumbnailUrl?: string | null;
  agentName: string;
  agentSlug: string;
  isVerified: boolean;
  nextDepartureDate: string;
  originalPrice?: number;
  pricePerPax: number;
  totalQuota: number;
  availableQuota: number;
  rating?: number;
  reviewCount?: number;
  vehicleType?: string;
}

interface PackageCardProps {
  packageData: PackageCardData;
}

export function PackageCard({ packageData }: PackageCardProps) {
  const isSoldOut = packageData.availableQuota <= 0;
  const isUrgent = packageData.availableQuota > 0 && packageData.availableQuota <= 3;
  const rating = packageData.rating || 4.9;
  const reviewCount = packageData.reviewCount || 184;

  const occupancyPercent = Math.min(
    100,
    Math.round(((packageData.totalQuota - packageData.availableQuota) / packageData.totalQuota) * 100)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Thumbnail Image Header */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          {packageData.thumbnailUrl ? (
            <img
              src={packageData.thumbnailUrl}
              alt={packageData.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 p-4 flex flex-col justify-between text-white">
              <div className="flex flex-wrap gap-1.5 z-10">
                {packageData.isVerified && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-700/90 text-white text-[11px] font-bold backdrop-blur-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-accent-400" />
                    Mitra Terverifikasi
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-xs">
                  {packageData.category === "open_trip"
                    ? "Open Trip"
                    : packageData.category === "private_trip"
                    ? "Private Trip"
                    : packageData.category === "liveaboard"
                    ? "Liveaboard"
                    : "Midnight Tour"}
                </span>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Badges on Thumbnail */}
          {packageData.thumbnailUrl && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              {packageData.isVerified && (
                <span className="px-2 py-0.5 rounded-full bg-brand-700/90 text-white text-[11px] font-bold backdrop-blur-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-accent-400" />
                  Mitra Terverifikasi
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-white/90 text-slate-900 text-[11px] font-bold backdrop-blur-xs">
                {packageData.category === "open_trip" ? "Open Trip" : "Private Trip"}
              </span>
            </div>
          )}

          {/* Bottom Location & Rating Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-1 text-xs font-semibold text-white/90">
              <MapPin className="w-3.5 h-3.5 text-accent-400" />
              <span className="truncate">{packageData.locationDetails || packageData.destinationCity}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs text-xs font-bold text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{rating}</span>
              <span className="text-white/60 font-normal">({reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          <div className="text-xs font-bold text-brand-700 truncate">{packageData.agentName}</div>
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-brand-700 transition-colors">
            {packageData.title}
          </h3>

          {/* Quota Progress / Urgency Badge */}
          {isSoldOut ? (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold flex items-center justify-between">
              <span>Kuota Penuh (Sold Out)</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">Closed</span>
            </div>
          ) : isUrgent ? (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-700 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-accent-500 animate-pulse" />
                  Tersisa {packageData.availableQuota} Kursi Lagi!
                </span>
                <span className="text-[10px] text-amber-600 font-semibold">Pessimistic Hold</span>
              </div>
              <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-accent-500 h-full rounded-full transition-all duration-500" style={{ width: `${occupancyPercent}%` }} />
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Tersisa {packageData.availableQuota} Kursi (Kapasitas {packageData.totalQuota} Pax)
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">Auto-Lock</span>
              </div>
              <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${occupancyPercent}%` }} />
              </div>
            </div>
          )}

          {/* Excursion Meta Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span>
                {packageData.durationDays}D / {packageData.durationNights}N
              </span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Car className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span className="truncate">{packageData.vehicleType || "Transport Berizin"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span>Tiket Masuk Termasuk</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span className="truncate">{packageData.nextDepartureDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Price & CTA */}
      <div className="p-4 pt-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        <div>
          {packageData.originalPrice && (
            <span className="text-[11px] text-slate-400 line-through block font-medium">
              {formatRupiah(packageData.originalPrice)}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-brand-700">
              {formatRupiah(packageData.pricePerPax)}
            </span>
            <span className="text-[11px] text-slate-500 font-normal">/pax</span>
          </div>
        </div>

        <Link
          href={`/${packageData.agentSlug}/packages/${packageData.slug}`}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition shadow-xs ${
            isSoldOut
              ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
              : "bg-accent-500 hover:bg-accent-600 text-white"
          }`}
        >
          <span>{isSoldOut ? "Lihat Detail" : "Pesan Sekarang"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

