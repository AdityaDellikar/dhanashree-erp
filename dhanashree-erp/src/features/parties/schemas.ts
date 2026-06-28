import { z } from "zod";

export const partyTypeOptions = [
  "supplier",
  "customer",
  "subcontractor",
  "other",
] as const;

const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const optionalText = (maxLength: number, message: string) =>
  z.string().trim().max(maxLength, message).nullable().optional();

const optionalEmail = z
  .string()
  .trim()
  .email("Enter a valid email address.")
  .nullable()
  .optional();

const optionalGstin = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .nullable()
  .optional()
  .refine((value) => value == null || GSTIN_PATTERN.test(value), {
    message: "Enter a valid GSTIN.",
  });

export const partyFormSchema = z.object({
  address: optionalText(1000, "Address must be 1000 characters or fewer."),
  contact_person: optionalText(
    160,
    "Contact person must be 160 characters or fewer.",
  ),
  email: optionalEmail,
  gstin: optionalGstin,
  name: z
    .string()
    .trim()
    .min(2, "Party name must be at least 2 characters.")
    .max(160, "Party name must be 160 characters or fewer."),
  notes: optionalText(2000, "Notes must be 2000 characters or fewer."),
  phone: optionalText(32, "Phone must be 32 characters or fewer.").refine(
    (value) => value == null || value.length >= 7,
    "Phone must be at least 7 characters.",
  ),
  type: z.enum(partyTypeOptions),
});

export type PartyFormInput = z.input<typeof partyFormSchema>;
export type PartyInput = z.infer<typeof partyFormSchema>;

export function normalizeOptionalText(value: unknown) {
  if (value == null) return null;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export function normalizePartyFormInput(values: PartyFormInput): PartyInput {
  return {
    address: normalizeOptionalText(values.address),
    contact_person: normalizeOptionalText(values.contact_person),
    email: normalizeOptionalText(values.email),
    gstin: normalizeOptionalText(values.gstin),
    name: values.name,
    notes: normalizeOptionalText(values.notes),
    phone: normalizeOptionalText(values.phone),
    type: values.type,
  };
}
