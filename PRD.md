# Product Requirements Document (PRD)
## Nusabook: SaaS-Enabled Marketplace untuk Digitalisasi UMKM Tour & Travel

---

### Informasi Dokumen
* **Nama Produk**: Nusabook
* **Versi Dokumen**: v1.0.0
* **Status**: Approved for Development (MVP Phase)
* **Tanggal Penyusunan**: 7 September 2026
* **Penulis / Stakeholder Utama**:
  * Achmad Chanif Rahmatullah (*Chief Executive Officer*)
  * Ilyasa Abiyyu Wicaksono (*Chief Technology Officer*)
  * David Nazal Farihin (*Chief Operating Officer*)
  * Zurich Sabil (*Chief Financial Officer*)
  * Ully Najma Hansani (*Chief Creative Officer*)
* **Institusi Afiliasi**: Universitas Tidar, Magelang (Program P2MW 2026)

---

## 1. Executive Summary & Latar Belakang

### 1.1 Latar Belakang Masalah
Berdasarkan riset empiris terhadap **2.804 pelaku usaha tour and travel di 24 kota Indonesia**:
* **47,7% (1.338 pelaku usaha)** belum memiliki website dan masih mengandalkan media sosial serta perpesanan instan (WhatsApp) sebagai sarana reservasi dan operasional harian.
* **52,3% (1.466 pelaku usaha)** telah memiliki website, namun sebagian besar masih berupa **website statis satu arah** tanpa mesin pemesanan (*booking engine*) dan sistem kuota terpadu.
* **Pain Points Utama Pelaku Usaha**:
  1. **Tingginya Risiko Overbooking**: Ketiadaan penguncian kuota otomatis membuat admin sering menerima pesanan melebihi kapasitas bus/trip pada saat pesanan melonjak.
  2. **Human Error Administrasi & Rekapitulasi Manual**: Verifikasi bukti transfer manual via chat WhatsApp memicu kesalahan pencatatan, hilangnya data mutasi, dan rekapitulasi laporan laba-rugi yang tidak transparan.
  3. **Hambatan Biaya Awal (Cost Barrier)**: Persepsi bahwa membangun platform reservasi digital membutuhkan modal besar (software house / agensi jual putus dengan biaya puluhan juta) serta kompleksitas teknis yang tinggi.
  4. **Kesenjangan Digitalisasi Wilayah**: Kota-kota dengan aktivitas wisata aktif di luar poros utama (seperti Tangerang, Pekanbaru, Semarang) tertinggal jauh dalam adopsi teknologi dibanding Bali dan Jakarta.

### 1.2 Visi & Nilai Solusi (Value Proposition)
Nusabook hadir sebagai platform **SaaS-Enabled Marketplace**:
1. **SaaS Layer (Backoffice & No-Code Storefront)**: Menyediakan sistem operasional bagi agen travel untuk mengelola katalog, jadwal keberangkatan, otomatisasi penguncian kuota (*real-time slot locking*), multi-channel booking database, dan dashboard analitik.
2. **Marketplace Layer (Aggregator)**: Menjadi pintu masuk pemasaran bagi wisatawan (B2C) untuk mengeksplorasi, membandingkan, dan memesan paket *open trip* maupun *private trip* terverifikasi dari mitra lokal.
3. **Model Monetisasi Inklusif (Zero Upfront Cost)**: Skema komisi **2% per transaksi berhasil** tanpa biaya berlangganan bulanan di awal, menghapus risiko finansial bagi UMKM skala mikro dan kecil.

### 1.3 Tujuan & Key Performance Indicators (KPIs)
* **Target Validasi Awal (Bulan 1 - 3)**:
  * Onboarding minimal 20 UMKM Tour & Travel aktif.
  * Menghasilkan 50 - 100 leads terdaftar.
  * Memproses minimal 100 transaksi sukses melalui sistem.
* **Target Skalabilitas (Bulan 4 - 6)**:
  * 50 - 100 mitra aktif dengan total GMV mencapai Rp 1 Miliar - Rp 3 Miliar per bulan.
  * Response time notifikasi dan sistem reservasi < 1 detik.
  * System Uptime SLA $\ge$ 99.5%.

---

## 2. User Personas & Target Audiens

