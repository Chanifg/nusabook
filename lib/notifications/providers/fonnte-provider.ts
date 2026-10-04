import type {
  NotificationProvider,
  SendBookingNoticeParams,
  SendPaymentSuccessParams,
} from "../types";
import { EmailFallbackProvider } from "./email-fallback-provider";

export interface FonnteProviderOptions {
  token?: string;
  fetchFn?: typeof fetch;
  fallbackProvider?: any;
  retryDelayMs?: number;
}

export class FonnteWhatsAppProvider implements NotificationProvider {
  name = "fonnte";
  private token: string;
  private fetchFn: typeof fetch;
  private fallbackProvider: any;
  private retryDelayMs: number;

  constructor(options?: FonnteProviderOptions) {
    this.token = options?.token || process.env.FONNTE_TOKEN || "demo_fonnte_token";
    this.fetchFn = options?.fetchFn || fetch;
    this.fallbackProvider = options?.fallbackProvider || new EmailFallbackProvider();
    this.retryDelayMs = options?.retryDelayMs !== undefined ? options?.retryDelayMs : 1000;
  }

  async send(params: { recipient: string; message: string }): Promise<{
    success: boolean;
    messageId?: string;
    provider: string;
    attempts?: number;
  }> {
    let lastError: any = null;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.fetchFn("https://api.fonnte.com/send", {
          method: "POST",
          headers: {
            Authorization: this.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target: params.recipient,
            message: params.message,
          }),
        });

        if (response.ok) {
          const json = await response.json();
          return {
            success: true,
            messageId: json.id || `fonnte-${Date.now()}`,
            provider: "fonnte",
            attempts: attempt,
          };
        } else {
          lastError = new Error(`HTTP ${response.status}`);
        }
      } catch (err: any) {
        lastError = err;
      }

      // Exponential backoff sebelum retry berikutnya
      if (attempt < maxRetries) {
        const delay = this.retryDelayMs * Math.pow(2, attempt - 1);
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    // Jika gagal 3x, fallback ke provider email
    if (this.fallbackProvider && typeof this.fallbackProvider.send === "function") {
      const fallbackRes = await this.fallbackProvider.send({
        recipient: params.recipient,
        message: params.message,
      });
      return {
        ...fallbackRes,
        provider: fallbackRes.provider || "email",
        attempts: maxRetries,
      };
    }

    throw lastError || new Error("Gagal mengirim notifikasi WhatsApp setelah 3x percobaan");
  }

  async sendBookingCreated(params: SendBookingNoticeParams): Promise<boolean> {
    const text = `Halo Kak ${params.customerName},\nPesanan #${params.bookingCode} untuk paket *${params.tripTitle}* (${params.pax} pax) telah dibuat.\nTotal: Rp ${params.totalAmount.toLocaleString("id-ID")}\nBatas bayar: ${params.expiresAt}.\nTerima kasih!`;
    const res = await this.send({ recipient: params.recipientPhone, message: text });
    return res.success;
  }

  async sendPaymentSuccess(params: SendPaymentSuccessParams): Promise<boolean> {
    const text = `Halo Kak ${params.customerName},\nPembayaran tiket #${params.bookingCode} untuk *${params.tripTitle}* telah BERHASIL.\nAkses e-Tiket & Kode QR: ${params.eTicketUrl}\nSelamat menikmati perjalanan bersama kami!`;
    const res = await this.send({ recipient: params.recipientPhone, message: text });
    return res.success;
  }
}
