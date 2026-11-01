# Stitch Fidelity Rework: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Setiap halaman Nusabook tampil identik (layout, warna, tipografi, ikon, copy) dengan 14 layar di Stitch project `215239094039483739`, dengan data nyata dari Supabase di tempat yang datanya tersedia.

**Architecture:** "Port dulu, baru sambungkan data." HTML Stitch sudah berupa Tailwind, jadi markup-nya dipindahkan hampir apa adanya ke JSX memakai token Stitch yang sama persis, lalu teks dummy diganti data Supabase. Tidak ada lagi interpretasi ulang dengan kelas `slate-*`/`brand-*`.

**Tech Stack:** Next.js 15 App Router, Tailwind 3.4, Supabase SSR, Material Symbols Outlined, Plus Jakarta Sans (`next/font/google`).

## Global Constraints

- Sumber desain tunggal: Stitch project `projects/215239094039483739` ("Nusabook System Architecture Design"). File HTML + PNG per layar ada di `.../brain/48a976e4-.../scratch/stitch/<screenId>.{html,png}`.
- Nama kelas token harus sama dengan HTML Stitch (`bg-primary-container`, `text-on-surface-variant`, `font-micro-badge`, `p-space-md`, dst).
- Ikon: Material Symbols Outlined (nama ikon sama dengan HTML Stitch). Lucide tidak dipakai di halaman yang di-port.
- Copy: tidak ada em-dash (`—`). Nama orang/agen dummy di Stitch (mis. "Bambang Pamungkas", "Pesona Nusantara Tour") wajib diganti data sesi/agen.
- Mata uang: `formatRupiah()` dari `@/lib/utils`.
- Batas Tim 1: tidak mengubah skema DB, migrasi, API route, atau stored procedure.
- Setiap task selesai dengan: `npm test` lulus, `npx next build` lulus, dan perbandingan visual 1280px terhadap PNG Stitch.

---

## 1. Kenapa hasil sebelumnya meleset

| # | Penyebab | Dampak |
|---|----------|--------|
| 1 | Dashboard dan Super Admin diambil dari project Stitch lain (`15730432702953421904`, palet `#002041`) yang sekarang sudah tidak bisa diakses, bukan project kanonik `215239094039483739` (palet `#003178`). | Struktur, warna, dan isi dashboard berbeda total dari desain kanonik. |
| 2 | Markup Stitch ditafsirkan ulang dengan kelas `slate-*`, `brand-*`, ikon Lucide, dan copy buatan sendiri. | Spacing, radius, tipografi, dan ikon tidak cocok walaupun "mirip". |
| 3 | Hanya 4 dari 14 layar yang disentuh. | 10 halaman masih tampilan lama. |
| 4 | Shell backoffice tidak mengikuti desain: Stitch punya 7 menu sidebar, breadcrumb, chip Escrow Vault, badge musim, panel "Mesin Konkurensi". | Semua halaman backoffice terasa beda walau isi halaman diperbaiki. |
| 5 | `/admin` berisi data dummy statis dan **tidak dicek role-nya**. Siapa pun bisa membuka URL ini. | Risiko keamanan dan menyesatkan saat demo. |

## 2. Pemetaan layar Stitch ke rute