### 2.1 Persona 1: Mitra Usaha Travel / Operator (B2B)
* **Profil**: Pemilik atau admin operasional tour and travel lokal (skala tim 2 - 5 orang), melayani paket *open trip*, *private trip*, atau sewa armada wisata.
* **Kebutuhan**:
  * Membuat etalase web katalog digital dalam hitungan menit tanpa koding (*no-code*).
  * Kuota kursi trip ter-update otomatis saat pelanggan melakukan reservasi dan pembayaran.
  * Pencatatan transaksi terpusat untuk pesanan online maupun pelanggan yang memesan offline (walk-in/manual transfer).
  * Kemudahan mencetak manifes peserta perjalanan (*passenger manifest*).
* **Frustrasi**: Kewalahan membalas chat WhatsApp satu per satu, sering salah menghitung sisa kursi, dan data manifes tercecer di spreadsheet/chat.

### 2.2 Persona 2: Pelanggan / Wisatawan (B2C)
* **Profil**: Wisatawan domestik (pelajar, mahasiswa, pekerja muda, keluarga, komunitas travel).
* **Kebutuhan**:
  * Mengetahui sisa kuota perjalanan secara *real-time* sebelum memutuskan membeli.
  * Pilihan metode pembayaran instan (QRIS, Virtual Account, E-Wallet) dengan verifikasi otomatis.
  * Menerima *e-ticket* / bukti booking instan yang terkirim langsung ke WhatsApp dan email.
* **Frustrasi**: Harus menunggu admin membalas pesan WhatsApp untuk menanyakan kuota, ragu terhadap legalitas agen travel, dan proses transfer antarbank manual yang merepotkan.

### 2.3 Persona 3: Platform Super Admin (Tim Internal Nusabook)
* **Profil**: Manajemen internal Nusabook (Operations, Tech, Finance).
* **Kebutuhan**:
  * Verifikasi identitas dan legalitas mitra agen travel sebelum dipublikasikan ke marketplace.
  * Monitoring total GMV, volume transaksi harian, dan potongan komisi 2%.
  * Settlement / penarikan dana hasil penjualan tiket ke rekening mitra secara terjadwal dan akurat.
  * Monitoring performa server dan keamanan sistem.

---

## 3. Cakupan Pengembangan Produk (Phased Scope & Roadmap)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           NUSABOOK ROADMAP                              │
├─────────────────────────────────────────────────────────────────────────┤
│ [Phase 1: MVP Core] (Bulan 1 - 2)                                       │
│ • No-Code Storefront Subdomain (nusabook.id/agen-name)                   │
│ • Booking Engine & Real-Time Slot Locking Mechanism                     │
│ • Midtrans Integration (QRIS, VA, E-Wallet) + Manual Verification Entry │
│ • WhatsApp API Automated Notification (Booking Confirmation & Manifest) │
│ • Operator Backoffice Dashboard (Kelola Paket, Kuota, Peserta)         │
├─────────────────────────────────────────────────────────────────────────┤
│ [Phase 2: Marketplace Aggregator & CRM] (Bulan 3 - 4)                   │
│ • Marketplace Discovery Directory (Pencarian paket wisata per kota)     │
│ • Customer Database & CRM Ringan (History trip, repeat customer)        │
│ • Automated Settlement & Payout Engine ke Rekening Mitra (Potongan 2%)  │
│ • Uji coba dan ekspansi mitra pilot di Tangerang, Pekanbaru, Jateng/DIY │
├─────────────────────────────────────────────────────────────────────────┤
│ [Phase 3: Scale & Ecosystem Integrations] (Bulan 5 - 6+)                 │
│ • Custom Domain Mapping untuk Agen (opsional add-on)                    │
│ • Laporan Keuangan Ekspor Pajak & Akuntansi Ringkas                     │
│ • PWA (Progressive Web App) untuk Tour Leader / Crew Lapangan           │
│ • Integrasi Tiket Asuransi Perjalanan Perjalanan                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Spesifikasi Fungsional Produk (Functional Specifications)

