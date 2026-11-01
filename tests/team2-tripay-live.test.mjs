import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { TripayPaymentProvider } from "../lib/payment/providers/tripay-provider.ts";

test("Tripay Live: Verifikasi signature HMAC-SHA256 valid dari callback webhook", async () => {
  const privateKey = "live_tripay_private_key_xyz";
  const provider = new TripayPaymentProvider({
    apiKey: "api_key",
    privateKey,
    merchantCode: "T123",
  });

  const payload = {
    reference: "TRX-9988",
    merchant_ref: "NB-202610-001",
    status: "PAID",
    total_amount: 750000,
  };

  const rawJson = JSON.stringify(payload);
  const validSignature = crypto
    .createHmac("sha256", privateKey)
    .update(rawJson)
    .digest("hex");

  const verification = await provider.verifyCallback(rawJson, {
    "x-callback-signature": validSignature,
  });

  assert.equal(verification.isValid, true);
  assert.equal(verification.status, "PAID");
  assert.equal(verification.bookingCode, "NB-202610-001");
  assert.equal(verification.paidAmount, 750000);
});

test("Tripay Live: Menolak webhook dengan signature palsu / mismatch", async () => {
  const provider = new TripayPaymentProvider({
    apiKey: "api_key",
    privateKey: "correct_key",
    merchantCode: "T123",
  });

  const payload = { reference: "TRX-1", status: "PAID" };
  const rawJson = JSON.stringify(payload);

  const verification = await provider.verifyCallback(rawJson, {
    "x-callback-signature": "forged_invalid_signature_hex",
  });

  assert.equal(verification.isValid, false);
});

test("Tripay Live: createInvoice menghasilkan QRIS URL dan instruksi pembayaran", async () => {
  const provider = new TripayPaymentProvider();
  const invoice = await provider.createInvoice({
    bookingCode: "NB-TEST-001",
    amount: 500000,
    customerName: "Budi",
    customerPhone: "0812345678",
  });

  assert.ok(invoice.invoiceId.startsWith("TP-"));
  assert.ok(invoice.qrCodeUrl);
  assert.equal(invoice.paymentMethod, "QRIS");
  assert.equal(invoice.amount, 500000);
});