| # | Screen ID | Judul Stitch | Rute | File utama | Status |
|---|-----------|--------------|------|------------|--------|
| 1 | `040580f53743401fa100ddf3f094dcc7` | Beranda | `/` | `app/page.tsx` | Sebagian, perlu port ulang |
| 2 | `a7a90b68dc9b4fe0b68ee4db0d1ee632` | Jelajah Wisata Marketplace | `/explore` | `app/explore/page.tsx`, `components/marketplace/*` | Belum |
| 3 | `345c77c4a76b410eb5e70bebbf4369fd` | Detail Paket Wisata | `/[slug]/packages/[packageSlug]` | `app/(storefront)/[slug]/packages/[packageSlug]/page.tsx` | Belum |
| 4 | `11fdd5e07bd94fd69fce47a6bac194db` | Profil Agen Mitra | `/[slug]` | `app/(storefront)/[slug]/page.tsx` | Belum |
| 5 | `86df45dcb0d845ffb931671387eb281f` | Checkout & Formulir Manifes | `/[slug]/booking` | `app/(storefront)/[slug]/booking/page.tsx` | Belum |
| 6 | `cd0eeff77e454e348592598b1d1a21d8` | Instruksi Pembayaran & Escrow | `/bookings/[code]/payment` | `app/bookings/[bookingCode]/payment/page.tsx` | Belum |
| 7 | `2a01eef10c50435da058e27962668c43` | E-Tiket & Bukti Reservasi | `/bookings/[code]` | `app/bookings/[bookingCode]/page.tsx` | Belum |
| 8 | `00d514c726ab4c77ad6a49cb63c4fb4c` | Ikhtisar Dashboard Mitra | `/dashboard` | `app/(backoffice)/dashboard/page.tsx` | Salah sumber, ulang total |
| 9 | `7a8f38a6d86046c3ae8a2a0f5c5995ce` | Jadwal & Kuota Kursi | `/dashboard/schedules` | `components/dashboard/schedules-list.tsx` | Belum |
| 10 | `14d4198a2b5d4be1800c3f2a90e25d30` | Manifes & Presensi QR | `/dashboard/schedules/[id]/manifest` | `components/manifest/*` | Belum |
| 11 | `9730d2fd91b34f148bf137ebaac00a87` | Daftar Paket Wisata | `/dashboard/packages` | `components/dashboard/packages-list.tsx` | Sebagian, perlu port ulang |
| 12 | `d3a3f99b46b54de48f35bbd05b8d37f2` | Tambah Paket Wisata | `/dashboard/packages/new` | `components/dashboard/package-form.tsx` | Belum |
| 13 | `04e70a2751f7470c96c9b0b04c82fa60` | Edit Paket Wisata | `/dashboard/packages/[id]/edit` | `components/dashboard/package-form.tsx` | Belum |
| 14 | `2f2b508f5a1d4273a9b64c9fd4fd9de3` | Profil Usaha & Pengaturan Toko | `/dashboard/profile` | `components/dashboard/profile-form.tsx` | Belum |
| - | (tidak ada) | Super Admin | `/admin` | `app/(admin)/*` | Butuh keputusan D2 |
| - | (tidak ada) | Login / Register | `/login`, `/register` | `app/(auth)/*` | Ikut token & header storefront |

## 3. Elemen desain tanpa data di skema saat ini

Tabel yang ada: `profiles`, `travel_agents`, `tour_packages`, `trip_schedules`, `bookings`, `booking_passengers`, `agent_payouts`.

| Elemen di Stitch | Layar | Data tersedia? |
|------------------|-------|----------------|
| Kuota terjual, hold, okupansi, harga | 8, 9 | Ya (`trip_schedules`) |
| Dana escrow, siap cair, telah dicairkan | 8 | Sebagian (`bookings.agent_payout_amount`, `agent_payouts`) |
| Metode bayar (BCA VA, QRIS) | 8, 6 | Ya (`bookings.payment_method`) |
| Presensi check-in | 10 | Ya (`booking_passengers.is_checked_in`) |
| Armada, tour leader, driver | 8, 9 | Tidak ada tabel |
| Checklist SIMAKSI, asuransi | 8 | Tidak ada |
| Rating, ulasan, sesi, konversi storefront | 4, 8, 11 | Tidak ada |
| Badge "Musim Ramai", lock latency, node | header, 8 | Tidak ada (dekoratif) |
| Menu "Armada & Tour Leader", "Keuangan & Escrow Vault" | sidebar | Belum ada rute |

Perlakuan elemen tanpa data ditentukan oleh keputusan D1.

## 4. Keputusan yang dibutuhkan sebelum eksekusi

- **D1. Elemen tanpa data:** (a) tampilkan sebagai konten statis apa adanya seperti di Stitch, (b) sembunyikan, atau (c) tampilkan dengan status nonaktif "Segera hadir" lalu diserahkan ke Tim 2. Rekomendasi: **(c)**, supaya layout tetap identik tanpa menampilkan angka palsu.
- **D2. Super Admin:** (a) buat dulu layar Super Admin di project Stitch kanonik lalu port, atau (b) pertahankan isi `/admin` sekarang tetapi restyle ke token kanonik. Apa pun pilihannya, tambahkan cek role `superadmin` di server.
- **D3. Radius global:** token Stitch mengubah `rounded` (DEFAULT 4px, `lg` 8px, `xl` 12px). Ini mengubah tampilan halaman yang belum di-port selama masa transisi. Rekomendasi: terima, karena semua halaman akan di-port.

---

## Task 0: Fondasi desain

**Files:**
- Modify: `tailwind.config.ts` (ganti token `surface` buatan sebelumnya dengan token Stitch verbatim)
- Modify: `app/layout.tsx` (Plus Jakarta Sans via `next/font/google`, link Material Symbols)
- Modify: `app/globals.css` (hapus `@import` font, tambah utilitas `.material-symbols-outlined`, `.icon-fill`)
- Create: `components/ui/icon.tsx`
- Create: `tests/stitch-tokens.test.mjs`

