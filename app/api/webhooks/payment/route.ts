import { NextResponse } from "next/server";
import { getPaymentGateway } from "@/lib/payment";
import { getNotificationProvider } from "@/lib/notifications";
import { bookingStore } from "@/lib/booking-store";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const headersObj: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headersObj[key.toLowerCase()] = value;
    });

    const gateway = getPaymentGateway();
    const verification = await gateway.verifyCallback(payload, headersObj);

    // 1. Verifikasi Signature / Hash Key
    if (!verification.isValid) {
      return NextResponse.json(
        { error: "Invalid cryptographic signature" },
        { status: 401 }
      );
    }

    const bookingCode = verification.bookingCode;
    if (!bookingCode) {
      return NextResponse.json(
        { error: "Booking code missing in callback" },
        { status: 400 }
      );
    }

    const booking = bookingStore.getBookingByCode(bookingCode);
    const scheduleId = booking?.schedule_id || "33333333-3333-3333-3333-333333333333";
    const totalPax = booking?.total_pax || 1;

    // 2. Cek Status Transaksi
    if (verification.status === "PAID") {
      const now = new Date().toISOString();

      // a. UPDATE bookings SET payment_status = 'PAID', paid_at = NOW()
      bookingStore.updateBookingStatus(bookingCode, "PAID", now);

      try {
        const supabase = await createClient();
        await (supabase.from("bookings") as any)
          .update({ payment_status: "PAID", paid_at: now })
          .eq("booking_code", bookingCode);

        // b. Panggil SQL confirm_trip_quota(schedule_id, pax)
        await (supabase.rpc as any)("confirm_trip_quota", {
          p_schedule_id: scheduleId,
          p_pax: totalPax,
        });
      } catch {
        // In-memory fallback
        bookingStore.confirmQuota(scheduleId, totalPax);
      }
      bookingStore.confirmQuota(scheduleId, totalPax);

      // c. Kirim WhatsApp e-ticket via NotificationProvider
      const notificationProvider = getNotificationProvider();
      await notificationProvider.sendPaymentSuccess({
        recipientPhone: booking?.customer_whatsapp || "081234567890",
        recipientEmail: booking?.customer_email,
        customerName: booking?.customer_name || "Wisatawan Nusabook",
        bookingCode,
        tripTitle: booking?.tripTitle || "Sunrise Lava Tour Merapi",
        eTicketUrl: `https://nusabook.id/bookings/${bookingCode}`,
      });

      return NextResponse.json({
        success: true,
        message: "Payment settled and quota confirmed",
        bookingCode,
        status: "PAID",
      });
    } else if (verification.status === "EXPIRED") {
      // a. UPDATE bookings SET payment_status = 'EXPIRED'
      bookingStore.updateBookingStatus(bookingCode, "EXPIRED");

      try {
        const supabase = await createClient();
        await (supabase.from("bookings") as any)
          .update({ payment_status: "EXPIRED" })
          .eq("booking_code", bookingCode);

        // b. Panggil SQL release_trip_quota(schedule_id, pax)
        await (supabase.rpc as any)("release_trip_quota", {
          p_schedule_id: scheduleId,
          p_pax: totalPax,
        });
      } catch {
        bookingStore.releaseQuota(scheduleId, totalPax);
      }
      bookingStore.releaseQuota(scheduleId, totalPax);

      return NextResponse.json({
        success: true,
        message: "Booking expired and quota released",
        bookingCode,
        status: "EXPIRED",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed with status " + verification.status,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process webhook" },
      { status: 500 }
    );
  }
}
