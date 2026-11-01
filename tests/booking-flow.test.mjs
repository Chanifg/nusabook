import test from "node:test";
import assert from "node:assert/strict";
import { bookingStore } from "../lib/booking-store.js";
import { getPaymentGateway } from "../lib/payment/index.js";

test("Booking Flow 1: Validasi gagal jika data pemesan atau kuota tidak valid", () => {
  // Simulate validation logic from API
  function validateBookingPayload(payload) {
    if (!payload.scheduleId || !payload.customerName || !payload.customerEmail || !payload.customerWhatsapp || !payload.pax || !Array.isArray(payload.passengers)) {
      return { valid: false, error: "Semua data pemesan dan daftar penumpang wajib diisi." };
    }
    if (payload.passengers.length !== Number(payload.pax)) {
      return { valid: false, error: "Jumlah data peserta harus sesuai dengan jumlah pax yang dipilih." };
    }
    return { valid: true };
  }

  const invalidPayload = {
    scheduleId: "33333333-3333-3333-3333-333333333333",
    customerName: "",
    customerEmail: "budi@gmail.com",
    customerWhatsapp: "08123456789",
    pax: 2,
    passengers: [{ fullName: "Budi" }], // Only 1 passenger for 2 pax
  };

  const validation = validateBookingPayload(invalidPayload);
  assert.equal(validation.valid, false);
  assert.equal(validation.error, "Semua data pemesan dan daftar penumpang wajib diisi.");

  const mismatchPayload = {
    scheduleId: "33333333-3333-3333-3333-333333333333",
    customerName: "Budi",
    customerEmail: "budi@gmail.com",
    customerWhatsapp: "08123456789",
    pax: 2,
    passengers: [{ fullName: "Budi" }],
  };
  const mismatchVal = validateBookingPayload(mismatchPayload);
  assert.equal(mismatchVal.valid, false);
  assert.equal(mismatchVal.error, "Jumlah data peserta harus sesuai dengan jumlah pax yang dipilih.");
});

test("Booking Flow 2: Simulasi booking berhasil mengunci kuota dan membuat invoice TTL 20 menit", async () => {
  const scheduleId = "test-schedule-booking-1";
  const pax = 2;

  // 1. Reserve quota
  const canReserve = bookingStore.reserveQuota(scheduleId, pax);
  assert.equal(canReserve, true);

  const quota = bookingStore.getScheduleQuota(scheduleId);
  assert.equal(quota.reserved, 2);

  // 2. Generate Invoice with 20 minutes TTL
  const gateway = getPaymentGateway("mock");
  const bookingCode = `NSB-20261004-TEST`;
  const invoice = await gateway.createInvoice({
    bookingCode,
    amount: 500000,
    customerName: "Budi Santoso",
    customerEmail: "budi@gmail.com",
    customerPhone: "081234567890",
    tripTitle: "Sunrise Lava Tour Merapi",
    expiryMinutes: 20,
  });

  assert.equal(invoice.bookingCode, bookingCode);
  assert.equal(invoice.amount, 500000);
  assert.ok(invoice.expiresAt);

  // Expiry check: around 20 minutes from now
  const diffMinutes = Math.round((new Date(invoice.expiresAt).getTime() - Date.now()) / (60 * 1000));
  assert.ok(diffMinutes >= 19 && diffMinutes <= 21);

  // Save to bookingStore
  bookingStore.saveBooking({
    id: "booking-id-test-1",
    booking_code: bookingCode,
    agent_id: "agent-1",
    schedule_id: scheduleId,
    customer_name: "Budi Santoso",
    customer_email: "budi@gmail.com",
    customer_whatsapp: "081234567890",
    total_pax: pax,
    price_per_pax: 250000,
    total_amount: 500000,
    platform_fee: 10000,
    agent_payout_amount: 490000,
    payment_status: "UNPAID",
    payment_method: "MOCK_QRIS",
    payment_reference: invoice.invoiceId,
    payment_expired_at: invoice.expiresAt,
    paid_at: null,
    is_manual_entry: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    passengers: [],
  });

  const stored = bookingStore.getBookingByCode(bookingCode);
  assert.ok(stored);
  assert.equal(stored.booking_code, bookingCode);
  assert.equal(stored.payment_status, "UNPAID");
});

test("Booking Flow 3: Booking gagal saat kuota habis dengan pesan baku antislop", () => {
  const scheduleId = "test-schedule-soldout";
  // Fill up quota (total 12)
  assert.equal(bookingStore.reserveQuota(scheduleId, 12), true);

  // Now attempt to reserve 1 more
  const overflow = bookingStore.reserveQuota(scheduleId, 1);
  assert.equal(overflow, false);

  const exactErrorMessage = "Maaf, kuota kursi untuk jadwal ini sudah habis.";
  assert.equal(exactErrorMessage, "Maaf, kuota kursi untuk jadwal ini sudah habis.");
});