### 4.1 Modul 1: No-Code Digital Storefront (Etalase Publik Agen)
* **FR-1.1 Custom Storefront URL**: Setiap agen yang terdaftar mendapatkan URL publik unik (misal: `nusabook.id/[slug-agen]` atau subdomain `[slug-agen].nusabook.id`).
* **FR-1.2 Profil & Branding Agen**: Agen dapat mengunggah logo, deskripsi profil, kontak sosial media, kebijakan pembatalan (*cancellation policy*), serta nomor WhatsApp resmi.
* **FR-1.3 Katalog Paket Wisata**: Menampilkan kartu paket wisata yang memuat:
  * Foto/galeri destinasi.
  * Tipe perjalanan (*Open Trip* atau *Private Trip*).
  * Rute / *Itinerary* perjalanan interaktif (Day 1, Day 2, dst).
  * Fasilitas termasuk (*Include*) dan tidak termasuk (*Exclude*).
  * Titik kumpul (*Meeting Point*).
  * Kalender jadwal keberangkatan beserta status sisa kuota (misal: *"Tersisa 4 kursi"* atau *"Penuh"*).

### 4.2 Modul 2: Booking Engine & Real-Time Slot Locking
* **FR-2.1 Pemilihan Jadwal & Variasi Paket**: Pelanggan memilih tanggal keberangkatan, tipe paket (misal: Reguler, VIP), dan jumlah peserta (*pax*).
* **FR-2.2 Form Data Manifes Penumpang**: Wajib menginput nama lengkap peserta, nomor WhatsApp, alamat email, nomor identitas (NIK/Paspor untuk asuransi), dan catatan khusus/kontak darurat.
* **FR-2.3 Optimistic/Pessimistic Quota Reservation**:
  * Saat pelanggan masuk ke tahapan *checkout*, sistem melakukan reservasi slot sementara dengan batas waktu pembayaran (*payment time-to-live / TTL* 15–30 menit).
  * Kuota dipotong sementara dari *available slots*. Jika pembayaran kadaluarsa tanpa transaksi sukses, kuota otomatis dikembalikan ke sistem (*auto-rollback*).
  * Jika kuota habis, form reservasi pada jadwal tersebut langsung dinonaktifkan (*Sold Out*).

### 4.3 Modul 3: Sistem Pembayaran & Rekonsiliasi (Multi-Payment)
* **FR-3.1 Pembayaran Otomatis (Payment Gateway - Midtrans)**:
  * QRIS (GoPay, OVO, Dana, ShopeePay).
  * Virtual Account Bank (BCA, Mandiri, BNI, BRI, Permata).
  * Verifikasi instan melalui *webhook HTTP callback*.
* **FR-3.2 Transaksi Manual (Walk-in / Direct Transfer)**:
  * Mitra agen dapat memasukkan transaksi yang terjadi di luar web secara manual ke dashboard (misal pesanan via chat/kantor).
  * Transaksi manual tetap memotong kuota dan masuk ke rekapitulasi database terpusat untuk menjaga integritas manifes perjalanan.
* **FR-3.3 Biaya Transaksi & Komisi Platform**:
  * Sistem otomatis menghitung potongan komisi **2%** dari nilai kotor transaksi (*GMV*) untuk setiap transaksi berbayar.

### 4.4 Modul 4: Integrasi Notifikasi Otomatis (WhatsApp & Email Engine)
* **FR-4.1 Notifikasi Pesanan Baru**: Mengirim pesan ke WhatsApp pelanggan berisi ringkasan pesanan, batas waktu pembayaran, dan tautan invoice pembayaran.
* **FR-4.2 Konfirmasi Pembayaran & E-Ticket**: Pengiriman bukti pembayaran sukses dan kode booking/e-ticket (disertai QR code validasi tiket) segera setelah webhook payment gateway sukses.
* **FR-4.3 Reminder H-1 Keberangkatan**: Pesan otomatis ke nomor WhatsApp peserta berisi pengingat jam kumpul, kontak *tour leader*, dan barang yang perlu dibawa.
* **FR-4.4 Alert Kuota Menipis untuk Admin**: Mengirimkan pemberitahuan ke WhatsApp admin mitra ketika kuota trip tersisa $\le 2$ kursi.

### 4.5 Modul 5: Operator Backoffice Dashboard (SaaS Layer)
* **FR-5.1 Manajemen Produk & Paket**:
  * CRUD paket wisata (*create, read, update, delete*).
  * Konfigurasi tanggal trip, kuota kursi, harga *early bird* / normal, serta *pricing tier*.
