# Nusabook: Rencana Pembagian Kerja 2 Tim (Dual-Team Execution Roadmap)

* **Tanggal Rilis**: 5 Oktober 2026
* **Status**: Siap Dieksekusi (Ready for Dual-Team Execution)
* **Target Milestone**: Rilis MVP Core Layak Pakai & Redesain Visual Standar Google Stitch
* **Basis Arsitektur**: Next.js 15 App Router, Tailwind CSS, Supabase PostgreSQL 3NF, Adapter Pattern

Dokumen ini membagi pekerjaan pengembangan platform Nusabook ke dalam **2 tim kerja paralel** dengan pemisahan tugas, kontrak antarmuka (*interface contract*), tautan referensi visual Google Stitch MCP, dan strategi Git branching tanpa konflik (*zero merge conflict*).

---

## 1. Ikhtisar Pembagian Tim & Git Branching

```text
                                  Main Branch (Production Ready)
                                                ▲
                        ┌───────────────────────┴───────────────────────┐
                        │ PR & Merge                            │ PR & Merge
                        │                                       │
           [Tim 1: UI Redesign & Stitch]            [Tim 2: Engineering & Readiness]
             Branch: feat/stitch-ui-redesign          Branch: feat/production-readiness
```

| Parameter | Tim 1 (UI Redesign & Frontend) | Tim 2 (Engineering & Production Readiness) |
| :--- | :--- | :--- |
| **Fokus Utama** | Menyesuaikan tampilan UI, tata letak, dan animasi seluruh halaman agar 100% presisi dengan desain Google Stitch. | Menyempurnakan fungsionalitas, kueri database live, keamanan privasi (UU PDP), dan fitur backend hingga layak operasional. |
| **Target Git Branch** | `feat/stitch-ui-redesign` | `feat/production-readiness` |
| **Domain File** | `components/**`, `app/**/page.tsx` (Visual/JSX/Tailwind) | `lib/**`, `supabase/migrations/**`, `app/api/**` (Backend/Logic/Data) |
| **Ketergantungan** | Tipe data di `types/database.types.ts` | Skema basis data Supabase & environment variables |

---

## 2. Tim 1: Redesain UI Berdasarkan Desain Google Stitch

### 2.1 Tujuan Tim 1
Mentransformasi seluruh halaman antarmuka web Nusabook agar mengadopsi bahasa desain (*Design System*) resmi dari Google Stitch: palet warna Samudra (`#0D47A1`), aksen Senja (`#F57C00`), tipografi Plus Jakarta Sans, card elevation yang halus, dan komponen micro-badge.

### 2.2 Inventaris Layar Google Stitch (Referensi Langsung)
Sumber: **Google Stitch Project `15730432702953421904`** (*Nusabook Travel Management Dashboard*) & **`215239094039483739`** (*Nusabook Architecture Design*).

