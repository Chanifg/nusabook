import { NextResponse } from "next/server";
import { bookingStore } from "@/lib/booking-store";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const now = new Date();
    const allBookings = bookingStore.getAllBookings();

    const expiredList: string[] = [];

    // 1. Process in-memory store
    for (const booking of allBookings) {
      if (booking.payment_status === "UNPAID") {
        const expiryDate = new Date(booking.payment_expired_at);
        if (now > expiryDate) {
          bookingStore.updateBookingStatus(booking.booking_code, "EXPIRED");
          bookingStore.releaseQuota(booking.schedule_id, booking.total_pax);
          expiredList.push(booking.booking_code);
        }
      }
    }

    // 2. Process database if Supabase client available
    try {
      const supabase = await createClient();
      const { data: expiredBookings } = await (supabase.from("bookings") as any)
        .select("id, booking_code, schedule_id, total_pax")
        .eq("payment_status", "UNPAID")
        .lt("payment_expired_at", now.toISOString());

      if (expiredBookings && expiredBookings.length > 0) {
        for (const item of expiredBookings) {
          await (supabase.from("bookings") as any)
            .update({ payment_status: "EXPIRED" })
            .eq("id", item.id);

          await (supabase.rpc as any)("release_trip_quota", {
            p_schedule_id: item.schedule_id,
            p_pax: item.total_pax,
          });

          if (!expiredList.includes(item.booking_code)) {
            expiredList.push(item.booking_code);
          }
        }
      }
    } catch {
      // Handled silently
    }

    return NextResponse.json({
      success: true,
      expiredCount: expiredList.length,
      expiredBookings: expiredList,
      timestamp: now.toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to expire bookings" },
      { status: 500 }
    );
  }
}
