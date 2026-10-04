import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passengerId, isCheckedIn } = body;

    if (!passengerId || typeof isCheckedIn !== "boolean") {
      return NextResponse.json(
        { error: "Parameter passengerId dan isCheckedIn (boolean) wajib disertakan." },
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

    // 1. Ambil data agent user
    const { data: agent } = await supabase
      .from("travel_agents")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!agent) {
      return NextResponse.json(
        { error: "Profil mitra agen tidak ditemukan." },
        { status: 403 }
      );
    }

    // 2. Verifikasi bahwa penumpang terdaftar pada booking milik agen ini
    const { data: passenger, error: checkError } = await (supabase.from("booking_passengers") as any)
      .select(`
        id,
        is_checked_in,
        checked_in_at,
        bookings (
          id,
          agent_id
        )
      `)
      .eq("id", passengerId)
      .maybeSingle();

    if (checkError || !passenger) {
      return NextResponse.json(
        { error: "Data penumpang tidak ditemukan." },
        { status: 404 }
      );
    }

    if (!passenger.bookings || passenger.bookings.agent_id !== agent.id) {
      return NextResponse.json(
        { error: "Akses ditolak: Penumpang bukan berasal dari reservasi agen Anda." },
        { status: 403 }
      );
    }

    // 3. Update status kehadiran
    const checkedInAt = isCheckedIn ? new Date().toISOString() : null;

    const { error: updateError } = await (supabase.from("booking_passengers") as any)
      .update({
        is_checked_in: isCheckedIn,
        checked_in_at: checkedInAt,
      })
      .eq("id", passengerId);

    if (updateError) {
      console.error("Gagal mengupdate status kehadiran:", updateError);
      return NextResponse.json(
        { error: "Gagal memperbarui status presensi di database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      passenger: {
        id: passengerId,
        is_checked_in: isCheckedIn,
        checked_in_at: checkedInAt,
      },
    });
  } catch (error) {
    console.error("Unhandled error saat check-in manifes:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
