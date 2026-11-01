import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface FlattenedPassenger {
  orderNumber: number;
  fullName: string;
  gender: string;
  idCardNumber: string;
  phoneNumber: string;
  emergencyContact: string;
  specialNotes: string;
  bookingCode: string;
  isCheckedIn: boolean;
  checkedInAt: string | null;
}

// Mock data penumpang untuk keperluan pratinjau cetak dan pengujian lokal
const MOCK_PRINT_PASSENGERS: FlattenedPassenger[] = [
  {
    orderNumber: 1,
    fullName: "Budi Santoso",
    gender: "L",
    idCardNumber: "3507123456780001",
    phoneNumber: "081234567890",
    emergencyContact: "081298765432 (Istri)",
    specialNotes: "Duduk di baris depan (riwayat mabuk darat)",
    bookingCode: "NBK-BRM-001",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:15:00Z",
  },
  {
    orderNumber: 2,
    fullName: "Siti Nurhaliza",
    gender: "P",
    idCardNumber: "3507234567890002",
    phoneNumber: "081987654321",
    emergencyContact: "-",
    specialNotes: "-",
    bookingCode: "NBK-BRM-001",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:20:00Z",
  },
  {
    orderNumber: 3,
    fullName: "Ahmad Fauzi",
    gender: "L",
    idCardNumber: "3507345678900003",
    phoneNumber: "085233445566",
    emergencyContact: "085211223344 (Kakak)",
    specialNotes: "Vegetarian (tidak makan olahan daging)",
    bookingCode: "NBK-BRM-002",
    isCheckedIn: false,
    checkedInAt: null,
  },
  {
    orderNumber: 4,
    fullName: "Dewi Lestari",
    gender: "P",
    idCardNumber: "3507456789010004",
    phoneNumber: "087811223344",
    emergencyContact: "-",
    specialNotes: "-",
    bookingCode: "NBK-BRM-002",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:35:00Z",
  },
  {
    orderNumber: 5,
    fullName: "Rian Pratama",
    gender: "L",
    idCardNumber: "3507567890120005",
    phoneNumber: "089677889900",
    emergencyContact: "-",
    specialNotes: "-",
    bookingCode: "NBK-BRM-003",
    isCheckedIn: false,
    checkedInAt: null,
  },
  {
    orderNumber: 6,
    fullName: "Intan Permatasari",
    gender: "P",
    idCardNumber: "3507678901230006",
    phoneNumber: "081399887766",
    emergencyContact: "081300998877 (Suami)",
    specialNotes: "Membawa kamera tripod profesional",
    bookingCode: "NBK-BRM-003",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:40:00Z",
  },
  {
    orderNumber: 7,
    fullName: "Eko Prasetyo",
    gender: "L",
    idCardNumber: "3507789012340007",
    phoneNumber: "082155667788",
    emergencyContact: "-",
    specialNotes: "-",
    bookingCode: "NBK-BRM-004",
    isCheckedIn: false,
    checkedInAt: null,
  },
  {
    orderNumber: 8,
    fullName: "Maya Anggraini",
    gender: "P",
    idCardNumber: "3507890123450008",
    phoneNumber: "081277665544",
    emergencyContact: "-",
    specialNotes: "-",
    bookingCode: "NBK-BRM-004",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:50:00Z",
  },
  {
    orderNumber: 9,
    fullName: "Bayu Saputra",
    gender: "L",
    idCardNumber: "3507901234560009",
    phoneNumber: "085712349876",
    emergencyContact: "085788990011 (Ayah)",
    specialNotes: "Penjemputan di Terminal Arjosari",
    bookingCode: "NBK-BRM-005",
    isCheckedIn: false,
    checkedInAt: null,
  },
  {
    orderNumber: 10,
    fullName: "Citra Anindita",
    gender: "P",
    idCardNumber: "3507012345670010",
    phoneNumber: "081809876543",
    emergencyContact: "-",
    specialNotes: "-",
    bookingCode: "NBK-BRM-005",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T07:05:00Z",
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const { scheduleId } = await params;
    const safeScheduleId = scheduleId || "SCH-261018-A";

    // Default mock data operator dan paket trip
    let agentName = "Nusantara Tour & Travel (Mitra Resmi Nusabook)";
    let agentAddress = "Jl. Ijen No. 45, Klojen, Kota Malang, Jawa Timur";
    let agentContact = "0812-3456-7890 / cs@nusantaratour.id";
    let tripTitle = "Eksplorasi Sunrise Bromo & Midnight Crater 2D1N";
    let departureDateFormatted = "Sabtu, 18 Oktober 2026";
    let meetingPoint = "Stasiun Malang Kota Baru (Pintu Timur)";
    let totalQuota = 12;
    let passengers: FlattenedPassenger[] = MOCK_PRINT_PASSENGERS;

    // Coba ambil data riil jika Supabase aktif dan memiliki sesi pengguna
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: agent } = await supabase
          .from("travel_agents")
          .select("id, business_name, office_address, city, whatsapp_number")
          .eq("owner_id", user.id)
          .maybeSingle();

        if (agent) {
          agentName = agent.business_name;
          agentAddress = `${agent.office_address || "Kantor Pusat Mitra"}, ${agent.city || "Indonesia"}`;
          agentContact = agent.whatsapp_number || agentContact;
        }

        const { data: schedule } = await (supabase.from("trip_schedules") as any)
          .select("id, departure_date, return_date, total_quota, price_per_pax, tour_packages(id, title, destination_city, meeting_point, agent_id)")
          .eq("id", safeScheduleId)
          .maybeSingle();

        if (schedule && schedule.tour_packages) {
          tripTitle = schedule.tour_packages.title;
          meetingPoint = schedule.tour_packages.meeting_point || meetingPoint;
          totalQuota = schedule.total_quota;

          try {
            const d = new Date(schedule.departure_date);
            departureDateFormatted = d.toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          } catch {
            departureDateFormatted = schedule.departure_date;
          }

          const { data: bookings } = await (supabase.from("bookings") as any)
            .select(`
              id,
              booking_code,
              customer_name,
              customer_whatsapp,
              booking_passengers (
                id,
                full_name,
                gender,
                id_card_number,
                phone_number,
                emergency_contact,
                special_notes,
                is_checked_in,
                checked_in_at
              )
            `)
            .eq("schedule_id", safeScheduleId)
            .eq("payment_status", "PAID")
            .order("created_at", { ascending: true });

          if (bookings && bookings.length > 0) {
            const livePax: FlattenedPassenger[] = [];
            let orderNum = 1;
            for (const b of bookings) {
              for (const p of b.booking_passengers || []) {
                livePax.push({
                  orderNumber: orderNum++,
                  fullName: p.full_name,
                  gender: p.gender === "MALE" ? "L" : p.gender === "FEMALE" ? "P" : "-",
                  idCardNumber: p.id_card_number || "-",
                  phoneNumber: p.phone_number || b.customer_whatsapp || "-",
                  emergencyContact: p.emergency_contact || "-",
                  specialNotes: p.special_notes || "-",
                  bookingCode: b.booking_code,
                  isCheckedIn: Boolean(p.is_checked_in),
                  checkedInAt: p.checked_in_at || null,
                });
              }
            }
            if (livePax.length > 0) {
              passengers = livePax;
            }
          }
        }
      }
    } catch {
      // Mock fallback otomatis jika tidak ada koneksi database
    }

    const totalPax = passengers.length;
    const checkedInPax = passengers.filter((p) => p.isCheckedIn).length;

    // Dokumen HTML standar siap cetak (No Puppeteer - Cloudflare Edge Friendly)
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MANIFES PENUMPANG - ${tripTitle} - ${departureDateFormatted}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 11px;
      color: #1e293b;
      background-color: #f8fafc;
      padding: 20px;
    }
    .screen-toolbar {
      position: sticky;
      top: 0;
      z-index: 50;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0D47A1;
      color: #fff;
      padding: 12px 24px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(13, 71, 161, 0.25);
    }
    .screen-toolbar h1 {
      font-size: 14px;
      font-weight: 700;
    }
    .toolbar-actions {
      display: flex;
      gap: 12px;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-primary {
      background: #F57C00;
      color: white;
    }
    .btn-primary:hover {
      background: #e65100;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.15);
      color: white;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.25);
    }
    .sheet {
      background: white;
      max-width: 100%;
      margin: 0 auto;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
    }
    .kop {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0D47A1;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .agency-name {
      font-size: 18px;
      font-weight: 800;
      color: #0D47A1;
      letter-spacing: -0.3px;
    }
    .agency-sub {
      font-size: 11px;
      color: #475569;
      margin-top: 2px;
    }
    .doc-badge {
      text-align: right;
    }
    .doc-title {
      font-size: 16px;
      font-weight: 800;
      color: #0D47A1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .doc-meta {
      font-size: 10px;
      color: #64748b;
      margin-top: 3px;
    }
    .trip-info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #f1f5f9;
      padding: 10px 14px;
      border-radius: 6px;
      margin-bottom: 16px;
      font-size: 11px;
      border-left: 4px solid #F57C00;
    }
    .info-label {
      font-size: 9px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
    }
    .info-val {
      font-weight: 700;
      color: #0f172a;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #0D47A1;
      color: white;
      text-align: left;
      padding: 7px 8px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    td {
      padding: 6px 8px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10px;
      vertical-align: top;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    .text-center {
      text-align: center;
    }
    .badge-present {
      color: #047857;
      font-weight: 700;
      background: #ecfdf5;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #a7f3d0;
      display: inline-block;
    }
    .badge-absent {
      color: #64748b;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
    }
    .signatures {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
      margin-top: 24px;
      page-break-inside: avoid;
    }
    .sign-box {
      border: 1px dashed #cbd5e1;
      padding: 14px;
      border-radius: 6px;
      text-align: center;
    }
    .sign-title {
      font-weight: 700;
      font-size: 11px;
      color: #334155;
    }
    .sign-space {
      height: 55px;
    }
    .sign-name {
      border-top: 1px solid #94a3b8;
      display: inline-block;
      min-width: 180px;
      padding-top: 4px;
      font-weight: 600;
      font-size: 10px;
      color: #1e293b;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      .screen-toolbar {
        display: none !important;
      }
      .sheet {
        border: none;
        box-shadow: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>

  <div class="screen-toolbar">
    <div>
      <h1>Pratinjau Dokumen Manifes Siap Cetak</h1>
      <p style="font-size: 11px; color: #e2e8f0; margin-top: 2px;">Format standar ukuran kertas A4 Landscape (SIMAKSI & Jasa Raharja).</p>
    </div>
    <div class="toolbar-actions">
      <button type="button" onclick="window.print()" class="btn btn-primary">
        Cetak / Simpan PDF
      </button>
      <button type="button" onclick="window.close()" class="btn btn-secondary">
        Tutup
      </button>
    </div>
  </div>

  <div class="sheet">
    <div class="kop">
      <div>
        <div class="agency-name">${agentName}</div>
        <div class="agency-sub">${agentAddress}</div>
        <div class="agency-sub">Kontak Layanan: ${agentContact}</div>
      </div>
      <div class="doc-badge">
        <div class="doc-title">MANIFES PENUMPANG</div>
        <div class="doc-meta">BATCH ID: #${safeScheduleId.slice(0, 10).toUpperCase()}</div>
        <div class="doc-meta">Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}</div>
      </div>
    </div>

    <div class="trip-info-grid">
      <div>
        <div class="info-label">Paket Wisata</div>
        <div class="info-val">${tripTitle}</div>
      </div>
      <div>
        <div class="info-label">Tanggal Keberangkatan</div>
        <div class="info-val">${departureDateFormatted}</div>
      </div>
      <div>
        <div class="info-label">Titik Kumpul (Meeting Point)</div>
        <div class="info-val">${meetingPoint}</div>
      </div>
      <div>
        <div class="info-label">Rekapitulasi Kehadiran</div>
        <div class="info-val">${checkedInPax} / ${totalPax} Peserta Hadir (Kapasitas: ${totalQuota} Pax)</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 30px;" class="text-center">No</th>
          <th>Nama Lengkap</th>
          <th style="width: 35px;" class="text-center">L/P</th>
          <th>NIK / No. Identitas</th>
          <th>No WhatsApp</th>
          <th>Kontak Darurat</th>
          <th>Catatan Khusus</th>
          <th style="width: 80px;">Kode Booking</th>
          <th style="width: 75px;" class="text-center">Status</th>
          <th style="width: 90px;" class="text-center">Paraf Peserta</th>
        </tr>
      </thead>
      <tbody>
        ${passengers
          .map(
            (p) => `<tr>
          <td class="text-center" style="font-weight: 700;">${p.orderNumber}</td>
          <td style="font-weight: 600;">${p.fullName}</td>
          <td class="text-center">${p.gender}</td>
          <td style="font-family: monospace;">${p.idCardNumber}</td>
          <td style="font-family: monospace;">${p.phoneNumber}</td>
          <td>${p.emergencyContact}</td>
          <td style="color: ${p.specialNotes !== "-" ? "#b91c1c" : "inherit"}; font-size: 9.5px;">${p.specialNotes}</td>
          <td><code>${p.bookingCode}</code></td>
          <td class="text-center">
            ${
              p.isCheckedIn
                ? `<span class="badge-present">Hadir</span>`
                : `<span class="badge-absent">Belum</span>`
            }
          </td>
          <td></td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <div class="signatures">
      <div class="sign-box">
        <div class="sign-title">Tour Leader / Koordinator Lapangan</div>
        <div class="sign-space"></div>
        <div class="sign-name">( ..................................................... )</div>
      </div>
      <div class="sign-box">
        <div class="sign-title">Pengemudi Armada / Kru Transportasi</div>
        <div class="sign-space"></div>
        <div class="sign-name">( ..................................................... )</div>
      </div>
    </div>
  </div>

  <script>
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("autoPrint") === "true") {
      window.onload = function() {
        window.print();
      };
    }
  </script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Gagal membuat dokumen PDF manifes:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