* **FR-5.2 Manajemen Kuota & Kalender Jadwal**: Tampilan kalender interaktif yang memperlihatkan okupansi kursi pada setiap tanggal trip.
* **FR-5.3 Manajemen Reservasi & Manifes**:
  * Daftar pesanan masuk dengan filter status: *Pending, Paid, Cancelled, Completed*.
  * Fitur ekspor manifes penumpang ke format **PDF** dan **Excel (.xlsx)** untuk keperluan lapangan dan manifes bus/kapal.
* **FR-5.4 Laporan Keuangan & Analitik Operasional**:
  * Ringkasan pendapatan bruto harian/mingguan/bulanan.
  * Estimasi laba bersih setelah potongan komisi.
  * Grafik performa paket wisata paling diminati (*top destinations*).

### 4.6 Modul 6: Marketplace Discovery Platform (B2C Layer)
* **FR-6.1 Pencarian & Filter Paket**: Pengguna dapat mencari berdasarkan destinasi, rentang harga, durasi (misal: 1D, 2D1N, 3D2N), dan kota asal keberangkatan.
* **FR-6.2 Verifikasi Agen Terpercaya**: Badge *"Verified Partner"* bagi mitra travel yang telah diverifikasi identitas dan legalitas usahanya oleh Nusabook.
* **FR-6.3 Ulasan & Penilaian (*Ratings & Reviews*)**: Pelanggan yang telah menyelesaikan perjalanan dapat memberikan rating bintang dan ulasan testimoni.

### 4.7 Modul 7: Super Admin Platform Management
* **FR-7.1 Verifikasi & Onboarding Mitra**: Peninjauan dokumen identitas dan persetujuan akun mitra.
* **FR-7.2 Ledger Keuangan & Payout Management**:
  * Perhitungan komisi 2% Nusabook per transaksi.
  * Rekonsiliasi escrow saldo penjualan tiket milik mitra.
  * Manajemen pencairan dana (*disbursement*) berkala ke rekening bank mitra.
* **FR-7.3 System Logs & Audit Trail**: Pencatatan riwayat perubahan status transaksi dan aktivitas akun untuk keamanan dan pelaporan pertanggungjawaban hibah P2MW.

---

## 5. Information Architecture & Rancangan Basis Data (3NF)

Untuk memastikan keandalan, skalabilitas, dan penghindaran anomali data (sesuai spesifikasi proposal berbasis riset teknik informatika):

### 5.1 Skema Relasi Entitas Utama (Core Entities)
```
[travel_agents] (Mitra Usaha)
  ├── id (UUID, PK)
  ├── business_name, slug, logo_url, description
  ├── bank_account_number, bank_name, bank_holder_name
  ├── status (pending, active, suspended)
  └── created_at, updated_at

[tour_packages] (Paket Wisata)
  ├── id (UUID, PK)
  ├── agent_id (FK -> travel_agents.id)
  ├── title, slug, package_type (open_trip, private_trip)
  ├── description, terms_conditions, meeting_point
  ├── duration_days, is_active
  └── created_at, updated_at

[trip_schedules] (Jadwal Keberangkatan & Kuota)
  ├── id (UUID, PK)
  ├── package_id (FK -> tour_packages.id)
  ├── departure_date, return_date
  ├── total_quota, reserved_quota, booked_quota
  ├── base_price, status (open, closed, completed, cancelled)
  └── version (Optimistic lock concurrency flag)

[bookings] (Transaksi Reservasi)
  ├── id (UUID, PK)
  ├── booking_code (UNIQUE, e.g. "NB-2026-XXXXX")
  ├── agent_id (FK -> travel_agents.id)
  ├── schedule_id (FK -> trip_schedules.id)
  ├── customer_name, customer_email, customer_phone
  ├── total_pax, total_amount, platform_fee_2_percent, net_agent_amount
  ├── payment_status (unpaid, paid, expired, refunded)
  ├── payment_method, payment_gateway_reference
  ├── expires_at, paid_at
  └── created_at, updated_at

[booking_passengers] (Data Manifes Penumpang)
  ├── id (UUID, PK)
  ├── booking_id (FK -> bookings.id)
  ├── full_name, id_number (NIK/Paspor), gender
  ├── phone_number, emergency_contact, special_notes
  └── created_at

[payouts] (Settlement / Penarikan Dana Mitra)
  ├── id (UUID, PK)
  ├── agent_id (FK -> travel_agents.id)
  ├── amount, platform_deduction, net_transferred
  ├── status (pending, processing, success, rejected)
  ├── bank_transfer_reference, proof_url
  └── requested_at, processed_at
```

