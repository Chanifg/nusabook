# Team 2: Production Readiness & Engineering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menuntaskan seluruh kesiapan teknis backend, live data fetching storefront, formulir booking manual walk-in, proteksi keamanan privasi UU PDP (enkripsi NIK), tata kelola Super Admin API, dan live provider WhatsApp (Fonnte) & Payment Gateway (Tripay) sesuai amanat `docs/DUAL_TEAM_EXECUTION_ROADMAP.md`.

**Architecture:** Menerapkan Modular Service Layer & Adapter Pattern di mana domain logika bisnis murni berada di `lib/**`, Next.js 15 route handlers di `app/api/**` sebagai controller, dan skema integritas di `supabase/migrations/**`. Menjamin isolasi penuh (zero merge conflict) dari pekerjaan UI Redesign Tim 1.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Supabase PostgreSQL, pgcrypto, Node.js crypto, Fonnte REST API, Tripay API.

## Global Constraints
- Target branch pengerjaan: `feat/production-readiness` (berasal dari branch utama).
- Dilarang memodifikasi layout/styling visual utama Tim 1 (`components/storefront/**`, `components/dashboard/layout*`, konfigurasi Tailwind).
- Kode harus lolos pengujian otomatis `npm test` dan `npm run build` di setiap akhir fase.
- Seluruh data NIK penumpang wajib dimasking (`3507********0001`) pada antarmuka publik dan terenkripsi simetris saat disimpan di basis data.

---

### Task 1: Storefront Live Database Fetching (Task 2.1)

**Files:**
- Modify: `app/(storefront)/[slug]/page.tsx`
- Modify: `app/(storefront)/[slug]/packages/[packageSlug]/page.tsx`
- Test: `tests/team2-storefront-live.test.mjs`

**Interfaces:**
- Consumes: `@/lib/supabase/server` (`createClient`), `next/navigation` (`notFound`)
- Produces: Live SSR rendering dari data `travel_agents`, `tour_packages`, dan `trip_schedules` tanpa fallback mock statis.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/team2-storefront-live.test.mjs
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/team2-storefront-live.test.mjs`
Expected: FAIL karena `app/(storefront)/[slug]/page.tsx` masih memuat fallback string dan `packageSlug/page.tsx` masih memuat `SCHEDULES`.

- [ ] **Step 3: Refactor `app/(storefront)/[slug]/page.tsx` & `[packageSlug]/page.tsx`**

Hapus fallback data dummy pada `app/(storefront)/[slug]/page.tsx`:
```typescript
  // Query real agent by slug
  const { data: agentData } = (await supabase
    .from("travel_agents")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()) as any;

  if (!agentData) {
    notFound();
  }

  const { data: pkgData } = (await supabase
    .from("tour_packages")
    .select("*, trip_schedules(*)")
    .eq("agent_id", agentData.id)
    .eq("is_published", true)) as any;
  const packages = pkgData || [];
```
Dan refactor `app/(storefront)/[slug]/packages/[packageSlug]/page.tsx` menjadi Server Component atau Hybrid yang mengambil data jadwal `trip_schedules` live dari Supabase berdasarkan `packageSlug` dan memanggil `notFound()` jika paket tidak ada.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/team2-storefront-live.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/team2-storefront-live.test.mjs app/(storefront)/
git commit -m "feat(storefront): switch to live database queries with notFound guards"
```

---

### Task 2: Manual Booking Service & Route API (Task 2.2 Backend)

**Files:**
- Create: `lib/bookings/manual-booking.ts`
- Create: `app/api/bookings/manual/route.ts`
- Test: `tests/team2-manual-booking.test.mjs`

**Interfaces:**
- Consumes: `@/lib/supabase/server`, `types/database.types.ts`
- Produces: `processManualBooking(payload: ManualBookingInput): Promise<ManualBookingResult>`
- Endpoint: `POST /api/bookings/manual`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/team2-manual-booking.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { processManualBooking } from "../lib/bookings/manual-booking.js";