| Modul Layar | Judul di Google Stitch | Tautan Unduh HTML Resmi | Tautan Pratinjau Visual | Target File Proyek |
| :--- | :--- | :--- | :--- | :--- |
| **Layar 1** | Nusabook Agency Dashboard | [Unduh HTML](https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWRjOGQ3NTU0YzgwMzgzODZkZjcyMTAxNjI2EgsSBxDIvpmQwxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTczMDQzMjcwMjk1MzQyMTkwNA&filename=&opi=89354086) | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1WPnRR62X6frkVnmRpGVFEc0vHzlCYCdli8BUoCj4Lggqz9P3HDJDiTjJN01djhoGI7XCNhXdHB6SBOPzteLyUfVeMVjT8KmKfsI227_quIqGtcXausLcOqir8f69j0QZNUU6wHaR8F0C0lY-5amt1zZBuC5nmoTUc9lq1Ud-Nw3qjwHbC7vwX1huKhTB3jNp3OtwQcSs3hun5Gj7Cqrl8X7_Ldk9yg5JvUwE0DjP0XKSvS_x5r5sZcLSxX) | `app/(backoffice)/dashboard/page.tsx` |
| **Layar 2** | Tour Package Management | [Unduh HTML](https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWRjOGQ2ODRhZDIwNTc2MDJlNzQ2MDYyZWUzEgsSBxDIvpmQwxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTczMDQzMjcwMjk1MzQyMTkwNA&filename=&opi=89354086) | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1WuUPE7xmDNA4qtWHwLYCwukMGYTkjO3vjeI4q427yAesFIlD3nvN0ykyiwQwxbi0D8Nb0BIODDbkTc_wskz3goDjxoFBZD2W6WxoDxCNtzWltderTMLFomqdu_X7SDBD0UmMJEuAx6nO9rPpvhVfEvHa8l0OeaHkPaVOo2LpGQ_UCuPCwkZ-1eMWUhSCJoohPlLSX17KgeVGzNDdPBQsxXnAYe1Mg2qsv0jJ1GjQG_Ipfhmt0l0Cwk2Ys) | `app/(backoffice)/dashboard/packages/page.tsx` |
| **Layar 3** | Nusabook Super Admin Portal | [Unduh HTML](https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWRjOGQ4NWU2OGYwNzc5YTA2YWZmMGE3MTBlEgsSBxDIvpmQwxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTczMDQzMjcwMjk1MzQyMTkwNA&filename=&opi=89354086) | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1XbRvjttEPtV1Sc9iYd0Ys680fZW7jwdluSJ-rlkLZLPuHA_pomE6qhy0qz9hkw7JVa5-KA_yby30efhr-EomNxntmLpJDWaT-B-dsSyhtph65jxosP_5XUO9K9LDqHYvQorwJY6i4b-Q2ZQj-oDegJQOqANfkBxA01atJhA6rdNAxox2FdjbyEbc7nz0YFnKddkK0CgACF4brBPiQf10cGOAxVbGANGZes4DKrxRiD0BIvOgaLX-nfCCJ-) | `app/(admin)/admin/page.tsx` *(Halaman Baru)* |
| **Layar 4** | Detail Paket Wisata (Bromo) | [Unduh HTML](https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWRjOGQ1ZjkxM2MwMzMyYzkyMTEzMmZhMzI2EgsSBxDIvpmQwxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTczMDQzMjcwMjk1MzQyMTkwNA&filename=&opi=89354086) | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1U5yYV7pYRDHDKNYJRXeC2dFDNRCPI4fAc-Aj-c3U2lTpb5fviU_m645f9DH_Nse64NLO5wqBZ4Ss6EsGJST9nEpcKZN09jWwpaPqjLL372WfCBbbjIcLZrMt3yPWIRm1rm2TOeuSPm2kH7XjJIqSKguo32kJR83rJz8slTbUK4y3dEvT5FNzHkDYQmoRbLcZ7Aq4gC_XvD-v8PVDYm8xHyK3tORjoKaxoHwYkN0EWBM2oUeHL_y7vyC-Y) | `app/(storefront)/[slug]/packages/[packageSlug]/page.tsx` |
| **Layar 5** | Pemesanan & Checkout | [Unduh HTML](https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWRjOGQyZWQwNzQwMmE5YjMyN2IyMzI0ZWM3EgsSBxDIvpmQwxwYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTczMDQzMjcwMjk1MzQyMTkwNA&filename=&opi=89354086) | [Lihat Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1VSBruZfxp3FjnMvlN1aTpm71-vEBkFG8no31iEWtVSPCBYKSV7Ziia3AoljpUDt-CWBmP_btEb9lX6yPb_b_uJuNwBwRx0pRKInDAujM517CMU_qk7j4WQk7nMaO__9EFv__V5QcigEEunBAWF-_ISMelx3yi3DYgSAtpLxCnZjtyWma22aM44vltDH5BWWdSl41OgBLBYGXpw3bfEVBpxuX22LSYJPwH86SlYR-Sd1vxP7xf48c7D-gY) | `app/(storefront)/[slug]/booking/page.tsx` |

### 2.3 Rincian Tugas Tim 1
1. **Task 1.1: Refactor Dashboard Shell & Navigation (`components/dashboard/`)**:
   - Terapkan layout sidebar presisi sesuai Layar 1 (Nusabook Agency Dashboard).
   - Lengkapi kartu metrik dengan visual badge presentase dan ikon kontras tinggi.
2. **Task 1.2: Redesain Halaman Paket Wisata (`dashboard/packages`)**:
   - Sesuaikan daftar tabel kartu paket dengan thumbnail galeri, lencana tipe perjalanan (Open Trip/Private Trip), dan aksi cepat jadwal.
3. **Task 1.3: Buat Halaman Super Admin Portal (`app/(admin)/admin/page.tsx`)**:
   - Implementasikan template dari Layar 3: Tabel monitoring agen nasional, ringkasan fee 2%, verifikasi NIB/SKU, dan daftar approval penarikan dana mitra.
4. **Task 1.4: Polish Storefront & Checkout B2C (`/[slug]/packages/...` & `/[slug]/booking`)**:
   - Terapkan alur checkout bertahap, countdown chip TTL 20 menit mengambang (*floating lock timer*), dan stepper itinerary perjalanan interaktif.

---

## 3. Tim 2: Core Engineering & Production Readiness

### 3.1 Tujuan Tim 2
Menutup kesenjangan fungsional dari dokumen PRD dan SRS sehingga platform bukan hanya tampak bagus, tetapi benar-benar siap menampung transaksi keuangan riil dari 10–20 mitra pilot UMKM di lapangan (*Production Ready*).

### 3.2 Rincian Tugas Tim 2

