# Panduan Kesiapan Deployment Online & Optimasi Performa Nusabook

Dokumen ini merangkum langkah-langkah persiapan teknis agar Nusabook dapat langsung di-deploy secara online (ke Supabase Cloud & Cloudflare Pages) dengan performa cepat, responsif, dan bebas hambatan latensi.

---

## 1. Masalah Latensi Sebelumnya & Solusi yang Telah Diterapkan

### Akar Masalah (Mengapa Dulu Sangat Lambat)
Ketika sebelumnya dihubungkan ke Supabase Cloud, navigasi halaman terasa berat dan lambat karena:
- File `middleware.ts` memeriksa `hasAuthCookie` untuk **setiap permintaan URL** (termasuk prefetch link Next.js pada halaman publik).
- `updateSession()` memanggil `await supabase.auth.getUser()`, yang melakukan *network roundtrip* HTTPS jarak jauh ke server Supabase Cloud (memakan waktu 500ms - 2.000ms per klik tautan).

### Solusi Optimasi Performa yang Telah Diterapkan (Commit `08632a0`)
Logika `middleware.ts` telah dirombak:
```typescript
// Hanya panggil updateSession pada rute privat yang benar-benar membutuhkan proteksi sesi
const isProtectedRoute =
  pathname.startsWith("/dashboard") ||
  pathname.startsWith("/admin") ||
  pathname.startsWith("/api/admin");

if (isProtectedRoute) {
  try {
    return await updateSession(request);
  } catch (error) {
    return NextResponse.next();
  }
}

return NextResponse.next();
```
*Hasil*: Seluruh rute publik (`/`, `/explore`, katalog agen, checkout, e-tiket) kini berpindah **instan (0 ms middleware delay)** tanpa menunggu jaringan cloud.

---

## 2. Kredensial & Kesiapan Supabase Cloud

Proyek Supabase Cloud Anda sudah aktif dan memiliki skema tabel serta data relasional lengkap:
* **Project URL**: `https://qpbarnvnapkfnntvbnjx.supabase.co`
* **Anon Key**:
  ```text
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwYmFybnZuYXBrZm5udHZibmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMzMxNDIsImV4cCI6MjA5OTgwOTE0Mn0.uFjp1rEkufNSMxi835GhskftploqsoopJWRkOXwVCok
  ```
* **Status Tabel di Cloud**:
  - `travel_agents`: 1 baris (Pesona Merapi Adventure)
  - `tour_packages`: 1 baris
  - `trip_schedules`: 1 baris
  - `bookings`: 7 riwayat transaksi
  - `booking_passengers`: 12 peserta manifes

---

## 3. Checklist Kesiapan Cloudflare Pages (Target Rilis)

1. **Ukuran Bundle Client**:
   - First Load JS bersama: **103 kB** (Jauh di bawah batas rekomendasi Google & Cloudflare: < 120 kB).
2. **Kompatibilitas Runtime Serverless / Edge**:
   - Tidak ada ketergantungan pada pustaka native C++ Node.js (`fs`, `child_process`) pada kode client dan public routes.
3. **Environment Variables untuk Cloudflare Pages**:
   Saat siap deploy, masukkan variabel berikut ke dashboard Cloudflare Pages:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://qpbarnvnapkfnntvbnjx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwYmFybnZuYXBrZm5udHZibmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMzMxNDIsImV4cCI6MjA5OTgwOTE0Mn0.uFjp1rEkufNSMxi835GhskftploqsoopJWRkOXwVCok
   PAYMENT_PROVIDER=mock
   NOTIFICATION_PROVIDER=mock
   NODE_VERSION=20.x
   ```

---

## 4. Status Pengujian
- **Unit & Integration Tests**: 69 / 69 passing (0 failure).
- **Next.js Production Build**: 19 / 19 routes compiled cleanly.
- **Git State**: Tersimpan rapi di branch `Main` (commit lokal, tanpa push).
