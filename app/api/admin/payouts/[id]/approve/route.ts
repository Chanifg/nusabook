import { NextResponse } from "next/server";
import { calculateSettlement } from "@/lib/admin/settlement";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const bankRefNumber = body.bankRefNumber || `TRF-BCA-${Date.now()}`;
    const grossAmount = Number(body.grossAmount || 1000000);

    const roleHeader = req.headers.get("x-user-role");
    if (roleHeader && roleHeader !== "superadmin") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Hanya Super Admin yang berwenang" },
        { status: 403 }
      );
    }

    const settlement = calculateSettlement(grossAmount);

    return NextResponse.json({
      success: true,
      message: `Pencairan dana payout ${id} telah disetujui dan ditransfer`,
      payoutId: id,
      bankRefNumber,
      settlement,
      status: "TRANSFERRED",
      transferredAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal memproses approval payout" },
      { status: 400 }
    );
  }
}
