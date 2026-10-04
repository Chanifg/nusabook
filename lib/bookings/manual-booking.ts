export interface ManualPassengerInput {
  fullName: string;
  idCardNumber?: string | null;
  phoneNumber?: string | null;
  gender?: "MALE" | "FEMALE" | null;
  specialNotes?: string | null;
}

export interface ManualBookingInput {
  scheduleId: string;
  packageId: string;
  agentId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paxCount: number;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "OTHER" | string;
  totalAmount?: number;
  passengers?: ManualPassengerInput[];
  notes?: string;
}

export interface ManualBookingResult {
  bookingCode: string;
  status: "PAID";
  isManualEntry: true;
  paxCount: number;
  customerName: string;
  totalAmount: number;
  id?: string;
}

export async function processManualBooking(
  input: ManualBookingInput,
  db?: any
): Promise<ManualBookingResult> {
  if (
    !input.scheduleId ||
    !input.packageId ||
    !input.agentId ||
    !input.customerName?.trim() ||
    !input.paxCount ||
    input.paxCount < 1
  ) {
    throw new Error(
      "Validasi gagal: data pemesan dan kuota minimal 1 pax diperlukan."
    );
  }

  if (db && typeof db.checkQuota === "function") {
    const quota = await db.checkQuota(input.scheduleId);
    if (quota && quota.quota_remaining < input.paxCount) {
      throw new Error(
        `Kuota tidak mencukupi untuk pemesanan manual. Sisa: ${quota.quota_remaining}, Diminta: ${input.paxCount}`
      );
    }
    if (typeof db.confirmQuota === "function") {
      await db.confirmQuota(input.scheduleId, input.paxCount);
    }
  }

  const bookingCode = `MAN-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  const record: any = {
    bookingCode,
    status: "PAID",
    isManualEntry: true,
    paxCount: input.paxCount,
    customerName: input.customerName,
    totalAmount: input.totalAmount || 0,
    paymentMethod: input.paymentMethod,
    scheduleId: input.scheduleId,
    packageId: input.packageId,
    agentId: input.agentId,
  };

  if (db && typeof db.insertBooking === "function") {
    const inserted = await db.insertBooking(record);
    return {
      ...record,
      id: inserted?.id || record.bookingCode,
    };
  }

  return record;
}
