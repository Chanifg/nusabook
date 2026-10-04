import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Workstream C: Migration file exists and contains is_checked_in and RLS update policy', () => {
  const migrationPath = path.resolve('supabase/migrations/20261004000001_workstream_c_manifest.sql');
  assert.ok(fs.existsSync(migrationPath), 'Migration file must exist');

  const sqlContent = fs.readFileSync(migrationPath, 'utf8');
  assert.ok(sqlContent.includes('is_checked_in'), 'SQL must add is_checked_in column');
  assert.ok(sqlContent.includes('checked_in_at'), 'SQL must add checked_in_at column');
  assert.ok(sqlContent.includes('Agents can update manifest checkin status'), 'SQL must create RLS policy for updating manifest');
});
