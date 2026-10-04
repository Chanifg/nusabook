import { NextResponse } from "next/server";
import { processManualBooking } from "@/lib/bookings/manual-booking";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await processManualBooking(body);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memproses booking manual" },
      { status: 400 }
    );
  }
}
