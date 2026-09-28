# Nusabook

> **SaaS-Enabled Marketplace untuk Digitalisasi UMKM Tour & Travel di Indonesia**  
> Inisiatif Program Pembinaan Mahasiswa Wirausaha (P2MW) 2026 • Universitas Tidar, Magelang

---

## Tentang Nusabook

Nusabook adalah platform *SaaS-Enabled Marketplace* berbasis multi-tenant yang dirancang khusus untuk mendigitalisasi operasional harian dan pemasaran pelaku usaha tour and travel skala mikro, kecil, dan menengah (UMKM). Platform ini mengatasi masalah utama seperti overbooking kuota, rekapitulasi manifes manual via WhatsApp, dan ketiadaan website reservasi mandiri tanpa biaya awal (skema bagi hasil 2% per transaksi berhasil).

---

## Fitur Utama (MVP Phase 1)

1. **Digital Storefront No-Code (`/[slug]`)**  
   Setiap mitra agen wisata yang terdaftar secara otomatis mendapatkan website katalog online dengan slug mandiri (contoh: `/pesona-merapi`) untuk menampilkan paket wisata, jadwal keberangkatan, dan fasilitas.

2. **Concurrency-Safe Quota Locking**  
   Mekanisme penguncian kuota kursi otomatis (*real-time slot locking*) berbasis stored procedure PostgreSQL (`reserve_trip_quota`) dengan *pessimistic lock* (`SELECT ... FOR UPDATE`). Mencegah overbooking saat banyak pengguna checkout pada detik yang sama.

3. **Pluggable Payment Gateway Layer**  
   Arsitektur pembayaran berbasis adapter (`PaymentGateway`) yang mendukung:
   - **Mock / Simulator Provider**: Pengujian instan QRIS dinamis dan Virtual Account dengan batas waktu bayar (TTL 20 menit) tanpa ketergantungan akun live.
   - **Manual Bank Transfer**: Instruksi transfer langsung ke rekening bank mitra travel dengan verifikasi bukti transfer.
   - **Live Gateway Ready**: Siap dihubungkan ke penyedia resmi (Tripay, Xendit, atau Midtrans) cukup dengan konfigurasi variabel lingkungan.

4. **Multi-Tenant Row Level Security (RLS)**  
   Keamanan data tingkat baris di PostgreSQL Supabase untuk memisahkan data transaksi, manifes peserta, dan paket wisata antar-mitra agen travel secara ketat.

5. **Notification Adapter Layer**  
   Abstraksi pengiriman konfirmasi pemesanan dan tiket digital via WhatsApp atau email (saat ini tersedia *mock logger* dan siap dihubungkan ke Wablas/Fonnte).

---

## Tech Stack

