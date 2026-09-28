import { NextResponse } from "next/server";
import { getPaymentGateway } from "@/lib/payment";
import { getNotificationProvider } from "@/lib/notifications";

export async function GET() {
  const payment = getPaymentGateway();
  const notification = getNotificationProvider();

  return NextResponse.json({
    status: "ok",
    app: "Nusabook Platform",
    timestamp: new Date().toISOString(),
    paymentProvider: payment.name,
    notificationProvider: notification.name,
  });
}
