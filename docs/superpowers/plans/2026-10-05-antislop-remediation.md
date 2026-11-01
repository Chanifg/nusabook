# Perencanaan Perbaikan Proyek Nusabook Berbasis Kaidah Anti-Slop

> **Petunjuk Eksekusi:** Rencana ini disusun menggunakan skill `antislop` (Mode 1: DURING) dan `writing-plans`. Setiap langkah terbagi menjadi unit kecil yang terverifikasi melalui test otomatis dan inspeksi kode.

**Tujuan:** Mengeliminasi seluruh pola AI-slop (aset asumsi, angka fiktif tanpa sumber, kontrol mati, ketiadaan state empty/loading/error, dan masalah aksesibilitas) pada platform Nusabook sehingga antarmuka berstandar keahlian desainer manusia (*Craftsmanship Standard*), berkarakter khas pariwisata Indonesia, dan tangguh secara fungsional.

**Arsitektur & Pendekatan:**
1. **Design Read & Dials:**
   > *Reading this as: B2B SaaS Operator Engine & Verified Tourism Marketplace for Indonesian travel agencies & adventure tourists, in a Stitch Material-Utility visual language, dial ENERGY 2 / RHYTHM 2 / MOTION 1.*
2. **Kepatuhan Hard Gate:** Menghapus semua foto profil asumtif (R-23/R-38), angka statistik statis tanpa rujukan database (R-17/R-36), menjamin navigasi nyata tanpa link mati (R-24/R-26), serta aksesibilitas keyboard penuh dengan indikator fokus dan penutup modal `Escape` (R-32).
3. **Kepatuhan Purpose-Gate & Kualitas:** Menjamin variasi ritme tata letak (R-05), tombol aksi spesifik dan kontekstual (R-15), 0 kata klise AI (R-16), dan kelengkapan 3 state (empty, loading, error) di seluruh tabel dan daftar (R-27).

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Supabase SSR/PostgreSQL 3NF, Material Symbols Outlined, Node.js Test Runner (`tsx --test`).

---

## Global Constraints (Batasan Mutlak)

