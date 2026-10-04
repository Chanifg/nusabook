import test from "node:test";
import assert from "node:assert/strict";
import { FonnteWhatsAppProvider } from "../lib/notifications/providers/fonnte-provider.ts";
import { EmailFallbackProvider } from "../lib/notifications/providers/email-fallback-provider.ts";

test("Fonnte WhatsApp Provider: Memformat payload dan header token secara tepat", async () => {
  let capturedUrl = "";
  let capturedHeaders = {};
  let capturedBody = {};

  const fakeFetch = async (url, options) => {
    capturedUrl = url;
    capturedHeaders = options.headers;
    capturedBody = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({ status: true, id: "msg-123" }),
    };
  };

  const provider = new FonnteWhatsAppProvider({
    token: "test_fonnte_token_123",
    fetchFn: fakeFetch,
  });

  const res = await provider.send({
    recipient: "081234567890",
    message: "Tiket Bromo Anda telah terbit!",
  });

  assert.equal(capturedUrl, "https://api.fonnte.com/send");
  assert.equal(capturedHeaders.Authorization, "test_fonnte_token_123");
  assert.equal(capturedBody.target, "081234567890");
  assert.equal(res.success, true);
  assert.equal(res.provider, "fonnte");
});

test("Fonnte WhatsApp Provider: Retry backoff 3x dan fallback ke Email jika WhatsApp gagal", async () => {
  let attempts = 0;
  const failingFetch = async () => {
    attempts++;
    return {
      ok: false,
      status: 500,
      json: async () => ({ status: false, reason: "Server Timeout" }),
    };
  };

  let emailSent = false;
  const mockEmailFallback = {
    send: async () => {
      emailSent = true;
      return { success: true, messageId: "email-fallback-123", provider: "email" };
    },
  };

  const provider = new FonnteWhatsAppProvider({
    token: "test_token",
    fetchFn: failingFetch,
    fallbackProvider: mockEmailFallback,
    retryDelayMs: 5, // Cepat untuk pengujian unit
  });

  const res = await provider.send({
    recipient: "081234567890",
    message: "Pemberitahuan tiket",
  });

  assert.equal(attempts, 3, "Harus mencoba 3 kali sebelum fallback");
  assert.equal(emailSent, true, "Email fallback harus dipanggil setelah 3x gagal");
  assert.equal(res.success, true);
  assert.equal(res.provider, "email");
});

test("Email Fallback Provider: Mengirimkan email jika dipanggil langsung", async () => {
  const emailProvider = new EmailFallbackProvider();
  const res = await emailProvider.send({
    recipient: "user@example.com",
    message: "Detail tiket Bromo",
  });
  assert.equal(res.success, true);
  assert.equal(res.provider, "email");
});
