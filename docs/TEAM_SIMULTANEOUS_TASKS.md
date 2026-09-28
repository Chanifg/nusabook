# Nusabook: Pembagian Tugas Tim Simultan (Simultaneous Team Workstreams)

* **Status**: Siap Dikerjakan (Ready for Execution)
* **Target Milestone**: MVP Phase 1 (Nusabook Core Release)
* **Arsitektur Fondasi**: Next.js 15 (App Router), Tailwind CSS, Supabase PostgreSQL 3NF, Adapter Pattern

Dokumen ini memetakan pembagian modul pengembangan platform Nusabook menjadi **5 jalur kerja (workstreams) independen**. Setiap anggota tim dapat mengerjakan jalurnya secara paralel di Git branch terpisah tanpa saling menghalangi (*zero blocking dependencies*).

---

## Matriks Jalur Kerja & Git Branching

| Workstream | Fokus Modul | Penanggung Jawab / Role | Target Branch | Ketergantungan |
| :--- | :--- | :--- | :--- | :--- |
| **Workstream A** | Booking Engine & Checkout Wisatawan | Frontend / Fullstack B2C | `feat/booking-engine` | Fondasi (Ready) |
| **Workstream B** | Backoffice Dashboard Mitra Travel | Frontend / Fullstack SaaS | `feat/backoffice-dashboard` | Fondasi (Ready) |
| **Workstream C** | Manifes Penumpang & Export PDF/Excel | Fullstack / Backend | `feat/passenger-manifest` | Fondasi (Ready) |
| **Workstream D** | Marketplace Discovery & Search Portal | Frontend / UI Specialist | `feat/marketplace-discovery` | Fondasi (Ready) |
| **Workstream E** | Webhook Handler & Settlement 2% | Backend Engineer | `feat/payment-webhook` | Fondasi (Ready) |

---

## Workstream A: Booking Engine & Checkout Wisatawan (B2C)

### 1. Tujuan
Membangun alur pemesanan tiket dari halaman paket wisata hingga terbitnya instruksi bayar dan e-ticket bagi wisatawan.

### 2. File yang Dikerjakan
* `app/(storefront)/[slug]/packages/[packageSlug]/page.tsx` (Detail paket wisata & pemilihan tanggal/jadwal)
* `app/(storefront)/[slug]/booking/page.tsx` (Formulir data kontak pemesan & data manifes setiap peserta)
* `app/api/bookings/route.ts` (API pembuatan pesanan & pemanggilan atomik `reserve_trip_quota`)
* `app/bookings/[bookingCode]/payment/page.tsx` (Halaman instruksi bayar QRIS simulator / rekening bank)
* `app/bookings/[bookingCode]/page.tsx` (Halaman publik E-Ticket & bukti reservasi)
* `components/booking/quota-counter.tsx` (Indikator sisa kursi dengan realtime feedback)

### 3. Kontrak API & Antarmuka
* **Endpoint**: `POST /api/bookings`
* **Payload Request**:
  ```typescript
  {
    scheduleId: string;
    customerName: string;
    customerEmail: string;
    customerWhatsapp: string;
    pax: number;
    passengers: Array<{
      fullName: string;
      idCardNumber?: string;
      gender?: 'MALE' | 'FEMALE';
      phoneNumber?: string;
      emergencyContact?: string;
    }>;
  }
  ```
* **Logika Backend**:
  1. Eksekusi RPC `reserve_trip_quota(scheduleId, pax)`.
  2. Jika bernilai `false`, kembalikan HTTP 400 dengan pesan: `"Maaf, kuota kursi untuk jadwal ini sudah habis."`
  3. Jika berhasil, insert ke tabel `bookings` dan `booking_passengers`.
  4. Panggil `getPaymentGateway().createInvoice(...)` untuk generate detail pembayaran.
  5. Kirim notifikasi pembuatan pesanan via `getNotificationProvider().sendBookingCreated(...)`.

### 4. Kriteria Selesai (Acceptance Criteria)
* Wisatawan dapat memilih jumlah pax dan mengisi formulir nama seluruh peserta.
* Jika kuota penuh, muncul pesan kesalahan yang ramah dan transaksi dibatalkan dengan aman.
* Menampilkan batas waktu pembayaran (TTL 20 menit) dengan countdown timer.
* Pengujian: 3 test unit untuk validasi form dan simulasi booking berhasil.

