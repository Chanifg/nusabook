# Spesifikasi Desain: Workstream C - Manifes Penumpang & Fitur Export Dokumen

* **Tanggal**: 2026-10-04
* **Target Branch**: `feat/passenger-manifest`
* **Status**: Disetujui (Approved)
* **Penyusun**: Antigravity AI Pair Programmer & Lead Developer

---

## 1. Latar Belakang & Tujuan

Workstream C bertujuan menyediakan fitur operasional penting bagi pengelola tour & travel (mitra B2B Nusabook):
1. **Manifes Penumpang**: Rekapitulasi lengkap seluruh peserta yang terdaftar pada suatu jadwal keberangkatan (*trip schedule*).
2. **Presensi Hari-H (Check-in)**: Fitur presensi untuk menandai kehadiran peserta di titik kumpul (*meeting point*) secara cepat dan realtime dengan data tersimpan di Supabase.
3. **Ekspor Dokumen**:
   - **Excel (CSV ber-BOM UTF-8)**: File spreadsheet siap olah yang kompatibel langsung dengan Microsoft Excel dan Google Sheets tanpa kendala karakter (*mojibake*).
   - **PDF Siap Cetak**: Dokumen manifes resmi dengan kop agen, informasi perjalanan, tabel manifes rapi untuk ukuran kertas A4, serta kolom tanda tangan kru lapangan (Tour Leader & Driver).

---

## 2. Arsitektur Data & Supabase Migrasi

### 2.1 Migrasi Skema (`supabase/migrations/20261004000001_workstream_c_manifest.sql`)
Menambahkan status kehadiran pada tabel `booking_passengers`:
```sql
ALTER TABLE booking_passengers 
ADD COLUMN IF NOT EXISTS is_checked_in BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;

-- Kebijakan RLS: Agen pemilik paket dapat memperbarui status presensi penumpangnya
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'booking_passengers' 
        AND policyname = 'Agents can update manifest checkin status'
    ) THEN
        CREATE POLICY "Agents can update manifest checkin status"
        ON booking_passengers FOR UPDATE TO authenticated
        USING (
            booking_id IN (
                SELECT b.id FROM bookings b
                JOIN travel_agents a ON b.agent_id = a.id
                WHERE a.owner_id = auth.uid()
            )
        )
        WITH CHECK (
            booking_id IN (
                SELECT b.id FROM bookings b
                JOIN travel_agents a ON b.agent_id = a.id
                WHERE a.owner_id = auth.uid()
            )
        );
    END IF;
END $$;
```

### 2.2 Penyesuaian TypeScript Types (`types/database.types.ts`)
Memperbarui tipe `booking_passengers` pada `Row`, `Insert`, dan `Update`:
- `is_checked_in: boolean;`
- `checked_in_at: string | null;`

---

## 3. Desain Antarmuka & Komponen

### 3.1 Halaman Manifes (`app/(backoffice)/dashboard/schedules/[id]/manifest/page.tsx`)
- Server Component dengan verifikasi sesi pengguna dan proteksi multi-tenant (hanya agen pemilik jadwal yang dapat mengakses).
- Mengambil relasi:
  - `trip_schedules` (id, departure_date, return_date, total_quota, price_per_pax)
  - `tour_packages` (title, destination_city, meeting_point)
  - `travel_agents` (business_name, office_address, whatsapp_number)
  - `bookings` (status `PAID`) beserta seluruh relasi baris `booking_passengers`.
- Kartu Ringkasan Metrik:
  - Total Kursi Terpesan / Penumpang Terdaftar
  - Sudah Check-in (Presensi Hadir)
  - Belum Check-in
  - Okupansi Kuota (%)
- Tombol Aksi Cepat:
  - "Unduh PDF" -> Tautan membuka `/api/manifest/[id]/pdf` (target `_blank`)
  - "Unduh Excel" -> Tautan download `/api/manifest/[id]/excel`
  - "Kembali ke Jadwal" -> Tautan ke `/dashboard/schedules`

