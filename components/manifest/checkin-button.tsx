"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/icon";

interface CheckinButtonProps {
  passengerId: string;
  initialChecked: boolean;
  initialTime: string | null;
  onToggle?: (checked: boolean, time: string | null) => void;
}

export function CheckinButton({
  passengerId,
  initialChecked,
  initialTime,
  onToggle,
}: CheckinButtonProps) {
  const [isChecked, setIsChecked] = useState(initialChecked);
  const [checkedTime, setCheckedTime] = useState<string | null>(initialTime);
  const [isLoading, setIsLoading] = useState(false);

  const formatShortTime = (isoString: string | null) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const handleToggle = async () => {
    if (isLoading) return;

    const previousChecked = isChecked;
    const previousTime = checkedTime;
    const nextChecked = !isChecked;
    const nextTime = nextChecked ? new Date().toISOString() : null;

    // Optimistic UI Update
    setIsChecked(nextChecked);
    setCheckedTime(nextTime);
    setIsLoading(true);

    try {
      const response = await fetch("/api/manifest/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passengerId,
          isCheckedIn: nextChecked,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal memperbarui status presensi");
      }

      const result = await response.json();
      const confirmedTime = result.passenger?.checked_in_at || nextTime;
      setCheckedTime(confirmedTime);
      if (onToggle) {
        onToggle(nextChecked, confirmedTime);
      }
    } catch (err) {
      console.error("Kesalahan update presensi:", err);
      // Rollback jika request gagal
      setIsChecked(previousChecked);
      setCheckedTime(previousTime);
      if (onToggle) {
        onToggle(previousChecked, previousTime);
      }
      alert("Gagal memperbarui status presensi. Silakan periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isChecked ? "Tandai belum hadir" : "Tandai sudah hadir"}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
        isChecked
          ? "bg-surface-container-high text-primary hover:bg-surface-container-highest"
          : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
      }`}
    >
      {isLoading ? (
        <span className="animate-spin text-sm">⌛</span>
      ) : isChecked ? (
        <MaterialIcon name="check_circle" className="text-sm text-primary" />
      ) : (
        <MaterialIcon name="radio_button_unchecked" className="text-sm text-outline" />
      )}
      <span>{isChecked ? "Hadir" : "Belum Check-in"}</span>
      {isChecked && checkedTime && (
        <span className="font-mono text-[10px] text-on-surface-variant">
          ({formatShortTime(checkedTime)})
        </span>
      )}
    </button>
  );
}
