import type { PaymentGateway, CreateInvoiceParams, InvoiceResult, CallbackVerificationResult } from "./types";

export class ManualTransferProvider implements PaymentGateway {
  name = "manual_transfer";

  async createInvoice(params: CreateInvoiceParams): Promise<InvoiceResult> {
    const expiresAt = new Date(Date.now() + (params.expiryMinutes || 120) * 60 * 1000).toISOString();
    const bank = params.bankDetails || {
      bankName: "BCA",
      accountNumber: "8820192831",
      accountName: "Nusabook Rekber Mitra",
    };

    return {
      invoiceId: `manual-${params.bookingCode}`,
      bookingCode: params.bookingCode,
      paymentMethod: "MANUAL_BANK_TRANSFER",
      amount: params.amount,
      expiresAt,
      instructions: [
        `Silakan transfer ke Bank ${bank.bankName}`,
        `Nomor Rekening: ${bank.accountNumber}`,
        `Atas Nama: ${bank.accountName}`,
        `Jumlah Persis: Rp ${params.amount.toLocaleString("id-ID")}`,
        "Setelah transfer, unggah bukti transfer di halaman verifikasi atau kirim ke WhatsApp resmi agen.",
      ],
    };
  }

  async verifyCallback(payload: any): Promise<CallbackVerificationResult> {
    return {
      isValid: true,
      bookingCode: payload.bookingCode || "",
      status: payload.isApproved ? "PAID" : "FAILED",
      transactionId: `manual-verified-${Date.now()}`,
      paidAmount: payload.amount,
    };
  }
}
