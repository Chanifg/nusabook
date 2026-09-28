import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('RLS migration file contains policies for all required entities', () => {
  const rls = fs.readFileSync('supabase/migrations/20260928000003_rls_policies.sql', 'utf8');

  assert.match(rls, /ALTER TABLE travel_agents ENABLE ROW LEVEL SECURITY/);
  assert.match(rls, /ALTER TABLE tour_packages ENABLE ROW LEVEL SECURITY/);
  assert.match(rls, /ALTER TABLE trip_schedules ENABLE ROW LEVEL SECURITY/);
  assert.match(rls, /ALTER TABLE bookings ENABLE ROW LEVEL SECURITY/);
  assert.match(rls, /ALTER TABLE booking_passengers ENABLE ROW LEVEL SECURITY/);
  assert.match(rls, /ALTER TABLE agent_payouts ENABLE ROW LEVEL SECURITY/);
});

test('Seed file contains Pesona Merapi demo data', () => {
  const seed = fs.readFileSync('supabase/seed.sql', 'utf8');

  assert.match(seed, /pesona-merapi/);
  assert.match(seed, /Sunrise Lava Tour Merapi/);
});
