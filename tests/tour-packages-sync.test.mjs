import test from "node:test";
import assert from "node:assert/strict";
import { CATALOG_PACKAGES, findCatalogPackage, findCatalogPackageByScheduleId } from "../lib/catalog-data.ts";
import { bookingStore } from "../lib/booking-store.ts";

test("End-to-End Tour Sync: 8 Paket Wisata Lengkap dan Terverifikasi", async () => {
  assert.equal(CATALOG_PACKAGES.length, 8, "Harus tersedia tepat 8 paket wisata aktif");

  const expectedPackages = [
    {
      slug: "sunrise-lava-tour-merapi",
      agentSlug: "pesona-merapi",
      title: "Sunrise Lava Tour Merapi & Bunker Kaliadem",
    },
    {
      slug: "borobudur-punthuk-setumbu",
      agentSlug: "borobudur-sunrise",
      title: "Private Premium Trip Candi Borobudur & Punthuk Setumbu",
    },
    {
      slug: "bromo-sunrise-savana",
      agentSlug: "bromo-overland",
      title: "Open Trip Bromo Sunrise & Savana Teletubbies 1D",
    },
    {
      slug: "labuan-bajo-komodo-phinisi",
      agentSlug: "flores-bahari",
      title: "Labuan Bajo Komodo Phinisi Sail 3D2N AC Cabin",
    },
    {
      slug: "kawah-ijen-blue-fire",
      agentSlug: "osing-heritage",
      title: "Kawah Ijen Blue Fire & Kawah Wurung Midnight",
    },
    {
      slug: "karimunjawa-bahari-snorkeling",
      agentSlug: "karimun-wave",
      title: "Eksotisme Karimunjawa Bahari 3D2N Full Snorkeling",
    },
    {
      slug: "dieng-golden-sunrise-highlands",
      agentSlug: "wonoland-dieng",
      title: "Dieng Golden Sunrise Sikunir & Telaga Warna 2D1N",
    },
    {
      slug: "derawan-maratua-island-hopping",
      agentSlug: "borneo-sea",
      title: "Derawan & Maratua Island Hopping Paradise 4D3N",
    },
  ];

  for (const exp of expectedPackages) {
    const pkg = findCatalogPackage(exp.agentSlug, exp.slug);
    assert.ok(pkg, `Paket ${exp.slug} harus ditemukan di katalog`);
    assert.equal(pkg.title, exp.title, `Judul paket ${exp.slug} harus sesuai`);
    assert.ok(pkg.thumbnail_url, `Paket ${exp.slug} harus memiliki cover image`);
    assert.ok(pkg.schedules.length > 0, `Paket ${exp.slug} harus memiliki jadwal keberangkatan aktif`);
    assert.ok(pkg.pricePerPax > 0, `Harga paket ${exp.slug} harus valid`);
    assert.ok(pkg.agent.whatsapp_number, `Paket ${exp.slug} harus memiliki nomor kontak agen`);
    assert.ok(pkg.agent.bank_account_number, `Paket ${exp.slug} harus memiliki nomor rekening`);

    // Test simulasi alur reservasi di bookingStore
    const sched = pkg.schedules[0];
    const scheduleMatch = findCatalogPackageByScheduleId(sched.id);
    assert.ok(scheduleMatch, `Lookup by scheduleId ${sched.id} harus berhasil`);

    const bookingCode = `NSB-TEST-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const testRecord = {
      id: crypto.randomUUID(),
      booking_code: bookingCode,
      agent_id: pkg.agent.id,
      schedule_id: sched.id,
      customer_name: "Wisatawan Nusantara",
      customer_email: "tamu@nusabook.id",
      customer_whatsapp: "081234567890",
      total_pax: 2,
      price_per_pax: sched.pricePerPax,
      total_amount: sched.pricePerPax * 2,
      platform_fee: Math.round(sched.pricePerPax * 2 * 0.02),
      agent_payout_amount: Math.round(sched.pricePerPax * 2 * 0.98),
      payment_status: "UNPAID",
      payment_method: "BANK_TRANSFER",
      payment_reference: `INV-${Date.now()}`,
      payment_expired_at: new Date(Date.now() + 20 * 60000).toISOString(),
      paid_at: null,
      is_manual_entry: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tripTitle: pkg.title,
      passengers: [
        {
          id: crypto.randomUUID(),
          booking_id: "test",
          full_name: "Wisatawan Satu",
          id_card_number: "3507123456780001",
          gender: "MALE",
          is_checked_in: false,
        },
        {
          id: crypto.randomUUID(),
          booking_id: "test",
          full_name: "Wisatawan Dua",
          id_card_number: "3507123456780002",
          gender: "FEMALE",
          is_checked_in: false,
        },
      ],
    };

    bookingStore.saveBooking(testRecord);
    const saved = bookingStore.getBookingByCode(bookingCode);
    assert.ok(saved, `Booking ${bookingCode} harus berhasil tersimpan`);
    assert.equal(saved.payment_status, "UNPAID");

    // Simulasi pelunasan transfer
    bookingStore.updateBookingStatus(bookingCode, "PAID", new Date().toISOString());
    const paid = bookingStore.getBookingByCode(bookingCode);
    assert.equal(paid?.payment_status, "PAID");
    assert.ok(paid?.paid_at);
  }
});