#### Task 2.1: Live Database Fetching pada Storefront Publik
* **Masalah**: Halaman `app/(storefront)/[slug]/page.tsx` dan `app/(storefront)/[slug]/packages/[packageSlug]/page.tsx` masih menyertakan fallback mock data jika data DB tidak ditemukan.
* **Pekerjaan**:
  - Ganti dengan kueri langsung `supabase.from("travel_agents").select("*, tour_packages(*, trip_schedules(*))").eq("slug", slug)`.
  - Jika agen tidak ditemukan atau `is_active = false`, kembalikan `notFound()`.
  - Integrasikan ketersediaan kuota real-time dari tabel `trip_schedules`.

#### Task 2.2: Formulir Pencatatan Booking Manual (Manual Booking Entry)
* **Dasar Kebutuhan**: SRS REQ-FUNC-PAY-04 & PRD Modul 4.3 (FR-3.2).
* **Pekerjaan**:
  - Tambahkan modal *"Catat Pesanan Manual / Walk-in"* pada `app/(backoffice)/dashboard/page.tsx` atau halaman terpisah.
  - Form menerima: Pilihan Jadwal, Nama Tamu, WhatsApp, Jumlah Pax, dan Bukti Transfer Fisik/Tunai.
  - Endpoint menyimpan ke `bookings` dengan flag `is_manual_entry = true`, status `PAID`, dan mengeksekusi `confirm_trip_quota(schedule_id, pax)`.

#### Task 2.3: API & Logika Super Admin Platform
* **Dasar Kebutuhan**: SRS REQ-FUNC-ADM-01 s.d. ADM-03 & PRD Modul 4.7.
* **Pekerjaan**:
  - Buat endpoint `POST /api/admin/agents/[id]/verify` untuk verifikasi mitra (`is_verified = true`).
  - Buat endpoint `POST /api/admin/payouts/[id]/approve` untuk mencatat nomor referensi transfer bank hasil penjualan tiket (98% setelah potongan 2%).
  - Buat middleware guard khusus `role = 'superadmin'` pada rute `/admin/**`.

#### Task 2.4: Enkripsi Data Pribadi (UU PDP No. 27/2022)
* **Dasar Kebutuhan**: SRS REQ-NFR-SEC-03 & PRD Bagian 7.1.
* **Pekerjaan**:
  - Buat migrasi SQL baru `supabase/migrations/20261005000001_nik_encryption.sql`.
  - Pasang fungsi simetris pgcrypto `pgp_sym_encrypt(NEW.id_card_number, current_setting('app.settings.jwt_secret'))` sebelum insert/update pada tabel `booking_passengers`.
  - Sediakan view/dekripsi yang hanya bisa diakses oleh agen pemilik pesanan via RLS.

#### Task 2.5: Integrasi Live Vendor Driver (Payment & WhatsApp)
* **Dasar Kebutuhan**: SRS REQ-FUNC-NOTIF-01 s.d. NOTIF-04 & REQ-FUNC-PAY-01.
* **Pekerjaan**:
  - Buat provider WhatsApp live: `lib/notifications/providers/fonnte-provider.ts` yang memanggil API Fonnte/Wablas HTTP POST.
  - Buat fallback SMTP email menggunakan `nodemailer` / Resend jika pesan WhatsApp gagal terkirim (3x retry exponential backoff).
  - Sambungkan env keys: `FONNTE_TOKEN`, `TRIPAY_API_KEY`, `TRIPAY_PRIVATE_KEY` pada `.env.local`.

---

## 4. Matriks Sinergi & Protokol Anti-Konflik Git

Agar kedua tim dapat bekerja serentak tanpa konflik (*merge conflict*), patuhi aturan isolasi berikut:

```text
┌─────────────────────────────────┬─────────────────────────────────┐
│     TIM 1: UI REDESIGN          │     TIM 2: CORE ENGINEERING     │
├─────────────────────────────────┼─────────────────────────────────┤
│ • Fokus file komponen visual:   │ • Fokus file logika & database: │
│   - components/dashboard/*      │   - lib/payment/*, lib/notif/*  │
│   - components/storefront/*     │   - supabase/migrations/*       │
│   - app/(admin)/* (JSX UI)      │   - app/api/admin/* (Route API) │
│ • DILARANG mengubah skema       │ • DILARANG mengubah class CSS   │
│   database SQL secara sepihak   │   Tailwind atau layout visual   │
│ • Menggunakan TypeScript types  │ • Menyediakan type definition   │
│   yang sudah didefinisikan      │   baru jika ada perubahan data  │
└─────────────────────────────────┴─────────────────────────────────┘
```

### Prosedur Kerja:
1. **Branch Tim 1**:
   ```bash
   git checkout Main
   git checkout -b feat/stitch-ui-redesign
   ```
2. **Branch Tim 2**:
   ```bash
   git checkout Main
   git checkout -b feat/production-readiness
   ```
3. **Penyatuan Kode (Integration)**:
   - Setiap tim wajib memastikan `npm test` dan `npm run build` lulus 100% di branch masing-masing sebelum mengajukan Pull Request (PR) ke branch `Main`.
   - Menggabungkan Tim 2 (Backend/Engine) terlebih dahulu, kemudian merebase Tim 1 (UI) di atasnya.
