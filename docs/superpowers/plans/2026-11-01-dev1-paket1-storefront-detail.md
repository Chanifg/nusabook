# Paket 1: Storefront & Detail Paket Wisata (Developer 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyempurnakan halaman etalase katalog agen dan detail paket wisata (`/[slug]/packages/[packageSlug]`) dengan rendering itinerary perjalanan dinamis, informasi titik kumpul, navigasi ramah ponsel (sticky mobile bar), dan eliminasi tautan mati.

**Architecture:** Memanfaatkan Server Component (`page.tsx`) untuk parallel query Supabase yang cepat, serta Client Component (`package-detail-view.tsx`) untuk interaktivitas pemilihan jadwal, penyesuaian pax, timeline itinerary bertahap, dan sticky mobile bottom sheet.

**Tech Stack:** Next.js 15 (App Router, React 19), Tailwind CSS, Lucide / Material Symbols Icons, Supabase Database Types, Node.js Test Runner.

## Global Constraints

- Pengerjaan langsung dilakukan pada branch `Main`.
- Wajib mematuhi Hard Gate Anti-Slop: Nol karakter em-dash (`—`), nol tautan mati (`href="#"`), dan nol buzzwords AI generik.
- Seluruh 56 tes eksisting di `npm test` harus tetap lulus 100% dan `npm run build` sukses.

---

## File Structure

```text
app/(storefront)/[slug]/
├── page.tsx                                                    # Etalase katalog agen (Read-only)
└── packages/[packageSlug]/
    ├── page.tsx                                                # Server Component fetching data
    ├── package-detail-view.tsx                                 # Client Component UI utama
    └── package-detail-client.tsx                               # Hapus berkas redundan usang ini (1264 baris)
tests/
└── dev1-paket1-storefront.test.mjs                             # Test suite spesifik untuk Paket 1
```

---

### Task 1: Eliminasi File Redundan & Pembersihan Tautan Footer

**Files:**
- Delete: `app/(storefront)/[slug]/packages/[packageSlug]/package-detail-client.tsx`
- Modify: `app/(storefront)/[slug]/packages/[packageSlug]/package-detail-view.tsx:628-653`
- Test: `tests/dev1-paket1-storefront.test.mjs`

**Interfaces:**
- Consumes: `PackageDetailViewProps` dari `package-detail-view.tsx`
- Produces: UI footer bersih tanpa rute mati 404 (`/guide`, `/terms`, `/safety`).

- [ ] **Step 1: Buat berkas tes `tests/dev1-paket1-storefront.test.mjs`**

```javascript
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
```

- [ ] **Step 2: Jalankan tes untuk memastikan tes gagal**

```bash
npm test
```

- [ ] **Step 3: Hapus `package-detail-client.tsx` dan perbaiki link footer pada `package-detail-view.tsx`**
  - Ganti tautan footer menjadi `/explore`, `/`, dan kontak WhatsApp resmi.

- [ ] **Step 4: Jalankan tes untuk memastikan tes Task 1 lulus**

```bash
npm test
```

---

### Task 2: Rendering Itinerary Dinamis & Titik Kumpul (Meeting Point)

**Files:**
- Modify: `app/(storefront)/[slug]/packages/[packageSlug]/package-detail-view.tsx`
- Test: `tests/dev1-paket1-storefront.test.mjs`

**Interfaces:**
- Consumes: `pkg.itinerary` (`Json` array aktivitas harian) & `pkg.meeting_point`
- Produces: Komponen visual timeline hari (Day 1, Day 2) dengan jam kegiatan dan kartu Titik Kumpul terverifikasi.

- [ ] **Step 1: Tambahkan tes unit untuk Itinerary dan Meeting Point ke `tests/dev1-paket1-storefront.test.mjs`**

```javascript
test("Paket 1: Package detail merender komponen itinerary dinamis dan titik kumpul", () => {
  const content = fs.readFileSync(
    "app/(storefront)/[slug]/packages/[packageSlug]/package-detail-view.tsx",
    "utf8"
  );
  assert.ok(content.includes("pkg.itinerary"), "Itinerary tidak dirender dari props pkg");
  assert.ok(content.includes("pkg.meeting_point"), "Meeting point tidak dirender dari props pkg");
  assert.ok(content.includes("Titik Kumpul"), "Label Titik Kumpul tidak ditemukan");
});
```

- [ ] **Step 2: Jalankan tes untuk mengonfirmasi kegagalan**

```bash
npm test
```

- [ ] **Step 3: Implementasikan rendering Itinerary dinamis & Titik Kumpul di `package-detail-view.tsx`**
  - Tambahkan kartu Titik Kumpul (Meeting Point) di bawah deskripsi dengan ikon lokasi `pin_drop`.
  - Tambahkan section Rencana Perjalanan (*Interactive Itinerary Timeline*) yang mem-parsing `pkg.itinerary` (menampilkan nomor hari, waktu, judul kegiatan, dan deskripsi).

- [ ] **Step 4: Jalankan tes untuk mengonfirmasi lulus**

```bash
npm test
```

---

### Task 3: Sticky Mobile Bottom Bar & Urgency Quota Indicator

**Files:**
- Modify: `app/(storefront)/[slug]/packages/[packageSlug]/package-detail-view.tsx`
- Test: `tests/dev1-paket1-storefront.test.mjs`

**Interfaces:**
- Consumes: `subtotal`, `selectedSchedule`, `handleBooking`, `paxCount`
- Produces: Fixed bottom bar di layar ponsel (< 1024px) dengan ringkasan harga dan tombol booking langsung.

- [ ] **Step 1: Tambahkan tes unit untuk Mobile Sticky Bar di `tests/dev1-paket1-storefront.test.mjs`**

```javascript
test("Paket 1: Memiliki sticky bottom bar untuk navigasi mobile", () => {
  const content = fs.readFileSync(
    "app/(storefront)/[slug]/packages/[packageSlug]/package-detail-view.tsx",
    "utf8"
  );
  assert.ok(
    content.includes("lg:hidden fixed bottom-0") || content.includes("md:hidden fixed bottom-0"),
    "Tidak ada sticky bottom bar di layar mobile"
  );
});
```

- [ ] **Step 2: Jalankan tes untuk mengonfirmasi kegagalan**

```bash
npm test
```

- [ ] **Step 3: Implementasikan sticky mobile bar di bagian bawah `package-detail-view.tsx`**
  - Muncul di layar mobile (`lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur border-t border-slate-200 p-4`).
  - Menampilkan total harga kalkulasi dinamis dan tombol CTA *"Pesan Sekarang"* yang langsung memanggil `handleBooking()`.

- [ ] **Step 4: Jalankan tes untuk mengonfirmasi lulus**

```bash
npm test
```

---

### Task 4: Verifikasi Komprehensif & Build Check

**Files:**
- Test: `npm test` dan `npm run build`

- [ ] **Step 1: Jalankan seluruh test suite**

```bash
npm test
```
*Pastikan minimal 57 tests lulus (56 existing + test Paket 1) dan 0 gagal.*

- [ ] **Step 2: Jalankan build kompilasi produksi**

```bash
npm run build
```
*Pastikan seluruh 19 rute Next.js App Router teroptimasi tanpa error.*
