# 🎨 Nusabook - Google Stitch UI/UX Prompt Guide

Dokumen ini berisi panduan lengkap **Master Prompt** dan **Screen-by-Screen Prompts** untuk menghasilkan desain antarmuka (*UI/UX*) platform **Nusabook** di **Google Stitch** secara presisi, sesuai dengan spesifikasi di `PRD.md` dan `SRS.md`.

---

## 📌 Petunjuk Penggunaan di Google Stitch

1. **Unggah Dokumen Referensi**: Jika Google Stitch mendukung lampiran file, unggah `PRD.md` dan `SRS.md` dari repository Nusabook.
2. **Set Master Prompt**: Salin bagian **[1. MASTER PROMPT]** sebagai aturan gaya visual, warna, dan peran pengguna utama.
3. **Generate Per Layar**: Salin prompt dari **[2. DETIL PROMPT PER HALAMAN]** secara bertahap untuk menghasilkan tiap layar aplikasi.

---

# 1. MASTER PROMPT (Sistem Desain & Identitas Visual Global)

> **Salin teks di bawah ini ke input instruksi utama / system prompt di Google Stitch:**

```text
Role & Context:
You are an expert UI/UX designer specialized in SaaS platforms and travel e-commerce marketplaces in Indonesia. You are designing the complete interface for "Nusabook", a SaaS-Enabled Marketplace platform connecting local tour & travel operators (UMKM) with domestic tourists.

Design System & Visual Guidelines:
- Design Style: Modern, clean, trustworthy, mobile-first responsive (360px–430px mobile, 1920x1080 desktop), card-based layout, subtle shadows, 10px-12px rounded corners, crisp typography (Inter/Roboto style).
- Color Palette:
  * Primary Accent: Deep Ocean Blue (#0D47A1) — symbol of trust and Indonesian sea travel.
  * Secondary Accent: Sunset Orange (#F57C00) — high-converting action buttons (CTA, booking badges, discount tags).
  * Backgrounds: Clean Off-White (#F8FAFC) for app background, Pure White (#FFFFFF) for cards/containers.
  * Neutral Text: Slate Gray (#1E293B for headings, #64748B for body text).
  * Status Colors: Emerald Green (#10B981) for Paid/Open/Available, Amber Yellow (#F59E0B) for Pending/Reserved, Crimson Red (#EF4444) for Expired/Sold Out.

Target Audience Roles:
1. B2C Tourists (Mobile-focused, quick booking, instant payment, real-time quota visibility).
2. B2B Travel Operators (Desktop-focused SaaS Backoffice, clean data tables, quick action modals, manifest exports).
3. Platform Super Admin (Financial overview, 2% commission ledger, payout approvals, agent verification).
```

---

# 2. DETIL PROMPT PER HALAMAN (SCREEN-BY-SCREEN)

---

### 📱 Screen 1: Marketplace Discovery Portal (B2C Public - `/explore`)

```text
Design the public B2C Marketplace Discovery Portal for Nusabook (Desktop & Mobile view):
- Top Navigation Bar: Nusabook logo, search bar ("Cari paket wisata, destinasi, atau kota..."), location selector dropdown ("Kota Asal"), category tags (Open Trip, Private Trip, Sewa Bus), and "Daftar Mitra Travel" button.
- Hero Search Filter Bar: Date range picker, budget filter (range slider), duration filter (1D, 2D1N, 3D2N), and destination filter.
- Tour Package Cards Grid: High quality destination photo, "Verified Partner" badge, Operator name with logo, Package Title, Departure date tag with real-time seat status pill ("Tersisa 4 kursi" in orange tag or "Tersisa 12 kursi" in green tag), Price per pax (e.g., "Rp 350.000 / pax"), rating stars (4.9 ★), and "Lihat Detail" button.
- Clean footer with trust badges (Midtrans Payment Secured, WA Instant E-Ticket, Verified UMKM).
```

---

### 🏪 Screen 2: Agent No-Code Digital Storefront (`nusabook.id/[agent-slug]`)

```text
Design a personalized digital storefront for a tour operator named "Pesona Merapi Tour":
- Header Banner & Profile Section: Cover image of Mt. Merapi, operator logo avatar, verified badge, operator title, brief bio, rating summary, official WhatsApp button ("Chat Admin"), and office address.
- Interactive Departure Calendar & Catalog Tab:
  * Tab switch: "Katalog Paket" and "Jadwal Keberangkatan".
  * Interactive monthly calendar showing green dots for open trips and red for sold out.
- Package Detail Drawer / Modal:
  * Destination photo gallery grid.
  * Day-by-Day Accordion Itinerary (Day 1: Gathering at Meeting Point, Day 2: Sunrise Jeep Tour, etc.).
  * Included & Excluded facilities checklist (Green check icons for Included, Red cross for Excluded).
  * Cancellation & Refund policy box.
  * Sticky Bottom Bar (Mobile): "Pilih Jadwal & Pesan" CTA button showing starting price.
```

