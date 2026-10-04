import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Workstream C: PDF route file exists and has print stylesheet and agent kop', () => {
  const pdfRoutePath = path.resolve('app/api/manifest/[scheduleId]/pdf/route.ts');
  assert.ok(fs.existsSync(pdfRoutePath), 'PDF route must exist');
  const code = fs.readFileSync(pdfRoutePath, 'utf8');
  assert.ok(code.includes('@media print'), 'Must include media print CSS');
  assert.ok(code.includes('MANIFES PENUMPANG'), 'Must include manifest title header');
  assert.ok(code.includes('window.print()'), 'Must include print trigger');
  assert.ok(!code.includes('—'), 'Must not contain em dash');
});