---

## Workstream B: Backoffice Dashboard Mitra Tour & Travel (B2B SaaS)

### 1. Tujuan
Menyediakan dashboard bagi pengelola tour & travel untuk memantau metrik usaha, mengatur katalog paket, dan mengelola jadwal keberangkatan.

### 2. File yang Dikerjakan
* `app/(auth)/login/page.tsx` (Halaman login mitra via Supabase Auth)
* `app/(auth)/register/page.tsx` (Pendaftaran agen baru & input profil usaha)
* `app/(backoffice)/dashboard/page.tsx` (Ringkasan metrik: Omzet bruto, pendapatan bersih setelah 2%, total kursi terjual)
* `app/(backoffice)/dashboard/packages/page.tsx` (Daftar paket wisata & tombol tambah/edit/hapus)
* `app/(backoffice)/dashboard/packages/new/page.tsx` (Form pembuatan paket, itinerary bertahap, fasilitas)
* `app/(backoffice)/dashboard/schedules/page.tsx` (Kalender jadwal keberangkatan & toggle status kuota)
* `components/dashboard/sidebar.tsx` & `components/dashboard/header.tsx`

### 3. Logika & Keamanan
* Menggunakan Supabase Server Client (`lib/supabase/server.ts`) untuk mengambil user session.
* Jika session tidak ditemukan, redirect pengguna ke `/login`.
* Seluruh kueri basis data otomatis terisolasi per `owner_id` berkat Row Level Security (RLS).
* Perhitungan komisi di dashboard:
  * Omzet Kotor = `SUM(total_amount)` pada booking berstatus `PAID`.
  * Potongan Platform (2%) = `SUM(platform_fee)`.
  * Pendapatan Bersih Mitra = `SUM(agent_payout_amount)`.

### 4. Kriteria Selesai (Acceptance Criteria)
* Mitra dapat login, melihat daftar paket wisata miliknya, dan menambah jadwal keberangkatan baru.
* Metrik omzet dan kursi terisi terhitung secara akurat.
* Antarmuka responsif dan nyaman digunakan pada tablet maupun laptop.

---

## Workstream C: Manifes Penumpang & Fitur Export Dokumen

### 1. Tujuan
Menyediakan fitur rekapitulasi data penumpang per jadwal perjalanan yang dapat diekspor ke format PDF siap cetak dan Excel spreadsheet untuk kebutuhan kru di lapangan.

### 2. File yang Dikerjakan
* `app/(backoffice)/dashboard/schedules/[id]/manifest/page.tsx` (Tabel manifes penumpang per jadwal)
* `app/api/manifest/[scheduleId]/pdf/route.ts` (Endpoint download manifes versi PDF)
* `app/api/manifest/[scheduleId]/excel/route.ts` (Endpoint download manifes versi Excel)
* `components/manifest/passenger-table.tsx` (Komponen tabel dengan fitur pencarian nama dan filter gender)
* `components/manifest/checkin-button.tsx` (Tombol presensi peserta saat hari-H)

### 3. Atribut Manifes yang Ditampilkan
1. Nomor Kursi / Urut
2. Nama Lengkap Peserta
3. Jenis Kelamin (L/P)
4. Nomor Identitas (NIK / Paspor terenkripsi)
5. Nomor Kontak WhatsApp
6. Kontak Darurat (Keluarga)
7. Catatan Khusus (Alergi / Riwayat Kesehatan)
8. Kode Booking & Status Pembayaran

### 4. Kriteria Selesai (Acceptance Criteria)
* Tabel manifes menampilkan seluruh penumpang yang terdaftar pada jadwal terkait.
* Fitur pencarian instan nama penumpang berfungsi cepat di sisi klien.
* Tombol "Unduh PDF" menghasilkan layout dokumen cetak yang rapi dengan kop nama agen.
* Tombol "Unduh Excel" menghasilkan file `.xlsx` atau `.csv` yang siap dibuka di spreadsheet.

---

## Workstream D: Marketplace Discovery & Public Portal

