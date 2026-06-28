import { z } from "zod";

export const projectStatusOptions = [
  "planned",
  "active",
  "on_hold",
  "completed",
  "cancelled",
] as const;

const projectCodePattern = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

const optionalText = (maxLength: number, message: string) =>
  z.string().trim().max(maxLength, message).nullable().optional();

const optionalDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format.")
  .nullable()
  .optional();

const optionalBudgetAmount = z
  .number()
  .min(0, "Budget amount cannot be negative.")
  .nullable()
  .optional();

export const projectFormSchema = z
  .object({
    budget_amount: optionalBudgetAmount,
    code: z
      .string()
      .trim()
      .min(1, "Project code is required.")
      .max(40, "Project code must be 40 characters or fewer.")
      .regex(
        projectCodePattern,
        "Use letters, numbers, underscores, or hyphens.",
      ),
    description: optionalText(
      2000,
      "Description must be 2000 characters or fewer.",
    ),
    end_date: optionalDate,
    location: optionalText(240, "Location must be 240 characters or fewer."),
    name: z
      .string()
      .trim()
      .min(2, "Project name must be at least 2 characters.")
      .max(160, "Project name must be 160 characters or fewer."),
    start_date: optionalDate,
    status: z.enum(projectStatusOptions),
  })
  .refine(
    (value) => {
      if (!value.start_date || !value.end_date) return true;

      return value.end_date >= value.start_date;
    },
    {
      message: "End date cannot be before start date.",
      path: ["end_date"],
    },
  );

export type ProjectFormInput = z.input<typeof projectFormSchema>;
export type ProjectInput = z.infer<typeof projectFormSchema>;

export function normalizeOptionalText(value: unknown) {
  if (value == null) return null;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeOptionalAmount(value: unknown) {
  if (value == null || value === "") return null;
  const amount = Number(value);

  return Number.isFinite(amount) ? amount : value;
}

export function normalizeProjectFormInput(values: ProjectFormInput) {
  return {
    budget_amount: normalizeOptionalAmount(values.budget_amount),
    code: values.code,
    description: normalizeOptionalText(values.description),
    end_date: normalizeOptionalText(values.end_date),
    location: normalizeOptionalText(values.location),
    name: values.name,
    start_date: normalizeOptionalText(values.start_date),
    status: values.status,
  };
}
