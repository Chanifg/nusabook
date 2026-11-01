import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Storefront Page: Tidak boleh ada fallback mock data atau dummy string hardcoded untuk agent", () => {
  const fileContent = fs.readFileSync("app/(storefront)/[slug]/page.tsx", "utf8");
  assert.ok(
    !fileContent.includes('"Pesona Nusantara Tour & Travel"'),
    "Halaman storefront masih mengandung fallback mock nama agen"
  );
  assert.ok(
    fileContent.includes("notFound()"),
    "Halaman storefront harus memanggil notFound() jika agen tidak ditemukan atau tidak aktif"
  );
});

test("Package Detail Page: Mengambil data paket dan jadwal live dari database", () => {
  const fileContent = fs.readFileSync(
    "app/(storefront)/[slug]/packages/[packageSlug]/page.tsx",
    "utf8"
  );
  assert.ok(
    !fileContent.includes("const SCHEDULES: ScheduleOption[] = ["),
    "Halaman detail paket masih menggunakan array statis SCHEDULES dummy"
  );
  assert.ok(
    fileContent.includes("notFound()"),
    "Halaman detail paket harus memanggil notFound() jika paket tidak ditemukan"
  );
});
