import { Metadata } from "next";
import { EscrowView } from "@/components/dashboard/escrow-view";

export const metadata: Metadata = {
  title: "Keuangan & Escrow Vault - Nusabook Operator",
  description: "Pengelolaan rekening bersama, saldo siap cair, dan mutasi penarikan dana payout mitra agen.",
};

export default function EscrowPage() {
  return <EscrowView businessName="Pesona Merapi Tour & Travel" />;
}

