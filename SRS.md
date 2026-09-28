# Software Requirements Specification (SRS)
## Nusabook: SaaS-Enabled Marketplace untuk Digitalisasi UMKM Tour & Travel

---

### Informasi Dokumen
* **Nama Sistem**: Nusabook Platform
* **Versi Dokumen**: v1.0.0
* **Status**: Baseline / Ready for Implementation
* **Standar Acuan**: IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018
* **Tanggal Rilis**: 7 September 2026
* **Tim Pengembang & Pemilik Sistem**:
  * Achmad Chanif Rahmatullah (*Chief Executive Officer*)
  * Ilyasa Abiyyu Wicaksono (*Chief Technology Officer*)
  * David Nazal Farihin (*Chief Operating Officer*)
  * Zurich Sabil (*Chief Financial Officer*)
  * Ully Najma Hansani (*Chief Creative Officer*)
* **Institusi Afiliasi**: Universitas Tidar, Magelang (Program P2MW 2026)

---

## 1. Pendahuluan (Introduction)

### 1.1 Tujuan (Purpose)
Dokumen *Software Requirements Specification* (SRS) ini mendefinisikan seluruh spesifikasi kebutuhan fungsional (*functional requirements*), kebutuhan antarmuka eksternal (*external interface requirements*), arsitektur basis data, serta kebutuhan non-fungsional (*non-functional requirements*) untuk pengembangan platform **Nusabook**. Dokumen ini menjadi pedoman teknis utama bagi tim pengembang perangkat lunak, *quality assurance*, *system administrator*, dan pemangku kepentingan (*stakeholder*) proyek P2MW 2026.

### 1.2 Konvensi Dokumen (Document Conventions)
* Penomoran kebutuhan fungsional menggunakan format **`REQ-FUNC-[MODUL]-[ID]`**.
* Penomoran kebutuhan non-fungsional menggunakan format **`REQ-NFR-[KATEGORI]-[ID]`**.
* Tingkat prioritas kebutuhan didefinisikan menggunakan standar MoSCoW:
  * **MUST**: Mutlak ada pada peluncuran Minimum Viable Product (MVP).
  * **SHOULD**: Sangat penting, diimplementasikan segera setelah fungsi inti stabil.
  * **COULD**: Fitur tambahan yang meningkatkan nilai tambah jika sumber daya mencukupi.
  * **WONT**: Tidak masuk dalam ruang lingkup fase rilis saat ini.

### 1.3 Pembaca yang Dituju (Intended Audience)
1. **Frontend & Backend Engineers**: Sebagai acuan penulisan kode, skema API, dan alur kerja logika bisnis.
2. **Database Engineers / Architects**: Sebagai pedoman struktur tabel PostgreSQL, implementasi *Row Level Security* (RLS), fungsi SQL, dan pemicu (*triggers*).
3. **DevOps & Security Engineers**: Untuk konfigurasi penyebaran (*deployment*) pada Cloudflare Pages, Supabase Project, dan pengaturan *firewall/gateway*.
4. **Tim Operasional & Verifikator P2MW**: Sebagai tolok ukur pengujian penerimaan sistem (*System Acceptance Test*).

### 1.4 Ruang Lingkup Produk (Product Scope)
Nusabook adalah platform *SaaS-Enabled Marketplace* berbasis multi-tenant yang menghubungkan pelaku usaha UMKM Tour & Travel lokal dengan wisatawan domestik. Sistem menyediakan:
* **Digital Storefront No-Code**: Halaman katalog publik mandiri bagi mitra agen tour.
* **Concurrency-Safe Booking Engine**: Mesin reservasi tiket perjalanan dengan penguncian kuota kursi otomatis (*real-time slot locking*).
* **Automated Multi-Channel Payment & Notification**: Integrasi pembayaran otomatis (Midtrans) dan pesan transaksi instan (WhatsApp Gateway).
* **Agent Backoffice Dashboard**: Sistem ERP/SaaS mikro untuk pencatatan transaksi terpusat (online maupun manual), manajemen manifes peserta, dan pelaporan keuangan.
* **Marketplace Discovery Platform**: Direktori agregasi produk wisata terkurasi untuk pelanggan umum (B2C).

---

## 2. Deskripsi Umum Sistem (Overall Description)

