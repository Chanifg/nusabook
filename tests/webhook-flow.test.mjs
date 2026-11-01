import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { TripayPaymentProvider } from "../lib/payment/providers/tripay-provider.js";
import { bookingStore } from "../lib/booking-store.js";

test("Webhook Flow 1: Webhook menolak callback jika signature key tidak valid", async () => {
  const tripay = new TripayPaymentProvider({
    privateKey: "secret_merchant_key",
  });

  const payload = {
    bookingCode: "NSB-TEST-INVALID-SIG",
    status: "PAID",
    amount: 250000,
  };

  const headers = {
    "x-callback-signature": "bogus_unauthorized_signature",
  };

  const verification = await tripay.verifyCallback(payload, headers);
  assert.equal(verification.isValid, false);
});

test("Webhook Flow 2: Signature valid diverifikasi dan status PAID memindahkan kuota dari reserved ke booked", async () => {
  const privateKey = "valid_test_secret_key";
  const tripay = new TripayPaymentProvider({ privateKey });

  const scheduleId = "test-schedule-webhook-settle";
  const bookingCode = "NSB-TEST-SETTLED";
  const pax = 3;

  // 1. Setup initial reservation
  bookingStore.reserveQuota(scheduleId, pax);
  let quota = bookingStore.getScheduleQuota(scheduleId);
  assert.equal(quota.reserved, 3);
  assert.equal(quota.booked, 0);

  bookingStore.saveBooking({
    id: "booking-webhook-1",
    booking_code: bookingCode,
    agent_id: "agent-1",
    schedule_id: scheduleId,
    customer_name: "Andi Pratama",
    customer_email: "andi@gmail.com",
    customer_whatsapp: "08123456789",
    total_pax: pax,
    price_per_pax: 250000,
    total_amount: 750000,
    platform_fee: 15000,
    agent_payout_amount: 735000,
    payment_status: "UNPAID",
    payment_method: "TRIPAY_QRIS",
    payment_reference: "TP-123456",
    payment_expired_at: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    paid_at: null,
    is_manual_entry: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    passengers: [],
  });

  // 2. Generate valid HMAC-SHA256 signature
  const payload = {
    bookingCode,
    status: "PAID",
    total_amount: 750000,
  };
  const validSignature = crypto
    .createHmac("sha256", privateKey)
    .update(JSON.stringify(payload))
    .digest("hex");

  const verification = await tripay.verifyCallback(payload, {
    "x-callback-signature": validSignature,
  });

  assert.equal(verification.isValid, true);
  assert.equal(verification.status, "PAID");

  // 3. Confirm quota transfer
  bookingStore.confirmQuota(scheduleId, pax);
  bookingStore.updateBookingStatus(bookingCode, "PAID", new Date().toISOString());

  quota = bookingStore.getScheduleQuota(scheduleId);
  assert.equal(quota.reserved, 0);
  assert.equal(quota.booked, 3);

  const updatedBooking = bookingStore.getBookingByCode(bookingCode);
  assert.equal(updatedBooking.payment_status, "PAID");
  assert.ok(updatedBooking.paid_at);
});

test("Webhook Flow 3: Booking kadaluarsa melepaskan kuota kembali ke kapasitas awal", () => {
  const scheduleId = "test-schedule-expire";
  const bookingCode = "NSB-TEST-EXPIRED";
  const pax = 2;

  // 1. Initial reservation
  bookingStore.reserveQuota(scheduleId, pax);
  let quota = bookingStore.getScheduleQuota(scheduleId);
  assert.equal(quota.reserved, 2);

  // 2. Release quota upon EXPIRED
  bookingStore.releaseQuota(scheduleId, pax);
  bookingStore.updateBookingStatus(bookingCode, "EXPIRED");

  quota = bookingStore.getScheduleQuota(scheduleId);
  assert.equal(quota.reserved, 0);
  assert.equal(quota.booked, 0);
});
