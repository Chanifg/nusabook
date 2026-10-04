import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Workstream C: PassengerTable and CheckinButton files exist', () => {
  const tablePath = path.resolve('components/manifest/passenger-table.tsx');
  const btnPath = path.resolve('components/manifest/checkin-button.tsx');
  assert.ok(fs.existsSync(tablePath), 'PassengerTable component must exist');
  assert.ok(fs.existsSync(btnPath), 'CheckinButton component must exist');

  const tableCode = fs.readFileSync(tablePath, 'utf8');
  assert.ok(tableCode.includes('searchQuery') || tableCode.includes('filter'), 'Must have search/filter logic');
  assert.ok(!tableCode.includes('—'), 'Must not contain em dash');

  const btnCode = fs.readFileSync(btnPath, 'utf8');
  assert.ok(btnCode.includes('/api/manifest/checkin'), 'CheckinButton must call checkin API endpoint');
  assert.ok(!btnCode.includes('—'), 'Must not contain em dash');
});