### 2.1 Perspektif Produk & Arsitektur Tingkat Tinggi
Platform Nusabook menggunakan arsitektur *Modern Jamstack & Serverless BaaS* terdistribusi:
* **Edge Presentation Layer (Cloudflare Pages)**: Meng-hosting aplikasi web modern (Next.js / SvelteKit / React) yang dieksekusi di jaringan tepi (*Global Edge Network*) Cloudflare dengan latensi sangat rendah ke pengguna di seluruh Indonesia.
* **Backend-as-a-Service & Database Layer (Supabase)**: Menyediakan basis data relasional PostgreSQL v15+, *Authentication* (GoTrue), *Row Level Security* (RLS), *Database Storage Engine*, dan *Edge Functions (Deno Runtime)* untuk menangani logika bisnis sensitif serta webhook.
* **Integration Layer**: Menghubungkan sistem dengan Payment Gateway (Midtrans) dan WhatsApp Notification Gateway (Wablas/Fonnte).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT DEVICES                                 │
│  [ Wisatawan (Mobile/Desktop) ]       [ Mitra Agen Travel (Backoffice) ]   │
└───────────────────────┬───────────────────────────────┬─────────────────────┘
                        │ HTTPS (TLS 1.3)               │ HTTPS (TLS 1.3)
                        ▼                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EDGE LAYER: CLOUDFLARE PAGES                             │
│  • Edge CDN Caching & DDoS Protection                                       │
│  • Next.js App Router / SSR / Client Components                             │
│  • Cloudflare Pages Functions (Edge Middleware & Routing)                   │
└───────────────────────┬───────────────────────────────┬─────────────────────┘
                        │                               │
        REST / GraphQL  │                               │ Supabase Realtime (WSS)
                        ▼                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER: SUPABASE                                │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────────┐  │
│  │ Supabase Auth (GoTrue)  │  │ PostgreSQL 15+ Engine                    │  │
│  │ • JWT Session / RBAC    │  │ • 3NF Relational Schema                  │  │
│  └─────────────────────────┘  │ • Row Level Security (RLS)               │  │
│  ┌─────────────────────────┐  │ • Concurrency Functions / Pessimistic Lock│ │
│  │ Supabase Storage        │  │ • Trigger Rollback Kadaluarsa            │  │
│  │ • Foto Destinasi/Logo   │  └──────────────────────────────────────────┘  │
│  └─────────────────────────┘  ┌──────────────────────────────────────────┐  │
│                               │ Supabase Edge Functions (Deno)           │  │
│                               │ • Midtrans Webhook Handler               │  │
│                               │ • WhatsApp Notification Dispatcher       │  │
│                               │ • Commission Calculator (2% Escrow)      │  │
│                               └──────────────────────────────────────────┘  │
└───────────────────────┬───────────────────────────────┬─────────────────────┘
                        │                               │
                        ▼                               ▼
             [ Midtrans Payment API ]       [ WhatsApp API Gateway ]
