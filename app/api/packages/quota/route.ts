import { NextResponse } from "next/server";
import { CATALOG_PACKAGES } from "@/lib/catalog-data";
import { bookingStore } from "@/lib/booking-store";

export async function GET() {
  const packageQuotas: Record<
    string,
    {
      totalQuota: number;
      availableQuota: number;
      bookedQuota: number;
      reservedQuota: number;
      isSoldOut: boolean;
      quotaLabel: string;
      quotaStatus: "urgent" | "safe" | "warning";
      occupancyPercent: number;
    }
  > = {};

  const scheduleQuotas: Record<
    string,
    {
      totalQuota: number;
      availableSeats: number;
      bookedQuota: number;
      reservedQuota: number;
      isSoldOut: boolean;
      statusBadge: string;
    }
  > = {};

  for (const pkg of CATALOG_PACKAGES) {
    const primarySchedule = pkg.schedules[0];
    if (primarySchedule) {
      const q = bookingStore.getScheduleQuota(primarySchedule.id);
      const available = Math.max(0, q.total - q.reserved - q.booked);
      const isSoldOut = available <= 0;
      const occupancy = Math.min(
        100,
        Math.round(((q.total - available) / Math.max(1, q.total)) * 100)
      );

      packageQuotas[pkg.slug] = {
        totalQuota: q.total,
        availableQuota: available,
        bookedQuota: q.booked,
        reservedQuota: q.reserved,
        isSoldOut,
        quotaLabel: isSoldOut
          ? "Kuota Penuh"
          : available <= 3
          ? `Sisa ${available} Kursi!`
          : `Tersisa ${available} Kursi Tersedia`,
        quotaStatus: isSoldOut ? "warning" : available <= 3 ? "urgent" : "safe",
        occupancyPercent: occupancy,
      };
    }

    for (const sch of pkg.schedules) {
      const q = bookingStore.getScheduleQuota(sch.id);
      const available = Math.max(0, q.total - q.reserved - q.booked);
      const isSoldOut = available <= 0;
      scheduleQuotas[sch.id] = {
        totalQuota: q.total,
        availableSeats: available,
        bookedQuota: q.booked,
        reservedQuota: q.reserved,
        isSoldOut,
        statusBadge: isSoldOut
          ? "Penuh (Sold Out)"
          : available <= 3
          ? `Sisa ${available} Kursi!`
          : `Tersedia ${available} Kursi`,
      };
    }
  }

  return NextResponse.json({
    success: true,
    packages: packageQuotas,
    schedules: scheduleQuotas,
  });
}
