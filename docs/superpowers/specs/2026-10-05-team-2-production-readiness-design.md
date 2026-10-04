# Spesifikasi Desain Arsitektur: Tim 2 (Engineering & Production Readiness)

* **Tanggal**: 2026-10-05
* **Target Branch**: `feat/production-readiness`
* **Status**: Disetujui (Approved)
* **Dokumen Rujukan**: `docs/DUAL_TEAM_EXECUTION_ROADMAP.md`, `PRD.md`, `SRS.md`
* **Pola Arsitektur**: Modular Service Layer & Adapter Pattern (Next.js 15 App Router, Supabase PostgreSQL, pgcrypto, Fonnte, Tripay)

---

## 1. Latar Belakang & Tujuan

Tim 2 bertanggung jawab untuk menyempurnakan keandalan teknis, keamanan kepatuhan hukum privasi (UU PDP No. 27/2022), live database data binding, dan penyediaan antarmuka operasional (manual booking walk-in & super admin portal) agar platform Nusabook siap menerima transaksi keuangan riil dari 10–20 mitra UMKM travel pilot di lapangan tanpa kendala operasional.

### Batasan Zero-Conflict Git
Untuk menjaga independensi dengan Tim 1 (UI Redesign & Google Stitch Design System):
- **Domain Tim 2**: `lib/**`, `app/api/**`, `supabase/migrations/**`, `types/**`, serta file komponen headless mandiri `components/dashboard/ManualBookingModal.tsx`.
- **Aturan**: Tim 2 dilarang mengubah file style visual styling, token warna, atau layout global milik Tim 1 (`components/storefront/**`, `components/dashboard/layout*`, CSS Tailwind).

---

## 2. Rincian Modul & Arsitektur

```text
[ Storefront / Backoffice Client ]
                │
                ▼ (HTTP / Server Action)
[ Route Handlers: app/api/** ]
   ├── /api/bookings/manual             (Manual Walk-in Booking API)
   ├── /api/admin/agents/[id]/verify    (Verifikasi Legalitas Agen)
   └── /api/admin/payouts/[id]/approve  (Persetujuan Settlement 98% / 2%)
                │
                ▼ (Adapter & Service Layer)
[ Business Service Modules: lib/** ]
   ├── lib/bookings/manual-booking.ts   -> Validasi kuota atomik, status PAID, booking code
   ├── lib/security/pdp-crypto.ts       -> Enkripsi simetris AES-256 / pgcrypto NIK & data masking
   ├── lib/admin/settlement.ts          -> Kalkulasi potongan 2% platform fee & settlement
   ├── lib/notifications/providers/     -> Fonnte WA Provider + Email Fallback (retry 3x)
   └── lib/payment/providers/           -> Tripay Payment Provider Live Engine
                │
                ▼ (Supabase Postgres Client)
[ Database Engine & Migrations: supabase/migrations/** ]
   ├── 20261005000001_nik_encryption.sql -> Ekstensi pgcrypto, trigger encrypt, RLS view
   └── Stored Procedure / RLS Policies   -> confirm_trip_quota, superadmin role checks
```

---

## 3. Rencana Bertahap (3 Fase Pelaksanaan)

### Fase 1: Live Storefront Data & Manual Booking Entry (Task 2.1 & Task 2.2)

#### 1. Live Storefront Data Fetching
- **Target File**:
  - `app/(storefront)/[slug]/page.tsx`
  - `app/(storefront)/[slug]/packages/[packageSlug]/page.tsx`
- **Spesifikasi Teknis**:
  - Hapus seluruh fallback mock data (SCHEDULES statis, dummy travel agent).
  - Lakukan kueri langsung ke Supabase:
    ```typescript
    const { data: agentData } = await supabase
      .from("travel_agents")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (!agentData) {
      notFound();
    }
    ```
  - Ambil paket dan jadwal keberangkatan riil dari tabel `tour_packages` dan `trip_schedules` dengan filter:
    - `is_published = true`
    - `departure_date >= CURRENT_DATE`
    - Tampilkan sisa kuota (`quota_remaining`).

