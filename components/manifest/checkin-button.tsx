"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

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
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 border ${
        isChecked
          ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700"
          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700"
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
      ) : isChecked ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      ) : (
        <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      )}
      <span>
        {isChecked
          ? `Hadir${checkedTime ? ` • ${formatShortTime(checkedTime)}` : ""}`
          : "Tandai Hadir"}
      </span>
    </button>
  );
}
