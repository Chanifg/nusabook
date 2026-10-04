import React from "react";

interface MaterialIconProps {
  name: string;
  className?: string;
}

export function MaterialIcon({ name, className = "" }: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none inline-block align-middle leading-none ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