```

### 2.2 Karakteristik Pengguna (User Classes & Actors)
1. **Guest / Wisatawan (B2C)**:
   * Menjelajahi katalog wisata pada *storefront* agen maupun direktori marketplace.
   * Melakukan pemesanan tiket, mengisi data manifes, dan membayar via QRIS/VA.
2. **Mitra Agen Travel (B2B Admin / Operator)**:
   * Mengatur informasi bisnis, katalog paket, jadwal keberangkatan, dan harga.
   * Memantau pesanan masuk, menginput transaksi manual, dan mengekspor manifes penumpang.
3. **Super Administrator (Nusabook Internal)**:
   * Memverifikasi pendaftaran agen baru.
   * Mengelola buku besar komisi 2% dan menyetujui penarikan dana (*disbursement*).
   * Memantau performa sistem dan integritas audit log.

### 2.3 Lingkungan Operasional (Operating Environment)
* **Hosting Platform**: Cloudflare Pages dengan dukungan integrasi Git berkesinambungan (*Continuous Deployment*).
* **Database & BaaS**: Supabase Managed Instance (PostgreSQL 15+ dengan ekstensi `pgcrypto`, `uuid-ossp`).
* **Klien Browser**: Google Chrome (v100+), Mozilla Firefox (v100+), Apple Safari (v15+), Microsoft Edge (v100+), dan Mobile Webview (Android/iOS).
* **Protokol Jaringan**: Wajib HTTPS (TLS 1.3), WebSocket (WSS) untuk *Realtime Updates*.

### 2.4 Batasan Desain & Implementasi (Constraints)
1. **Regulasi Finansial**: Nusabook tidak bertindak sebagai lembaga keuangan penyimpan dana (*banking*), melainkan perantara transaksi berbasis kemitraan dengan penampungan dana (*escrow*) melalui payment gateway berlisensi Bank Indonesia (Midtrans).
2. **Kepatuhan Privasi (UU PDP)**: Data nomor identitas (NIK / Paspor) penumpang wajib dienkripsi dan diproteksi dengan RLS sehingga hanya agen penyelenggara yang berhak mengakses.
3. **Zero Upfront Cost Policy**: Sistem harus mampu berjalan seefisien mungkin pada tier *serverless* terkelola untuk menjaga *cost of goods sold* (COGS) tetap rendah di bawah batas komisi 2%.

---

## 3. Spesifikasi Kebutuhan Fungsional (Functional Requirements)

### 3.1 Modul 1: Autentikasi, Otorisasi, dan Manajemen Sesi
* **REQ-FUNC-AUTH-01 [MUST]**: Sistem harus mendukung registrasi dan login mitra menggunakan Supabase Auth melalui email & kata sandi dengan validasi keamanan (minimal 8 karakter, kombinasi huruf & angka).
* **REQ-FUNC-AUTH-02 [MUST]**: Sistem harus menerapkan *Role-Based Access Control* (RBAC) menggunakan klaim JWT Supabase dengan tiga tingkatan: `superadmin`, `agent_owner`, `agent_staff`.
* **REQ-FUNC-AUTH-03 [MUST]**: Sistem harus mendukung fitur *Forgot Password* dengan pengiriman token reset kata sandi melalui tautan aman ber-TTL 15 menit.
* **REQ-FUNC-AUTH-04 [SHOULD]**: Sistem harus menyediakan opsi login instan (*Magic Link* atau Google OAuth) untuk kemudahan akses staf agen.

### 3.2 Modul 2: Manajemen Profil & No-Code Storefront Agen
* **REQ-FUNC-PROF-01 [MUST]**: Sistem harus menyediakan pembuatan profil usaha agen yang mencakup: Nama Usaha, Deskripsi, Alamat Kantor, Nomor Kontak WhatsApp Resmi, Media Sosial, dan Rekening Bank Mitra.
* **REQ-FUNC-PROF-02 [MUST]**: Sistem harus membuat slug unik untuk setiap agen terdaftar (contoh: `nusabook.id/pesona-merapi`) yang merender halaman katalog khusus agen tersebut secara dinamis di Cloudflare Pages.
* **REQ-FUNC-PROF-03 [MUST]**: Sistem harus mengizinkan agen mengunggah aset visual (logo usaha, banner etalase) ke *Supabase Storage Bucket* (`agent-assets`) dengan batasan format JPEG/PNG/WebP maks 2 MB.
* **REQ-FUNC-PROF-04 [COULD]**: Sistem mendukung pemetaan domain kustom (*Custom Domain CNAME*) ke Cloudflare Pages untuk agen tier menengah.

### 3.3 Modul 3: Manajemen Paket Wisata & Inventaris Jadwal
* **REQ-FUNC-TOUR-01 [MUST]**: Agen dapat membuat, mengubah, menonaktifkan, dan menghapus paket wisata dengan atribut:
  * Judul Paket, Kategori (*Open Trip* / *Private Trip*), Durasi (Hari/Malam).
  * Destinasi, Titik Kumpul (*Meeting Point*), dan Waktu Kumpul.
  * *Itinerary* perjalanan bertahap.
  * Fasilitas Termasuk (*Included*) dan Fasilitas Tidak Termasuk (*Excluded*).
  * Kebijakan Pembatalan (*Refund & Cancellation Policy*).
* **REQ-FUNC-TOUR-02 [MUST]**: Agen dapat menambahkan jadwal keberangkatan (*trip schedules*) untuk masing-masing paket:
  * Tanggal Keberangkatan dan Tanggal Kepulangan.
  * Kuota Kursi Total (*Total Seat Capacity*).
  * Harga Tiket per Peserta (*Price per Pax*).
* **REQ-FUNC-TOUR-03 [MUST]**: Sistem harus menyediakan tombol *toggle* status jadwal (`OPEN`, `CLOSED`, `SOLD_OUT`, `CANCELLED`).

### 3.4 Modul 4: Booking Engine & Concurrency-Safe Quota Locking
* **REQ-FUNC-BOOK-01 [MUST]**: Wisatawan dapat memilih jadwal trip, menentukan kuantitas peserta (*pax*), dan mengisi data kontak pemesan (Nama, Email, WhatsApp).
* **REQ-FUNC-BOOK-02 [MUST]**: Wisatawan wajib mengisi data identitas setiap peserta perjalanan (Nama Lengkap, Jenis Kelamin, NIK/Paspor, Kontak Darurat).
* **REQ-FUNC-BOOK-03 [MUST]**: Sistem harus mengeksekusi mekanisme *Pessimistic Quota Reservation*:
  * Saat tombol checkout ditekan, kuota dipesan sementara (`reserved_quota = reserved_quota + pax`) via fungsi PostgreSQL ber-transaksi atomik.
  * Sistem menerbitkan masa berlaku pembayaran (*TTL Timer*) selama **20 menit**.
  * Jika dalam waktu 20 menit tidak ada konfirmasi pembayaran sukses, sistem pemicu (*cron worker*) otomatis mengembalikan kuota (`reserved_quota = reserved_quota - pax`).
* **REQ-FUNC-BOOK-04 [MUST]**: Jika sisa kuota kurang dari kuantitas yang diminta saat reservasi terjadi secara simultan, sistem harus menolak transaksi dengan pesan kesalahan *"Maaf, kuota kursi tidak mencukupi"*.
* **REQ-FUNC-BOOK-05 [MUST]**: Sistem harus memperbarui ketersediaan kuota secara *real-time* ke antarmuka pengguna menggunakan *Supabase Realtime Channel*.

### 3.5 Modul 5: Sistem Pembayaran & Pencatatan Transaksi Manual
* **REQ-FUNC-PAY-01 [MUST]**: Sistem harus mengintegrasikan Midtrans Snap / Core API untuk menyediakan kanal pembayaran:
  * QRIS (Dinamis).
  * Virtual Account Bank (BCA, Mandiri, BNI, BRI, Permata).
* **REQ-FUNC-PAY-02 [MUST]**: Sistem harus menyediakan *Webhook Endpoint* (Supabase Edge Function) untuk menerima *HTTP Callback* dari Midtrans dan memvalidasi keaslian signature key (`SHA512(order_id + status_code + gross_amount + server_key)`).
* **REQ-FUNC-PAY-03 [MUST]**: Saat status transaksi berubah menjadi `settlement` atau `capture`:
  * Kuota berpindah dari reservasi ke terkonfirmasi (`reserved_quota -= pax`, `booked_quota += pax`).
  * Status pesanan diperbarui menjadi `PAID`.
  * Sistem menghitung potongan komisi Nusabook sebesar **2%** dari nilai kotor (*Gross Amount*).
* **REQ-FUNC-PAY-04 [MUST]**: Sistem harus menyediakan fitur *Manual Booking Entry* di dashboard agen untuk mencatat pesanan yang diterima via chat WhatsApp atau pembayaran tunai offline, dengan tetap memotong kuota resmi dan mencatat ke basis data terpadu.

### 3.6 Modul 6: Notifikasi Otomatis (WhatsApp & Email Engine)
* **REQ-FUNC-NOTIF-01 [MUST]**: Sistem harus mengirim pesan WhatsApp otomatis ke pelanggan ketika tagihan dibuat, berisi: Kode Booking, Batas Waktu Bayar, Jumlah Tagihan, dan Tautan Pembayaran.
* **REQ-FUNC-NOTIF-02 [MUST]**: Sistem harus mengirim pesan WhatsApp konfirmasi dan tautan E-Ticket ber-QR Code segera setelah pembayaran berhasil diverifikasi.
* **REQ-FUNC-NOTIF-03 [SHOULD]**: Sistem harus mengirim pesan WhatsApp pengingat (*Reminder H-1*) sebelum jam keberangkatan kepada seluruh peserta manifes.
* **REQ-FUNC-NOTIF-04 [MUST]**: Sistem harus menyediakan fungsi pengiriman email cadangan (*fallback*) apabila pesan WhatsApp gagal terkirim karena pembatasan nomor.

### 3.7 Modul 7: Dashboard Manajemen Agen (Backoffice SaaS)
* **REQ-FUNC-DASH-01 [MUST]**: Menampilkan ringkasan metrik usaha:
  * Total Omzet Penjualan (Bruto).
  * Total Pendapatan Bersih (Netto setelah komisi 2%).
  * Jumlah Kursi Terjual & Persentase Okupansi Rata-rata.
  * Daftar pesanan aktif yang menunggu pembayaran (*Pending*).
* **REQ-FUNC-DASH-02 [MUST]**: Fitur **Manifes Penumpang**:
  * Menampilkan seluruh data peserta per jadwal trip.
  * Fitur pencarian nama penumpang.
  * Tombol unduh manifes dalam format **PDF** dan spreadsheet **Excel (.xlsx)**.
* **REQ-FUNC-DASH-03 [SHOULD]**: Kalender Interaktif yang menampilkan status ketersediaan kursi di seluruh paket wisata dalam satu tampilan visual bulanan.

### 3.8 Modul 8: Marketplace Discovery Platform (B2C Public)
* **REQ-FUNC-MKT-01 [MUST]**: Menyediakan antarmuka pencarian paket wisata berdasarkan: Kata Kunci Destinasi, Kota Asal Keberangkatan, Rentang Tanggal, dan Rentang Harga.
* **REQ-FUNC-MKT-02 [MUST]**: Menampilkan lencana (*badge*) *"Verified Partner"* pada profil agen yang telah lolos verifikasi berkas oleh admin.
* **REQ-FUNC-MKT-03 [SHOULD]**: Modul testimoni dan ulasan peserta yang telah menyelesaikan trip dengan verifikasi kode pesanan asli (*Verified Buyer Review*).

### 3.9 Modul 9: Platform Super Admin & Escrow Payout Management
* **REQ-FUNC-ADM-01 [MUST]**: Menampilkan ringkasan metrik global platform: Total Transaksi Nasional, Total GMV, Akumulasi Komisi 2% Nusabook, dan Jumlah Mitra Aktif.
* **REQ-FUNC-ADM-02 [MUST]**: Fitur verifikasi dokumen pendaftaran mitra agen (KTP Pemilik, NIB/SKU Usaha) sebelum etalase agen aktif di marketplace publik.
* **REQ-FUNC-ADM-03 [MUST]**: Manajemen penarikan dana (*payout/disbursement*):
  * Agen dapat mengajukan pencairan saldo penjualan tiket yang telah berstatus `COMPLETED` (H+1 setelah trip berjalan).
  * Super Admin memverifikasi dan menyetujui mutasi transfer dana ke rekening agen dikurangi biaya admin bank dan komisi 2%.

---

## 4. Kebutuhan Antarmuka Eksternal (External Interface Requirements)

### 4.1 Antarmuka Pengguna (User Interface)
* **Desain Responsif**: Antarmuka wajib dioptimalkan untuk tampilan *Mobile First* (layar 360px – 430px) tanpa mengurangi keterbacaan pada desktop (1920x1080).
* **Design System**: Menggunakan Tailwind CSS dengan palet warna bernuansa profesional, terpercaya, dan pariwisata Indonesia (Biru Samudra `#0D47A1`, Oranye Senja `#F57C00`, dan Abu Netral).
* **Kecepatan Interaksi**: State UI menggunakan *Optimistic UI Rendering* dengan indikator pemuatan (*skeleton loaders*) pada setiap request data.

