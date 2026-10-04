import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const { scheduleId } = await params;
    if (!scheduleId) {
      return NextResponse.json(
        { error: "Parameter scheduleId wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Sesi tidak valid. Silakan login kembali." },
        { status: 401 }
      );
    }

    // 1. Ambil data agen travel milik user
    const { data: agent } = await supabase
      .from("travel_agents")
      .select("id, business_name, office_address, city, whatsapp_number")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!agent) {
      return NextResponse.json(
        { error: "Profil mitra agen tidak ditemukan." },
        { status: 403 }
      );
    }

    // 2. Ambil detail jadwal dan paket wisata
    const { data: schedule, error: scheduleError } = await (supabase.from("trip_schedules") as any)
      .select("id, departure_date, return_date, total_quota, price_per_pax, tour_packages(id, title, destination_city, meeting_point, agent_id)")
      .eq("id", scheduleId)
      .maybeSingle();

    if (scheduleError || !schedule) {
      return NextResponse.json(
        { error: "Jadwal perjalanan tidak ditemukan." },
        { status: 404 }
      );
    }

    const pkg = schedule.tour_packages;
    if (!pkg || pkg.agent_id !== agent.id) {
      return NextResponse.json(
        { error: "Akses ditolak: Anda bukan pemilik jadwal perjalanan ini." },
        { status: 403 }
      );
    }

    // 3. Ambil seluruh pesanan berstatus PAID dan data penumpangnya
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
      .eq("schedule_id", scheduleId)
      .eq("payment_status", "PAID")
      .order("created_at", { ascending: true });

    // 4. Flatten data peserta
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

    const passengers: FlattenedPassenger[] = [];
    let orderNum = 1;

    for (const b of bookings || []) {
      for (const p of b.booking_passengers || []) {
        passengers.push({
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

    const formatIdDate = (dateStr: string) => {
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return dateStr;
      }
    };

    const departureFormatted = formatIdDate(schedule.departure_date);
    const totalPax = passengers.length;
    const checkedInPax = passengers.filter((p) => p.isCheckedIn).length;

    // 5. Generate Print-Ready HTML Document
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manifes Penumpang - ${pkg.title} - ${schedule.departure_date}</title>
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
      background: #0f172a;
      color: #fff;
      padding: 12px 24px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .screen-toolbar h1 {
      font-size: 14px;
      font-weight: 600;
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
      background: #059669;
      color: white;
    }
    .btn-primary:hover {
      background: #047857;
    }
    .btn-secondary {
      background: #334155;
      color: white;
    }
    .btn-secondary:hover {
      background: #475569;
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
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .agency-name {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .agency-sub {
      font-size: 11px;
      color: #475569;
      margin-top: 3px;
    }
    .doc-badge {
      text-align: right;
    }
    .doc-title {
      font-size: 16px;
      font-weight: 800;
      color: #047857;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .doc-meta {
      font-size: 10px;
      color: #64748b;
      margin-top: 4px;
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
      background: #0f172a;
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
      height: 50px;
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
      <p style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Format standar ukuran kertas A4 Landscape.</p>
    </div>
    <div class="toolbar-actions">
      <button onclick="window.print()" class="btn btn-primary">
        Cetak / Simpan PDF
      </button>
      <button onclick="window.close()" class="btn btn-secondary">
        Tutup
      </button>
    </div>
  </div>

  <div class="sheet">
    <div class="kop">
      <div>
        <div class="agency-name">${agent.business_name}</div>
        <div class="agency-sub">${agent.office_address || "Kantor Pusat Operasional Mitra Nusabook"}, ${agent.city}</div>
        <div class="agency-sub">WhatsApp Layanan: ${agent.whatsapp_number}</div>
      </div>
      <div class="doc-badge">
        <div class="doc-title">MANIFES PENUMPANG</div>
        <div class="doc-meta">ID Jadwal: #${schedule.id.slice(0, 8)}</div>
        <div class="doc-meta">Dicetak: ${new Date().toLocaleDateString("id-ID")}</div>
      </div>
    </div>

    <div class="trip-info-grid">
      <div>
        <div class="info-label">Paket Wisata</div>
        <div class="info-val">${pkg.title}</div>
      </div>
      <div>
        <div class="info-label">Tanggal Keberangkatan</div>
        <div class="info-val">${departureFormatted}</div>
      </div>
      <div>
        <div class="info-label">Titik Kumpul (Meeting Point)</div>
        <div class="info-val">${pkg.meeting_point || "Ditentukan oleh Tour Leader"}</div>
      </div>
      <div>
        <div class="info-label">Rekapitulasi Kehadiran</div>
        <div class="info-val">${checkedInPax} / ${totalPax} Peserta Hadir (Kapasitas: ${schedule.total_quota} Kursi)</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 32px;" class="text-center">No</th>
          <th>Nama Lengkap</th>
          <th style="width: 40px;" class="text-center">L/P</th>
          <th>No. Identitas (NIK/Paspor)</th>
          <th>Kontak WhatsApp</th>
          <th>Kontak Darurat</th>
          <th>Catatan Medis/Alergi</th>
          <th style="width: 80px;">Kode Booking</th>
          <th style="width: 85px;" class="text-center">Status Presensi</th>
          <th style="width: 100px;" class="text-center">Paraf Peserta</th>
        </tr>
      </thead>
      <tbody>
        ${
          passengers.length === 0
            ? '<tr><td colspan="10" style="text-align: center; padding: 24px; color: #64748b;">Belum ada penumpang terdaftar dengan status pembayaran lunas.</td></tr>'
            : passengers
                .map(
                  (p) => `<tr>
          <td class="text-center" style="font-weight: 700;">${p.orderNumber}</td>
          <td style="font-weight: 600;">${p.fullName}</td>
          <td class="text-center">${p.gender}</td>
          <td>${p.idCardNumber}</td>
          <td>${p.phoneNumber}</td>
          <td>${p.emergencyContact}</td>
          <td style="color: ${p.specialNotes !== "-" ? "#b91c1c" : "inherit"}; font-weight: ${p.specialNotes !== "-" ? "600" : "normal"};">${p.specialNotes}</td>
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
                .join("")
        }
      </tbody>
    </table>

    <div class="signatures">
      <div class="sign-box">
        <div class="sign-title">Tour Leader / Koordinator Lapangan</div>
        <div class="sign-space"></div>
        <div class="sign-name">( ..................................................... )</div>
      </div>
      <div class="sign-box">
        <div class="sign-title">Pengemudi / Kru Transportasi</div>
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
    console.error("Unhandled error saat membuat dokumen PDF manifes:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
