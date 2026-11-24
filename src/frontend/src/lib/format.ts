/** Motoko `Time.now()` values are nanosecond bigints. Convert before any Date use. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

const timeFormatter = new Intl.DateTimeFormat("en-AU", {
  hour: "numeric",
  minute: "2-digit",
});

const dayFormatter = new Intl.DateTimeFormat("en-AU", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const fullFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatTime(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  return date ? timeFormatter.format(date) : "—";
}

export function formatDay(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  return date ? dayFormatter.format(date) : "—";
}

export function formatDate(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  return date ? fullFormatter.format(date) : "—";
}

/** Day bucket key used to group chat messages by calendar day. */
export function dayKey(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "unknown";
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function relativeDayLabel(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "Earlier";
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
  const diffDays = Math.round((startOfToday - startOfDay) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return dayFormatter.format(date);
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function firstName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "Member";
  return trimmed.split(/\s+/)[0];
}