### 4.2 Antarmuka Perangkat Lunak (Software Interfaces)
1. **Supabase Client SDK (`@supabase/supabase-js`)**:
   * Digunakan untuk operasi CRUD basis data, manajemen token sesi autentikasi, serta pendaftaran pendengar event *Realtime Channel*.
2. **Cloudflare Pages / Workers API**:
   * Mengatur routing edge middleware, penyusunan header keamanan (CSP, HSTS, X-Frame-Options), dan kompresi konten statis Brotli/Gzip.
3. **Midtrans Core API & Snap**:
   * Endpoint: `https://app.midtrans.com/snap/v1/transactions` (Produksi) / `https://app.sandbox.midtrans.com/snap/v1/transactions` (Testing).
   * Format payload: JSON dengan otentikasi Server Key Base64.
4. **WhatsApp Gateway API (Wablas / Fonnte)**:
   * Endpoint pengiriman pesan teks dan pesan dokumen PDF.
   * Parameter: `phone`, `message`, `priority`, `secret_token`.

### 4.3 Antarmuka Komunikasi (Communications Interfaces)
* Semua lalu lintas HTTP antara klien dan Cloudflare Pages wajib menggunakan protokol **HTTPS (TLS 1.3)** dengan pengalihan otomatis dari HTTP port 80.
* Sinkronisasi data kuota antara klien dan Supabase menggunakan protokol **WebSockets Secure (WSS)**.
* Validasi *Webhook* Midtrans mewajibkan verifikasi algoritma *Cryptographic Hash* SHA-512 untuk mencegah manipulasi data status pembayaran (*Man-in-the-Middle*).

