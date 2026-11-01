# Workstream C: Passenger Manifest & Document Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun modul Manifes Penumpang (Workstream C) untuk mitra tour & travel di Nusabook, mencakup tabel manifes interaktif, presensi/check-in peserta hari-H, ekspor CSV Excel ber-BOM UTF-8, dan cetak dokumen PDF resmi siap cetak.

**Architecture:** Menggunakan Supabase SSR untuk autentikasi dan isolasi tenant (RLS), Server Component untuk rendering halaman manifes, Client Components untuk filter/search instan dan toggle presensi optimis, serta Route Handlers Next.js untuk ekspor dokumen (CSV UTF-8 BOM dan Print-Ready PDF).

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Supabase PostgreSQL, Node.js Test Runner.

## Global Constraints

- Patuhi aturan antislop: Hindari karakter em dash (`—`) pada teks UI atau copywriting; gunakan tanda strip standar (`-`), titik tengah (`•`), atau tanda kurung.
- Format mata uang dan tanggal konsisten dengan standar Indonesia (IDR, tanggal lokal format Indonesia).
- Gunakan `formatRupiah(amount)` dari `@/lib/utils` jika menampilkan nominal harga.
- Seluruh query data harus terisolasi sesuai kepemilikan agen (`travel_agents.owner_id = auth.uid()`).
- File CSV wajib berawalan BOM UTF-8 (`\uFEFF`) agar terbaca sempurna di Microsoft Excel dan Google Sheets.

---

### Task 1: Supabase Migration & TypeScript Database Types

**Files:**
- Create: `supabase/migrations/20261004000001_workstream_c_manifest.sql`
- Modify: `types/database.types.ts`
- Test: `tests/manifest-migration.test.mjs`

**Interfaces:**
- Produces: `is_checked_in: boolean`, `checked_in_at: string | null` in `BookingPassenger` and database schema.

- [ ] **Step 1: Write failing test for migration and schema**

```javascript
// tests/manifest-migration.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Workstream C: Migration file exists and contains is_checked_in and RLS update policy', () => {
  const migrationPath = path.resolve('supabase/migrations/20261004000001_workstream_c_manifest.sql');
  assert.ok(fs.existsSync(migrationPath), 'Migration file must exist');

  const sqlContent = fs.readFileSync(migrationPath, 'utf8');
  assert.ok(sqlContent.includes('is_checked_in'), 'SQL must add is_checked_in column');
  assert.ok(sqlContent.includes('checked_in_at'), 'SQL must add checked_in_at column');
  assert.ok(sqlContent.includes('Agents can update manifest checkin status'), 'SQL must create RLS policy for updating manifest');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/manifest-migration.test.mjs`
Expected: FAIL (file does not exist)

- [ ] **Step 3: Create SQL migration and update database.types.ts**

```sql
-- supabase/migrations/20261004000001_workstream_c_manifest.sql
-- Workstream C: Passenger Manifest and Attendance Check-in Schema
ALTER TABLE booking_passengers 
ADD COLUMN IF NOT EXISTS is_checked_in BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;

-- RLS Policy: Allow travel agents to update check-in status for passengers in their bookings
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'booking_passengers' 
        AND policyname = 'Agents can update manifest checkin status'
    ) THEN
        CREATE POLICY "Agents can update manifest checkin status"
        ON booking_passengers FOR UPDATE TO authenticated
        USING (
            booking_id IN (
                SELECT b.id FROM bookings b
                JOIN travel_agents a ON b.agent_id = a.id
                WHERE a.owner_id = auth.uid()
            )
        )
        WITH CHECK (
            booking_id IN (
                SELECT b.id FROM bookings b
                JOIN travel_agents a ON b.agent_id = a.id
                WHERE a.owner_id = auth.uid()
            )
        );
    END IF;
END $$;
```

