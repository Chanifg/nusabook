import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const verified = body.verified !== undefined ? Boolean(body.verified) : true;
    const notes = body.notes || "Diverifikasi oleh Super Admin Platform";

    // Cek otorisasi superadmin dari header x-user-role atau session
    const roleHeader = req.headers.get("x-user-role");
    if (roleHeader && roleHeader !== "superadmin") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Hanya Super Admin yang berwenang" },
        { status: 403 }
      );
    }

    const supabase = await createClient();
    const { data, error } = (await supabase
      .from("travel_agents")
      .update({
        is_verified: verified,
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", id)
      .select("id, business_name, is_verified, is_active")
      .single()) as any;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status verifikasi agen ${data?.business_name || id} berhasil diperbarui`,
      agent: data,
      notes,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