---

## 5. Arsitektur Basis Data & Skema PostgreSQL (3NF Compliance)

### 5.1 Skema Normalisasi Basis Data
Basis data diimplementasikan pada PostgreSQL Supabase dan dinormalisasi secara ketat hingga bentuk normal ketiga (3NF) guna menjamin konsistensi data transaksi.

```sql
-- 1. Ekstensi Kriptografi & UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enumerasi Tipe Data
CREATE TYPE user_role AS ENUM ('superadmin', 'agent_owner', 'agent_staff');
CREATE TYPE package_category AS ENUM ('open_trip', 'private_trip');
CREATE TYPE schedule_status AS ENUM ('OPEN', 'CLOSED', 'SOLD_OUT', 'CANCELLED');
CREATE TYPE booking_status AS ENUM ('UNPAID', 'PAID', 'EXPIRED', 'CANCELLED', 'REFUNDED');
CREATE TYPE payout_status AS ENUM ('REQUESTED', 'APPROVED', 'TRANSFERRED', 'REJECTED');

-- 3. Tabel Profil Pengguna (Terkait dengan Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    role user_role DEFAULT 'agent_owner',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Mitra Usaha (Travel Agents)
CREATE TABLE travel_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id),
    business_name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    office_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    instagram_handle VARCHAR(50),
    bank_name VARCHAR(50) NOT NULL,
    bank_account_number VARCHAR(50) NOT NULL,
    bank_account_name VARCHAR(150) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Paket Wisata (Tour Packages)
CREATE TABLE tour_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES travel_agents(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    category package_category NOT NULL DEFAULT 'open_trip',
    duration_days INT NOT NULL CHECK (duration_days > 0),
    duration_nights INT NOT NULL DEFAULT 0,
    destination_city VARCHAR(100) NOT NULL,
    meeting_point TEXT NOT NULL,
    description TEXT NOT NULL,
    itinerary JSONB NOT NULL DEFAULT '[]'::JSONB,
    facilities_included TEXT[] NOT NULL DEFAULT '{}',
    facilities_excluded TEXT[] NOT NULL DEFAULT '{}',
    cancellation_policy TEXT,
    thumbnail_url TEXT,
    gallery_urls TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_agent_package_slug UNIQUE (agent_id, slug)
);

-- 6. Tabel Jadwal Keberangkatan (Trip Schedules & Quota)
CREATE TABLE trip_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES tour_packages(id) ON DELETE CASCADE,
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    total_quota INT NOT NULL CHECK (total_quota > 0),
    reserved_quota INT NOT NULL DEFAULT 0 CHECK (reserved_quota >= 0),
    booked_quota INT NOT NULL DEFAULT 0 CHECK (booked_quota >= 0),
    price_per_pax NUMERIC(12, 2) NOT NULL CHECK (price_per_pax >= 0),
    status schedule_status DEFAULT 'OPEN',
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_trip_dates CHECK (return_date >= departure_date),
    CONSTRAINT quota_integrity CHECK (reserved_quota + booked_quota <= total_quota)
);

-- 7. Tabel Transaksi Pemesanan (Bookings)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(30) UNIQUE NOT NULL,
    agent_id UUID NOT NULL REFERENCES travel_agents(id),
    schedule_id UUID NOT NULL REFERENCES trip_schedules(id),
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_whatsapp VARCHAR(20) NOT NULL,
    total_pax INT NOT NULL CHECK (total_pax > 0),
    price_per_pax NUMERIC(12, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    platform_fee NUMERIC(12, 2) NOT NULL, -- Komisi 2%
    agent_payout_amount NUMERIC(12, 2) NOT NULL, -- 98%
    payment_status booking_status DEFAULT 'UNPAID',
    payment_method VARCHAR(50),
    midtrans_transaction_id VARCHAR(100),
    payment_expired_at TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    is_manual_entry BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabel Manifes Peserta (Booking Passengers)
CREATE TABLE booking_passengers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    id_card_number VARCHAR(50), -- NIK / Paspor (Terenkripsi)
    gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE')),
    phone_number VARCHAR(20),
    emergency_contact VARCHAR(100),
    special_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Tabel Penarikan Dana Mitra (Agent Payouts)
CREATE TABLE agent_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES travel_agents(id),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    platform_deduction NUMERIC(12, 2) DEFAULT 0,
    net_transferred NUMERIC(12, 2) NOT NULL,
    status payout_status DEFAULT 'REQUESTED',
    bank_destination_name VARCHAR(50) NOT NULL,
    bank_destination_account VARCHAR(50) NOT NULL,
    bank_destination_holder VARCHAR(150) NOT NULL,
    transfer_proof_url TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);
```