### 3.2 Komponen Tabel Manifes (`components/manifest/passenger-table.tsx`)
- Client Component interaktif:
  - **Pencarian Realtime**: Filter instan berdasarkan nama peserta, NIK, nomor WhatsApp, atau kode booking.
  - **Filter Tab/Pilihan**:
    - Gender: *Semua*, *Laki-laki*, *Perempuan*
    - Kehadiran: *Semua*, *Sudah Hadir*, *Belum Hadir*
  - **Daftar Kolom**:
    1. No. Urut Kursi
    2. Nama Lengkap
    3. Gender (*L* / *P*)
    4. NIK / No. Identitas
    5. WhatsApp (tautan interaktif)
    6. Kontak Darurat
    7. Catatan Medis / Khusus
    8. Kode Booking & Status (*PAID*)
    9. Presensi (Tombol Check-in)

### 3.3 Komponen Presensi (`components/manifest/checkin-button.tsx`)
- Client Component interaktif:
  - Mengirimkan request ke `POST /api/manifest/checkin`.
  - Update state lokal secara optimis (*optimistic UI*).
  - Tampilan tombol:
    - Belum Hadir: Tombol sekunder / abu-abu dengan label "Tandai Hadir".
    - Hadir: Tombol hijau dengan ikon centang dan jam presensi (misal: "Hadir • 07:30").

### 3.4 Integrasi Navigasi (`components/dashboard/schedules-list.tsx`)
- Menambahkan tautan/tombol **"Lihat Manifes"** di setiap kartu jadwal yang mengarah ke `/dashboard/schedules/${schedule.id}/manifest`.

---

## 4. API Endpoints

### 4.1 Endpoint Check-in (`POST /api/manifest/checkin`)
- **Body**: `{ passengerId: string, isCheckedIn: boolean }`
- **Validasi**: Autentikasi sesi agen dan memastikan penumpang berasal dari jadwal agen tersebut.
- **Respon**: JSON `{ success: true, passenger: { id, is_checked_in, checked_in_at } }`.

### 4.2 Endpoint Ekspor Excel CSV (`GET /api/manifest/[scheduleId]/excel`)
- Menghasilkan CSV dengan BOM `\uFEFF`.
- Kolom:
  1. No
  2. Nama Lengkap
  3. Gender
  4. NIK / No Identitas
  5. WhatsApp
  6. Kontak Darurat
  7. Catatan Khusus
  8. Kode Booking
  9. Status Bayar
  10. Status Kehadiran
  11. Waktu Check-in
- Header:
  - `Content-Type: text/csv; charset=utf-8`
  - `Content-Disposition: attachment; filename="manifes-[scheduleId].csv"`

### 4.3 Endpoint Ekspor PDF Siap Cetak (`GET /api/manifest/[scheduleId]/pdf`)
- Menghasilkan halaman cetak dokumen resmi (Print-Ready HTML/PDF) dengan layout khusus `@media print`:
  - Kop usaha resmi agen travel mitra.
  - Informasi trip (nama paket, jadwal, rute, meeting point).
  - Tabel manifes penumpang 11 kolom rapi.
  - Area tanda tangan Tour Leader & Driver di bagian bawah halaman.
  - Tombol otomatis trigger `window.print()` / simpan PDF saat dibuka.

---

## 5. Rencana Pengujian (`tests/manifest.test.mjs`)

Skenario pengujian otomatis:
1. **Validasi File Migrasi**: Skrip migrasi SQL menambahkan kolom dan policy dengan benar.
2. **Validasi Formatter CSV**: Format UTF-8 BOM, penanganan koma, tanda kutip, dan baris baru.
3. **Validasi Logika Filter & Search**: Pencarian nama, NIK, filter gender, dan filter status kehadiran.
4. **Validasi Endpoint Presensi**: Toggle `is_checked_in` dan pembaruan `checked_in_at`.
5. **Verifikasi Sistem**: `npm test`, `npx tsc --noEmit`, dan `npm run build` berhasil 100%.
