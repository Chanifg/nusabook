# Implementation Plan - Developer 1 Paket 4: Halaman E-Ticket Resmi & Print Layout

Halaman E-Ticket (`app/bookings/[bookingCode]/page.tsx`) merupakan gerbang akhir alur pemesanan B2C (Langkah 4 dari 4). Pelanggan yang telah menyelesaikan pembayaran mengakses halaman ini untuk melihat boarding pass resmi, identitas manifes TNBTS/asuransi, panduan titik jemput, serta mencetak atau mengunduh tiket dalam format PDF / print.

## Proposed Changes

### `app/bookings/[bookingCode]/page.tsx`
- Ambil data transaksi secara langsung dari Supabase via `bookingCode`:
  - `bookings` join `travel_agents`, `trip_schedules(tour_packages)`, `booking_passengers`.
- Hapus seluruh data statis dan mock dummy:
  - Ganti nama operator "Pesona Nusantara Tour & Travel" dengan nama agen dinamis `travel_agents.business_name`.
  - Ganti profil "Bambang Pamungkas" dengan nama pemesan dinamis `bookings.customer_name`.
  - Ganti email `anindya.paramitha@gmail.com` dan nomor telepon dummy dengan `bookings.customer_email` dan `bookings.customer_whatsapp`.
  - Ganti judul paket wisata statis Bromo dengan `tour_packages.title`.
  - Ganti jadwal keberangkatan statis dengan `trip_schedules.departure_date`.
  - Ganti titik kumpul statis dengan `tour_packages.meeting_point`.
  - Ganti tabel manifes statis dengan perulangan `booking_passengers` live (dengan NIK ter-masking untuk privasi PDP).
  - Ganti nominal tagihan Rp 850.000 dengan `formatRupiah(bookings.total_amount)`.
- Fungsionalitas Interaksi:
  - Tombol **Unduh PDF / Cetak**: Memanggil fungsi native `window.print()` dengan layout cetak yang rapi (utilitas `print:hidden` dan `print:block`).
  - Tombol **WhatsApp**: Membuka tautan resmi WhatsApp Web/App ke nomor koordinasi dengan pesan konfirmasi berisikan kode booking aktif.
- Anti-Slop:
  - Menghapus tautan mati `href="/terms"` pada footer dan mengarahkannya ke rute aktif `/explore`.
  - Zero em-dash (`—`).
  - Nol link mati `href="#"`.

## Test Plan
- Buat test suite baru `tests/dev1-paket4-eticket.test.mjs`:
  1. Memverifikasi tidak ada hardcoded nama "Bambang Pamungkas" atau "Pesona Nusantara Tour & Travel" sebagai satu-satunya fallback di halaman E-Ticket.
  2. Memverifikasi fungsi cetak memicu `window.print()` dan ada tombol integrasi WhatsApp yang valid.
  3. Memverifikasi seluruh tabel manifes penumpang dirender dari array data dinamis.
  4. Memverifikasi tidak ada link mati `href="/terms"` atau `href="#"`.
  5. Menjalankan seluruh test suite `npm test` (harus 100% lolos).