- **R-02 (Anti Em-Dash):** Tidak boleh ada karakter em dash (`—`) di seluruh teks antarmuka atau salinan Bahasa Indonesia. Gunakan tanda koma (`,`), titik (`.`), titik dua (`:`), tanda kurung `()`, atau bullet (`•`).
- **R-03 (Mobile Responsiveness):** Tidak ada horizontal overflow pada viewport 360px s.d 1440px. Tabel manifes dan jadwal wajib memiliki container scroll horizontal berbayang halus.
- **R-17 & R-36 (Kebenaran Data):** Tidak ada statistik pengguna atau rating fiktif. Elemen yang belum memiliki data riil wajib berstatus jujur (tampilkan "0" atau label eksplisit "Segera Hadir").
- **R-24 & R-26 (Kelengkapan Interaktif):** Tidak ada tombol mati (*dead button*) atau link yang mengarah ke `#` kosong.
- **R-27 (UI States):** Seluruh komponen data dinamis wajib memiliki **Empty State**, **Loading State**, dan **Error State**.
- **R-32 (Aksesibilitas Keyboard):** Seluruh tombol dan input wajib memiliki visible focus indicator (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`). Semua dialog modal wajib dapat ditutup dengan tombol `Escape`.
- **R-35 (Verifikasi Sebelum Selesai):** Semua test unit/integrasi (`npm test`) dan build produksi (`npm run build`) wajib lulus 100% tanpa error.

---

## Rincian File yang Terkait

| File Path | Tanggung Jawab Perbaikan |
|---|---|
| [tests/antislop-rules.test.mjs](file:///home/aniiporangbaik/development/projects/Nusabook/tests/antislop-rules.test.mjs) | Test otomatis untuk mendeteksi em-dash, kata klise AI, link `#` kosong, dan kelengkapan state. |
| [app/explore/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/explore/page.tsx) | Menghapus foto profil asumsi `Bambang Pamungkas` (R-23), menghubungkan total paket aktif dinamis (R-17), melengkapi keyboard escape. |
| [app/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/page.tsx) | Memastikan seluruh CTA spesifik (R-15), memverifikasi ketiadaan buzzword AI (R-16), dan memastikan tidak ada claim palsu. |
| [app/(storefront)/[slug]/packages/[packageSlug]/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/%28storefront%29/%5Bslug%5D/packages/%5BpackageSlug%5D/page.tsx) | Memastikan bagian review/ulasan jujur (R-18/R-38), sticky bar mobile responsif tanpa overflow (R-03), dan selektor jadwal berfokus jelas (R-32). |
| [app/(storefront)/[slug]/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/%28storefront%29/%5Bslug%5D/page.tsx) | Menambahkan empty state bermakna saat agen belum memiliki paket wisata aktif (R-27). |
| [components/dashboard/packages-list.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/components/dashboard/packages-list.tsx) | Memperkuat empty state dan loading feedback pada backoffice paket wisata (R-27). |
| [components/dashboard/schedules-list.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/components/dashboard/schedules-list.tsx) | Memperkuat empty state saat belum ada jadwal dan tombol pembuatan jadwal baru (R-27). |
| [components/manifest/passenger-table.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/components/manifest/passenger-table.tsx) | Menangani empty state jika jadwal belum memiliki manifest penumpang (R-27). |
| [app/(admin)/admin/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/%28admin%29/admin/page.tsx) | Memastikan modal KYC dan payout dapat ditutup dengan tombol `Escape` (R-32). |

---

## Rangkaian Tugas Implementasi (Task Breakdown)

### Task 1: Pembuatan Test Suite Anti-Slop Otomatis
**Tujuan:** Menambahkan pengujian otomatis di `tests/antislop-rules.test.mjs` untuk memvalidasi kaidah antislop secara persisten.

- [ ] **Langkah 1.1:** Buat file test baru [tests/antislop-rules.test.mjs](file:///home/aniiporangbaik/development/projects/Nusabook/tests/antislop-rules.test.mjs) yang menguji:
  1. Tidak adanya karakter em-dash (`—`) pada seluruh file di direktori `app/` dan `components/` (R-02).
  2. Tidak adanya kata klise AI (*AI-powered, revolutionary, cutting-edge, next generation, seamless*) di seluruh teks antarmuka (R-16).
  3. Tidak adanya tombol/link dengan `href="#"` kosong tanpa ID section yang valid (R-24 & R-26).
- [ ] **Langkah 1.2:** Jalankan `npm test` untuk memverifikasi test suite baru berjalan dan mendeteksi kondisi awal.

---

### Task 2: Pembersihan Aset Asumsi & Angka Fiktif (Hard Gate R-17, R-23, R-38)
**Tujuan:** Menghapus foto profil buatan dan angka klaim statis yang tidak bersumber dari data riil.

- [ ] **Langkah 2.1:** Pada [app/explore/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/explore/page.tsx):
  - Hapus foto wajah eksternal dan nama `Bambang Pamungkas` di header. Ganti dengan avatar berbasis inisial netral `[P]` atau tombol akses cepat navigasi (R-23).
  - Pada pagination bar bawah (baris ~1080), ganti angka hardcoded `28 paket wisata aktif` menjadi nilai dinamis dari data paket yang sebenarnya (`filteredPackages.length`) (R-17).
- [ ] **Langkah 2.2:** Pada [app/(storefront)/[slug]/packages/[packageSlug]/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/%28storefront%29/%5Bslug%5D/packages/%5BpackageSlug%5D/page.tsx):
  - Periksa blok ulasan wisatawan. Pastikan ulasan memiliki indikator status transparan (*Ulasan Terverifikasi Wisatawan Pasca-Trip*) atau berikan empty state yang jujur jika belum ada ulasan tamu (R-18 & R-38).
- [ ] **Langkah 2.3:** Jalankan `npm test` dan pastikan tidak ada regresi.

---

### Task 3: Aksesibilitas Keyboard & Penutupan Modal (Hard Gate R-26, R-32)
**Tujuan:** Memastikan setiap elemen interaktif dapat dioperasikan penuh dengan keyboard, memiliki focus indicator jelas, dan modal dapat ditutup dengan `Escape`.

- [ ] **Langkah 3.1:** Tambahkan keyboard event listener `Escape` pada seluruh modal interaktif:
  - Modal konfirmasi KYC dan Payout di [app/(admin)/admin/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/%28admin%29/admin/page.tsx).
  - Modal reset sandi di [app/(auth)/login/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/%28auth%29/login/page.tsx).
  - Modal share/bagikan paket di [app/(storefront)/[slug]/packages/[packageSlug]/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/%28storefront%29/%5Bslug%5D/packages/%5BpackageSlug%5D/page.tsx).
- [ ] **Langkah 3.2:** Pastikan tombol-tombol utama dan input formulir memiliki kelas `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none` yang kontras dan jelas (R-32).
- [ ] **Langkah 3.3:** Verifikasi navigasi Tab/Shift+Tab dan tombol Enter/Space pada filter tabs di [app/explore/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/explore/page.tsx).

---

### Task 4: Kelengkapan 3 State UI: Empty, Loading, Error (Hard Gate R-27, C-4)
**Tujuan:** Menjamin aplikasi tidak hanya indah pada "happy path", melainkan siap melayani kondisi data kosong, gagal memuat, atau proses menunggu.

- [ ] **Langkah 4.1:** Pada etalase [app/(storefront)/[slug]/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/%28storefront%29/%5Bslug%5D/page.tsx):
  - Tambahkan tampilan **Empty State** berdesain Stitch jika `packages.length === 0` (menampilkan ilustrasi/ikon `explore_off`, pesan bersahabat bahwa agen sedang menyusun jadwal tur baru, dan tombol kontak langsung via WhatsApp).
- [ ] **Langkah 4.2:** Pada komponen manifes [components/manifest/passenger-table.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/components/manifest/passenger-table.tsx):
  - Periksa tampilan jika belum ada penumpang terdaftar (0 pax). Sediakan tampilan tabel kosong yang rapi dengan info *"Belum ada pemesanan tiket untuk jadwal keberangkatan ini"*.
- [ ] **Langkah 4.3:** Pada daftar paket [components/dashboard/packages-list.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/components/dashboard/packages-list.tsx) dan jadwal [components/dashboard/schedules-list.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/components/dashboard/schedules-list.tsx):
  - Pastikan tombol CTA *"Tambah Paket Wisata Baru"* dan *"Buka Jadwal Baru"* tampil mencolok ketika data masih kosong, memandu operator langkah demi langkah.

---

### Task 5: Penajaman Copywriting & Tombol Aksi (Quality Locks R-15, R-16, C-1)
**Tujuan:** Mengganti label CTA yang generik (*Get Started, Explore, Learn More*) dengan aksi nyata yang spesifik konteks pengguna pariwisata.

- [ ] **Langkah 5.1:** Audit seluruh tombol CTA di [app/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/page.tsx) dan [app/explore/page.tsx](file:///home/aniiporangbaik/development/projects/Nusabook/app/explore/page.tsx):
  - Ganti label umum seperti *"Mulai Sekarang"* menjadi *"Buka Storefront Gratis"* atau *"Cari Jadwal Open Trip"*.
  - Ganti label *"Lihat Detail"* menjadi *"Cek Kuota & Itinerary"*.
- [ ] **Langkah 5.2:** Pastikan teks narasi menjelaskan manfaat konkret (misal: *Pemisahan saldo escrow otomatis H+1 pelaksanaan tour*, *Sertifikasi pemandu HPI*, *Validasi manifes KSOP/TNBTS*), bukan klaim abstrak tanpa arti.

---

### Task 6: Buku Catatan Rasional (R-31) & Verifikasi Delivery Gate (R-35)
**Tujuan:** Mendokumentasikan alasan satu baris untuk setiap keputusan visual dan memverifikasi seluruh komponen secara menyeluruh sebelum dinyatakan selesai.

- [ ] **Langkah 6.1:** Catat *Buku Rasional Desain (R-31)* di dokumen ini:
  - *Warna Primary (`#003178` Deep Royal Navy):* Mewakili kepastian hukum, integritas pencairan escrow, dan identitas maritim nusantara.
  - *Warna Secondary (`#fc820c` Terracotta Orange):* Memberi aksen hangat khas matahari terbit Bromo dan daya tarik pariwisata luar ruang.
  - *Tipografi Plus Jakarta Sans:* Tipografi geometris modern buatan desainer Indonesia yang sangat mudah dibaca pada perangkat mobile.
  - *Ikon Material Symbols Outlined:* Simbol industri terstandarisasi yang jelas dan konsisten di seluruh layar backoffice dan storefront.
  - *Card & Container Spacing:* Mengikuti kelipatan 4/8px (*Stitch token system*) untuk konsistensi hierarki visual.
- [ ] **Langkah 6.2:** Jalankan pengujian penuh:
  ```bash
  npm test
  npm run build
  ```
- [ ] **Langkah 6.3:** Buat laporan kelulusan *Delivery Gate* resmi yang mencakup verifikasi checklist R-01 s.d R-38.

---

## Verifikasi & Kriteria Keberhasilan

1. Seluruh 27+ unit test lulus 100%.
2. Build `npm run build` berhasil (`exit code 0`) untuk seluruh 18 route.
3. Server lokal `http://localhost:3000` merespons seluruh halaman dengan status 200 OK / 307 Redirect tanpa 500 error.
4. Laporan *Delivery Gate* menyatakan seluruh 38 kaidah antislop berstatus **PASS**.