- **Framework Web**: [Next.js 15](https://nextjs.org/) (App Router, React 19, TypeScript Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan palet warna Biru Samudra (`#0D47A1`) dan Oranye Senja (`#F57C00`)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL 15+, GoTrue Auth, Row Level Security, Storage)
- **Database Client**: `@supabase/ssr` dan `@supabase/supabase-js`
- **Testing & Tooling**: Node.js Test Runner dengan `tsx`
- **Ikon**: `lucide-react`

---

## Struktur Direktori

```text
Nusabook/
├── app/
│   ├── (auth)/                  # Rute autentikasi (login, register, forgot-password)
│   ├── (backoffice)/            # Dashboard manajemen agen & superadmin
│   ├── (storefront)/[slug]/     # Halaman katalog dinamis mitra agen tour
│   ├── api/
│   │   ├── bookings/            # Endpoint reservasi tiket
│   │   └── health/              # Health check status sistem & payment provider
│   ├── globals.css              # Setup warna tema, typography, base layout
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page publik Nusabook
├── components/
│   ├── ui/                      # Komponen atomik (Button, Card, Input, Modal, Badge)
│   └── shared/                  # Komponen navigasi bersama
├── lib/
│   ├── payment/                 # Payment Gateway Adapter Layer
│   │   ├── types.ts             # Interface PaymentGateway, InvoiceResult, Callback
│   │   ├── mock-provider.ts     # Simulator pembayaran QRIS & VA
│   │   ├── manual-transfer.ts   # Handler transfer bank rekening mitra
│   │   └── index.ts             # Factory resolver getPaymentGateway()
│   ├── notifications/           # Notification Adapter Layer (WhatsApp/Email)
│   │   ├── types.ts             # Interface NotificationProvider
│   │   ├── mock-provider.ts     # Console & debug logger
│   │   └── index.ts             # Factory resolver getNotificationProvider()
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client (@supabase/ssr)
│   │   ├── server.ts            # Server Supabase client dengan async cookies
│   │   └── middleware.ts        # Session & token refresh helper
│   └── utils.ts                 # Helper format Rupiah (IDR), styling merge (cn)
├── types/
│   └── database.types.ts        # TypeScript typings untuk tabel 3NF & enums PostgreSQL
├── supabase/
│   ├── migrations/              # Skrip migrasi terurut (3NF, Concurrency Lock, RLS, Seed)
│   │   ├── 20260928000001_initial_schema.sql
│   │   ├── 20260928000002_concurrency_locking.sql
│   │   ├── 20260928000003_rls_policies.sql
│   │   └── 20260928000004_seed_data.sql
│   └── seed.sql                 # Data contoh Pesona Merapi Tour & Travel
├── tests/                       # Unit & integration test suite
├── docs/                        # Dokumentasi spesifikasi arsitektur & rencana kerja
├── middleware.ts                # Next.js Edge Middleware
└── .env.example                 # Template variabel lingkungan
```

---

## Panduan Memulai (Getting Started)

### 1. Prasyarat
- [Node.js](https://nodejs.org/) v20+ atau v22+
- npm v10+

### 2. Kloning Repository & Instalasi
```bash
git clone https://github.com/Chanifg/nusabook.git
cd nusabook
npm install
```

### 3. Konfigurasi Environment Variables
Salin file template `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi konfigurasi sesuai kredensial proyek Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

PAYMENT_PROVIDER=mock
NOTIFICATION_PROVIDER=mock
```

### 4. Eksekusi Migrasi Basis Data (Supabase)
Jalankan file SQL yang berada di direktori `supabase/migrations/` secara berurutan pada Supabase SQL Editor atau melalui Supabase CLI:
1. `20260928000001_initial_schema.sql` (Tabel 3NF & Enum)
2. `20260928000002_concurrency_locking.sql` (Stored Procedure `reserve_trip_quota`)
3. `20260928000003_rls_policies.sql` (Kebijakan Row Level Security)
4. `20260928000004_seed_data.sql` (Data Awal Pesona Merapi)

### 5. Menjalankan Pengujian (Testing)
Untuk memastikan seluruh logika kuota, migrasi, dan adapter bekerja dengan benar:
```bash
npm test
```

### 6. Menjalankan Server Pengembangan (Local Dev)
```bash
npm run dev
```
Buka browser pada [http://localhost:3000](http://localhost:3000):
- Halaman Utama: [http://localhost:3000](http://localhost:3000)
- Contoh Storefront Mitra: [http://localhost:3000/pesona-merapi](http://localhost:3000/pesona-merapi)
- Health Check API: [http://localhost:3000/api/health](http://localhost:3000/api/health)

### 7. Membangun Bundle Produksi
```bash
npm run build
```

---

## Tim Pengembang & Stakeholder

- **Achmad Chanif Rahmatullah** (Chief Executive Officer)
- **Ilyasa Abiyyu Wicaksono** (Chief Technology Officer)
- **David Nazal Farihin** (Chief Operating Officer)
- **Zurich Sabil** (Chief Financial Officer)
- **Ully Najma Hansani** (Chief Creative Officer)

Afiliasi: **Universitas Tidar, Magelang (P2MW 2026)**
