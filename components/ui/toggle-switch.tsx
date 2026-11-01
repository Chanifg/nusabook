"use client";

import React from "react";

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  label,
  size = "md",
  ariaLabel,
}: ToggleSwitchProps) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const sizeClasses = {
    sm: {
      track: "w-8 h-4",
      knob: "w-3 h-3",
      translate: "translate-x-4",
    },
    md: {
      track: "w-11 h-6",
      knob: "w-4 h-4",
      translate: "translate-x-5",
    },
    lg: {
      track: "w-14 h-7",
      knob: "w-5 h-5",
      translate: "translate-x-7",
    },
  }[size];

  return (
    <div className="inline-flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label || "Toggle status verifikasi"}
        disabled={disabled}
        onClick={handleToggle}
        className={`relative inline-flex shrink-0 ${sizeClasses.track} rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0D47A1]/30 focus:ring-offset-1 select-none ${
          disabled
            ? "bg-slate-200 opacity-60 cursor-not-allowed"
            : checked
            ? "bg-emerald-600 hover:bg-emerald-700 shadow-xs"
            : "bg-slate-300 hover:bg-slate-400"
        }`}
      >
        <span
          className={`pointer-events-none inline-block ${
            sizeClasses.knob
          } transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out self-center ml-1 ${
            checked ? sizeClasses.translate : "translate-x-0"
          }`}
        />
      </button>
      {label && <span className="text-xs font-medium text-slate-700 select-none">{label}</span>}
    </div>
  );
}

export default ToggleSwitch;