Update `types/database.types.ts` on `booking_passengers` table (Row, Insert, Update) and `BookingPassenger` interface:
```typescript
is_checked_in: boolean;
checked_in_at: string | null;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test tests/manifest-migration.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20261004000001_workstream_c_manifest.sql types/database.types.ts tests/manifest-migration.test.mjs
git commit -m "feat(manifest): add database migration and types for passenger checkin"
```

---

### Task 2: CSV Helper & Manifest API Endpoints (Excel & Checkin)

**Files:**
- Create: `lib/manifest/csv-helper.ts`
- Create: `app/api/manifest/[scheduleId]/excel/route.ts`
- Create: `app/api/manifest/checkin/route.ts`
- Test: `tests/manifest-api.test.mjs`

**Interfaces:**
- Produces: `generateManifestCsv(passengers)`: string
- Produces: `GET /api/manifest/[scheduleId]/excel` -> CSV attachment response
- Produces: `POST /api/manifest/checkin` -> JSON `{ success: boolean, passenger: object }`

- [ ] **Step 1: Write failing test for CSV formatting and API logic**

```javascript
// tests/manifest-api.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateManifestCsv } from '../lib/manifest/csv-helper.ts';

test('Workstream C: generateManifestCsv includes UTF-8 BOM and escapes commas/quotes', () => {
  const sampleData = [
    {
      orderNumber: 1,
      fullName: 'Budi Santoso, S.Kom',
      gender: 'MALE',
      idCardNumber: '3301234567890001',
      phoneNumber: '081234567890',
      emergencyContact: 'Istri: 081987654321',
      specialNotes: 'Alergi seafood, "butuh obat"',
      bookingCode: 'NBK-TEST01',
      paymentStatus: 'PAID',
      isCheckedIn: true,
      checkedInAt: '2026-10-04T08:00:00Z',
    },
  ];

  const csv = generateManifestCsv(sampleData);
  assert.ok(csv.startsWith('\uFEFF'), 'CSV must start with UTF-8 BOM');
  assert.ok(csv.includes('"Budi Santoso, S.Kom"'), 'Names with comma must be quoted');
  assert.ok(csv.includes('""butuh obat""'), 'Quotes inside text must be escaped');
  assert.ok(csv.includes('Hadir'), 'Checked-in status must be translated to Hadir');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/manifest-api.test.mjs`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement lib/manifest/csv-helper.ts, excel route, and checkin route**

```typescript
// lib/manifest/csv-helper.ts
export interface ManifestCsvItem {
  orderNumber: number;
  fullName: string;
  gender: string | null;
  idCardNumber: string | null;
  phoneNumber: string | null;
  emergencyContact: string | null;
  specialNotes: string | null;
  bookingCode: string;
  paymentStatus: string;
  isCheckedIn: boolean;
  checkedInAt: string | null;
}

function escapeCsvField(field: string | number | null | undefined): string {
  if (field === null || field === undefined) return '""';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function generateManifestCsv(items: ManifestCsvItem[]): string {
  const header = [
    'No',
    'Nama Lengkap',
    'Gender',
    'NIK / No Identitas',
    'WhatsApp',
    'Kontak Darurat',
    'Catatan Khusus',
    'Kode Booking',
    'Status Bayar',
    'Status Kehadiran',
    'Waktu Check-in',
  ].join(',');

  const rows = items.map((item) => {
    const genderText = item.gender === 'MALE' ? 'Laki-laki' : item.gender === 'FEMALE' ? 'Perempuan' : '-';
    const checkinStatus = item.isCheckedIn ? 'Hadir' : 'Belum Hadir';
    const checkinTime = item.checkedInAt ? new Date(item.checkedInAt).toLocaleString('id-ID') : '-';

    return [
      item.orderNumber,
      escapeCsvField(item.fullName),
      escapeCsvField(genderText),
      escapeCsvField(item.idCardNumber || '-'),
      escapeCsvField(item.phoneNumber || '-'),
      escapeCsvField(item.emergencyContact || '-'),
      escapeCsvField(item.specialNotes || '-'),
      escapeCsvField(item.bookingCode),
      escapeCsvField(item.paymentStatus),
      escapeCsvField(checkinStatus),
      escapeCsvField(checkinTime),
    ].join(',');
  });

  return '\uFEFF' + [header, ...rows].join('\r\n');
}
```

