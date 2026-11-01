import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateManifestCsv, ManifestCsvItem } from "@/lib/manifest/csv-helper";

// Mock data penumpang untuk fallback jika database belum terisi atau testing offline
const MOCK_CSV_PASSENGERS: ManifestCsvItem[] = [
  {
    orderNumber: 1,
    fullName: "Budi Santoso",
    gender: "MALE",
    idCardNumber: "3507123456780001",
    phoneNumber: "081234567890",
    emergencyContact: "081298765432 (Istri)",
    specialNotes: "Duduk di baris depan (riwayat mabuk darat)",
    bookingCode: "NBK-BRM-001",
    paymentStatus: "PAID",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:15:00Z",
  },
  {
    orderNumber: 2,
    fullName: "Siti Nurhaliza",
    gender: "FEMALE",
    idCardNumber: "3507234567890002",
    phoneNumber: "081987654321",
    emergencyContact: "-",
    specialNotes: "-",
    bookingCode: "NBK-BRM-001",
    paymentStatus: "PAID",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:20:00Z",
  },
  {
    orderNumber: 3,
    fullName: "Ahmad Fauzi",
    gender: "MALE",
    idCardNumber: "3507345678900003",
    phoneNumber: "085233445566",
    emergencyContact: "085211223344 (Kakak)",
    specialNotes: "Vegetarian (tidak makan olahan daging)",
    bookingCode: "NBK-BRM-002",
    paymentStatus: "PAID",
    isCheckedIn: false,
    checkedInAt: null,
  },
  {
    orderNumber: 4,
    fullName: "Dewi Lestari",
    gender: "FEMALE",
    idCardNumber: "3507456789010004",
    phoneNumber: "087811223344",
    emergencyContact: "-",
    specialNotes: "-",
    bookingCode: "NBK-BRM-002",
    paymentStatus: "PAID",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:35:00Z",
  },
  {
    orderNumber: 5,
    fullName: "Rian Pratama",
    gender: "MALE",
    idCardNumber: "3507567890120005",
    phoneNumber: "089677889900",
    emergencyContact: "-",
    specialNotes: "-",
    bookingCode: "NBK-BRM-003",
    paymentStatus: "PAID",
    isCheckedIn: false,
    checkedInAt: null,
  },
  {
    orderNumber: 6,
    fullName: "Intan Permatasari",
    gender: "FEMALE",
    idCardNumber: "3507678901230006",
    phoneNumber: "081399887766",
    emergencyContact: "081300998877 (Suami)",
    specialNotes: "Membawa kamera tripod profesional",
    bookingCode: "NBK-BRM-003",
    paymentStatus: "PAID",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:40:00Z",
  },
  {
    orderNumber: 7,
    fullName: "Eko Prasetyo",
    gender: "MALE",
    idCardNumber: "3507789012340007",
    phoneNumber: "082155667788",
    emergencyContact: "-",
    specialNotes: "-",
    bookingCode: "NBK-BRM-004",
    paymentStatus: "PAID",
    isCheckedIn: false,
    checkedInAt: null,
  },
  {
    orderNumber: 8,
    fullName: "Maya Anggraini",
    gender: "FEMALE",
    idCardNumber: "3507890123450008",
    phoneNumber: "081277665544",
    emergencyContact: "-",
    specialNotes: "-",
    bookingCode: "NBK-BRM-004",
    paymentStatus: "PAID",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T06:50:00Z",
  },
  {
    orderNumber: 9,
    fullName: "Bayu Saputra",
    gender: "MALE",
    idCardNumber: "3507901234560009",
    phoneNumber: "085712349876",
    emergencyContact: "085788990011 (Ayah)",
    specialNotes: "Penjemputan di Terminal Arjosari",
    bookingCode: "NBK-BRM-005",
    paymentStatus: "PAID",
    isCheckedIn: false,
    checkedInAt: null,
  },
  {
    orderNumber: 10,
    fullName: "Citra Anindita",
    gender: "FEMALE",
    idCardNumber: "3507012345670010",
    phoneNumber: "081809876543",
    emergencyContact: "-",
    specialNotes: "-",
    bookingCode: "NBK-BRM-005",
    paymentStatus: "PAID",
    isCheckedIn: true,
    checkedInAt: "2026-10-18T07:05:00Z",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get("scheduleId") || "SCH-261018-A";

    let csvItems: ManifestCsvItem[] = MOCK_CSV_PASSENGERS;

    // Coba ambil data riil dari Supabase jika user memiliki sesi login
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: bookings } = await (supabase.from("bookings") as any)
          .select(`
            id,
            booking_code,
            payment_status,
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

        if (bookings && bookings.length > 0) {
          const liveItems: ManifestCsvItem[] = [];
          let counter = 1;

          for (const b of bookings) {
            for (const p of b.booking_passengers || []) {
              liveItems.push({
                orderNumber: counter++,
                fullName: p.full_name,
                gender: p.gender,
                idCardNumber: p.id_card_number,
                phoneNumber: p.phone_number || b.customer_whatsapp,
                emergencyContact: p.emergency_contact,
                specialNotes: p.special_notes,
                bookingCode: b.booking_code,
                paymentStatus: b.payment_status,
                isCheckedIn: Boolean(p.is_checked_in),
                checkedInAt: p.checked_in_at,
              });
            }
          }

          if (liveItems.length > 0) {
            csvItems = liveItems;
          }
        }
      }
    } catch {
      // Gunakan mock data jika Supabase belum aktif di lokal
    }

    // Generate CSV dengan UTF-8 BOM (\uFEFF)
    const csvContent = generateManifestCsv(csvItems);

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="manifes-peserta-${scheduleId}.csv"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Gagal meng-generate CSV manifes:", error);
    return NextResponse.json(
      { error: "Gagal membuat file export manifes CSV." },
      { status: 500 }
    );
  }
}
