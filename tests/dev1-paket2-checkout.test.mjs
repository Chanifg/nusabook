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
