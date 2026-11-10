# Spesifikasi Desain: Sistem Akun Pelanggan (Wisatawan / `customer`) NusaBook

**Tanggal**: 2026-11-07  
**Status**: Disetujui (*Approved*)  
**Target Arsitektur**: Next.js 15 App Router + Supabase Auth/PostgreSQL + Hybrid Local Fallback

---

## 1. Tujuan & Latar Belakang
Saat ini NusaBook baru menyediakan autentikasi dan panel khusus untuk **Mitra Agen Travel (`agent_owner`, `agent_staff`)** dan **Super Admin (`superadmin`)**, sementara wisatawan hanya dapat memesan sebagai tamu (*Guest Checkout*).

Fitur ini menambahkan dukungan penuh untuk **Akun Pelanggan (`customer`)** dengan tetap mempertahankan kemudahan *Guest Checkout* (`FR-2.2` PRD), sehingga wisatawan dapat:
1. Mendaftar dan masuk sebagai **Wisatawan (`customer`)** melalui halaman `/register` dan `/login` terpadu.
2. Memiliki **Portal Akun Pelanggan (`/account`)** untuk melihat riwayat pesanan & E-Tiket, mengklaim kode booking tamu, mengelola daftar penumpang tersimpan (*Saved Travelers* untuk pengisian manifes 1-klik), mengelola *Wishlist* paket wisata, dan memperbarui profil.
3. Menikmati **Auto-Fill Data Pemesan & Pilih Penumpang Tersimpan** saat melakukan *checkout* di `/[slug]/booking`.

---

## 2. Perubahan Skema Database & Tipe Data

### 2.1 Migrasi SQL (`supabase/migrations/0003_customer_accounts.sql`)
1. **Enum `user_role`**:
   - Menambahkan nilai `'customer'` pada tipe enum `user_role` (`ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'customer';`).
2. **Relasi `customer_id` pada Tabel `bookings`**:
   - `ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL;`
   - Indeks: `CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);`
