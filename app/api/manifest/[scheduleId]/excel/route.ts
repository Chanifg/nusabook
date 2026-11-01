import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateManifestCsv, ManifestCsvItem } from "@/lib/manifest/csv-helper";

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

    // 1. Ambil data travel agent milik user
    const { data: agent } = await supabase
      .from("travel_agents")
      .select("id, business_name")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!agent) {
      return NextResponse.json(
        { error: "Profil mitra agen tidak ditemukan." },
        { status: 403 }
      );
    }

    // 2. Ambil jadwal keberangkatan dan pastikan milik agen terkait
    const { data: schedule, error: scheduleError } = await (supabase.from("trip_schedules") as any)
      .select("id, departure_date, return_date, package_id, tour_packages(id, title, slug, agent_id)")
      .eq("id", scheduleId)
      .maybeSingle();

    if (scheduleError || !schedule) {
      return NextResponse.json(
        { error: "Jadwal keberangkatan tidak ditemukan." },
        { status: 404 }
      );
    }

    const pkg = schedule.tour_packages;
    if (!pkg || pkg.agent_id !== agent.id) {
      return NextResponse.json(
        { error: "Akses ditolak: Anda bukan pemilik jadwal ini." },
        { status: 403 }
      );
    }

    // 3. Ambil seluruh pesanan berstatus PAID pada jadwal ini
    const { data: bookings, error: bookingsError } = await (supabase.from("bookings") as any)
      .select(`
        id,
        booking_code,
        payment_status,
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
          checked_in_at,
          created_at
        )
      `)
      .eq("schedule_id", scheduleId)
      .eq("payment_status", "PAID")
      .order("created_at", { ascending: true });

    if (bookingsError) {
      console.error("Gagal mengambil data pemesanan manifes:", bookingsError);
      return NextResponse.json(
        { error: "Gagal mengambil data pemesanan." },
        { status: 500 }
      );
    }

    // 4. Flatten data penumpang menjadi baris manifes terurut
    const manifestItems: ManifestCsvItem[] = [];
    let orderNum = 1;

    for (const booking of bookings || []) {
      const passengers = booking.booking_passengers || [];
      for (const p of passengers) {
        manifestItems.push({
          orderNumber: orderNum++,
          fullName: p.full_name,
          gender: p.gender,
          idCardNumber: p.id_card_number,
          phoneNumber: p.phone_number || booking.customer_whatsapp,
          emergencyContact: p.emergency_contact,
          specialNotes: p.special_notes,
          bookingCode: booking.booking_code,
          paymentStatus: booking.payment_status,
          isCheckedIn: Boolean(p.is_checked_in),
          checkedInAt: p.checked_in_at || null,
        });
      }
    }

    const csvContent = generateManifestCsv(manifestItems);
    const filename = `manifes-${pkg.slug || "trip"}-${schedule.departure_date}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Unhandled error saat ekspor excel manifes:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
