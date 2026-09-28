import type { PaymentGateway } from "./types";
import { MockPaymentProvider } from "./mock-provider";
import { ManualTransferProvider } from "./manual-transfer";
import { TripayPaymentProvider } from "./providers/tripay-provider";

export function getPaymentGateway(provider?: string): PaymentGateway {
  const selectedProvider = provider || process.env.PAYMENT_PROVIDER || "mock";

  switch (selectedProvider.toLowerCase()) {
    case "tripay":
      return new TripayPaymentProvider();
    case "manual_transfer":
      return new ManualTransferProvider();
    case "mock":
    default:
      return new MockPaymentProvider();
  }
}

export * from "./types";
export { TripayPaymentProvider } from "./providers/tripay-provider";