### 1. Tujuan
Membangun antarmuka katalog agregator pariwisata pada landing page utama Nusabook, memudahkan wisatawan mencari dan membandingkan paket wisata terverifikasi dari berbagai kota di Indonesia.

### 2. File yang Dikerjakan
* `app/explore/page.tsx` (Direktori pencarian katalog wisata nasional)
* `components/marketplace/search-bar.tsx` (Form pencarian: Kota Tujuan, Tanggal, Jumlah Pax)
* `components/marketplace/package-card.tsx` (Kartu paket wisata dengan lencana Verified Partner)
* `components/marketplace/filter-sidebar.tsx` (Filter kategori: Open Trip / Private Trip, Rentang Harga)
* `components/marketplace/city-chips.tsx` (Pintasan kota populer: Magelang, Sleman, Malang, Banyuwangi, dll.)

### 3. Logika Pengambilan Data
* Menampilkan paket wisata yang memiliki status `is_published = true` dan berasal dari agen aktif (`is_active = true`).
* Menyortir berdasarkan tanggal keberangkatan terdekat.
* Jika kuota pada suatu paket sudah penuh, kartu menampilkan badge `"Kuota Penuh"` tanpa menonaktifkan informasi detail.

### 4. Kriteria Selesai (Acceptance Criteria)
* Wisatawan dapat menyaring paket wisata berdasarkan kota destinasi dan rentang harga.
* Mengklik kartu wisata mengarahkan wisatawan langsung ke storefront resmi mitra agen terkait.
* Desain responsif sempurna di layar smartphone (360px ke atas).

---

## Workstream E: Webhook Handler & Pembukuan Transaksi Otomatis

### 1. Tujuan
Menangani callback notifikasi pembayaran otomatis, memvalidasi tanda tangan kriptografi, memperbarui status pesanan, dan mengonfirmasi pemotongan kuota secara atomik.

### 2. File yang Dikerjakan
* `app/api/webhooks/payment/route.ts` (Endpoint HTTP POST penerima callback gateway)
* `lib/payment/providers/tripay-provider.ts` (Implementasi adapter live Tripay / Duitku)
* `app/api/cron/expire-bookings/route.ts` (Worker pembersih booking kadaluarsa yang melebihi 20 menit)
* `tests/webhook-flow.test.mjs` (Pengujian alur callback dan pemindahan kuota)

### 3. Alur Logika Webhook
```text
[Gateway Callback] ──> [Verifikasi Signature / Hash Key]
                             │
                  Valid? ────┴──── Tidak ──> Return 401 Unauthorized
                    │
                    ▼
          [Cek Status Transaksi]
          • PAID / Settlement:
            1. UPDATE bookings SET payment_status = 'PAID', paid_at = NOW()
            2. Panggil SQL confirm_trip_quota(schedule_id, pax)
            3. Kirim WhatsApp e-ticket via NotificationProvider
          • EXPIRED / Cancelled:
            1. UPDATE bookings SET payment_status = 'EXPIRED'
            2. Panggil SQL release_trip_quota(schedule_id, pax)
```

### 4. Kriteria Selesai (Acceptance Criteria)
* Webhook menolak request jika signature key tidak valid.
* Pembayaran sukses memicu perubahan status booking menjadi `PAID` dan kuota berpindah dari `reserved_quota` ke `booked_quota`.
* Booking yang kadaluarsa secara otomatis mengembalikan kursi ke `reserved_quota` via fungsi `release_trip_quota`.

---

## Panduan Kolaborasi Git untuk Tim

1. **Membuat Branch Kerja**:
   ```bash
   git checkout Main
   git pull origin Main
   git checkout -b <nama-branch-workstream>
   ```
2. **Aturan Commit & Kode**:
   - Selalu jalankan `npm test` dan `npm run build` sebelum membuat commit.
   - Hindari karakter em dash (`—`) pada teks UI atau copywriting sesuai standar antislop.
   - Gunakan format Rupiah yang seragam dengan memanggil helper `formatRupiah(amount)` dari `@/lib/utils`.
3. **Menggabungkan Kode (Merge)**:
   - Buat Pull Request (PR) ke branch `Main`.
   - Pastikan tidak ada konflik file antar-workstream karena struktur direktori telah dipisahkan per modul.
