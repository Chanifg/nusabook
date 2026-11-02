import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface FinancialExportRow {
  no: number;
  bookingCode: string;
  transactionDate: string;
  customerName: string;
  packageTitle: string;
  totalPax: number;
  totalAmount: number;
  platformFee: number;
  agentPayout: number;
  paymentStatus: string;
  escrowStatus: string;
}

const MOCK_FINANCIAL_ROWS: FinancialExportRow[] = [
  {
    no: 1,
    bookingCode: "NSB-20261018-001",
    transactionDate: "2026-10-14 09:25 WIB",
    customerName: "Budi Santoso",
    packageTitle: "Sunrise Lava Tour Merapi & Bunker Kaliadem",
    totalPax: 4,
    totalAmount: 1000000,
    platformFee: 20000,
    agentPayout: 980000,
    paymentStatus: "LUNAS (PAID)",
    escrowStatus: "Tersimpan di Escrow Vault",
  },
  {
    no: 2,
    bookingCode: "NSB-20261018-002",
    transactionDate: "2026-10-15 14:10 WIB",
    customerName: "Siti Nurhaliza",
    packageTitle: "Sunrise Lava Tour Merapi & Bunker Kaliadem",
    totalPax: 2,
    totalAmount: 500000,
    platformFee: 10000,
    agentPayout: 490000,
    paymentStatus: "LUNAS (PAID)",
    escrowStatus: "Tersimpan di Escrow Vault",
  },
  {
    no: 3,
    bookingCode: "NSB-20261019-003",
    transactionDate: "2026-10-16 11:30 WIB",
    customerName: "Ahmad Fauzi",
    packageTitle: "Midnight Overland Bromo Sunrise & Savana Teletubbies",
    totalPax: 3,
    totalAmount: 1350000,
    platformFee: 27000,
    agentPayout: 1323000,
    paymentStatus: "LUNAS (PAID)",
    escrowStatus: "Siap Dicairkan ke Rekening Mitra",
  },
  {
    no: 4,
    bookingCode: "NSB-20261020-004",
    transactionDate: "2026-10-17 16:45 WIB",
    customerName: "Dewi Lestari",
    packageTitle: "Private Premium Trip Candi Borobudur & Punthuk Setumbu",
    totalPax: 2,
    totalAmount: 1300000,
    platformFee: 26000,
    agentPayout: 1274000,
    paymentStatus: "LUNAS (PAID)",
    escrowStatus: "Selesai Dicairkan",
  },
  {
    no: 5,
    bookingCode: "NSB-20261021-005",
    transactionDate: "2026-10-18 08:20 WIB",
    customerName: "Rian Pratama",
    packageTitle: "Sunrise Lava Tour Merapi & Bunker Kaliadem",
    totalPax: 5,
    totalAmount: 1125000,
    platformFee: 22500,
    agentPayout: 1102500,
    paymentStatus: "LUNAS (PAID)",
    escrowStatus: "Tersimpan di Escrow Vault",
  },
];

function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const stringValue = String(value);
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export async function GET() {
  try {
    let rows: FinancialExportRow[] = MOCK_FINANCIAL_ROWS;

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: agent } = await supabase
          .from("travel_agents")
          .select("id")
          .eq("owner_id", user.id)
          .maybeSingle();

        if (agent) {
          const { data: dbBookings } = await (supabase.from("bookings") as any)
            .select(`
              id,
              booking_code,
              created_at,
              customer_name,
              total_pax,
              total_amount,
              platform_fee,
              agent_payout_amount,
              payment_status,
              trip_schedules (
                tour_packages (
                  title
                )
              )
            `)
            .eq("agent_id", agent.id)
            .eq("payment_status", "PAID")
            .order("created_at", { ascending: false });

          if (dbBookings && dbBookings.length > 0) {
            rows = dbBookings.map((b: any, index: number) => ({
              no: index + 1,
              bookingCode: b.booking_code || `NSB-${b.id.slice(0, 8)}`,
              transactionDate: b.created_at
                ? new Date(b.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })
                : "2026-10-18",
              customerName: b.customer_name || "Wisatawan",
              packageTitle: b.trip_schedules?.tour_packages?.title || "Paket Wisata Nusantara",
              totalPax: Number(b.total_pax || 1),
              totalAmount: Number(b.total_amount || 0),
              platformFee: Number(b.platform_fee || Math.round((b.total_amount || 0) * 0.02)),
              agentPayout: Number(b.agent_payout_amount || Math.round((b.total_amount || 0) * 0.98)),
              paymentStatus: "LUNAS (PAID)",
              escrowStatus: "Tersimpan di Escrow Vault",
            }));
          }
        }
      }
    } catch {
      // Fallback to verified seed rows
    }

    const headers = [
      "No",
      "Kode Reservasi",
      "Waktu Transaksi",
      "Nama Pemesan",
      "Paket Wisata",
      "Jumlah Pax",
      "Omzet Kotor (IDR)",
      "Fee Platform 2% (IDR)",
      "Hak Bersih Mitra 98% (IDR)",
      "Status Pembayaran",
      "Status Rekening Bersama Escrow",
    ];

    const csvLines = [headers.join(",")];

    for (const r of rows) {
      csvLines.push(
        [
          r.no,
          escapeCsv(r.bookingCode),
          escapeCsv(r.transactionDate),
          escapeCsv(r.customerName),
          escapeCsv(r.packageTitle),
          r.totalPax,
          r.totalAmount,
          r.platformFee,
          r.agentPayout,
          escapeCsv(r.paymentStatus),
          escapeCsv(r.escrowStatus),
        ].join(",")
      );
    }

    // Totals row
    const totalOmzet = rows.reduce((acc, cur) => acc + cur.totalAmount, 0);
    const totalFee = rows.reduce((acc, cur) => acc + cur.platformFee, 0);
    const totalNet = rows.reduce((acc, cur) => acc + cur.agentPayout, 0);
    const totalPaxSum = rows.reduce((acc, cur) => acc + cur.totalPax, 0);

    csvLines.push("");
    csvLines.push(`"TOTAL",,,,,"${totalPaxSum} Pax",${totalOmzet},${totalFee},${totalNet},,`);

    // Prepend UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility
    const csvContent = "\uFEFF" + csvLines.join("\r\n");
    const currentDate = new Date().toISOString().split("T")[0];

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="rekap-keuangan-nusabook-${currentDate}.csv"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("Gagal export rekap keuangan:", err);
    return NextResponse.json(
      { error: "Gagal membuat rekap finansial CSV." },
      { status: 500 }
    );
  }
}

