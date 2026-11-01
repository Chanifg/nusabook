import type {
  NotificationProvider,
  SendBookingNoticeParams,
  SendPaymentSuccessParams,
} from "../types";

export interface EmailSendParams {
  recipient: string;
  message?: string;
  subject?: string;
  body?: string;
}

export class EmailFallbackProvider implements NotificationProvider {
  name = "email-fallback";

  async send(params: EmailSendParams): Promise<{ success: boolean; messageId: string; provider: string }> {
    const messageId = `email-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    // Fallback log or SMTP transmission
    return {
      success: true,
      messageId,
      provider: "email",
    };
  }

  async sendBookingCreated(params: SendBookingNoticeParams): Promise<boolean> {
    const to = params.recipientEmail || `${params.recipientPhone}@nusabook.id`;
    await this.send({
      recipient: to,
      subject: `[Nusabook] Menunggu Pembayaran: ${params.bookingCode}`,
      body: `Halo ${params.customerName}, tagihan untuk trip ${params.tripTitle} (${params.pax} pax) total ${params.totalAmount} siap dibayar sebelum ${params.expiresAt}.`,
    });
    return true;
  }

  async sendPaymentSuccess(params: SendPaymentSuccessParams): Promise<boolean> {
    const to = params.recipientEmail || `${params.recipientPhone}@nusabook.id`;
    await this.send({
      recipient: to,
      subject: `[Nusabook] Tiket Dikonfirmasi: ${params.bookingCode}`,
      body: `Halo ${params.customerName}, tiket Anda untuk ${params.tripTitle} berhasil dikonfirmasi. Akses e-Tiket: ${params.eTicketUrl}`,
    });
    return true;
  }
}
