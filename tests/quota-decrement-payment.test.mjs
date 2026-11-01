import test from "node:test";
import assert from "node:assert/strict";
import { bookingStore } from "../lib/booking-store.js";
import { CATALOG_PACKAGES, findCatalogPackageByScheduleId } from "../lib/catalog-data.js";

test("Quota Decrement 1: Pemesanan dan pembayaran berhasil mengurangi sisa kuota kursi secara akurat", () => {
  const scheduleId = "33333333-3333-3333-3333-333333333333"; // Merapi schedule
  const catalogMatch = findCatalogPackageByScheduleId(scheduleId);
  assert.ok(catalogMatch, "Jadwal Merapi harus ditemukan di catalog");

  const initialTotal = catalogMatch.schedule.totalQuota;
  const initialAvailable = catalogMatch.schedule.availableSeats;
  const initialBooked = catalogMatch.schedule.bookedQuota;
  const initialReserved = catalogMatch.schedule.reservedQuota;

  const pax = 2;
  const bookingCode = `NSB-TEST-QUOTA-${Date.now()}`;

  // 1. User melakukan pemesanan (reserveQuota)
  const reservedSuccess = bookingStore.reserveQuota(scheduleId, pax);
  assert.equal(reservedSuccess, true, "Reservasi kuota harus berhasil");

  const quotaAfterReserve = bookingStore.getScheduleQuota(scheduleId);
  assert.equal(quotaAfterReserve.reserved, initialReserved + pax);
  assert.equal(
    catalogMatch.schedule.availableSeats,
    initialAvailable - pax,
    "Sisa kursi di katalog harus berkurang setelah reservasi"
  );

  // Simpan data booking awal (UNPAID)
  bookingStore.saveBooking({
    id: "booking-test-quota",
    booking_code: bookingCode,
    agent_id: catalogMatch.pkg.agent.id,
    schedule_id: scheduleId,
    customer_name: "Uji Pembayaran Kuota",
    customer_email: "uji@nusabook.id",
    customer_whatsapp: "081299998888",
    total_pax: pax,
    price_per_pax: catalogMatch.schedule.pricePerPax,
    total_amount: catalogMatch.schedule.pricePerPax * pax,
    platform_fee: 10000,
    agent_payout_amount: catalogMatch.schedule.pricePerPax * pax - 10000,
    payment_status: "UNPAID",
    payment_method: "BCA_VA",
    payment_reference: "REF-123",
    payment_expired_at: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    paid_at: null,
    is_manual_entry: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    passengers: [],
  });

  // 2. User menyelesaikan pembayaran (confirmQuota & update status PAID)
  bookingStore.confirmQuota(scheduleId, pax);
  bookingStore.updateBookingStatus(bookingCode, "PAID", new Date().toISOString());

  const quotaAfterPayment = bookingStore.getScheduleQuota(scheduleId);
  assert.equal(quotaAfterPayment.reserved, initialReserved, "Reserved quota harus kembali ke angka sebelum booking");
  assert.equal(quotaAfterPayment.booked, initialBooked + pax, "Booked quota harus bertambah sejumlah pax yang dibayar");
  assert.equal(
    catalogMatch.schedule.availableSeats,
    initialAvailable - pax,
    "Sisa kursi yang tersedia setelah pembayaran harus berkurang sesuai pax"
  );

  // 3. Verifikasi idempoten: memanggil confirmQuota kedua kalinya untuk booking yang sama tidak boleh mengurangi kuota lagi
  const updatedBooking = bookingStore.getBookingByCode(bookingCode);
  assert.equal(updatedBooking.payment_status, "PAID");
});

test("Quota Decrement 2: Pembatalan atau kadaluarsa mengembalikan kuota kursi", () => {
  const scheduleId = "test-schedule-quota-cancel";
  const pax = 3;
  const bookingCode = `NSB-TEST-CANCEL-${Date.now()}`;

  bookingStore.reserveQuota(scheduleId, pax);
  let q = bookingStore.getScheduleQuota(scheduleId);
  assert.equal(q.reserved, 3);

  // Booking kadaluarsa / batal -> releaseQuota
  bookingStore.releaseQuota(scheduleId, pax);
  bookingStore.updateBookingStatus(bookingCode, "EXPIRED");

  q = bookingStore.getScheduleQuota(scheduleId);
  assert.equal(q.reserved, 0, "Reserved quota harus kembali 0 setelah booking dibatalkan/kadaluarsa");
  assert.equal(q.booked, 0);
});
