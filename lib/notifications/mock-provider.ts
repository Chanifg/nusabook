import type { NotificationProvider, SendBookingNoticeParams, SendPaymentSuccessParams } from "./types";

export class MockNotificationProvider implements NotificationProvider {
  name = "mock";

  async sendBookingCreated(params: SendBookingNoticeParams): Promise<boolean> {
    console.log(`[MockNotification: WhatsApp -> ${params.recipientPhone}] Halo ${params.customerName}, pemesanan ${params.tripTitle} (${params.pax} pax) dengan kode ${params.bookingCode} berhasil dibuat. Selesaikan pembayaran sebelum ${params.expiresAt}. Link: ${params.paymentUrl}`);
    return true;
  }

  async sendPaymentSuccess(params: SendPaymentSuccessParams): Promise<boolean> {
    console.log(`[MockNotification: WhatsApp -> ${params.recipientPhone}] Pembayaran ${params.bookingCode} BERHASIL. E-Ticket Anda dapat diakses di: ${params.eTicketUrl}`);
    return true;
  }
}
