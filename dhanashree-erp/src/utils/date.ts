import { DEFAULT_LOCALE } from "@/config/constants";

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {},
): string {
  const value = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(value);
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
