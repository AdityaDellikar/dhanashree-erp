import { z } from "zod";

export const cashflowEntryTypeOptions = ["income", "expense"] as const;
export const cashflowStatusOptions = [
  "pending",
  "completed",
  "cancelled",
] as const;
export const paymentModeOptions = [
  "cash",
  "bank",
  "upi",
  "cheque",
  "other",
] as const;

export const cashflowCategoryOptions = [
  "Material",
  "Labor",
  "Equipment",
  "Fuel",
  "Transport",
  "Vendor Payment",
  "Client Payment",
  "Miscellaneous",
] as const;

const optionalText = (maxLength: number, message: string) =>
  z.string().trim().max(maxLength, message).nullable().optional();

export const cashflowEntryFormSchema = z.object({
  amount: z.number().positive("Amount must be greater than zero."),
  category: z
    .string()
    .trim()
    .min(2, "Category is required.")
    .max(120, "Category must be 120 characters or fewer."),
  description: optionalText(
    1000,
    "Description must be 1000 characters or fewer.",
  ),
  entry_type: z.enum(cashflowEntryTypeOptions),
  notes: optionalText(2000, "Notes must be 2000 characters or fewer."),
  party_id: z.string().uuid("Select a valid party.").nullable().optional(),
  payment_mode: z.enum(paymentModeOptions),
  project_id: z.string().uuid("Select a valid project."),
  reference_number: optionalText(
    120,
    "Reference number must be 120 characters or fewer.",
  ),
  status: z.enum(cashflowStatusOptions),
  supplier_id: z.string().uuid("Select a valid supplier.").nullable().optional(),
  transaction_date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format."),
});

export const cashflowEntryFilterSchema = z.object({
  dateFrom: z.string().trim().optional(),
  dateTo: z.string().trim().optional(),
  entryType: z.enum(cashflowEntryTypeOptions).optional(),
  projectId: z.string().uuid().optional(),
  search: z.string().trim().max(120).optional(),
  status: z.enum(cashflowStatusOptions).optional(),
});

export type CashflowEntryFilterInput = z.infer<
  typeof cashflowEntryFilterSchema
>;
export type CashflowEntryFormInput = z.input<typeof cashflowEntryFormSchema>;
export type CashflowEntryInput = z.infer<typeof cashflowEntryFormSchema>;

export function normalizeOptionalText(value: unknown) {
  if (value == null) return null;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeOptionalUuid(value: unknown) {
  return normalizeOptionalText(value);
}

export function normalizeAmount(value: unknown) {
  if (value == null || value === "") return value;
  const amount = Number(value);

  return Number.isFinite(amount) ? amount : value;
}

export function normalizeCashflowEntryFormInput(
  values: CashflowEntryFormInput,
) {
  return {
    amount: normalizeAmount(values.amount),
    category: values.category,
    description: normalizeOptionalText(values.description),
    entry_type: values.entry_type,
    notes: normalizeOptionalText(values.notes),
    party_id: normalizeOptionalUuid(values.party_id),
    payment_mode: values.payment_mode,
    project_id: values.project_id,
    reference_number: normalizeOptionalText(values.reference_number),
    status: values.status,
    supplier_id: normalizeOptionalUuid(values.supplier_id),
    transaction_date: values.transaction_date,
  };
}