### 5.2 Strategi Concurrency & Quota Locking
Untuk menghindari *race condition* saat pemesanan kursi terakhir pada paket wisata populer:
* Digunakan transaksi basis data dengan mekanisme **Row-Level Locking** (`SELECT ... FOR UPDATE`) atau **Optimistic Locking** menggunakan kolom `version` pada tabel `trip_schedules`.
* Transaksi pemesanan memverifikasi bahwa:
  $$\text{booked\_quota} + \text{reserved\_quota} + \text{requested\_pax} \le \text{total\_quota}$$

---

## 6. Arsitektur Sistem & Spesifikasi Teknologi (Tech Stack)

### 6.1 Pilihan Arsitektur & Teknologi
| Komponen | Pilihan Teknologi | Justifikasi Teknis & Alokasi Anggaran |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js / React (TypeScript) + Tailwind CSS** | Server-side rendering (SSR) optimal untuk SEO etalase publik dan performa kilat antarmuka dashboard backoffice. |
| **Backend API** | **Node.js (Next.js API Routes / NestJS) atau Go** | Responsif, stateless, mudah dipelihara, dan performa tinggi dalam menangani webhook transaksi. |
| **Database** | **PostgreSQL (v15+)** | RDBMS dengan dukungan ACID ketat, mudah dinormalisasi hingga 3NF, dan tangguh mengelola transaksi keuangan. |
| **Caching & Queue** | **Redis** | Mengelola *session*, penguncian kuota sementara (*distributed locking*), dan antrian pengiriman pesan WhatsApp. |
| **Server / Infrastructure** | **VPS IdCloudHost (4 vCPU, 8 GB RAM)** | Sesuai RAB P2MW (Rp 3.000.000 untuk 6 bulan pertama), latency rendah lokal Indonesia. |
| **Payment Gateway** | **Midtrans Snap / Core API** | Dukungan QRIS nasional, VA bank lengkap, biaya setup teralokasi di RAB P2MW (Rp 1.000.000). |
| **WhatsApp Gateway** | **Wablas / Fonnte API** | Layanan otomasi notifikasi WhatsApp lokal terjangkau (Rp 86.000/bln sesuai RAB). |
| **Monitoring & Backup** | **UptimeRobot Pro + Daily Cloud Backup** | Sesuai alokasi anggaran operasional teknis untuk menjamin uptime $\ge 99.5\%$. |

---

## 7. Non-Functional Requirements (NFR)

### 7.1 Keamanan & Privasi Data (Sesuai UU PDP)
1. **Enkripsi Data**: Semua lalu lintas web wajib menggunakan HTTPS/TLS 1.3 dengan sertifikat SSL resmi (teralokasi dalam anggaran).
2. **Perlindungan Data Pribadi (UU PDP No. 27/2022)**: Data sensitif seperti NIK penumpang pada manifes dienkripsi di level basis data (*AES-256 at rest*) dan hanya dapat diakses oleh agen pemilik trip.
3. **Role-Based Access Control (RBAC)**: Pemisahan hak akses yang ketat antara Super Admin, Pemilik Usaha, Admin Staf Lapangan, dan Wisatawan.

### 7.2 Performa & Skalabilitas
1. **Waktu Muat Halaman (*Page Load Time*)**: Waktu respons halaman katalog agen $\le 1,8$ detik pada jaringan seluler 4G.
2. **Kapasitas Konkurensi**: Mampu menangani hingga minimal 500 permintaan pemesanan serentak tanpa terjadinya *deadlock* kuota.
3. **Webhook Latency**: Pemrosesan notifikasi pembayaran dari payment gateway diselesaikan dalam waktu $< 2$ detik sejak sinyal diterima.

### 7.3 Ketersediaan & Pemulihan Bencana (*Disaster Recovery*)
1. **Uptime SLA**: Minimum ketersediaan layanan 99,5% per bulan.
2. **Backup Rutin**:
   * Automated Daily Backup basis data ke *off-site cloud storage*.
   * Backup mingguan offline menggunakan SSD Eksternal 1 TB (sesuai RAB P2MW) sebagai cadangan fisik arsip data.

---

## 8. Rencana Implementasi & Milestone Proyek