#### 2. Manual Booking Walk-in Service & Modal
- **Target File**:
  - `lib/bookings/manual-booking.ts`
  - `app/api/bookings/manual/route.ts`
  - `components/dashboard/ManualBookingModal.tsx`
- **Spesifikasi Teknis**:
  - Menerima payload input walk-in dari staf agen: `scheduleId`, `packageId`, `agentId`, `customerName`, `customerPhone`, `customerEmail`, `paxCount`, `paymentNotes`, dan daftar penumpang.
  - Memvalidasi ketersediaan sisa kuota sebelum eksekusi.
  - Menjalankan pengurangan kuota atomik via stored procedure `confirm_trip_quota`.
  - Menyimpan data pemesanan ke tabel `bookings` dengan parameter:
    - `booking_code`: format `MAN-YYYYMMDD-XXXX`
    - `status`: `PAID`
    - `payment_method`: `MANUAL`
    - `is_manual_entry`: `true`
    - `paid_at`: timestamp waktu pencatatan
  - Menyimpan data penumpang ke `booking_passengers` terenkripsi.

---

### Fase 2: Super Admin Governance & UU PDP Compliance (Task 2.3 & Task 2.4)

#### 1. Super Admin Middleware Guard & API
- **Target File**:
  - `lib/admin/settlement.ts`
  - `app/api/admin/agents/[id]/verify/route.ts`
  - `app/api/admin/payouts/[id]/approve/route.ts`
  - `middleware.ts`
- **Spesifikasi Teknis**:
  - **Middleware Guard**: Melindungi seluruh rute `/admin/**` dan `/api/admin/**`. Hanya pengguna terotentikasi dengan metadata/kolom `role === 'superadmin'` yang dapat mengakses (HTTP 403 Forbidden untuk unauthorized).
  - **Agent Verification (`/api/admin/agents/[id]/verify`)**:
    - Menerima update status: `is_verified: boolean`, `notes?: string`.
    - Mengupdate `travel_agents.is_verified` dan mencatat timestamp verifikasi legalitas agen.
  - **Payout Approval & Settlement (`/api/admin/payouts/[id]/approve`)**:
    - Menghitung split fee:
      - Total Bruto = `gross_amount`
      - Platform Fee (2%) = `Math.round(gross_amount * 0.02)`
      - Net Transfer Mitra (98%) = `gross_amount - platform_fee`
    - Menerima nomor referensi transfer bank (`bank_ref_number`).
    - Mengupdate status penarikan dana menjadi `TRANSFERRED` dan mencatat riwayat mutasi.

#### 2. Kepatuhan UU PDP No. 27/2022 (Enkripsi NIK Penumpang)
- **Target File**:
  - `supabase/migrations/20261005000001_nik_encryption.sql`
  - `lib/security/pdp-crypto.ts`
- **Spesifikasi Teknis**:
  - Ekstensi `pgcrypto` diaktifkan di PostgreSQL Supabase.
  - Kolom `id_card_encrypted bytea` ditambahkan pada `booking_passengers`.
  - Fungsi simetris PostgreSQL:
    ```sql
    pgp_sym_encrypt(NEW.id_card_number, current_setting('app.settings.encryption_key', true))
    ```
  - Trigger `BEFORE INSERT OR UPDATE` pada `booking_passengers` mengenkripsi NIK secara otomatis di level database.
  - Helper aplikasi `lib/security/pdp-crypto.ts`:
    - Fungsi enkripsi simetris (AES-256-GCM / pgcrypto) untuk lingkungan aplikasi.
    - Fungsi masking data NIK: `maskNik(nik: string): string` -> menghasilkan format aman `3507********0001` agar data mentah tidak bocor ke antarmuka umum atau berkas log.

---

### Fase 3: Live Vendor Providers (Payment & WhatsApp) (Task 2.5)

#### 1. Fonnte WhatsApp Live Provider & Resend/Nodemailer Fallback
- **Target File**:
  - `lib/notifications/providers/fonnte-provider.ts`
  - `lib/notifications/providers/email-fallback-provider.ts`
  - `lib/notifications/index.ts`
