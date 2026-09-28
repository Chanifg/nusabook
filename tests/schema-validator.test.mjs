import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('SQL schema file exists and contains all required 3NF tables', () => {
  const sql = fs.readFileSync('supabase/migrations/20260928000001_initial_schema.sql', 'utf8');
  const requiredTables = [
    'profiles',
    'travel_agents',
    'tour_packages',
    'trip_schedules',
    'bookings',
    'booking_passengers',
    'agent_payouts',
  ];

  for (const table of requiredTables) {
    assert.match(sql, new RegExp(`CREATE TABLE (IF NOT EXISTS )?${table}`, 'i'), `Missing table ${table}`);
  }

  assert.match(sql, /CREATE TYPE user_role/);
  assert.match(sql, /CREATE TYPE package_category/);
  assert.match(sql, /CREATE TYPE schedule_status/);
  assert.match(sql, /CREATE TYPE booking_status/);
  assert.match(sql, /CREATE TYPE payout_status/);
  assert.match(sql, /CONSTRAINT quota_integrity/);
});
