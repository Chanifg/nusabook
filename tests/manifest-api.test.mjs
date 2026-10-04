import test from 'node:test';
import assert from 'node:assert/strict';
import { generateManifestCsv } from '../lib/manifest/csv-helper.ts';

test('Workstream C: generateManifestCsv includes UTF-8 BOM and escapes commas/quotes', () => {
  const sampleData = [
    {
      orderNumber: 1,
      fullName: 'Budi Santoso, S.Kom',
      gender: 'MALE',
      idCardNumber: '3301234567890001',
      phoneNumber: '081234567890',
      emergencyContact: 'Istri: 081987654321',
      specialNotes: 'Alergi seafood, "butuh obat"',
      bookingCode: 'NBK-TEST01',
      paymentStatus: 'PAID',
      isCheckedIn: true,
      checkedInAt: '2026-10-04T08:00:00Z',
    },
    {
      orderNumber: 2,
      fullName: 'Siti Rahma',
      gender: 'FEMALE',
      idCardNumber: null,
      phoneNumber: '081122334455',
      emergencyContact: null,
      specialNotes: null,
      bookingCode: 'NBK-TEST02',
      paymentStatus: 'PAID',
      isCheckedIn: false,
      checkedInAt: null,
    },
  ];

  const csv = generateManifestCsv(sampleData);
  assert.ok(csv.startsWith('\uFEFF'), 'CSV must start with UTF-8 BOM');
  assert.ok(csv.includes('"Budi Santoso, S.Kom"'), 'Names with comma must be quoted');
  assert.ok(csv.includes('""butuh obat""'), 'Quotes inside text must be escaped');
  assert.ok(csv.includes('Hadir'), 'Checked-in status must be translated to Hadir');
  assert.ok(csv.includes('Belum Hadir'), 'Unchecked status must be translated to Belum Hadir');
  assert.ok(csv.includes('Laki-laki'), 'MALE must be translated to Laki-laki');
  assert.ok(csv.includes('Perempuan'), 'FEMALE must be translated to Perempuan');
});
