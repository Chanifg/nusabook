import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Paket 1: package-detail-client.tsx usang harus dihapus dari codebase", () => {
  const exists = fs.existsSync(
    "app/(storefront)/[slug]/packages/[packageSlug]/package-detail-client.tsx"
  );
  assert.equal(exists, false, "Berkas usang package-detail-client.tsx masih ada");
});

test("Paket 1: Footer detail paket tidak boleh mengarahkan ke rute mati 404", () => {
  const content = fs.readFileSync(
    "app/(storefront)/[slug]/packages/[packageSlug]/package-detail-view.tsx",
    "utf8"
  );
  assert.ok(!content.includes('href="/guide"'), "Masih ada link mati ke /guide");
  assert.ok(!content.includes('href="/terms"'), "Masih ada link mati ke /terms");
  assert.ok(!content.includes('href="/safety"'), "Masih ada link mati ke /safety");
});