3. **Tabel `saved_passengers` (Daftar Penumpang Tersimpan)**:
   - Kolom:
     - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
     - `customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
     - `full_name VARCHAR(150) NOT NULL`
     - `id_card_number VARCHAR(30)`
     - `gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE'))`
     - `phone_number VARCHAR(25)`
     - `emergency_contact VARCHAR(50)`
     - `special_notes TEXT`
     - `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
4. **Kebijakan Row-Level Security (RLS)**:
   - Pelanggan dapat membaca (`SELECT`) dan memperbarui (`UPDATE`) baris `bookings` di mana `customer_id = auth.uid()`.
   - Pelanggan dapat melakukan `SELECT, INSERT, UPDATE, DELETE` pada `saved_passengers` di mana `customer_id = auth.uid()`.

### 2.2 Tipe TypeScript (`types/database.types.ts`)
- Memperbarui `UserRole` menjadi `'superadmin' | 'agent_owner' | 'agent_staff' | 'customer'`.
- Menambahkan field `customer_id?: string | null` pada tipe tabel `bookings`.
- Menambahkan definisi tabel `saved_passengers` beserta tipe ekspor `SavedPassenger`.

---

## 3. Autentikasi Terpadu & Isolasi Peran (RBAC)

### 3.1 Halaman Registrasi (`app/(auth)/register/page.tsx`)
- Menyediakan **Tab Pemilih Peran** di bagian atas kartu registrasi:
  - **Wisatawan / Pelanggan (`customer`)**: Hanya 1 langkah (Nama Lengkap, Email, Nomor WhatsApp, Kata Sandi & Konfirmasi). Saat disubmit:
    1. Membuat akun di Supabase Auth (`supabase.auth.signUp`) dengan metadata `role: 'customer'`.
    2. Menyimpan baris `profiles` dengan `role: 'customer'`.
    3. Menyimpan sesi pelanggan ke *state* lokal (`nusabook_customer_session`) sebagai *fallback* lingkungan demo/offline.
    4. Mengarahkan ke `/account` (atau ke URL pada query `?redirect=...`).
  - **Mitra Agen Travel (`agent_owner`)**: Tetap menggunakan alur 2 langkah (Informasi Akun + Profil Bisnis & Rekening Escrow) yang mengarah ke `/dashboard`.

### 3.2 Halaman Login (`app/(auth)/login/page.tsx`)
- Menambahkan pemilih mode masuk (**Wisatawan** vs **Mitra Travel**) dan fitur **Akses Cepat Akun Demo** (1-klik masuk sebagai Pelanggan Demo atau Mitra Demo).
- Setelah login berhasil, sistem memeriksa `profiles.role` (atau pilihan peran):
  - `superadmin` $\rightarrow$ `/admin`
  - `agent_owner` / `agent_staff` $\rightarrow$ `/dashboard`
  - `customer` $\rightarrow$ query `?redirect` jika valid, atau `/account`.

### 3.3 Proteksi Route (`middleware.ts` & `app/(backoffice)/layout.tsx`)
- `middleware.ts`: Menambahkan `/account` ke daftar rute yang memicu `updateSession(request)`.
- `app/(backoffice)/layout.tsx`: Jika `profile?.role === 'customer'`, pengguna diarahkan otomatis (`redirect('/account')`) agar pelanggan tidak dapat mengakses panel operasional mitra.

---

## 4. Portal Akun Pelanggan (`app/account/page.tsx`)

Portal `/account` dirancang dengan estetika *Savanna Emerald & Sunbaked Terracotta* yang konsisten dengan ekosistem NusaBook dan memiliki 4 tab utama:
1. **Pesanan & E-Tiket Saya (`bookings`)**:
   - Menampilkan daftar booking milik pelanggan (gabungan query Supabase `bookings` + sinkronisasi booking lokal + riwayat klaim) dengan filter: *Semua*, *Menunggu Pembayaran*, *Aktif / Terkonfirmasi*, dan *Selesai / Riwayat*.
   - Setiap kartu pesanan menampilkan status pembayaran, kode booking, tanggal keberangkatan, titik kumpul, jumlah peserta, total harga, serta tombol aksi langsung (**Lanjutkan Pembayaran** ke `/bookings/[code]/payment` atau **Lihat E-Tiket & QR** ke `/bookings/[code]`).
   - **Klaim Pesanan Tamu (*Claim Guest Booking*)**: Form input kode booking (contoh: `NSB-20261018-001`) untuk menautkan pesanan yang dibuat saat *Guest Checkout* ke akun pelanggan.
2. **Penumpang Tersimpan (`travelers`)**:
   - Daftar anggota keluarga / rekan seperjalanan yang tersimpan (Nama Lengkap, NIK 16 digit dengan sensor privasi UU PDP, Nomor HP, Kontak Darurat, Catatan Khusus).
   - Form tambah & hapus penumpang tersimpan yang tersinkronisasi ke tabel `saved_passengers` dan *storage* pelanggan sehingga langsung tersedia saat *checkout*.
3. **Wishlist Paket Impian (`wishlist`)**:
   - Menampilkan daftar paket wisata yang disimpan pelanggan, lengkap dengan harga, sisa kuota, dan tombol **Pesan Sekarang**.
4. **Profil & Pengaturan Akun (`profile`)**:
   - Form pembaruan Nama Lengkap, Email, Nomor WhatsApp, preferensi notifikasi WhatsApp H-1, serta tombol **Keluar Akun (Logout)**.

---

## 5. Integrasi Checkout (`app/(storefront)/[slug]/booking/page.tsx`) & API Booking

1. **Banner Status Akun di Checkout**:
   - Jika belum login: Menampilkan kartu informasi *"Punya akun NusaBook? Masuk untuk isi otomatis data pemesan & gunakan daftar penumpang tersimpan"* dengan tautan ke `/login?redirect=...` (tanpa memblokir *Guest Checkout*).
   - Jika sudah login sebagai pelanggan: Menampilkan badge *"Masuk sebagai [Nama Pelanggan] — Tiket otomatis tersimpan ke Akun Anda"* dan mengisi otomatis kolom Nama Pemesan, Email, serta Nomor WhatsApp.
2. **1-Click Auto-Fill Manifes dari Penumpang Tersimpan**:
   - Pada setiap kartu peserta di form manifes, menyediakan *dropdown/chips* **"Isi dari Penumpang Tersimpan"** yang langsung mengisi Nama Lengkap, 16 digit NIK, dan catatan peserta.
3. **API `POST /api/bookings` (`app/api/bookings/route.ts`)**:
   - Menerima field opsional `customerId` pada payload dan menyimpannya ke dalam record booking.

---

## 6. Strategi Pengujian (`tests/customer-account.test.mjs`)
- Memverifikasi skema migrasi `0003_customer_accounts.sql` dan tipe `UserRole` (`'customer'`).
- Memverifikasi alur klaim & pencatatan `customerId` pada `POST /api/bookings`.
- Memverifikasi halaman `/account`, pemilih peran di `/register` & `/login`, serta fitur *Auto-Fill Saved Travelers* di halaman checkout.
- Memastikan seluruh pengujian (`npm test`) dan kompilasi produksi (`npm run build`) lulus 100%.
