# Nusabook Foundation Architecture & Database Schema Design

* **Tanggal**: 2026-09-28
* **Status**: Approved by User
* **Ruang Lingkup**: Inisialisasi Fondasi Proyek Nusabook (MVP Phase 1: Next.js App Router, Supabase Migration Suite, Concurrency Locking, Pluggable Payment & Notification Adapters)

---

## 1. Latar Belakang & Tujuan

Proyek Nusabook memiliki spesifikasi komprehensif pada [PRD.md](file:///home/aniiporangbaik/development/projects/Nusabook/PRD.md) dan [SRS.md](file:///home/aniiporangbaik/development/projects/Nusabook/SRS.md). Dokumen desain ini menetapkan arsitektur fondasi teknis yang kokoh sebelum membangun modul fungsional Storefront, Booking Engine, dan Operator Backoffice.

Tujuan utama fondasi:
1. **Scaffolding Proyek**: Setup Next.js 15+ (App Router, TypeScript strict, Tailwind CSS) di root direktori dengan struktur yang modular dan terukur.
2. **Skema Basis Data 3NF & Migrasi Deklaratif**: Menyiapkan file migrasi SQL terversi di `supabase/migrations/` yang mencakup 7 tabel inti, enumerasi, dan indeks sesuai SRS Bab 5.
3. **Mekanisme Penguncian Kuota Konkuren (Concurrency-Safe Slot Locking)**: Menjamin tidak terjadi *overbooking* saat pemesanan serentak via stored procedure PostgreSQL `reserve_trip_quota` dengan *pessimistic lock* (`SELECT ... FOR UPDATE`).
4. **Pluggable Payment Gateway Adapter**: Abstraksi layer pembayaran yang mendukung **Mock/Simulator** (untuk pengujian instan tanpa menunggu proses verifikasi legalitas gateway), **Manual Bank Transfer** (untuk kebutuhan operasional UMKM), dan siap dihubungkan ke gateway resmi (Tripay/Xendit/Midtrans) di kemudian hari.
5. **Pluggable Notification Adapter**: Abstraksi pengiriman notifikasi WhatsApp/Email yang mendukung *mock logger* saat dev dan siap diintegrasikan dengan API WhatsApp (Wablas/Fonnte).

---

## 2. Arsitektur Proyek & Struktur Direktori

### 2.1 Tech Stack
* **Framework**: Next.js 15+ (App Router, React 19, TypeScript strict mode)
* **Styling**: Tailwind CSS dengan palet warna Nusabook:
  * Brand Primary: Biru Samudra (`#0D47A1` / HSL tailored)
  * Brand Accent: Oranye Senja (`#F57C00`)
  * Surface & Neutral: Slate / Zinc palette
* **BaaS / Backend**: Supabase (PostgreSQL 15+, Auth GoTrue, Storage, RLS)
* **Klien Database**: `@supabase/supabase-js`, `@supabase/ssr`
* **Icons & UI Utilities**: `lucide-react`, `clsx`, `tailwind-merge`

### 2.2 Tata Letak Direktori
```text
Nusabook/
├── app/
│   ├── (auth)/                  # Rute autentikasi (login, register, reset-password)
│   ├── (backoffice)/            # Dashboard mitra travel & superadmin
│   ├── (storefront)/            # Halaman katalog dinamis agen [slug]
│   ├── api/
│   │   ├── bookings/            # Endpoint reservasi & kuota
│   │   └── webhooks/payment/    # Endpoint webhook pembayaran
│   ├── globals.css              # Setup warna tema, typography, base layout
│   ├── layout.tsx               # Root layout aplikasi
│   └── page.tsx                 # Landing page & direktori marketplace publik
├── components/
│   ├── ui/                      # Komponen atomik (button, card, input, badge, modal)
│   └── shared/                  # Header, footer, navigasi
├── lib/
│   ├── payment/                 # Payment Adapter Layer
│   │   ├── types.ts             # Interface PaymentGateway, Invoice, Callback
│   │   ├── mock-provider.ts     # Simulator pembayaran untuk dev & staging
│   │   ├── manual-transfer.ts   # Handler transfer manual dengan bukti bayar
│   │   └── index.ts             # Payment gateway factory
│   ├── notifications/           # Notification Adapter Layer
│   │   ├── types.ts             # Interface NotificationProvider
│   │   └── mock-provider.ts     # Console & debug notification logger
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client (createBrowserClient)
│   │   ├── server.ts            # Server Supabase client (createServerClient)
│   │   └── middleware.ts        # Session & token refresher
│   └── utils.ts                 # Helper format Rupiah (IDR), waktu, text
├── types/
│   └── database.types.ts        # TypeScript typings untuk tabel, view, dan enums
├── supabase/
│   ├── migrations/
│   │   ├── 20260928000001_initial_schema.sql      # Tabel 3NF & enumerasi
│   │   ├── 20260928000002_concurrency_locking.sql # reserve_trip_quota & release
│   │   ├── 20260928000003_rls_policies.sql        # Kebijakan Row Level Security
│   │   └── 20260928000004_seed_data.sql           # Data agen dan trip contoh
│   └── seed.sql
├── .env.example                 # Dokumentasi variabel lingkungan
└── middleware.ts                # Next.js Edge Middleware
```

---

## 3. Desain Basis Data & Migrasi SQL

### 3.1 Enumerasi & Tabel Inti (3NF)
1. **`user_role`**: `'superadmin'`, `'agent_owner'`, `'agent_staff'`.
2. **`package_category`**: `'open_trip'`, `'private_trip'`.
3. **`schedule_status`**: `'OPEN'`, `'CLOSED'`, `'SOLD_OUT'`, `'CANCELLED'`.
4. **`booking_status`**: `'UNPAID'`, `'PAID'`, `'EXPIRED'`, `'CANCELLED'`, `'REFUNDED'`.
5. **`payout_status`**: `'REQUESTED'`, `'APPROVED'`, `'TRANSFERRED'`, `'REJECTED'`.

Tabel-tabel:
* **`profiles`**: Terhubung ke `auth.users(id)` via Foreign Key ON DELETE CASCADE.
* **`travel_agents`**: Menyimpan identitas UMKM tour & travel, nomor kontak WhatsApp resmi, nomor rekening bank, dan `slug` unik etalase.
* **`tour_packages`**: Katalog paket wisata per agen dengan itinerary bertahap, fasilitas included/excluded, dan kebijakan pembatalan.
* **`trip_schedules`**: Jadwal tanggal keberangkatan, harga per pax, kapasitas kuota total, kuota terpesan sementara (`reserved_quota`), dan kuota terbayar (`booked_quota`).
* **`bookings`**: Transaksi reservasi dengan kode unik `booking_code`, rincian pax, total nominal, potongan komisi platform 2% (`platform_fee`), batas waktu pembayaran (TTL 20 menit), dan status bayar.
* **`booking_passengers`**: Manifes data peserta untuk setiap pemesanan.
* **`agent_payouts`**: Rekapitulasi permohonan pencairan dana tiket oleh agen.

### 3.2 Concurrency-Safe Stored Procedures
* **`reserve_trip_quota(p_schedule_id UUID, p_pax INT) RETURNS BOOLEAN`**:
  * Menggunakan `SELECT ... FOR UPDATE` untuk mengunci baris `trip_schedules`.
  * Memeriksa kondisi: `(reserved_quota + booked_quota + p_pax) <= total_quota`.
  * Jika cukup: `reserved_quota = reserved_quota + p_pax`, increment `version`, return `TRUE`.
  * Jika tidak cukup: return `FALSE`.
* **`release_trip_quota(p_schedule_id UUID, p_pax INT)`**:
  * Mengurangi `reserved_quota` ketika transaksi kadaluarsa atau dibatalkan.
* **`confirm_trip_quota(p_schedule_id UUID, p_pax INT)`**:
  * Mengurangi `reserved_quota` dan menambah `booked_quota` saat status pembayaran berubah menjadi `PAID`.

### 3.3 Row Level Security (RLS)
* **Katalog Publik**: `SELECT` diizinkan untuk `travel_agents` yang aktif, `tour_packages` yang terpublikasi, dan `trip_schedules` yang berstatus `OPEN`.
* **Backoffice Mitra**: Operasi `INSERT`, `UPDATE`, `DELETE` hanya diizinkan untuk agen yang terautentikasi sesuai kepemilikan `agent_id`.
* **Pesanan**: Agen hanya dapat melihat transaksi pesanan milik agennya sendiri. Superadmin memiliki hak akses menyeluruh.

---

## 4. Layer Pembayaran & Notifikasi (Adapter Pattern)

### 4.1 Interface `PaymentGateway`
```typescript
export interface CreateInvoiceParams {
  bookingCode: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tripTitle: string;
  expiryMinutes: number;
}

export interface InvoiceResult {
  invoiceId: string;
  paymentUrl?: string;
  qrCodeUrl?: string;
  virtualAccountNumber?: string;
  paymentMethod: string;
  expiresAt: Date;
}

export interface PaymentGateway {
  createInvoice(params: CreateInvoiceParams): Promise<InvoiceResult>;
  verifyCallback(payload: any, headers?: Record<string, string>): Promise<{
    isValid: boolean;
    bookingCode: string;
    status: 'PAID' | 'EXPIRED' | 'FAILED';
    transactionId: string;
  }>;
}
```

### 4.2 Implementasi Adapter
1. **`MockPaymentProvider`**: Digunakan saat pengembangan lokal & staging (`PAYMENT_PROVIDER=mock`). Menghasilkan URL pembayaran simulasi dengan tombol "Bayar Sekarang" yang langsung memicu webhook status `PAID` dan pengujian kuota.
2. **`ManualTransferProvider`**: Menyajikan informasi nomor rekening bank resmi agen/platform dan formulir unggah bukti transfer.
3. **Live Gateway Adapter (Placeholder)**: Siap dihubungkan ke Tripay / Xendit / Midtrans saat akun dan kredensial API sudah tersedia.

### 4.3 Copy Notifikasi & Pesan Error
Sesuai arahan pengguna, pesan ketika kuota habis tidak bertele-tele:
> **"Maaf, kuota kursi untuk jadwal ini sudah habis."**

---

## 5. Rencana Pengujian & Kriteria Keberhasilan

1. **Build & Typecheck**:
   * Perintah `npm run build` dan `npx tsc --noEmit` berjalan tanpa error.
2. **Integritas Skema SQL**:
   * Seluruh file migrasi di `supabase/migrations/` valid secara sintaks PostgreSQL 15+.
   * Menjalankan kueri pengujian konkurensi pada `reserve_trip_quota` untuk memastikan kuota tidak dapat bernilai negatif atau melebihi `total_quota`.
3. **Koneksi Supabase Helper**:
   * Helper klien Supabase (browser & server) dapat membaca konfigurasi dari environment variables secara aman.
4. **Payment Abstraction**:
   * Mock payment provider berhasil memproses simulasi invoice dan callback status bayar.