### 5.2 Kebijakan Keamanan Tingkat Baris (Row Level Security - RLS)
Supabase menerapkan RLS ketat pada setiap tabel:
1. **`travel_agents`**: Publik dapat melihat (*SELECT*) agen yang `is_active = true`. Hanya pengguna terautentikasi dengan `owner_id = auth.uid()` atau `role = 'superadmin'` yang dapat memperbarui (*UPDATE*).
2. **`tour_packages` & `trip_schedules`**: Terbuka untuk dibaca oleh publik (*SELECT*). Operasi penulisan (*INSERT/UPDATE/DELETE*) dibatasi hanya untuk pemilik agen yang sah.
3. **`bookings` & `booking_passengers`**:
   * Agen hanya dapat membaca pesanan yang memiliki `agent_id` sesuai dengan identitas bisnis mereka.
   * Wisatawan dapat membaca rincian pesanan spesifik melalui verifikasi kombinasi unik `booking_code` dan `customer_whatsapp` (melalui Supabase Edge Function).
   * Superadmin memiliki hak akses menyeluruh (*Bypass/Full Access*).

### 5.3 Stored Procedure Concurrency Safe Quota Locking
```sql
CREATE OR REPLACE FUNCTION reserve_trip_quota(
    p_schedule_id UUID,
    p_pax INT
) RETURNS BOOLEAN AS $$
DECLARE
    v_total_quota INT;
    v_reserved INT;
    v_booked INT;
BEGIN
    -- Kunci baris jadwal secara pesimis untuk mencegah race conditions
    SELECT total_quota, reserved_quota, booked_quota
    INTO v_total_quota, v_reserved, v_booked
    FROM trip_schedules
    WHERE id = p_schedule_id
    FOR UPDATE;

    -- Validasi ketersediaan kuota
    IF (v_reserved + v_booked + p_pax) <= v_total_quota THEN
        UPDATE trip_schedules
        SET reserved_quota = reserved_quota + p_pax,
            version = version + 1,
            updated_at = NOW()
        WHERE id = p_schedule_id;
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### 6.1 Performa & Skalabilitas (REQ-NFR-PERF)
* **REQ-NFR-PERF-01**: Waktu respons server di jaringan tepi (*Edge TTFB - Time to First Byte*) Cloudflare Pages harus $\le 100$ milidetik di wilayah Indonesia.
* **REQ-NFR-PERF-02**: Eksekusi endpoint API (Supabase Edge Function) pemesanan tiket tidak boleh melebihi batas waktu $400$ milidetik.
* **REQ-NFR-PERF-03**: Sistem koneksi basis data harus menggunakan PgBouncer / Supabase Supavisor connection pooler untuk mendukung hingga 500 koneksi bersamaan tanpa kegagalan kehabisan soket (*connection starvation*).

### 6.2 Keamanan & Integritas Data (REQ-NFR-SEC)
* **REQ-NFR-SEC-01**: Wajib menerapkan sertifikat SSL/TLS 1.3 dengan *HSTS (HTTP Strict Transport Security)* diaktifkan pada semua domain dan subdomain.
* **REQ-NFR-SEC-02**: Mencegah kerentanan OWASP Top 10 (SQL Injection melalui parameterisasi kueri, Cross-Site Scripting melalui sanitasi React JSX, dan Cross-Site Request Forgery).
* **REQ-NFR-SEC-03**: Enkripsi simetris data identitas sensitif penumpang (NIK/No KTP) menggunakan modul pgcrypto dengan algoritma `AES-256` sebelum tersimpan di disk basis data.
* **REQ-NFR-SEC-04**: Otentikasi *webhook* pembayaran wajib memverifikasi tanda tangan digital (*signature key hash*) sebelum mengubah status transaksi keuangan.

### 6.3 Keandalan & Ketersediaan (REQ-NFR-REL)
* **REQ-NFR-REL-01**: Ketersediaan sistem (*High Availability*) ditargetkan mencapai minimal **99,9%** uptime setiap bulannya dengan pemantauan UptimeRobot.
* **REQ-NFR-REL-02**: Jika terjadi gangguan pada penyedia WhatsApp API, sistem harus mengantrekan (*queue*) pengiriman pesan dan mencoba kembali (*retry*) hingga 3 kali dengan interval waktu bertahap (*exponential backoff*).
* **REQ-NFR-REL-03**: *Mean Time to Recovery* (MTTR) pada insiden kegagalan deployment edge tidak boleh lebih dari 5 menit menggunakan fitur *Instant Rollback* Cloudflare Pages.

### 6.4 Pemeliharaan & Portabilitas (REQ-NFR-MAINT)
* **REQ-NFR-MAINT-01**: Kode sumber frontend dan backend ditulis menggunakan TypeScript yang menerapkan aturan ketat (*strict mode*) untuk meminimalkan *runtime error*.
* **REQ-NFR-MAINT-02**: Setiap migrasi basis data dikelola melalui skrip deklaratif versi kontrol Supabase CLI (`supabase migration up`).

---

## 7. Matriks Ketertelusuran Kebutuhan (Requirements Traceability Matrix)

| Kode Kebutuhan SRS | Modul Terkait | Komponen Tech Stack | Status Validasi |
| :--- | :--- | :--- | :--- |
| **REQ-FUNC-AUTH-01** | Autentikasi | Supabase Auth (GoTrue) | Unit Test & E2E Test |
| **REQ-FUNC-PROF-02** | Storefront | Cloudflare Pages (Dynamic Slug Route) | UI Verification |
| **REQ-FUNC-TOUR-02** | Manajemen Trip | Supabase PostgreSQL 3NF Schema | Integration Test |
| **REQ-FUNC-BOOK-03** | Quota Locking | PostgreSQL PL/pgSQL Function | Concurrency Load Test |
| **REQ-FUNC-PAY-02** | Webhook | Supabase Edge Functions (Deno) | Webhook Signature Test |
| **REQ-FUNC-NOTIF-01**| Notifikasi | Wablas / Fonnte WhatsApp API | Message Delivery Test |
| **REQ-FUNC-DASH-02** | Manifes | Next.js Edge + PDFKit/XLSX Export | File Download Test |
| **REQ-FUNC-ADM-03** | Payout 2% | Supabase Ledger Table + Escrow Calc | Financial Audit Test |
| **REQ-NFR-SEC-03** | Kepatuhan PDP | PostgreSQL pgcrypto AES-256 | Security Audit Test |

---

## 8. Kriteria Penerimaan Sistem (System Acceptance Criteria)

Sistem dinyatakan layak untuk diluncurkan ke tahap operasional pilot jika memenuhi indikator berikut:
1. Pengujian konkurensi berhasil mengeksekusi 50 pemesanan serentak pada trip berkursi 10 tanpa satupun insiden *overbooking* (tepat 10 kursi terpesan, 40 pesanan tertolak secara elegan).
2. Callback notifikasi pembayaran dari Midtrans Sandbox terverifikasi dan mengubah status pesanan dari `UNPAID` menjadi `PAID` dalam waktu $< 2$ detik.
3. Pesan WhatsApp konfirmasi beserta link E-Ticket berhasil diterima nomor tujuan dalam waktu $< 5$ detik setelah status pembayaran `PAID`.
4. Seluruh tabel telah lulus audit normalisasi 3NF dan seluruh kueri klien terproteksi oleh Supabase RLS.
5. Antarmuka web responsif sempurna pada perangkat seluler dengan skor performa Google Lighthouse $\ge 90$.
