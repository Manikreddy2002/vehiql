import React from "react";

export function Progress({ value = 0, className = "", durationMs = 1500, barClassName = "bg-green-600" }) {
  const percent = Math.max(0, Math.min(100, Number(value)));
  return (
    <div className={`relative w-full h-2.5 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`${barClassName} h-2.5 rounded-full`}
        style={{ width: `${percent}%`, transition: `width ${durationMs}ms ease` }}
      />
    </div>
  );
}