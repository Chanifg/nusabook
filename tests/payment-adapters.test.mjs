import test from 'node:test';
import assert from 'node:assert/strict';
import { MockPaymentProvider } from '../lib/payment/mock-provider.ts';
import { ManualTransferProvider } from '../lib/payment/manual-transfer.ts';
import { getPaymentGateway } from '../lib/payment/index.ts';
import { getNotificationProvider } from '../lib/notifications/index.ts';

test('Payment mock provider generates valid invoice with TTL and QRIS', async () => {
  const provider = new MockPaymentProvider();

  const invoice = await provider.createInvoice({
    bookingCode: 'NB-TEST-1234',
    amount: 500000,
    customerName: 'Ahmad User',
    customerEmail: 'ahmad@example.com',
    customerPhone: '08123456789',
    tripTitle: 'Open Trip Bromo Sunrise',
  });

  assert.equal(invoice.bookingCode, 'NB-TEST-1234');
  assert.equal(invoice.amount, 500000);
  assert.equal(invoice.paymentMethod, 'QRIS_SIMULATOR');
  assert.ok(invoice.paymentUrl.includes('NB-TEST-1234'));
  assert.ok(new Date(invoice.expiresAt).getTime() > Date.now());

  const callback = await provider.verifyCallback({ bookingCode: 'NB-TEST-1234', status: 'PAID' });
  assert.equal(callback.isValid, true);
  assert.equal(callback.status, 'PAID');
});

test('Manual transfer provider outputs bank transfer instructions', async () => {
  const provider = new ManualTransferProvider();

  const invoice = await provider.createInvoice({
    bookingCode: 'NB-MANUAL-001',
    amount: 750000,
    customerName: 'Siti Rahma',
    customerEmail: 'siti@example.com',
    customerPhone: '08129876543',
    tripTitle: 'Lava Tour Merapi',
    bankDetails: {
      bankName: 'Mandiri',
      accountNumber: '13700192831',
      accountName: 'Pesona Merapi Official',
    },
  });

  assert.equal(invoice.paymentMethod, 'MANUAL_BANK_TRANSFER');
  assert.ok(invoice.instructions.some(i => i.includes('Mandiri')));
  assert.ok(invoice.instructions.some(i => i.includes('13700192831')));
});

test('Payment and Notification factory return correct defaults', async () => {
  const payment = getPaymentGateway('mock');
  assert.equal(payment.name, 'mock');

  const manual = getPaymentGateway('manual_transfer');
  assert.equal(manual.name, 'manual_transfer');

  const notif = getNotificationProvider('mock');
  assert.equal(notif.name, 'mock');
});
