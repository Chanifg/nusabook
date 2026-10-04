import test from "node:test";
import assert from "node:assert/strict";
import { processManualBooking } from "../lib/bookings/manual-booking.ts";

test("Manual Booking: Menolak pemesanan jika paxCount < 1 atau field wajib kosong", async () => {
  await assert.rejects(
    async () => {
      await processManualBooking({
        scheduleId: "",
        packageId: "pkg-1",
        agentId: "agent-1",
        customerName: "",
        customerPhone: "0812345678",
        customerEmail: "test@example.com",
        paxCount: 0,
        paymentMethod: "CASH",
        passengers: [],
      });
    },
    { message: /Validasi gagal: data pemesan dan kuota minimal 1 pax diperlukan/ }
  );
});

test("Manual Booking: Menghasilkan kode booking dengan prefix MAN- dan status PAID", async () => {
  const mockDb = {
    checkQuota: async () => ({ quota_remaining: 10 }),
    confirmQuota: async () => true,
    insertBooking: async (record) => ({ ...record, id: "b-123" }),
  };

  const result = await processManualBooking(
    {
      scheduleId: "sched-1",
      packageId: "pkg-1",
      agentId: "agent-1",
      customerName: "Ahmad Dahlan",
      customerPhone: "081234567890",
      customerEmail: "ahmad@example.com",
      paxCount: 2,
      paymentMethod: "CASH",
      totalAmount: 1500000,
      passengers: [
        { fullName: "Ahmad Dahlan", idCardNumber: "3507041234560001" },
        { fullName: "Fatimah", idCardNumber: "3507041234560002" },
      ],
    },
    mockDb
  );

  assert.ok(result.bookingCode.startsWith("MAN-"));
  assert.equal(result.status, "PAID");
  assert.equal(result.isManualEntry, true);
  assert.equal(result.paxCount, 2);
});

test("Manual Booking: Menolak pemesanan jika kuota tidak mencukupi", async () => {
  const mockDb = {
    checkQuota: async () => ({ quota_remaining: 1 }),
    confirmQuota: async () => true,
    insertBooking: async (record) => ({ ...record, id: "b-123" }),
  };

  await assert.rejects(
    async () => {
      await processManualBooking(
        {
          scheduleId: "sched-1",
          packageId: "pkg-1",
          agentId: "agent-1",
          customerName: "Ahmad Dahlan",
          customerPhone: "081234567890",
          customerEmail: "ahmad@example.com",
          paxCount: 5,
          paymentMethod: "CASH",
          passengers: [],
        },
        mockDb
      );
    },
    { message: /Kuota tidak mencukupi untuk pemesanan manual/ }
  );
});
