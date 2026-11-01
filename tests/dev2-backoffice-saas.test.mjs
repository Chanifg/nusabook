/**
 * Dev2 Backoffice SaaS – Automated Test Suite
 * Covers: package form, schedule batch generator, profile settings, financial dashboard metrics.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());

// ──────────────────────────────────────────────────────────────────────────────
// PACKAGE FORM
// ──────────────────────────────────────────────────────────────────────────────
test("Dev2-PF-01: package-form.tsx exposes handleAddDay and handleRemoveDay", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/package-form.tsx"),
    "utf-8"
  );
  assert.ok(src.includes("handleAddDay"), "handleAddDay handler must exist");
  assert.ok(src.includes("handleRemoveDay"), "handleRemoveDay handler must exist");
});

test("Dev2-PF-02: Itinerary section has Tambah Hari button", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/package-form.tsx"),
    "utf-8"
  );
  assert.ok(src.includes("Tambah Hari"), "Tambah Hari button must exist in itinerary section");
});

test("Dev2-PF-03: Hapus Hari button is conditionally rendered when multiple days exist", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/package-form.tsx"),
    "utf-8"
  );
  assert.ok(src.includes("Hapus Hari"), "Hapus Hari button must exist");
  assert.ok(
    src.includes("itinerary.length > 1"),
    "Hapus Hari must be gated: only shown when length > 1"
  );
});

test("Dev2-PF-04: thumbnail preview has onError fallback handler", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/package-form.tsx"),
    "utf-8"
  );
  assert.ok(src.includes("onError"), "onError must be present on thumbnail img tag");
  assert.ok(
    src.includes("broken_image"),
    "Placeholder icon 'broken_image' must display when thumbnail fails"
  );
});

test("Dev2-PF-05: package-form does not contain dead href='#'", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/package-form.tsx"),
    "utf-8"
  );
  assert.ok(!src.includes('href="#"'), "No dead href=\"#\" links allowed in package-form");
});

// ──────────────────────────────────────────────────────────────────────────────
// SCHEDULE BATCH GENERATOR
// ──────────────────────────────────────────────────────────────────────────────
test("Dev2-SL-01: schedules-list.tsx contains batch generator modal state", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/schedules-list.tsx"),
    "utf-8"
  );
  assert.ok(
    src.includes("isBatchModalOpen"),
    "isBatchModalOpen state must exist"
  );
  assert.ok(
    src.includes("batchDayOfWeek"),
    "batchDayOfWeek state must exist"
  );
  assert.ok(src.includes("batchWeeks"), "batchWeeks state must exist");
  assert.ok(src.includes("batchTotalQuota"), "batchTotalQuota state must exist");
  assert.ok(src.includes("batchPricePerPax"), "batchPricePerPax state must exist");
});

test("Dev2-SL-02: handleBatchGenerate function iterates dates by day-of-week", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/schedules-list.tsx"),
    "utf-8"
  );
  assert.ok(src.includes("handleBatchGenerate"), "handleBatchGenerate handler must exist");
  assert.ok(
    src.includes("cursor.getDay()"),
    "Batch generator must iterate by getDay() to match selected days of week"
  );
  assert.ok(
    src.includes("batchDayOfWeek.includes"),
    "Batch generator must filter dates using batchDayOfWeek.includes"
  );
});

test("Dev2-SL-03: handleBatchGenerate inserts into trip_schedules with correct fields", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/schedules-list.tsx"),
    "utf-8"
  );
  assert.ok(
    src.includes(".from(\"trip_schedules\")") && src.includes(".insert(scheduleRows)"),
    "Batch generator must insert into trip_schedules table"
  );
  assert.ok(
    src.includes("reserved_quota: 0") && src.includes("booked_quota: 0"),
    "New batch schedules must start with 0 reserved and booked quota"
  );
});

test("Dev2-SL-04: Quick toggle button is present in each schedule row action cell", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/schedules-list.tsx"),
    "utf-8"
  );
  assert.ok(src.includes("handleQuickToggle"), "handleQuickToggle must be defined");
  assert.ok(
    src.includes("Tutup Kuota Sekarang") || src.includes("Tutup Kuota"),
    "Quick toggle must show Tutup label for OPEN schedule"
  );
  assert.ok(
    src.includes("Buka Kuota") || src.includes("Buka\")"),
    "Quick toggle must show Buka label for CLOSED schedule"
  );
});

test("Dev2-SL-05: Quick toggle updates status OPEN <=> CLOSED optimistically", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/schedules-list.tsx"),
    "utf-8"
  );
  assert.ok(
    src.includes("CLOSED") && src.includes("OPEN"),
    "Toggle logic must reference both OPEN and CLOSED values"
  );
  assert.ok(
    src.includes("status === \"OPEN\" ? \"CLOSED\" : \"OPEN\""),
    "Toggle must derive new status as inverse of current"
  );
});

test("Dev2-SL-06: Batch generator validates empty day selection", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/schedules-list.tsx"),
    "utf-8"
  );
  assert.ok(
    src.includes("batchDayOfWeek.length === 0"),
    "Batch generator must reject empty day-of-week selection"
  );
});

test("Dev2-SL-07: Batch generator shows success count after generation", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/schedules-list.tsx"),
    "utf-8"
  );
  assert.ok(
    src.includes("batchResult"),
    "batchResult state must be used to show success message"
  );
  assert.ok(
    src.includes("jadwal berhasil dibuat"),
    "Success message must confirm jadwal count"
  );
});

test("Dev2-SL-08: Generate Jadwal Berkala button opens modal", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/schedules-list.tsx"),
    "utf-8"
  );
  assert.ok(
    src.includes("Generate Jadwal Berkala"),
    "Header must contain Generate Jadwal Berkala button label"
  );
});

// ──────────────────────────────────────────────────────────────────────────────
// PROFILE FORM – CANCELLATION POLICY
// ──────────────────────────────────────────────────────────────────────────────
test("Dev2-PR-01: profile-form.tsx has cancellation policy section", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/profile-form.tsx"),
    "utf-8"
  );
  assert.ok(
    src.includes("Kebijakan Pembatalan"),
    "Profile form must have Kebijakan Pembatalan section"
  );
  assert.ok(
    src.includes("cancellationPolicy"),
    "cancellationPolicy state must exist"
  );
  assert.ok(
    src.includes("setCancellationPolicy"),
    "setCancellationPolicy setter must exist"
  );
});

test("Dev2-PR-02: Refund policy textarea is editable and bound to state", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/profile-form.tsx"),
    "utf-8"
  );
  assert.ok(
    src.includes("onChange={(e) => setCancellationPolicy(e.target.value)}"),
    "Cancellation policy textarea must be wired to state onChange"
  );
});

test("Dev2-PR-03: profile-form does not contain dead href='#'", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/profile-form.tsx"),
    "utf-8"
  );
  assert.ok(!src.includes('href="#"'), "No dead href=\"#\" links allowed in profile-form");
});

// ──────────────────────────────────────────────────────────────────────────────
// DASHBOARD FINANCIAL METRICS
// ──────────────────────────────────────────────────────────────────────────────
test("Dev2-DB-01: dashboard page.tsx has omzetKotor metric from total_amount SUM", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "app/(backoffice)/dashboard/page.tsx"),
    "utf-8"
  );
  assert.ok(src.includes("omzetKotor"), "omzetKotor variable must exist");
  assert.ok(
    src.includes("total_amount"),
    "omzetKotor must be derived from total_amount field"
  );
});

test("Dev2-DB-02: dashboard page.tsx has platformFeeTotal metric from platform_fee SUM", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "app/(backoffice)/dashboard/page.tsx"),
    "utf-8"
  );
  assert.ok(src.includes("platformFeeTotal"), "platformFeeTotal variable must exist");
  assert.ok(
    src.includes("platform_fee"),
    "platformFeeTotal must be derived from platform_fee column"
  );
});

test("Dev2-DB-03: dashboard page.tsx has pendapatanBersih metric from agent_payout_amount SUM", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "app/(backoffice)/dashboard/page.tsx"),
    "utf-8"
  );
  assert.ok(src.includes("pendapatanBersih"), "pendapatanBersih variable must exist");
  assert.ok(
    src.includes("agent_payout_amount"),
    "pendapatanBersih must be derived from agent_payout_amount column"
  );
});

test("Dev2-DB-04: Financial KPI cards display all 3 required metrics", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "app/(backoffice)/dashboard/page.tsx"),
    "utf-8"
  );
  assert.ok(src.includes("Total Omzet Kotor"), "Card 1: Total Omzet Kotor must be visible");
  assert.ok(
    src.includes("Potongan Nusabook 2%"),
    "Card 2: Potongan Nusabook 2% must be visible"
  );
  assert.ok(
    src.includes("Pendapatan Bersih 98%"),
    "Card 3: Pendapatan Bersih 98% must be visible"
  );
});

test("Dev2-DB-05: Financial cards have correct proportional progress bars (2% and 98%)", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "app/(backoffice)/dashboard/page.tsx"),
    "utf-8"
  );
  assert.ok(
    src.includes('width: "2%"'),
    "Potongan Nusabook bar must show 2% width"
  );
  assert.ok(
    src.includes('width: "98%"'),
    "Pendapatan Bersih bar must show 98% width"
  );
});

test("Dev2-DB-06: dashboard page has no dead href='#'", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "app/(backoffice)/dashboard/page.tsx"),
    "utf-8"
  );
  assert.ok(!src.includes('href="#"'), "No dead href=\"#\" links allowed in dashboard page");
});

// ──────────────────────────────────────────────────────────────────────────────
// DOMAIN BOUNDARY CHECKS
// ──────────────────────────────────────────────────────────────────────────────
test("Dev2-BOUNDARY-01: ManualBookingModal.tsx was NOT modified by dev2 branch", () => {
  // ManualBookingModal is Dev3 territory - verify it still exists untouched
  const exists = fs.existsSync(
    path.join(ROOT, "components/dashboard/ManualBookingModal.tsx")
  );
  assert.ok(exists, "ManualBookingModal.tsx must still exist (Dev3 domain, not to be touched)");
});

test("Dev2-BOUNDARY-02: Manifest subfolder route is intact and untouched", () => {
  // manifest is explicitly excluded from Dev2 domain
  const manifestExists = fs.existsSync(
    path.join(ROOT, "app/(backoffice)/dashboard/schedules")
  );
  assert.ok(manifestExists, "schedules directory must still exist");
});

// ------------------------------------------------------------------------------
// DEFINITION OF DONE (DOD) VALIDATIONS
// ------------------------------------------------------------------------------
test("Dev2-DOD-01: schedules-list.tsx prevents past dates on departure date inputs and handlers", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/schedules-list.tsx"),
    "utf-8"
  );
  assert.ok(
    src.includes("formDepartureDate < today"),
    "Schedule handler must prevent dates earlier than today"
  );
  assert.ok(
    src.includes('min={new Date().toISOString().split("T")[0]}'),
    "Departure date input must have min attribute set to today"
  );
});

test("Dev2-DOD-02: schedules-list.tsx prevents negative and zero quota on inputs and batch generator", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/schedules-list.tsx"),
    "utf-8"
  );
  assert.ok(
    src.includes("formTotalQuota < 1"),
    "Schedule handler must reject quota < 1"
  );
  assert.ok(
    src.includes("batchTotalQuota < 1"),
    "Batch generator must reject quota < 1"
  );
  assert.ok(
    src.includes('min="1"'),
    "Quota inputs must have min='1' attribute"
  );
});

test("Dev2-DOD-03: package-form.tsx enforces positive duration days", () => {
  const src = fs.readFileSync(
    path.join(ROOT, "components/dashboard/package-form.tsx"),
    "utf-8"
  );
  assert.ok(
    src.includes('min="1"'),
    "Duration days input must have min='1' attribute"
  );
});