**Interfaces:**
- Produces: `<Icon name="calendar_month" className="text-xl" filled? />`; kelas Tailwind `primary`, `primary-container`, `on-primary`, `secondary`, `secondary-container`, `secondary-fixed`, `tertiary*`, `surface`, `surface-container-{lowest,low,,high,highest}`, `on-surface`, `on-surface-variant`, `outline`, `outline-variant`, `error*`; `fontSize` `display`, `display-mobile`, `headline-lg`, `headline-lg-mobile`, `headline-md`, `headline-sm`, `title-md`, `body-lg`, `body-regular`, `body-semibold`, `caption`, `micro-badge`; spacing `space-{xs,sm,md,lg,xl}`, `gutter`, `gutter-desktop`, `margin`, `margin-tablet`, `margin-desktop`.

- [ ] **Step 1:** Tulis `tests/stitch-tokens.test.mjs` yang mengimpor `tailwind.config.ts` dan memastikan `primary === "#003178"`, `secondary-container === "#fc820c"`, `primary-container === "#0d47a1"`, `fontSize["micro-badge"][0] === "11px"`. Jalankan, pastikan gagal.
- [ ] **Step 2:** Salin blok `colors`, `borderRadius`, `spacing`, `fontFamily`, `fontSize` dari `<script id="tailwind-config">` di `040580f53743401fa100ddf3f094dcc7.html` ke `theme.extend`. Pertahankan `brand`/`accent` sementara agar halaman lama tidak rusak.
- [ ] **Step 3:** Pasang font dan ikon di `app/layout.tsx`, buat `components/ui/icon.tsx`.
- [ ] **Step 4:** `npm test` dan `npx next build` lulus.
- [ ] **Step 5:** Commit `feat(ui): adopt canonical stitch design tokens`.

## Task 1: Shell backoffice (Operator Engine)

Referensi: bagian `<aside>` dan `<header>` di `00d514c726ab4c77ad6a49cb63c4fb4c.html` (sama di layar 9 sampai 14).

**Files:**
- Modify: `components/dashboard/sidebar.tsx`, `components/dashboard/header.tsx`, `components/dashboard/dashboard-shell.tsx`
- Modify: `app/(backoffice)/layout.tsx` (kirim data escrow ringkas ke header)

**Interfaces:**
- Consumes: `<Icon>` dari Task 0.
- Produces: `DashboardShell` dengan prop `breadcrumb: string[]` dan `escrowBalance: number`, dipakai semua halaman backoffice.

- [ ] **Step 1:** Port sidebar: logo + "NusaBook / Operator Engine", kartu agen terverifikasi, 7 menu (Ikhtisar, Jadwal & Alokasi Kuota, Manifes & Pemesanan, Manajemen Paket Wisata, Keuangan & Escrow Vault, Armada & Tour Leader, Pengaturan Akun & Legalitas), panel "Mesin Konkurensi", tombol "Switch ke Storefront". Menu tanpa rute diperlakukan sesuai D1.
- [ ] **Step 2:** Port header: breadcrumb, input cari, badge musim (sesuai D1), chip Escrow Vault dengan saldo nyata, lonceng notifikasi, profil pengguna dari `profiles.full_name`.
- [ ] **Step 3:** Pertahankan perilaku mobile drawer dan logout yang sudah ada.
- [ ] **Step 4:** Bandingkan visual dengan PNG layar 8 di 1280px. Build lulus. Commit.

## Task 2: Ikhtisar Dashboard Mitra (layar 8)

**Files:**
- Modify: `app/(backoffice)/dashboard/page.tsx` (ganti total isi)
- Create: `lib/dashboard-metrics.ts`, `tests/dashboard-metrics.test.mjs`

**Interfaces:**
- Produces: `getGreeting(date: Date): "Selamat Pagi" | "Selamat Siang" | "Selamat Sore" | "Selamat Malam"`; `summarizeQuota(schedules): { sold: number; held: number; occupancyPct: number; fullSlots: number }`; `summarizeEscrow(bookings, payouts): { inEscrow: number; ready: number; disbursed: number }`.

- [ ] **Step 1:** Tulis test untuk ketiga fungsi (termasuk kasus kosong dan pembagian nol). Pastikan gagal.
- [ ] **Step 2:** Implementasi `lib/dashboard-metrics.ts` sampai test lulus.
- [ ] **Step 3:** Port markup: kartu sapaan + 3 tombol aksi, banner "Engine Active", 4 KPI (Kuota Terjual, Dana Escrow, Siap Cair, Seat Hold), "Jadwal Keberangkatan Terdekat", "Kesiapan Operasional", "Arus Dana Escrow Vault", "Storefront Publik", tabel "Ringkasan Pemesanan Masuk Terbaru".
- [ ] **Step 4:** Sambungkan data dari query yang sudah ada (bookings, schedules, packages, agent). Elemen tanpa data sesuai D1.
- [ ] **Step 5:** Visual compare, test, build, commit.

## Task 3: Jadwal & Kuota Kursi (layar 9)

**Files:** Modify `components/dashboard/schedules-list.tsx`, `app/(backoffice)/dashboard/schedules/page.tsx`

