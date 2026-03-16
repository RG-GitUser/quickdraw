"use client";

import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  endsAt: string;
  size?: "sm" | "md";
}

export default function CountdownTimer({ endsAt, size = "md" }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isUrgent, isExpired } = useCountdown(endsAt);

  if (isExpired) {
    return (
      <span className={`inline-flex items-center rounded-full bg-bg-card px-2 py-0.5 font-mono text-text-secondary ${size === "sm" ? "text-xs" : "text-sm"}`}>
        Ended
      </span>
    );
  }

  const segments: { value: number; label: string }[] = [];
  if (days > 0) segments.push({ value: days, label: "d" });
  if (days > 0 || hours > 0) segments.push({ value: hours, label: "h" });
  segments.push({ value: minutes, label: "m" });
  if (days === 0) segments.push({ value: seconds, label: "s" });

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-mono ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      } ${
        isUrgent
          ? "bg-accent-red/20 text-accent-red countdown-pulse"
          : "bg-bg-card text-text-primary"
      }`}
    >
      {segments.map((s) => (
        <span key={s.label}>
          {String(s.value).padStart(2, "0")}
          <span className="text-text-secondary">{s.label}</span>
        </span>
      ))}
    </span>
  );
}
