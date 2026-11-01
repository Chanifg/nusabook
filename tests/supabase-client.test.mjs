import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Supabase client and server files export createClient function', () => {
  const clientCode = fs.readFileSync('lib/supabase/client.ts', 'utf8');
  const serverCode = fs.readFileSync('lib/supabase/server.ts', 'utf8');
  const middlewareCode = fs.readFileSync('lib/supabase/middleware.ts', 'utf8');

  assert.match(clientCode, /export function createClient/);
  assert.match(serverCode, /export async function createClient/);
  assert.match(middlewareCode, /export async function updateSession/);
});
