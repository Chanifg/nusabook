import { NextResponse } from "next/server";
import { getPaymentGateway } from "@/lib/payment";
import { getNotificationProvider } from "@/lib/notifications";
import { bookingStore } from "@/lib/booking-store";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      scheduleId,
      customerName,
      customerEmail,
      customerWhatsapp,
      pax,
      passengers,
      tripTitle = "Sunrise Lava Tour Merapi & Bunker Kaliadem",
      pricePerPax = 250000,
    } = body;

    // Basic Validation
    if (!scheduleId || !customerName || !customerEmail || !customerWhatsapp || !pax || !Array.isArray(passengers)) {
      return NextResponse.json(
        { error: "Semua data pemesan dan daftar penumpang wajib diisi." },
        { status: 400 }
      );
    }

    if (passengers.length !== Number(pax)) {
      return NextResponse.json(
        { error: "Jumlah data peserta harus sesuai dengan jumlah pax yang dipilih." },
        { status: 400 }
      );
    }

    const numPax = Number(pax);

    // 1. Eksekusi RPC reserve_trip_quota (atomic pessimistic lock)
    let quotaReserved = false;

    try {
      const supabase = await createClient();
      const { data, error } = await (supabase.rpc as any)("reserve_trip_quota", {
        p_schedule_id: scheduleId,
        p_pax: numPax,
      });

      if (!error && typeof data === "boolean") {
        quotaReserved = data;
      } else {
        // Fallback to in-memory atomic quota manager if Supabase is in local/mock mode
        quotaReserved = bookingStore.reserveQuota(scheduleId, numPax);
      }
    } catch {
      quotaReserved = bookingStore.reserveQuota(scheduleId, numPax);
    }

    // 2. Jika bernilai false, kembalikan HTTP 400 dengan pesan baku antislop
    if (!quotaReserved) {
      return NextResponse.json(
        { error: "Maaf, kuota kursi untuk jadwal ini sudah habis." },
        { status: 400 }
      );
    }

    // Generate unique Booking Code: NSB-YYYYMMDD-XXXX
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const bookingCode = `NSB-${dateStr}-${randomSuffix}`;
    const bookingId = crypto.randomUUID();

    const totalAmount = numPax * pricePerPax;
    const platformFee = Math.round(totalAmount * 0.02); // 2% fee
    const agentPayoutAmount = totalAmount - platformFee;

    // 4. Panggil getPaymentGateway().createInvoice(...) (TTL 20 menit)
    const paymentGateway = getPaymentGateway();
    const invoice = await paymentGateway.createInvoice({
      bookingCode,
      amount: totalAmount,
      customerName,
      customerEmail,
      customerPhone: customerWhatsapp,
      tripTitle,
      expiryMinutes: 20,
    });

    const bookingRecord = {
      id: bookingId,
      booking_code: bookingCode,
      agent_id: "11111111-1111-1111-1111-111111111111",
      schedule_id: scheduleId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_whatsapp: customerWhatsapp,
      total_pax: numPax,
      price_per_pax: pricePerPax,
      total_amount: totalAmount,
      platform_fee: platformFee,
      agent_payout_amount: agentPayoutAmount,
      payment_status: "UNPAID" as const,
      payment_method: invoice.paymentMethod,
      payment_reference: invoice.invoiceId,
      payment_expired_at: invoice.expiresAt,
      paid_at: null,
      is_manual_entry: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tripTitle,
      paymentInstructions: invoice.instructions,
      qrCodeUrl: invoice.qrCodeUrl,
      virtualAccountNumber: invoice.virtualAccountNumber,
      passengers: passengers.map((p: any, idx: number) => ({
        id: crypto.randomUUID(),
        booking_id: bookingId,
        full_name: p.fullName,
        id_card_number: p.idCardNumber || null,
        gender: p.gender || null,
        phone_number: p.phoneNumber || null,
        emergency_contact: p.emergencyContact || null,
        special_notes: p.specialNotes || null,
        is_checked_in: false,
        checked_in_at: null,
        created_at: new Date().toISOString(),
      })),
    };

    // 3. Simpan ke database / store
    try {
      const supabase = await createClient();
      await (supabase.from("bookings") as any).insert({
        id: bookingRecord.id,
        booking_code: bookingRecord.booking_code,
        agent_id: bookingRecord.agent_id,
        schedule_id: bookingRecord.schedule_id,
        customer_name: bookingRecord.customer_name,
        customer_email: bookingRecord.customer_email,
        customer_whatsapp: bookingRecord.customer_whatsapp,
        total_pax: bookingRecord.total_pax,
        price_per_pax: bookingRecord.price_per_pax,
        total_amount: bookingRecord.total_amount,
        platform_fee: bookingRecord.platform_fee,
        agent_payout_amount: bookingRecord.agent_payout_amount,
        payment_status: bookingRecord.payment_status,
        payment_method: bookingRecord.payment_method,
        payment_reference: bookingRecord.payment_reference,
        payment_expired_at: bookingRecord.payment_expired_at,
        is_manual_entry: false,
      });

      if (bookingRecord.passengers.length > 0) {
        await (supabase.from("booking_passengers") as any).insert(bookingRecord.passengers);
      }
    } catch {
      // Fallback caught silently, in-memory store keeps record
    }

    bookingStore.saveBooking(bookingRecord);

    // 5. Kirim notifikasi pembuatan pesanan via getNotificationProvider()
    const notificationProvider = getNotificationProvider();
    await notificationProvider.sendBookingCreated({
      recipientPhone: customerWhatsapp,
      recipientEmail: customerEmail,
      customerName,
      bookingCode,
      tripTitle,
      pax: numPax,
      totalAmount,
      paymentUrl: invoice.paymentUrl,
      expiresAt: invoice.expiresAt,
    });

    return NextResponse.json(
      {
        success: true,
        bookingCode,
        bookingId,
        invoice,
        redirectUrl: `/bookings/${bookingCode}/payment`,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan internal saat memproses pesanan." },
      { status: 500 }
    );
  }
}
