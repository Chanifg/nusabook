import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Paket 3: Halaman pembayaran tidak boleh memiliki nilai tagihan statis atau nama dummy", () => {
  const content = fs.readFileSync(
    "app/bookings/[bookingCode]/payment/page.tsx",
    "utf8"
  );
  assert.ok(!content.includes("const totalAmount = 850000;"), "Masih ada nominal statis 850000");
  assert.ok(!content.includes('const vaNumber = "8277 0812 3456 7890";'), "Masih ada VA statis");
  assert.ok(!content.includes('"1. Anindya Paramitha"'), "Masih ada nama dummy Anindya");
  assert.ok(!content.includes('"2. Reza Herdian"'), "Masih ada nama dummy Reza");
});

test("Paket 3: Timer pembayaran dihitung dari payment_expired_at database", () => {
  const content = fs.readFileSync(
    "app/bookings/[bookingCode]/payment/page.tsx",
    "utf8"
  );
  assert.ok(
    !content.includes("const [totalSeconds, setTotalSeconds] = useState<number>(14 * 60 + 42);"),
    "Masih ada timer hardcoded 14 menit 42 detik"
  );
  assert.ok(
    content.includes("payment_expired_at"),
    "Timer belum memanfaatkan field payment_expired_at dari database"
  );
});

test("Paket 3: Halaman pembayaran tidak memiliki tautan mati dan menampilkan instruksi transfer bank", () => {
  const content = fs.readFileSync(
    "app/bookings/[bookingCode]/payment/page.tsx",
    "utf8"
  );
  assert.ok(!content.includes('href="/terms"'), "Masih ada link mati /terms");
  assert.ok(
    content.includes("bank_account_number") || content.includes("bankNumber") || content.includes("agentBankAccountNumber"),
    "Nomor rekening bank agen belum dirender secara dinamis"
  );
});

