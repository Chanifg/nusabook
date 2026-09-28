export interface CreateInvoiceParams {
  bookingCode: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tripTitle: string;
  expiryMinutes?: number;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface InvoiceResult {
  invoiceId: string;
  bookingCode: string;
  paymentUrl?: string;
  qrCodeUrl?: string;
  virtualAccountNumber?: string;
  paymentMethod: string;
  amount: number;
  expiresAt: string;
  instructions?: string[];
}

export interface CallbackVerificationResult {
  isValid: boolean;
  bookingCode: string;
  status: 'PAID' | 'EXPIRED' | 'FAILED';
  transactionId: string;
  paidAmount?: number;
}

export interface PaymentGateway {
  name: string;
  createInvoice(params: CreateInvoiceParams): Promise<InvoiceResult>;
  verifyCallback(payload: any, headers?: Record<string, string>): Promise<CallbackVerificationResult>;
}
