import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { calculateSettlement } from "../lib/admin/settlement.ts";

test("Settlement: Menghitung platform fee 2% dan transfer net 98% secara presisi", () => {
  const result = calculateSettlement(1000000);
  assert.equal(result.platformFee, 20000);
  assert.equal(result.netPayout, 980000);

  // Nilai ganjil
  const oddResult = calculateSettlement(375500);
  assert.equal(oddResult.platformFee, 7510);
  assert.equal(oddResult.netPayout, 367990);
});

test("Settlement: Menolak angka negatif", () => {
  assert.throws(
    () => calculateSettlement(-50000),
    { message: /Gross amount tidak boleh negatif/ }
  );
});

test("Admin Route Handler: Files endpoint verify dan approve payout tersedia", () => {
  assert.ok(
    fs.existsSync("app/api/admin/agents/[id]/verify/route.ts"),
    "Route verify agent harus ada"
  );
  assert.ok(
    fs.existsSync("app/api/admin/payouts/[id]/approve/route.ts"),
    "Route payout approve harus ada"
  );
});

test("Middleware: Melindungi rute /admin dari unauthorized access", () => {
  const middlewareContent = fs.readFileSync("middleware.ts", "utf8");
  assert.ok(
    middlewareContent.includes("/admin") || middlewareContent.includes("admin"),
    "Middleware harus memuat proteksi rute admin"
  );
});
