import type { NotificationProvider } from "./types";
import { MockNotificationProvider } from "./mock-provider";
import { FonnteWhatsAppProvider } from "./providers/fonnte-provider";
import { EmailFallbackProvider } from "./providers/email-fallback-provider";

export function getNotificationProvider(provider?: string): NotificationProvider {
  const selected =
    provider ||
    process.env.NOTIFICATION_PROVIDER ||
    (process.env.FONNTE_TOKEN ? "fonnte" : "mock");

  switch (selected.toLowerCase()) {
    case "fonnte":
      return new FonnteWhatsAppProvider();
    case "email":
      return new EmailFallbackProvider();
    case "mock":
    default:
      return new MockNotificationProvider();
  }
}

export * from "./types";
export * from "./providers/fonnte-provider";
export * from "./providers/email-fallback-provider";
