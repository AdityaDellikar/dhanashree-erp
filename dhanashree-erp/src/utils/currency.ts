import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "@/config/constants";

export function formatCurrency(
  amount: number,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    currency: DEFAULT_CURRENCY,
    maximumFractionDigits: 2,
    style: "currency",
    ...options,
  }).format(amount);
}