test("Manual Booking: Menolak pemesanan jika paxCount < 1 atau field wajib kosong", async () => {
  await assert.rejects(
    async () => {
      await processManualBooking({
        scheduleId: "",
        packageId: "pkg-1",
        agentId: "agent-1",
        customerName: "",
        customerPhone: "0812345678",
        customerEmail: "test@example.com",
        paxCount: 0,
        paymentMethod: "CASH",
        passengers: [],
      });
    },
    { message: /Validasi gagal: data pemesan dan kuota minimal 1 pax diperlukan/ }
  );
});

test("Manual Booking: Menghasilkan kode booking dengan prefix MAN- dan status PAID", async () => {
  // Simulasi dummy DB handler untuk unit testing
  const mockDb = {
    checkQuota: async () => ({ quota_remaining: 10 }),
    confirmQuota: async () => true,
    insertBooking: async (record) => ({ ...record, id: "b-123" }),
  };

  const result = await processManualBooking(
    {
      scheduleId: "sched-1",
      packageId: "pkg-1",
      agentId: "agent-1",
      customerName: "Ahmad Dahlan",
      customerPhone: "081234567890",
      customerEmail: "ahmad@example.com",
      paxCount: 2,
      paymentMethod: "CASH",
      totalAmount: 1500000,
      passengers: [
        { fullName: "Ahmad Dahlan", idCardNumber: "3507041234560001" },
        { fullName: "Fatimah", idCardNumber: "3507041234560002" },
      ],
    },
    mockDb
  );

  assert.ok(result.bookingCode.startsWith("MAN-"));
  assert.equal(result.status, "PAID");
  assert.equal(result.isManualEntry, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/team2-manual-booking.test.mjs`
Expected: FAIL (Cannot find module `../lib/bookings/manual-booking.js`)

- [ ] **Step 3: Write implementation of `lib/bookings/manual-booking.ts` and API route**

Buat `lib/bookings/manual-booking.ts`:
```typescript
export interface PassengerInput {
  fullName: string;
  idCardNumber?: string;
  phone?: string;
}

export interface ManualBookingInput {
  scheduleId: string;
  packageId: string;
  agentId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paxCount: number;
  paymentMethod: "CASH" | "DIRECT_TRANSFER";
  paymentNotes?: string;
  totalAmount?: number;
  passengers: PassengerInput[];
}

export interface ManualBookingResult {
  bookingId: string;
  bookingCode: string;
  status: "PAID";
  isManualEntry: true;
  paxCount: number;
}

export async function processManualBooking(
  input: ManualBookingInput,
  dbOverride?: any
): Promise<ManualBookingResult> {
  if (!input.scheduleId || !input.customerName || !input.customerPhone || input.paxCount < 1) {
    throw new Error("Validasi gagal: data pemesan dan kuota minimal 1 pax diperlukan");
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  const bookingCode = `MAN-${dateStr}-${rand}`;

  // Logika simpan DB & konfirmasi kuota atomik
  if (dbOverride) {
    const quota = await dbOverride.checkQuota(input.scheduleId);
    if (!quota || quota.quota_remaining < input.paxCount) {
      throw new Error("Kuota tidak mencukupi untuk pemesanan manual");
    }
    await dbOverride.confirmQuota(input.scheduleId, input.paxCount);
    const saved = await dbOverride.insertBooking({
      booking_code: bookingCode,
      schedule_id: input.scheduleId,
      package_id: input.packageId,
      agent_id: input.agentId,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      customer_email: input.customerEmail,
      pax_count: input.paxCount,
      total_amount: input.totalAmount || 0,
      status: "PAID",
      payment_method: "MANUAL",
      is_manual_entry: true,
      paid_at: now.toISOString(),
    });
    return {
      bookingId: saved.id,
      bookingCode,
      status: "PAID",
      isManualEntry: true,
      paxCount: input.paxCount,
    };
  }

  // Live Supabase implementation
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: schedule } = await supabase
    .from("trip_schedules")
    .select("quota_remaining, price")
    .eq("id", input.scheduleId)
    .single();

  if (!schedule || schedule.quota_remaining < input.paxCount) {
    throw new Error("Kuota tidak mencukupi untuk pemesanan manual");
  }

  const totalAmount = input.totalAmount || schedule.price * input.paxCount;

  // Insert booking
  const { data: booking, error: bErr } = await supabase
    .from("bookings")
    .insert({
      booking_code: bookingCode,
      schedule_id: input.scheduleId,
      package_id: input.packageId,
      agent_id: input.agentId,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      customer_email: input.customerEmail,
      pax_count: input.paxCount,
      total_amount: totalAmount,
      status: "PAID",
      payment_method: "MANUAL",
      is_manual_entry: true,
      paid_at: now.toISOString(),
      notes: input.paymentNotes,
    })
    .select("id")
    .single();

  if (bErr || !booking) throw new Error(bErr?.message || "Gagal menyimpan booking manual");

  // Kurangi kuota atomik
  await supabase.rpc("confirm_trip_quota", {
    p_schedule_id: input.scheduleId,
    p_pax_count: input.paxCount,
  });

  return {
    bookingId: booking.id,
    bookingCode,
    status: "PAID",
    isManualEntry: true,
    paxCount: input.paxCount,
  };
}
```

Buat endpoint controller `app/api/bookings/manual/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { processManualBooking } from "@/lib/bookings/manual-booking";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await processManualBooking(body);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/team2-manual-booking.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/bookings/manual-booking.ts app/api/bookings/manual/ tests/team2-manual-booking.test.mjs
git commit -m "feat(bookings): implement manual walk-in booking service and API endpoint"
```

---

### Task 3: Manual Booking UI Modal Component (Task 2.2 UI Extension)

**Files:**
- Create: `components/dashboard/ManualBookingModal.tsx`
- Test: `tests/team2-manual-booking-modal.test.mjs`

**Interfaces:**
- Consumes: `processManualBooking` / `/api/bookings/manual`
- Produces: Komponen `<ManualBookingModal isOpen={isOpen} onClose={...} onCreated={...} schedules={...} />`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/team2-manual-booking-modal.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("ManualBookingModal: File komponen mandiri tersedia dan mengekspor fungsi modal", () => {
  assert.ok(
    fs.existsSync("components/dashboard/ManualBookingModal.tsx"),
    "Komponen ManualBookingModal.tsx harus dibuat"
  );
  const content = fs.readFileSync("components/dashboard/ManualBookingModal.tsx", "utf8");
  assert.ok(content.includes("ManualBookingModal"), "Komponen harus mengekspor ManualBookingModal");
  assert.ok(content.includes("/api/bookings/manual"), "Komponen harus memanggil endpoint manual booking");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/team2-manual-booking-modal.test.mjs`
Expected: FAIL (File not found)

- [ ] **Step 3: Create `components/dashboard/ManualBookingModal.tsx`**

Implementasikan komponen modal dialog ramah pengguna: formulir nama pemesan, kontak WhatsApp, dropdown pilihan jadwal dengan sisa kuota, jumlah pax, pilihan metode pembayaran tunai/transfer, tombol submit yang memanggil `POST /api/bookings/manual`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/team2-manual-booking-modal.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/ManualBookingModal.tsx tests/team2-manual-booking-modal.test.mjs
git commit -m "feat(dashboard): add isolated ManualBookingModal component"
```

---

### Task 4: Super Admin Governance & API Guard (Task 2.3)

**Files:**
- Create: `lib/admin/settlement.ts`
- Create: `app/api/admin/agents/[id]/verify/route.ts`
- Create: `app/api/admin/payouts/[id]/approve/route.ts`
- Modify: `middleware.ts`
- Test: `tests/team2-admin-governance.test.mjs`

**Interfaces:**
- Produces:
  - `calculateSettlement(grossAmount: number): { platformFee: number, netPayout: number }`
  - Endpoint `POST /api/admin/agents/[id]/verify`
  - Endpoint `POST /api/admin/payouts/[id]/approve`
  - Role guard middleware for `/admin/**` & `/api/admin/**`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/team2-admin-governance.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { calculateSettlement } from "../lib/admin/settlement.js";

test("Settlement: Menghitung platform fee 2% dan transfer net 98% secara presisi", () => {
  const result = calculateSettlement(1000000);
  assert.equal(result.platformFee, 20000);
  assert.equal(result.netPayout, 980000);

  // Nilai ganjil
  const oddResult = calculateSettlement(375500);
  assert.equal(oddResult.platformFee, 7510);
  assert.equal(oddResult.netPayout, 367990);
});

test("Admin Route Handler: Files endpoint verify dan approve payout tersedia", () => {
  import("fs").then((fs) => {
    assert.ok(fs.existsSync("app/api/admin/agents/[id]/verify/route.ts"));
    assert.ok(fs.existsSync("app/api/admin/payouts/[id]/approve/route.ts"));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/team2-admin-governance.test.mjs`
Expected: FAIL (Cannot find module `../lib/admin/settlement.js`)

- [ ] **Step 3: Implement settlement calculation, admin routes, and middleware**

Buat `lib/admin/settlement.ts`:
```typescript
export interface SettlementResult {
  grossAmount: number;
  platformFee: number;
  netPayout: number;
}

export function calculateSettlement(grossAmount: number): SettlementResult {
  if (grossAmount < 0) throw new Error("Gross amount tidak boleh negatif");
  const platformFee = Math.round(grossAmount * 0.02);
  const netPayout = grossAmount - platformFee;
  return { grossAmount, platformFee, netPayout };
}
```

Implementasikan rute verify `app/api/admin/agents/[id]/verify/route.ts` dan payout approve `app/api/admin/payouts/[id]/approve/route.ts` dengan pengecekan header `x-user-role === 'superadmin'` atau session cookie.
Perbarui `middleware.ts` untuk memblokir rute `/admin/**` bagi pengunjung yang tidak memiliki hak akses `superadmin`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/team2-admin-governance.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/admin/settlement.ts app/api/admin/ middleware.ts tests/team2-admin-governance.test.mjs
git commit -m "feat(admin): implement superadmin settlement logic, routes, and middleware guard"
```

---

### Task 5: UU PDP Compliance & NIK Encryption (Task 2.4)

**Files:**
- Create: `supabase/migrations/20261005000001_nik_encryption.sql`
- Create: `lib/security/pdp-crypto.ts`
- Test: `tests/team2-pdp-security.test.mjs`

**Interfaces:**
- Produces:
  - `encryptNik(nik: string, secret?: string): string`
  - `decryptNik(cipherText: string, secret?: string): string`
  - `maskNik(nik: string): string` -> format `3507********0001`
  - PostgreSQL trigger & pgcrypto migration file

- [ ] **Step 1: Write the failing test**

```javascript
// tests/team2-pdp-security.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { encryptNik, decryptNik, maskNik } from "../lib/security/pdp-crypto.js";

test("PDP Crypto: Enkripsi dan dekripsi bolak-balik NIK berhasil", () => {
  const nik = "3507041234560001";
  const encrypted = encryptNik(nik);
  assert.notEqual(encrypted, nik);
  const decrypted = decryptNik(encrypted);
  assert.equal(decrypted, nik);
});

test("PDP Crypto: maskNik menyamarkan 8 digit tengah dengan tanda bintang", () => {
  const nik = "3507041234560001";
  const masked = maskNik(nik);
  assert.equal(masked, "3507********0001");
});

test("PDP Migration: Berkas migrasi SQL pgcrypto valid dan berisi trigger enkripsi", () => {
  const sql = fs.readFileSync(
    "supabase/migrations/20261005000001_nik_encryption.sql",
    "utf8"
  );
  assert.ok(sql.includes("CREATE EXTENSION IF NOT EXISTS pgcrypto;"));
  assert.ok(sql.includes("pgp_sym_encrypt"));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/team2-pdp-security.test.mjs`
Expected: FAIL (Cannot find module `../lib/security/pdp-crypto.js`)

- [ ] **Step 3: Implement `lib/security/pdp-crypto.ts` and SQL migration**

Buat `lib/security/pdp-crypto.ts` dengan Node.js `crypto` (AES-256-CBC/GCM):
```typescript
import crypto from "node:crypto";

const ALGORITHM = "aes-256-cbc";
const DEFAULT_KEY = process.env.PDP_ENCRYPTION_KEY || "nusabook_pdp_default_secret_key_32b!"; // 32 chars

export function maskNik(nik: string): string {
  if (!nik || nik.length < 8) return "********";
  const prefix = nik.slice(0, 4);
  const suffix = nik.slice(-4);
  const middleMask = "*".repeat(Math.max(0, nik.length - 8));
  return `${prefix}${middleMask}${suffix}`;
}

export function encryptNik(nik: string, secretKey: string = DEFAULT_KEY): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash("sha256").update(secretKey).digest();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(nik, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decryptNik(cipherText: string, secretKey: string = DEFAULT_KEY): string {
  const [ivHex, encrypted] = cipherText.split(":");
  if (!ivHex || !encrypted) throw new Error("Format ciphertext tidak valid");
  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.createHash("sha256").update(secretKey).digest();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
```

Buat `supabase/migrations/20261005000001_nik_encryption.sql`:
```sql
-- Migration: Kepatuhan UU PDP No. 27/2022 untuk Enkripsi NIK Penumpang
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE booking_passengers ADD COLUMN IF NOT EXISTS id_card_encrypted bytea;

-- Trigger enkripsi otomatis saat data penumpang ditambahkan atau diubah
CREATE OR REPLACE FUNCTION encrypt_passenger_nik()
RETURNS trigger AS $$
BEGIN
  IF NEW.id_card_number IS NOT NULL AND NEW.id_card_number != '' THEN
    NEW.id_card_encrypted := pgp_sym_encrypt(
      NEW.id_card_number,
      coalesce(current_setting('app.settings.encryption_key', true), 'nusabook_pdp_default_secret_key_32b!')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_encrypt_passenger_nik ON booking_passengers;
CREATE TRIGGER trg_encrypt_passenger_nik
BEFORE INSERT OR UPDATE ON booking_passengers
FOR EACH ROW EXECUTE FUNCTION encrypt_passenger_nik();
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/team2-pdp-security.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/security/pdp-crypto.ts supabase/migrations/20261005000001_nik_encryption.sql tests/team2-pdp-security.test.mjs
git commit -m "feat(security): implement UU PDP NIK encryption and data masking"
```

---

### Task 6: Fonnte WhatsApp Live Provider & Email Fallback (Task 2.5 Notification)

**Files:**
- Create: `lib/notifications/providers/fonnte-provider.ts`
- Create: `lib/notifications/providers/email-fallback-provider.ts`
- Modify: `lib/notifications/index.ts`
- Test: `tests/team2-live-notifications.test.mjs`

**Interfaces:**
- Consumes: `NotificationProvider` from `lib/notifications/types.ts`
- Produces: `FonnteWhatsAppProvider`, `EmailFallbackProvider`, automatic retry with backoff.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/team2-live-notifications.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { FonnteWhatsAppProvider } from "../lib/notifications/providers/fonnte-provider.js";
import { EmailFallbackProvider } from "../lib/notifications/providers/email-fallback-provider.js";

test("Fonnte WhatsApp Provider: Memformat payload dan header token secara tepat", async () => {
  let capturedUrl = "";
  let capturedHeaders = {};
  let capturedBody = {};

  const fakeFetch = async (url, options) => {
    capturedUrl = url;
    capturedHeaders = options.headers;
    capturedBody = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({ status: true, id: "msg-123" }),
    };
  };

  const provider = new FonnteWhatsAppProvider({
    token: "test_fonnte_token_123",
    fetchFn: fakeFetch,
  });

  const res = await provider.send({
    recipient: "081234567890",
    message: "Tiket Bromo Anda telah terbit!",
  });

  assert.equal(capturedUrl, "https://api.fonnte.com/send");
  assert.equal(capturedHeaders.Authorization, "test_fonnte_token_123");
  assert.equal(capturedBody.target, "081234567890");
  assert.equal(res.success, true);
});

test("Email Fallback Provider: Mengirimkan email jika WhatsApp gagal", async () => {
  const emailProvider = new EmailFallbackProvider();
  const res = await emailProvider.send({
    recipient: "user@example.com",
    subject: "Tiket Nusabook",
    body: "Detail tiket Bromo",
  });
  assert.equal(res.success, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/team2-live-notifications.test.mjs`
Expected: FAIL (Cannot find module `../lib/notifications/providers/fonnte-provider.js`)

- [ ] **Step 3: Implement `fonnte-provider.ts` and `email-fallback-provider.ts`**

Buat `lib/notifications/providers/fonnte-provider.ts` dengan logika retry 3 kali (1s, 2s, 4s backoff) dan graceful degradation.
Buat `lib/notifications/providers/email-fallback-provider.ts`.
Perbarui factory pada `lib/notifications/index.ts` agar memilih `FonnteWhatsAppProvider` jika `FONNTE_TOKEN` tersedia di environment.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/team2-live-notifications.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/notifications/ tests/team2-live-notifications.test.mjs
git commit -m "feat(notifications): add Fonnte WhatsApp provider with retry and email fallback"
```

---

### Task 7: Tripay Payment Gateway Live Engine & Webhook Verification (Task 2.5 Payment)

**Files:**
- Modify: `lib/payment/providers/tripay-provider.ts`
- Modify: `lib/payment/index.ts`
- Test: `tests/team2-tripay-live.test.mjs`

**Interfaces:**
- Produces: `TripayPaymentProvider` yang memverifikasi signature webhook HMAC-SHA256 produksi secara akurat.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/team2-tripay-live.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { TripayPaymentProvider } from "../lib/payment/providers/tripay-provider.js";

test("Tripay Live: Verifikasi signature HMAC-SHA256 valid dari callback webhook", async () => {
  const privateKey = "live_tripay_private_key_xyz";
  const provider = new TripayPaymentProvider({
    apiKey: "api_key",
    privateKey,
    merchantCode: "T123",
  });

  const payload = {
    reference: "TRX-9988",
    merchant_ref: "NB-202610-001",
    status: "PAID",
    total_amount: 750000,
  };

  const rawJson = JSON.stringify(payload);
  const validSignature = crypto
    .createHmac("sha256", privateKey)
    .update(rawJson)
    .digest("hex");

  const verification = await provider.verifyCallback(rawJson, {
    "x-callback-signature": validSignature,
  });

  assert.equal(verification.isValid, true);
  assert.equal(verification.status, "PAID");
  assert.equal(verification.paidAmount, 750000);
});
```

- [ ] **Step 2: Run test to verify it fails / passes**

Run: `node --test tests/team2-tripay-live.test.mjs`
Expected: FAIL jika parsing string raw body signature belum konsisten.

- [ ] **Step 3: Modify `lib/payment/providers/tripay-provider.ts`**

Sempurnakan parser verifikasi signature callback Tripay agar secara konsisten menghitung HMAC dari raw body JSON dan memetakan kode status transaksi produksi (`PAID`, `SETTLEMENT`, `EXPIRED`, `FAILED`).

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/team2-tripay-live.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/payment/ tests/team2-tripay-live.test.mjs
git commit -m "feat(payment): enhance Tripay provider for live HMAC signature callback"
```

---

### Task 8: End-to-End Suite Verification & Build Sanity Check

**Files:**
- Verification only

- [ ] **Step 1: Run complete test suite**

Run: `npm test`
Expected: PASS 100% (27 tests awal + 7 test suites baru Tim 2 = total 34+ passing tests)

- [ ] **Step 2: Run TypeScript compile & Next.js production build**

Run: `npm run build`
Expected: SUCCESS tanpa error compile TypeScript atau linting failure.

- [ ] **Step 3: Final Git Tag & Integration Ready Commit**

```bash
git add .
git commit -m "chore(team2): finalize production readiness milestone"
```
