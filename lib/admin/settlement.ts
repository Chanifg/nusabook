export interface SettlementResult {
  grossAmount: number;
  platformFee: number;
  netPayout: number;
}

export function calculateSettlement(grossAmount: number): SettlementResult {
  if (grossAmount < 0) {
    throw new Error("Gross amount tidak boleh negatif");
  }
  // Fee platform 2%, transfer bersih mitra 98%
  const platformFee = Math.round(grossAmount * 0.02);
  const netPayout = grossAmount - platformFee;
  return { grossAmount, platformFee, netPayout };
}
