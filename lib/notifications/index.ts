import type { NotificationProvider } from "./types";
import { MockNotificationProvider } from "./mock-provider";

export function getNotificationProvider(provider?: string): NotificationProvider {
  const selected = provider || process.env.NOTIFICATION_PROVIDER || "mock";

  switch (selected.toLowerCase()) {
    case "mock":
    default:
      return new MockNotificationProvider();
  }
}

export * from "./types";
