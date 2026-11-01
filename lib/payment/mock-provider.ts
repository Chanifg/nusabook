import type { PaymentGateway, CreateInvoiceParams, InvoiceResult, CallbackVerificationResult } from "./types";

export class MockPaymentProvider implements PaymentGateway {
  name = "mock";

  async createInvoice(params: CreateInvoiceParams): Promise<InvoiceResult> {
    const expiryMinutes = params.expiryMinutes || 20;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString();

    return {
      invoiceId: `mock-inv-${Date.now()}`,
      bookingCode: params.bookingCode,
      paymentUrl: `/mock-payment?code=${params.bookingCode}&amount=${params.amount}`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MOCK_QRIS_${params.bookingCode}`,
      virtualAccountNumber: `88019${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: "QRIS_SIMULATOR",
      amount: params.amount,
      expiresAt,
      instructions: [
        "Buka aplikasi e-wallet atau mobile banking Anda (Simulasi).",
        "Scan kode QRIS simulator di atas.",
        "Pastikan nama merchant Nusabook Demo tertera.",
        "Selesaikan pembayaran dalam waktu 20 menit.",
      ],
    };
  }

  async verifyCallback(payload: any): Promise<CallbackVerificationResult> {
    const bookingCode = payload.bookingCode || payload.order_id || "";
    const status = payload.status === "PAID" ? "PAID" : "FAILED";

    return {
      isValid: true,
      bookingCode,
      status,
      transactionId: payload.transactionId || `mock-tx-${Date.now()}`,
      paidAmount: payload.amount,
    };
  }
}