- [ ] **Step 1:** Port header halaman, filter bulan/paket, tombol "+ Tambah Batch Jadwal Baru", 4 KPI, banner Mesin Konkurensi, toggle Kalender/Tabel, chip filter status, tabel batch (tanggal, paket, armada, okupansi bar, hold TTL, harga, status, aksi), paginasi.
- [ ] **Step 2:** Pertahankan modal tambah/edit/hapus/ubah status yang sudah berfungsi, restyle ke token.
- [ ] **Step 3:** Ekstrak pemetaan status kuota (`Tersedia`, `Menipis`, `Full`) ke fungsi murni beserta test.
- [ ] **Step 4:** Visual compare, test, build, commit.

## Task 4: Manifes & Presensi (layar 10)

**Files:** Modify `app/(backoffice)/dashboard/schedules/[id]/manifest/page.tsx`, `components/manifest/passenger-table.tsx`, `components/manifest/checkin-button.tsx`

- [ ] Port layout, pertahankan check-in, ekspor PDF/Excel, dan masking NIK yang sudah ada. Visual compare, test, build, commit.

## Task 5: Daftar, Tambah, Edit Paket (layar 11, 12, 13)

**Files:** Modify `components/dashboard/packages-list.tsx`, `components/dashboard/package-form.tsx`, halaman `new` dan `[id]/edit`

- [ ] **Step 1:** Port ulang daftar paket dari layar 11 (gantikan versi interpretasi sebelumnya), termasuk tampilan tabel/grid sesuai Stitch.
- [ ] **Step 2:** Port form tambah (layar 12) dan edit (layar 13) dengan validasi dan submit yang sudah ada.
- [ ] **Step 3:** Visual compare ketiga layar, test, build, commit.

## Task 6: Profil Usaha & Pengaturan Toko (layar 14)

**Files:** Modify `components/dashboard/profile-form.tsx`

- [ ] Port layout, pertahankan field dan submit yang ada. Visual compare, build, commit.

## Task 7: Shell publik (header + footer storefront)

Referensi: `<header>` dan footer di `040580f53743401fa100ddf3f094dcc7.html`.

**Files:** Create `components/site/site-header.tsx`, `components/site/site-footer.tsx`

- [ ] Port header (logo, badge P2MW, nav, "Cek Status Booking", "Gabung Mitra") dan footer. Profil di header hanya tampil bila ada sesi. Dipakai Task 8 sampai 12 dan halaman auth.

## Task 8: Beranda (layar 1)

- [ ] Port ulang `app/page.tsx` dari HTML secara utuh (hero, dual mockup, metrik, masalah vs solusi, dan seluruh section sampai footer; tinggi desain 13.970px, versi sekarang baru dua section). Visual compare, build, commit.

## Task 9: Jelajah Wisata (layar 2)

- [ ] Port `app/explore/page.tsx` dan `components/marketplace/*`. Pertahankan logika filter yang sudah diuji di `tests/` (Workstream D). Visual compare, test, build, commit.

## Task 10: Profil Agen dan Detail Paket (layar 4, 3)

- [ ] Port `/[slug]` dan `/[slug]/packages/[packageSlug]` dengan data agen, paket, jadwal, dan `quota-counter`. Visual compare, build, commit.

## Task 11: Checkout, Pembayaran, E-Tiket (layar 5, 6, 7)

- [ ] Port tiga halaman alur booking tanpa mengubah kontrak `/api/bookings` dan webhook. Pertahankan TTL 20 menit dan pesan kuota habis yang diuji di `tests/`. Visual compare, test, build, commit.

## Task 12: Super Admin dan Auth

- [ ] **Step 1:** Tambahkan cek server di `app/(admin)/layout.tsx`: ambil `profiles.role`, `redirect("/login")` bila bukan `superadmin`.
- [ ] **Step 2:** Jalankan opsi D2.
- [ ] **Step 3:** Restyle `/login` dan `/register` memakai token dan `SiteHeader`.
- [ ] **Step 4:** Build, commit.

## Task 13: QA akhir dan pembersihan

- [ ] Hapus token `brand`/`accent` lama bila sudah tidak dipakai (`grep -r "brand-\|accent-" app components`).
- [ ] Screenshot 14 rute di 1280px dan 390px, susun berdampingan dengan PNG Stitch di `docs/stitch-fidelity-report.md`.
- [ ] `grep -r "—" app components` harus kosong.
- [ ] `npm test`, `npx next build` lulus. Buka PR `feat/stitch-ui-redesign` ke `Main`.

## Urutan dan estimasi

| Fase | Task | Estimasi |
|------|------|----------|
| Fondasi | 0, 1, 7 | 0,5 hari |
| Backoffice | 2, 3, 4, 5, 6 | 2 hari |
| Publik | 8, 9, 10, 11 | 2 hari |
| Admin, auth, QA | 12, 13 | 0,5 hari |
