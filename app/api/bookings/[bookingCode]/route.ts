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

    // 1. Update in Supabase
    try {
      const supabase = await createClient();
      await (supabase.from("bookings") as any)
        .update({
          payment_status: status,
          paid_at: paidAt,
          updated_at: paidAt,
        })
        .eq("booking_code", bookingCode);
    } catch {
      // Ignored if local db is offline
    }

    // 2. Update in bookingStore
    bookingStore.updateBookingStatus(bookingCode, status, paidAt);

    return NextResponse.json({
      success: true,
      message: "Status pembayaran berhasil diperbarui.",
      status,
      paidAt,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status pembayaran." },
      { status: 500 }
    );
  }
}

