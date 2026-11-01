"use client";

import { Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuotaCounterProps {
  totalQuota: number;
  availableQuota: number;
  className?: string;
}

export function QuotaCounter({
  totalQuota,
  availableQuota,
  className,
}: QuotaCounterProps) {
  const percentage = Math.max(
    0,
    Math.min(100, Math.round((availableQuota / Math.max(1, totalQuota)) * 100))
  );

  const isSoldOut = availableQuota <= 0;
  const isLimited = availableQuota > 0 && availableQuota <= 3;

  return (
    <div
      className={cn(
        "rounded-xl p-4 border transition-all",
        isSoldOut
          ? "bg-rose-50 border-rose-200 text-rose-800"
          : isLimited
          ? "bg-amber-50 border-amber-200 text-amber-900"
          : "bg-emerald-50 border-emerald-200 text-emerald-900",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 font-medium text-sm">
          {isSoldOut ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : isLimited ? (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>
            {isSoldOut
              ? "Maaf, kuota kursi untuk jadwal ini sudah habis."
              : isLimited
              ? `Tersisa ${availableQuota} kursi lagi!`
              : `Kuota Tersedia: ${availableQuota} dari ${totalQuota} kursi`}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs opacity-75 shrink-0">
          <Users className="w-3.5 h-3.5" />
          <span>{percentage}%</span>
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isSoldOut
              ? "bg-rose-500 w-full"
              : isLimited
              ? "bg-amber-500"
              : "bg-emerald-600"
          )}
          style={{ width: isSoldOut ? "100%" : `${percentage}%` }}
        />
      </div>
    </div>
  );
}
