import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { encryptNik, decryptNik, maskNik } from "../lib/security/pdp-crypto.ts";

test("PDP Crypto: Enkripsi dan dekripsi bolak-balik NIK berhasil", () => {
  const nik = "3507041234560001";
  const encrypted = encryptNik(nik);
  assert.notEqual(encrypted, nik);
  const decrypted = decryptNik(encrypted);
  assert.equal(decrypted, nik);
});

test("PDP Crypto: maskNik menyamarkan 8 digit tengah dengan tanda bintang", () => {
  const nik = "3507041234560001";
  const masked = maskNik(nik);
  assert.equal(masked, "3507********0001");
});

test("PDP Crypto: maskNik mengembalikan default mask untuk NIK pendek atau kosong", () => {
  assert.equal(maskNik(""), "********");
  assert.equal(maskNik("123"), "********");
});

test("PDP Migration: Berkas migrasi SQL pgcrypto valid dan berisi trigger enkripsi", () => {
  const sql = fs.readFileSync(
    "supabase/migrations/20261005000001_nik_encryption.sql",
    "utf8"
  );
  assert.ok(sql.includes("CREATE EXTENSION IF NOT EXISTS pgcrypto;"));
  assert.ok(sql.includes("pgp_sym_encrypt"));
  assert.ok(sql.includes("booking_passengers"));
});
