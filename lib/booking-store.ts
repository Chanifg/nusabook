import type { Booking, BookingPassenger } from "@/types/database.types";

export interface BookingWithPassengers extends Booking {
  passengers: BookingPassenger[];
  tripTitle?: string;
  paymentInstructions?: string[];
  qrCodeUrl?: string;
  virtualAccountNumber?: string;
}

// In-memory persistent store across requests for demo/test mode
const globalStore = globalThis as unknown as {
  __nusabook_bookings__?: Map<string, BookingWithPassengers>;
  __nusabook_quota__?: Map<string, { total: number; reserved: number; booked: number }>;
};

if (!globalStore.__nusabook_bookings__) {
  globalStore.__nusabook_bookings__ = new Map();
}

if (!globalStore.__nusabook_quota__) {
  globalStore.__nusabook_quota__ = new Map();
  // Default seed schedule quota
  globalStore.__nusabook_quota__.set("33333333-3333-3333-3333-333333333333", {
    total: 12,
    reserved: 0,
    booked: 0,
  });
}

export const bookingStore = {
  saveBooking(booking: BookingWithPassengers) {
    globalStore.__nusabook_bookings__!.set(booking.booking_code, booking);
  },

  getBookingByCode(code: string): BookingWithPassengers | undefined {
    return globalStore.__nusabook_bookings__!.get(code);
  },

  updateBookingStatus(
    code: string,
    status: Booking["payment_status"],
    paidAt?: string
  ): BookingWithPassengers | undefined {
    const booking = globalStore.__nusabook_bookings__!.get(code);
    if (!booking) return undefined;
    booking.payment_status = status;
    if (paidAt) {
      booking.paid_at = paidAt;
    }
    booking.updated_at = new Date().toISOString();
    return booking;
  },

  getAllBookings(): BookingWithPassengers[] {
    return Array.from(globalStore.__nusabook_bookings__!.values());
  },

  // Simulated RPC reserve_trip_quota
  reserveQuota(scheduleId: string, pax: number): boolean {
    if (pax <= 0) return false;
    let quota = globalStore.__nusabook_quota__!.get(scheduleId);
    if (!quota) {
      quota = { total: 12, reserved: 0, booked: 0 };
      globalStore.__nusabook_quota__!.set(scheduleId, quota);
    }

    if (quota.reserved + quota.booked + pax <= quota.total) {
      quota.reserved += pax;
      return true;
    }
    return false;
  },

  // Simulated RPC confirm_trip_quota
  confirmQuota(scheduleId: string, pax: number): void {
    const quota = globalStore.__nusabook_quota__!.get(scheduleId);
    if (quota) {
      quota.reserved = Math.max(0, quota.reserved - pax);
      quota.booked += pax;
    }
  },

  // Simulated RPC release_trip_quota
  releaseQuota(scheduleId: string, pax: number): void {
    const quota = globalStore.__nusabook_quota__!.get(scheduleId);
    if (quota) {
      quota.reserved = Math.max(0, quota.reserved - pax);
    }
  },

  getScheduleQuota(scheduleId: string) {
    return globalStore.__nusabook_quota__!.get(scheduleId) || { total: 12, reserved: 0, booked: 0 };
  },
};