- **Spesifikasi Teknis**:
  - Implementasi antarmuka `NotificationProvider`.
  - Memanggil REST API endpoint Fonnte: `POST https://api.fonnte.com/send` dengan header `Authorization: process.env.FONNTE_TOKEN`.
  - Menerapkan mekanisme retry 3 kali dengan jeda exponential backoff (1s, 2s, 4s).
  - Jika kegagalan berlanjut setelah 3x percobaan, eksekusi dialihkan secara *fallback* ke `EmailFallbackProvider` untuk mengirimkan notifikasi e-tiket via email pemesan.
  - Penambahan environment variable: `FONNTE_TOKEN`, `EMAIL_SMTP_HOST`, `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASS`.

#### 2. Tripay Payment Gateway Live Engine
- **Target File**:
  - `lib/payment/providers/tripay-provider.ts`
  - `lib/payment/index.ts`
- **Spesifikasi Teknis**:
  - Mengonfigurasi kredensial produksi/sandbox Tripay via environment: `TRIPAY_API_KEY`, `TRIPAY_PRIVATE_KEY`, `TRIPAY_MERCHANT_CODE`.
  - Validasi callback signature HMAC-SHA256 yang aman terhadap payload webhook mentah dari Tripay.
  - Pemetikan status transaksi: `PAID`, `SETTLEMENT`, `SUCCESS` -> `PAID`; `EXPIRED`, `CANCELLED` -> `EXPIRED`; `FAILED` -> `FAILED`.

---

## 4. Strategi Pengujian Otomatis

Seluruh modul Tim 2 diverifikasi dengan suite pengujian otomatis (`npm test`):
1. **`tests/team2-manual-booking.test.mjs`**:
   - Memastikan validasi input gagal jika pax < 1 atau nama pemesan kosong.
   - Memastikan pemesanan manual menghasilkan `status = 'PAID'`, `is_manual_entry = true`, dan mengunci kuota.
   - Memastikan proteksi terhadap kuota habis (anti-overbooking).
2. **`tests/team2-admin-governance.test.mjs`**:
   - Memastikan proteksi otentikasi role superadmin (403 untuk akses tidak berwenang).
   - Memastikan kalkulasi komisi 2% dan transfer net 98% akurat hingga digit desimal/rupiah.
   - Memastikan verifikasi agen mengubah status aktif.
3. **`tests/team2-pdp-security.test.mjs`**:
   - Memastikan enkripsi dan dekripsi simetris data NIK berfungsi bolak-balik tanpa kehilangan data.
   - Memastikan masking NIK menyamarkan 8 digit tengah dengan tanda bintang (`*`).
   - Memastikan sintaks file migrasi SQL valid.
4. **`tests/team2-live-providers.test.mjs`**:
   - Memastikan formatting request dan token Fonnte.
   - Memastikan logika retry 3x dan pemicuan email fallback berjalan mulus saat WA gagal.
   - Memastikan verifikasi signature webhook Tripay menolak signature palsu dan menerima signature valid.

---

## 5. Kriteria Penerimaan (Acceptance Criteria)

- [ ] Seluruh kueri pada storefront publik (`/[slug]` dan `/[slug]/packages/[packageSlug]`) membaca data live dari Supabase; mengembalikan `notFound()` bila agen/jadwal tidak ditemukan.
- [ ] Fitur manual booking mencatat transaksi tunai/walk-in dengan status `PAID` dan kuota langsung terkunci di database.
- [ ] Endpoint superadmin terlindungi otentikasi role, mampu memverifikasi agen dan memproses payout 98%/2%.
- [ ] NIK penumpang tersimpan terenkripsi sesuai amanat UU PDP No. 27/2022 dan dimasking saat ditampilkan.
- [ ] Driver WhatsApp Fonnte dan Tripay Payment Gateway berfungsi dengan fallback dan signature yang valid.
- [ ] `npm test` lulus 100% (27 tes awal + seluruh tes baru Tim 2).
- [ ] `npm run build` sukses tanpa kesalahan kompilasi TypeScript atau Next.js.
