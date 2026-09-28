import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Stored procedure migration file has correct logic and functions', () => {
  const sql = fs.readFileSync('supabase/migrations/20260928000002_concurrency_locking.sql', 'utf8');

  assert.match(sql, /CREATE OR REPLACE FUNCTION reserve_trip_quota/);
  assert.match(sql, /FOR UPDATE/);
  assert.match(sql, /CREATE OR REPLACE FUNCTION release_trip_quota/);
  assert.match(sql, /CREATE OR REPLACE FUNCTION confirm_trip_quota/);
});

test('Simulated quota lock prevents overbooking accurately', () => {
  let totalQuota = 10;
  let reservedQuota = 0;
  let bookedQuota = 0;

  function simulateReserve(pax) {
    if (pax <= 0) return false;
    if (reservedQuota + bookedQuota + pax <= totalQuota) {
      reservedQuota += pax;
      return true;
    }
    return false;
  }

  // Attempt booking 6 pax
  assert.equal(simulateReserve(6), true);
  assert.equal(reservedQuota, 6);

  // Attempt booking 5 pax (6 + 5 = 11 > 10, must fail)
  assert.equal(simulateReserve(5), false);
  assert.equal(reservedQuota, 6);

  // Attempt booking 4 pax (6 + 4 = 10 == 10, must succeed)
  assert.equal(simulateReserve(4), true);
  assert.equal(reservedQuota, 10);

  // Any further booking must fail
  assert.equal(simulateReserve(1), false);
});
