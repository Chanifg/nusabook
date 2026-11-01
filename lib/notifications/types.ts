export interface SendBookingNoticeParams {
  recipientPhone: string;
  recipientEmail?: string;
  customerName: string;
  bookingCode: string;
  tripTitle: string;
  pax: number;
  totalAmount: number;
  paymentUrl?: string;
  expiresAt: string;
}

export interface SendPaymentSuccessParams {
  recipientPhone: string;
  recipientEmail?: string;
  customerName: string;
  bookingCode: string;
  tripTitle: string;
  eTicketUrl: string;
}

export interface NotificationProvider {
  name: string;
  sendBookingCreated(params: SendBookingNoticeParams): Promise<boolean>;
  sendPaymentSuccess(params: SendPaymentSuccessParams): Promise<boolean>;
}
