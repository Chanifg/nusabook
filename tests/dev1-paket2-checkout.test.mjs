import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Paket 2: Halaman booking tidak boleh memiliki data kontak atau peserta hardcoded", () => {
  const content = fs.readFileSync(
    "app/(storefront)/[slug]/booking/page.tsx",
    "utf8"
  );
  assert.ok(!content.includes('"Anindya Paramitha"'), "Masih ada nama hardcoded Anindya Paramitha");
  assert.ok(!content.includes('"Reza Herdian"'), "Masih ada nama hardcoded Reza Herdian");
  assert.ok(!content.includes('"anindya.paramitha@gmail.com"'), "Masih ada email hardcoded");
});

test("Paket 2: Harga dan judul trip diambil secara dinamis dari database/API", () => {
  const content = fs.readFileSync(
    "app/(storefront)/[slug]/booking/page.tsx",
    "utf8"
  );
  assert.ok(
    !content.includes('const pricePerPax = 450000;'),
    "Masih ada harga per pax hardcoded 450000"
  );
  assert.ok(
    !content.includes('const tripTitle = "Open Trip Bromo Golden Sunrise";'),
    "Masih ada judul trip hardcoded Bromo"
  );
});

test("Paket 2: Memiliki sticky bottom checkout bar di layar mobile dan nol tautan mati", () => {
  const content = fs.readFileSync(
    "app/(storefront)/[slug]/booking/page.tsx",
    "utf8"
  );
  assert.ok(
    content.includes("lg:hidden fixed bottom-0") || content.includes("md:hidden fixed bottom-0"),
    "Tidak ada sticky checkout bar di layar mobile"
  );
  assert.ok(!content.includes('href="/terms"'), "Masih ada link mati /terms");
  assert.ok(!content.includes('href="/privacy"'), "Masih ada link mati /privacy");
});


