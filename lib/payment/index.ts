import type { PaymentGateway } from "./types";
import { MockPaymentProvider } from "./mock-provider";
import { ManualTransferProvider } from "./manual-transfer";

export function getPaymentGateway(provider?: string): PaymentGateway {
  const selectedProvider = provider || process.env.PAYMENT_PROVIDER || "mock";

  switch (selectedProvider.toLowerCase()) {
    case "manual_transfer":
      return new ManualTransferProvider();
    case "mock":
    default:
      return new MockPaymentProvider();
  }
}

export * from "./types";