Implement `app/api/manifest/[scheduleId]/excel/route.ts`:
- Check authenticated user.
- Query schedule with agent verification (`travel_agents.owner_id = user.id`).
- Fetch passengers from `bookings` for this schedule where `payment_status = 'PAID'`.
- Return CSV with headers `Content-Type: text/csv; charset=utf-8` and `Content-Disposition: attachment; filename="manifes-[scheduleId].csv"`.

Implement `app/api/manifest/checkin/route.ts`:
- Check authenticated user.
- Accept `{ passengerId: string, isCheckedIn: boolean }`.
- Update `booking_passengers` with `is_checked_in: isCheckedIn, checked_in_at: isCheckedIn ? new Date().toISOString() : null`.
- Return `{ success: true, isCheckedIn, checkedInAt }`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test tests/manifest-api.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/manifest/csv-helper.ts app/api/manifest/ tests/manifest-api.test.mjs
git commit -m "feat(manifest): add CSV export helper and manifest API endpoints"
```

---

### Task 3: PDF Print-Ready Document Route

**Files:**
- Create: `app/api/manifest/[scheduleId]/pdf/route.ts`
- Test: `tests/manifest-pdf.test.mjs`

**Interfaces:**
- Produces: `GET /api/manifest/[scheduleId]/pdf` -> HTML Document with print layout and auto-trigger print dialog.

- [ ] **Step 1: Write test for PDF route output**

```javascript
// tests/manifest-pdf.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Workstream C: PDF route file exists and has print stylesheet and agent kop', () => {
  const pdfRoutePath = path.resolve('app/api/manifest/[scheduleId]/pdf/route.ts');
  assert.ok(fs.existsSync(pdfRoutePath), 'PDF route must exist');
  const code = fs.readFileSync(pdfRoutePath, 'utf8');
  assert.ok(code.includes('@media print'), 'Must include media print CSS');
  assert.ok(code.includes('MANIFES PENUMPANG'), 'Must include manifest title header');
  assert.ok(code.includes('window.print()'), 'Must include print trigger');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/manifest-pdf.test.mjs`
Expected: FAIL (file does not exist)

- [ ] **Step 3: Implement app/api/manifest/[scheduleId]/pdf/route.ts**

Generate a clean, high-contrast, professional printable HTML view:
- A4 landscape print CSS (`@page { size: A4 landscape; margin: 12mm; }`).
- Header kop containing business name, office address, WhatsApp contact, trip package title, departure date, and booking statistics.
- Elegant table with 10 columns: No, Nama Lengkap, L/P, No. Identitas, Kontak WhatsApp, Kontak Darurat, Catatan Khusus, Kode Booking, Status Presensi, Tanda Tangan.
- Field signature section at bottom: Tour Leader / Koordinator and Pengemudi / Driver.
- Floating "Cetak / Simpan PDF" button (hidden on `@media print`) with script executing `window.print()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test tests/manifest-pdf.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/manifest/[scheduleId]/pdf/route.ts tests/manifest-pdf.test.mjs
git commit -m "feat(manifest): add printable PDF manifest document route"
```

---

### Task 4: Interactive Manifest UI Components (Passenger Table & Check-in Button)

**Files:**
- Create: `components/manifest/checkin-button.tsx`
- Create: `components/manifest/passenger-table.tsx`
- Test: `tests/manifest-components.test.mjs`

**Interfaces:**
- Produces: `<CheckinButton passengerId={string} initialChecked={boolean} initialTime={string | null} onToggle={(checked: boolean, time: string | null) => void} />`
- Produces: `<PassengerTable passengers={PassengerManifestData[]} scheduleTitle={string} />`

- [ ] **Step 1: Write test for components structure**

```javascript
// tests/manifest-components.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Workstream C: PassengerTable and CheckinButton files exist', () => {
  const tablePath = path.resolve('components/manifest/passenger-table.tsx');
  const btnPath = path.resolve('components/manifest/checkin-button.tsx');
  assert.ok(fs.existsSync(tablePath), 'PassengerTable component must exist');
  assert.ok(fs.existsSync(btnPath), 'CheckinButton component must exist');

  const tableCode = fs.readFileSync(tablePath, 'utf8');
  assert.ok(tableCode.includes('searchQuery') || tableCode.includes('filter'), 'Must have search/filter logic');
  assert.ok(!tableCode.includes('—'), 'Must not contain em dash');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/manifest-components.test.mjs`
Expected: FAIL

- [ ] **Step 3: Implement CheckinButton and PassengerTable**

1. `components/manifest/checkin-button.tsx`:
   - Interactive button with optimistic state update.
   - Calls `POST /api/manifest/checkin`.
   - Handles network loading indicator and rollback on failure.
   - Shows "Tandai Hadir" (gray/outline) or "Hadir • [jam]" (emerald green badge/button).

2. `components/manifest/passenger-table.tsx`:
   - Instant search input (matches name, ID card, WhatsApp, or booking code).
   - Filter chips for Gender (Semua, Laki-laki, Perempuan) and Kehadiran (Semua, Hadir, Belum Hadir).
   - Summary status counters in table header.
   - High-contrast, clean antislop table design with clear typography.
   - Responsive horizontal scroll for small screens and quick WhatsApp click link.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test tests/manifest-components.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/manifest/ tests/manifest-components.test.mjs
git commit -m "feat(manifest): create passenger table and checkin toggle components"
```

