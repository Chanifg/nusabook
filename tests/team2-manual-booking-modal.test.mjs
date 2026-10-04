import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("ManualBookingModal: File komponen mandiri tersedia dan mengekspor fungsi modal", () => {
  assert.ok(
    fs.existsSync("components/dashboard/ManualBookingModal.tsx"),
    "Komponen ManualBookingModal.tsx harus dibuat"
  );
  const content = fs.readFileSync("components/dashboard/ManualBookingModal.tsx", "utf8");
  assert.ok(
    content.includes("export default function ManualBookingModal") ||
      content.includes("export function ManualBookingModal"),
    "Komponen harus mengekspor ManualBookingModal"
  );
  assert.ok(
    content.includes("/api/bookings/manual"),
    "Komponen harus memanggil endpoint manual booking"
  );
  assert.ok(
    content.includes("is_manual_entry") || content.includes("Walk-in") || content.includes("Manual"),
    "Komponen harus menampilkan judul pencatatan booking manual"
  );
});