---

### 🛒 Screen 3: Concurrency-Safe Booking & Passenger Form Modal

```text
Design the 3-step checkout booking modal for a tourist purchasing 2 pax for "Open Trip Dieng Plateau":
- Top Stepper Indicator: Step 1: Pilih Jadwal -> Step 2: Data Manifes -> Step 3: Pembayaran.
- Step 1 View: Departure date radio selection, quantity counter (+/- pax selector), and live quota counter pill ("Hanya tersisa 3 kursi!").
- Step 2 View (Passenger Manifest Form):
  * Primary Contact Input: Full Name, WhatsApp Number, Email.
  * Passenger Data Cards (Pax 1 & Pax 2): Full Name, Gender (Male/Female), Identity Number (NIK/Passport), Emergency Contact Name & Phone, Special Notes textarea.
- Timer Countdown Banner at the top: "Selesaikan pemesanan dalam 19:45" (Payment TTL countdown).
- Order Summary Card: Subtotal price, 0% convenience fee, Total amount, and "Lanjut ke Pembayaran" button.
```

---

### 💳 Screen 4: Payment Gateway Checkout & E-Ticket View

```text
Design two connected screens for payment and ticket confirmation:
- Screen 4A (Payment Gateway Modal):
  * Booking Reference: "NB-2026-X89K2".
  * Payment Timer Countdown: 18:30 minutes left.
  * Payment Method Accordion: QRIS (GoPay/OVO/ShopeePay) with generated dynamic QR code preview, Virtual Account (BCA, Mandiri, BRI, BNI) with 16-digit VA number and "Salin" copy button.
- Screen 4B (Issued E-Ticket View):
  * Success Badge ("Pembayaran Berhasil / Paid").
  * Unique QR Code for check-in / ticket verification.
  * Booking details: Trip name, Departure date & time, Meeting point map pin, Tour Leader contact, Passenger Manifest list.
  * Buttons: "Download PDF E-Ticket" and "Kirim ke WhatsApp".
```

---

### 📊 Screen 5: Operator Backoffice Dashboard (`/dashboard`)

```text
Design the B2B SaaS Backoffice Dashboard for a Travel Operator (Desktop View 1920x1080):
- Sidebar Navigation: Dashboard, Katalog Paket, Jadwal & Kuota, Data Pesanan & Manifes, Laporan Keuangan, Pengaturan Toko.
- Top Bar: Agent Profile avatar, Notification bell, Store Status Toggle (Online/Offline), Storefront URL link button.
- Analytics Summary Cards (Top Row):
  1. Gross Revenue Card ("Rp 45.200.000").
  2. Net Payout (98%) Card ("Rp 44.296.000" after 2% platform fee).
  3. Occupancy Rate Card ("84.5% - 142 Kursi Terjual").
  4. Pending Payment Orders ("6 Orders").
- Central Content:
  * Top Selling Packages Chart / Bar Graph.
  * Recent Orders Data Table: Order ID, Customer Name, Package Name, Departure Date, Pax, Total Amount, Payment Status (Paid/Pending/Expired pills), and Quick Action Menu (View Details, WhatsApp Customer, Print Manifest).
```

---

### 📋 Screen 6: Passenger Manifest & Quota Manager (Backoffice)

```text
Design the Passenger Manifest Management interface for Backoffice:
- Page Header: Title "Manifes Peserta - Open Trip Bromo Sunrise (12 Oct 2026)", Total Passengers: 18/20 seats filled.
- Action Toolbar: Search passenger name input, Filter by payment status, Export Buttons ("Export to Excel .xlsx" in green, "Download PDF Manifest" in red), and "+ Input Pesanan Manual (Offline)" primary button.
- Passenger Table Columns: No, Booking Code, Full Name, Gender, NIK/Passport (masked for PDP compliance), WhatsApp, Emergency Contact, Special Notes, Payment Status, Check-in Status toggle.
- Manual Booking Entry Modal Overlay: Form to manually add walk-in or offline WhatsApp bookings (Customer info, Schedule picker, Pax, Payment Status: Cash/Paid).
```

---

### 🛡️ Screen 7: Super Admin Escrow & Payout Ledger (`/admin`)

```text
Design the Platform Super Admin Dashboard for Nusabook Internal Team:
- Overview Metrics: Total GMV National ("Rp 1.250.000.000"), Total 2% Commission Earned ("Rp 25.000.000"), Active Verified Agents ("48 Agen").
- Agent Verification Queue Table: Agent Name, NIB/KTP Document Upload link, Registration Date, Verification Action buttons ("Approve", "Reject", "View Documents").
- Escrow Payout Ledger Table: Agent Name, Bank Account Details (Bank Name, Account Number, Holder Name), Requested Amount, Net Amount Transferred (after deduction), Request Date, Status (Requested / Transferred), and "Approve Payout & Upload Proof" modal trigger.
```
