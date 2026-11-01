import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bookingStore } from "@/lib/booking-store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookingCode: string }> }
) {
  const { bookingCode } = await params;

  // 1. Try fetching from Supabase
  try {
    const supabase = await createClient();
    const { data: bData } = await (supabase
      .from("bookings") as any)
      .select("*, travel_agents(*), trip_schedules(*, tour_packages(*)), booking_passengers(*)")
      .eq("booking_code", bookingCode)
      .maybeSingle();

    if (bData) {
      return NextResponse.json({ success: true, booking: bData });
    }
  } catch {
    // Supabase error or connection offline
  }

  // 2. Fallback to in-memory bookingStore
  const memoryBooking = bookingStore.getBookingByCode(bookingCode);
  if (memoryBooking) {
    return NextResponse.json({ success: true, booking: memoryBooking });
  }

  return NextResponse.json(
    { success: false, error: "Booking tidak ditemukan." },
    { status: 404 }
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ bookingCode: string }> }
) {
  const { bookingCode } = await params;

  try {
    const body = await request.json();
    const status = body?.status || "PAID";
    const paidAt = new Date().toISOString();

    // 1. Get current booking to know scheduleId, pax, and previous status
    let scheduleId = "";
    let totalPax = 1;
    let prevStatus = "UNPAID";

    const memoryBooking = bookingStore.getBookingByCode(bookingCode);
    if (memoryBooking) {
      scheduleId = memoryBooking.schedule_id;
      totalPax = memoryBooking.total_pax || 1;
      prevStatus = memoryBooking.payment_status;
    }

    // 2. Update in Supabase
    try {
      const supabase = await createClient();
      const { data: dbBooking } = await (supabase.from("bookings") as any)
        .select("schedule_id, total_pax, payment_status")
        .eq("booking_code", bookingCode)
        .maybeSingle();

      if (dbBooking) {
        if (!scheduleId && dbBooking.schedule_id) scheduleId = dbBooking.schedule_id;
        if (dbBooking.total_pax) totalPax = dbBooking.total_pax;
        if (dbBooking.payment_status) prevStatus = dbBooking.payment_status;
      }

      await (supabase.from("bookings") as any)
        .update({
          payment_status: status,
          paid_at: paidAt,
          updated_at: paidAt,
        })
        .eq("booking_code", bookingCode);

      // Confirm or release quota in Supabase if not already in target status
      if (status === "PAID" && prevStatus !== "PAID" && scheduleId) {
        await (supabase.rpc as any)("confirm_trip_quota", {
          p_schedule_id: scheduleId,
          p_pax: totalPax,
        });
      } else if (
        (status === "EXPIRED" || status === "CANCELLED") &&
        prevStatus === "UNPAID" &&
        scheduleId
      ) {
        await (supabase.rpc as any)("release_trip_quota", {
          p_schedule_id: scheduleId,
          p_pax: totalPax,
        });
      }
    } catch {
      // Ignored if local db is offline or schedule not present
    }

    // 3. Update quota in bookingStore (idempotent check)
    if (status === "PAID" && prevStatus !== "PAID" && scheduleId) {
      bookingStore.confirmQuota(scheduleId, totalPax);
    } else if (
      (status === "EXPIRED" || status === "CANCELLED") &&
      prevStatus === "UNPAID" &&
      scheduleId
    ) {
      bookingStore.releaseQuota(scheduleId, totalPax);
    }

    // 4. Update in bookingStore
    bookingStore.updateBookingStatus(bookingCode, status, paidAt);

    return NextResponse.json({
      success: true,
      message: "Status pembayaran berhasil diperbarui.",
      status,
      paidAt,
      scheduleId,
      totalPax,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status pembayaran." },
      { status: 500 }
    );
  }
}