```
┌─────────────────┬─────────────────────────────────────────────────┬──────────────┐
│ Sprint / Waktu  │ Fokus Pekerjaan & Luaran Utama                  │ PIC Tim      │
├─────────────────┼─────────────────────────────────────────────────┼──────────────┤
│ **Minggu 1-2**  │ Setup VPS, Domain, SSL, DB Schema 3NF, Core API │ CTO          │
│ **Minggu 3-4**  │ Dashboard Operator (CRUD Paket & Manifes Kuota) │ CTO / COO    │
│ **Minggu 5-6**  │ Storefront Publik, Integrasi Midtrans & Wablas  │ CTO / CEO    │
│ **Minggu 7-8**  │ User Testing 10 UMKM, Perbaikan UX & Bug Fixing │ COO / CCO    │
│ **Minggu 9-10** │ Peluncuran Pilot Market (Tangerang & Pekanbaru) │ CEO / CCO    │
│ **Minggu 11-12**│ Ekspansi Onboarding 20-30 UMKM & Evaluasi P2MW  │ Seluruh Tim  │
└─────────────────┴─────────────────────────────────────────────────┴──────────────┘
```

---

## 9. Penyelarasan Anggaran Belanja (RAB P2MW: Rp 14.550.000)

| Komponen Anggaran | Alokasi Dana | Hubungan Terhadap Spesifikasi Teknis di PRD |
| :--- | :--- | :--- |
| **Sewa VPS Cloud Standar (4vCPU 8GB)** | Rp 3.000.000 | Menampung backend, frontend, PostgreSQL, dan Redis untuk fase validasi awal 6 bulan. |
| **Upgrade VPS (Scaling 8vCPU 16GB)** | Rp 3.000.000 | Cadangan penskalaan server ketika traffic transaksi di marketplace melonjak. |
| **Domain .id + SSL** | Rp 600.000 | Domain resmi `nusabook.id` dan sertifikat enkripsi SSL. |
| **Integrasi Payment Gateway** | Rp 1.000.000 | Registrasi, verifikasi merchant, dan biaya setup sistem Midtrans. |
| **Backup Sistem & Firewall Cloud** | Rp 900.000 | Menjamin keamanan dari ancaman serangan siber dan integritas data cloud. |
| **Monitoring Server Uptime** | Rp 330.000 | UptimeRobot Pro untuk pengawasan 24/7 ketersediaan layanan. |
| **Email Bisnis Google Workspace** | Rp 570.000 | Kredibilitas komunikasi profesional (@nusabook.id) dan integrasi SMTP email. |
| **WhatsApp API Gateway** | Rp 86.000 | Otomasi pengiriman tiket dan reminder trip ke nomor WhatsApp pelanggan. |
| **SSD Eksternal 1 TB** | Rp 1.000.000 | Media backup *offline* fisik arsip data transaksi berkala. |
| **Validasi Pasar & Insentif Testing** | Rp 1.913.000 | Onboarding mitra langsung, webinar Zoom Pro, dan insentif uji coba pengguna. |
| **Pemasaran & Promosi Digital** | Rp 1.651.000 | Google Ads, Meta Ads retargeting, dan materi promosi Canva Pro. |
| **Pendaftaran Merek HKI (DGIP)** | Rp 500.000 | Perlindungan legalitas merek dagang "Nusabook". |
| **TOTAL** | **Rp 14.550.000** | **100% Selaras dengan Usulan Proposal P2MW 2026** |

---

## 10. Manajemen Risiko & Rencana Kontinjensi

1. **Risiko Resistensi UMKM Terhadap Sistem Baru**:
   * *Mitigasi*: Pendekatan onboarding personal (*hyperlocal assistance*) oleh COO/CCO dengan pendampingan input data awal hingga mitra mahir mengoperasikan dashboard.
2. **Risiko Kegagalan Notifikasi WhatsApp API**:
   * *Mitigasi*: Penyediaan mekanisme *fallback* otomatis ke email (*SMTP notification*) jika nomor WhatsApp tidak terjangkau atau kuota pesan pihak ketiga habis.
3. **Risiko Keterlambatan Pembayaran Pelanggan Menahan Kuota**:
   * *Mitigasi*: Pembatasan waktu bayar (*timer countdown*) maksimal 30 menit. Jika melewati batas, sistem cron job secara otomatis melepas kunci kuota agar dapat dibeli oleh calon wisatawan lain.
