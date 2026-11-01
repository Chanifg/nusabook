"use client";

import { MaterialIcon } from "@/components/ui/icon";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0D47A1] hover:bg-[#0A3880] text-white text-xs font-semibold transition-colors shadow-xs"
      title="Cetak Manifes langsung menggunakan dialog print browser"
    >
      <MaterialIcon name="print" className="text-base" />
      <span>Cetak Halaman</span>
    </button>
  );
}

export default PrintButton;