---

### Task 5: Backoffice Manifest Page & Navigation Integration

**Files:**
- Create: `app/(backoffice)/dashboard/schedules/[id]/manifest/page.tsx`
- Modify: `components/dashboard/schedules-list.tsx`
- Test: Full validation via `npm test`, `npx tsc --noEmit`, and `npm run build`

**Interfaces:**
- Produces: Route `/dashboard/schedules/[id]/manifest`
- Connects: "Lihat Manifes" button on schedule cards in `/dashboard/schedules`

- [ ] **Step 1: Implement app/(backoffice)/dashboard/schedules/[id]/manifest/page.tsx**

- Server Component:
  - Validates user session (`supabase.auth.getUser()`).
  - Fetches schedule details, tour package, and travel agent profile.
  - Verifies ownership (`agent.owner_id === user.id`).
  - Fetches bookings with status `PAID` and their `booking_passengers`.
  - Computes summary: Total Pax, Hadir (Checked-in), Belum Hadir, Sisa Kuota.
  - Action buttons: "Unduh PDF" (`/api/manifest/${id}/pdf`), "Unduh Excel" (`/api/manifest/${id}/excel`), "Kembali".
  - Renders `<PassengerTable />`.

- [ ] **Step 2: Add "Lihat Manifes" action to components/dashboard/schedules-list.tsx**

- Add action button on each schedule card linking to `/dashboard/schedules/${schedule.id}/manifest` with `Users` or `ClipboardList` icon and descriptive title.

- [ ] **Step 3: Run full verification suite**

Run: `npm test`
Expected: All 26+ tests PASS

Run: `npx tsc --noEmit`
Expected: 0 errors

Run: `npm run build`
Expected: Build succeeds and compiles `/dashboard/schedules/[id]/manifest`

- [ ] **Step 4: Commit**

```bash
git add app/(backoffice)/dashboard/schedules/[id]/manifest/page.tsx components/dashboard/schedules-list.tsx
git commit -m "feat(manifest): add manifest page and integrate navigation in schedules list"
```
