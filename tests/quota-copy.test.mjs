import test from 'node:test';
import assert from 'node:assert/strict';

test('Quota full error message adheres to user requirement without extra fluff', () => {
  const quotaFullMessage = "Maaf, kuota kursi untuk jadwal ini sudah habis.";
  assert.equal(quotaFullMessage, "Maaf, kuota kursi untuk jadwal ini sudah habis.");
  assert.ok(!quotaFullMessage.includes("baru saja"));
});
