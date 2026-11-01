# Paket 2: Formulir Checkout & Validasi Manifes Peserta (Developer 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah halaman checkout reservasi (`app/(storefront)/[slug]/booking/page.tsx`) dari formulir dengan data dummy statis menjadi formulir dinamis yang memuat data paket & jadwal live dari Supabase, validasi ketat data kontak & NIK peserta, pembersihan link mati, serta penambahan sticky bottom bar di layar mobile.

**Architecture:** Memanfaatkan Server Component (`page.tsx`) dan Client Component (`booking-view.tsx` atau client-rendered state) yang mengaitkan `scheduleId` dengan database Supabase, menghitung tagihan riil, memvalidasi manifes peserta sesuai standar UU PDP, dan mengirimkan payload terverifikasi ke `POST /api/bookings`.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Supabase Database Client, Node.js Test Runner.

## Global Constraints

- Pengerjaan langsung dilakukan pada branch `Main`.
- Commit perubahan secara lokal tanpa melakukan `git push`.
- Wajib mematuhi Hard Gate Anti-Slop: Nol em-dash (`—`), nol `href="#"`, dan nol kata klise AI generik.
- Seluruh tes di `npm test` harus lulus 100% dan `npm run build` sukses.

---

## File Structure

```text
app/(storefront)/[slug]/booking/
├── page.tsx                                                # Halaman Checkout & Formulir Reservasi
tests/
└── dev1-paket2-checkout.test.mjs                           # Test suite khusus Paket 2
```

---

### Task 1: Sanitasi Input & Pembersihan Data Dummy Awal

**Files:**
- Modify: `app/(storefront)/[slug]/booking/page.tsx`
- Create: `tests/dev1-paket2-checkout.test.mjs`

**Interfaces:**
- Consumes: `PassengerInput`, `initialPax`
- Produces: State bersih kosong untuk pemesan dan peserta dengan placeholder ramah pengguna.

- [ ] **Step 1: Buat berkas tes `tests/dev1-paket2-checkout.test.mjs`**

```javascript
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
```

- [ ] **Step 2: Jalankan tes untuk memastikan tes gagal**

```bash
npm test
```

- [ ] **Step 3: Bersihkan state awal pada `app/(storefront)/[slug]/booking/page.tsx`**
  - Ubah `customerName`, `customerEmail`, `customerWhatsapp` menjadi string kosong (`""`).
  - Inisialisasi daftar `passengers` kosong sesuai `initialPax`.
  - Sediakan placeholder informatif pada input teks.

- [ ] **Step 4: Jalankan tes untuk memastikan tes Task 1 lulus**

```bash
npm test
```

---

### Task 2: Pengambilan Data Paket & Jadwal Dinamis dari Supabase

**Files:**
- Modify: `app/(storefront)/[slug]/booking/page.tsx`
- Test: `tests/dev1-paket2-checkout.test.mjs`

**Interfaces:**
- Consumes: `scheduleId`, `slug` dari URL params & searchParams
- Produces: Judul trip, tanggal keberangkatan, harga per pax, dan nama agen yang sinkron dengan database Supabase.

- [ ] **Step 1: Tambahkan tes unit data dinamis ke `tests/dev1-paket2-checkout.test.mjs`**

```javascript
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
```

- [ ] **Step 2: Jalankan tes untuk mengonfirmasi kegagalan**

```bash
npm test
```

- [ ] **Step 3: Implementasikan kueri dinamis Supabase pada `app/(storefront)/[slug]/booking/page.tsx`**
  - Ambil data jadwal (`trip_schedules`) dan paket (`tour_packages`) berdasarkan `scheduleId`.
  - Pasang state dinamis untuk `tripTitle`, `pricePerPax`, `departureDateText`, dan `agentName`.
  - Perbarui rincian ringkasan pesanan di kolom kanan agar menggunakan data dinamis tersebut.

- [ ] **Step 4: Jalankan tes untuk mengonfirmasi kelulusan**

```bash
npm test
```

---

### Task 3: Validasi Ketat Manifes & Sticky Mobile Checkout Bar

**Files:**
- Modify: `app/(storefront)/[slug]/booking/page.tsx`
- Test: `tests/dev1-paket2-checkout.test.mjs`

**Interfaces:**
- Consumes: `customerWhatsapp`, `passengers`, `subtotal`, `isPending`
- Produces: Validasi nomor HP (+62/08), validasi NIK 16 digit, eliminasi tautan mati (`/terms`, `/privacy`), dan sticky bottom bar mobile.

- [ ] **Step 1: Tambahkan tes unit validasi & mobile sticky bar ke `tests/dev1-paket2-checkout.test.mjs`**

```javascript
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
```

- [ ] **Step 2: Jalankan tes untuk mengonfirmasi kegagalan**

```bash
npm test
```

- [ ] **Step 3: Tambahkan fungsi validasi nomor HP & NIK, perbaiki tautan, dan tambahkan mobile bar**
  - Validasi regex nomor WhatsApp Indonesia: `^(\+62|62|08)[0-9]{8,13}$`.
  - Validasi NIK jika diisi: tepat 16 digit angka `^[0-9]{16}$`.
  - Tambahkan fixed sticky bottom bar di `<form>` untuk viewport mobile (< 1024px) dengan total harga dan tombol submit.
  - Perbaiki tautan syarat ketentuan dan kebijakan privasi agar mengarah ke modal atau rute valid.

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
*Pastikan minimal 63 tests lulus (60 existing + 3 test Paket 2) dan 0 gagal.*

- [ ] **Step 2: Jalankan build kompilasi produksi**

```bash
npm run build
```
*Pastikan seluruh 19 rute Next.js App Router teroptimasi tanpa error.*
