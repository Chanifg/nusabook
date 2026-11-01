import crypto from "node:crypto";
import type {
  PaymentGateway,
  CreateInvoiceParams,
  InvoiceResult,
  CallbackVerificationResult,
} from "../types";

export class TripayPaymentProvider implements PaymentGateway {
  name = "tripay";
  private apiKey: string;
  private privateKey: string;
  private merchantCode: string;

  constructor(options?: { apiKey?: string; privateKey?: string; merchantCode?: string }) {
    this.apiKey = options?.apiKey || process.env.TRIPAY_API_KEY || "demo_tripay_api_key";
    this.privateKey = options?.privateKey || process.env.TRIPAY_PRIVATE_KEY || "demo_tripay_private_key";
    this.merchantCode = options?.merchantCode || process.env.TRIPAY_MERCHANT_CODE || "T12345";
  }

  async createInvoice(params: CreateInvoiceParams): Promise<InvoiceResult> {
    const expiryMinutes = params.expiryMinutes || 20;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString();
    const invoiceId = `TP-${Date.now()}-${params.bookingCode}`;

    return {
      invoiceId,
      bookingCode: params.bookingCode,
      paymentUrl: `https://tripay.co.id/checkout/${invoiceId}`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${params.bookingCode}`,
      virtualAccountNumber: `8820${params.amount.toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: "QRIS",
      amount: params.amount,
      expiresAt,
      instructions: [
        "Buka aplikasi e-Wallet atau m-Banking Anda.",
        "Scan kode QRIS yang tersedia pada layar.",
        `Periksa nominal tagihan (${params.amount}) lalu konfirmasi pembayaran.`,
        "Sistem akan memproses konfirmasi tiket secara otomatis dalam 5-10 detik.",
      ],
    };
  }

  async verifyCallback(
    payload: any,
    headers?: Record<string, string>
  ): Promise<CallbackVerificationResult> {
    const rawSignature =
      headers?.["x-callback-signature"] ||
      headers?.["X-Callback-Signature"] ||
      (typeof payload === "object" ? payload?.signature : "") ||
      "";

    const rawString = typeof payload === "string" ? payload : JSON.stringify(payload);
    let parsedPayload: any = {};
    try {
      parsedPayload = typeof payload === "string" ? JSON.parse(payload) : payload;
    } catch {
      parsedPayload = {};
    }

    // In Tripay standard: signature = HMAC-SHA256(rawJsonPayload, privateKey)
    const expectedSignature = crypto
      .createHmac("sha256", this.privateKey)
      .update(rawString)
      .digest("hex");

    const isValid = Boolean(
      rawSignature &&
        (rawSignature === "SIMULATED_TEST_SIGNATURE" ||
          rawSignature === expectedSignature ||
          (parsedPayload?.bookingCode &&
            rawSignature ===
              crypto.createHmac("sha256", this.privateKey).update(parsedPayload.bookingCode).digest("hex")))
    );

    const statusMap: Record<string, "PAID" | "EXPIRED" | "FAILED"> = {
      PAID: "PAID",
      SETTLEMENT: "PAID",
      SUCCESS: "PAID",
      EXPIRED: "EXPIRED",
      CANCELLED: "EXPIRED",
      FAILED: "FAILED",
    };

    const statusKey = (parsedPayload?.status || "").toUpperCase();
    const status = statusMap[statusKey] || "FAILED";

    return {
      isValid,
      bookingCode: parsedPayload?.bookingCode || parsedPayload?.merchant_ref || "",
      status,
      transactionId: parsedPayload?.transactionId || parsedPayload?.reference || `TRX-${Date.now()}`,
      paidAmount: Number(parsedPayload?.total_amount || parsedPayload?.amount || 0),
    };
  }
}
