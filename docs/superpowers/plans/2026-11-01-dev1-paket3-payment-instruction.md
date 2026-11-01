# Paket 3: Instruksi Pembayaran & Countdown TTL 20 Menit Dinamis (Developer 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah halaman instruksi pembayaran (`app/bookings/[bookingCode]/payment/page.tsx`) menjadi halaman pembayaran dinamis yang mengambil data reservasi riil dari database Supabase, menghitung sisa waktu TTL 20 menit dari `payment_expired_at`, menampilkan rekening bank transfer mitra travel asli, serta menyajikan manifes penumpang yang akurat.

**Architecture:** Client Component (`page.tsx`) yang menerima `params.bookingCode`, melakukan kueri relasional ke tabel `bookings` (termasuk `travel_agents`, `trip_schedules`, `tour_packages`, dan `booking_passengers`), menghitung selisih countdown secara presisi, memfasilitasi salin rekening 1-klik, dan memverifikasi status pembayaran.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Supabase Database Client, Node.js Test Runner.

## Global Constraints

- Pengerjaan langsung dilakukan pada branch `Main`.
- Commit perubahan secara lokal tanpa melakukan `git push`.
- Wajib mematuhi Hard Gate Anti-Slop: Nol em-dash (`—`), nol `href="#"`, dan nol kata klise AI generik.
- Seluruh tes di `npm test` harus lulus 100% dan `npm run build` sukses.

---

## File Structure

```text
app/bookings/[bookingCode]/payment/
└── page.tsx                                                # Halaman Instruksi Pembayaran & Countdown
tests/
└── dev1-paket3-payment.test.mjs                            # Test suite khusus Paket 3
```

---

### Task 1: Eliminasi Data Dummy Statis & Query Dinamis Supabase

**Files:**
- Modify: `app/bookings/[bookingCode]/payment/page.tsx`
- Create: `tests/dev1-paket3-payment.test.mjs`

**Interfaces:**
- Consumes: `bookingCode` dari `params`
- Produces: State `bookingData` dinamis dari Supabase (total tagihan, detail rekening, status pembayaran).

- [ ] **Step 1: Buat berkas tes `tests/dev1-paket3-payment.test.mjs`**

```javascript
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
```

- [ ] **Step 2: Jalankan tes untuk memastikan tes gagal**

```bash
npm test
```

- [ ] **Step 3: Implementasikan query Supabase dinamis di `app/bookings/[bookingCode]/payment/page.tsx`**
  - Buat state `booking` untuk menampung data transaksi: `total_amount`, `payment_expired_at`, `payment_status`, data agen (`bank_name`, `bank_account_number`, `bank_account_name`), paket, dan daftar penumpang.
  - Ganti konstanta statis dengan state dinamis.

- [ ] **Step 4: Jalankan tes untuk memastikan tes Task 1 lulus**

```bash
npm test
```

---

### Task 2: Countdown Timer Dinamis Berbasis `payment_expired_at`

**Files:**
- Modify: `app/bookings/[bookingCode]/payment/page.tsx`
- Test: `tests/dev1-paket3-payment.test.mjs`

**Interfaces:**
- Consumes: `booking.payment_expired_at`
- Produces: `totalSeconds` sisa waktu riil yang berkurang per detik dan status expired saat 0.

- [ ] **Step 1: Tambahkan tes unit countdown dinamis ke `tests/dev1-paket3-payment.test.mjs`**

```javascript
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
```

- [ ] **Step 2: Jalankan tes untuk mengonfirmasi kegagalan**

```bash
npm test
```

- [ ] **Step 3: Implementasikan perhitungan countdown dinamis**
  - Hitung `remainingSeconds` dari `new Date(paymentExpiredAt).getTime() - Date.now()`.
  - Jika waktu habis ($\le 0$), tampilkan status kadaluarsa dan nonaktifkan tombol cek pembayaran.

- [ ] **Step 4: Jalankan tes untuk mengonfirmasi kelulusan**

```bash
npm test
```

---

### Task 3: Rekening Bank Mitra Riil, Manifes Dinamis & Pembersihan Link

**Files:**
- Modify: `app/bookings/[bookingCode]/payment/page.tsx`
- Test: `tests/dev1-paket3-payment.test.mjs`

**Interfaces:**
- Consumes: `agent.bank_name`, `agent.bank_account_number`, `passengers`
- Produces: Kartu instruksi transfer bank resmi agen, daftar penumpang dari tabel `booking_passengers`, dan nol link mati.

- [ ] **Step 1: Tambahkan tes unit rekening & pembersihan link ke `tests/dev1-paket3-payment.test.mjs`**

```javascript
test("Paket 3: Halaman pembayaran tidak memiliki tautan mati dan menampilkan instruksi transfer bank", () => {
  const content = fs.readFileSync(
    "app/bookings/[bookingCode]/payment/page.tsx",
    "utf8"
  );
  assert.ok(!content.includes('href="/terms"'), "Masih ada link mati /terms");
  assert.ok(
    content.includes("bank_account_number") || content.includes("bankNumber"),
    "Nomor rekening bank agen belum dirender secara dinamis"
  );
});
```

- [ ] **Step 2: Jalankan tes untuk mengonfirmasi kegagalan**

```bash
npm test
```

- [ ] **Step 3: Implementasikan rendering detail bank agen & pembersihan tautan**
  - Tampilkan nama bank agen, nomor rekening dengan tombol salin, dan atas nama pemilik rekening.
  - Render nama penumpang riil dari relasi `booking_passengers`.
  - Ganti link `/terms` pada footer menjadi rute valid.

- [ ] **Step 4: Jalankan tes untuk mengonfirmasi kelulusan**

```bash
npm test
```

---

### Task 4: Verifikasi Komprehensif & Build Check

**Files:**
- Test: `npm test` dan `npm run build`

- [ ] **Step 1: Jalankan seluruh suite tes otomatis**

```bash
npm test
```
*Pastikan minimal 66 tests lulus (63 existing + 3 test Paket 3) dan 0 gagal.*

- [ ] **Step 2: Jalankan build kompilasi produksi**

```bash
npm run build
```
*Pastikan seluruh 19 rute Next.js App Router teroptimasi tanpa error.*
