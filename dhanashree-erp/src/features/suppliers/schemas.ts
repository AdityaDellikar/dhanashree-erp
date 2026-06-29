import { z } from "zod";

export const supplierStatusOptions = ["active", "inactive"] as const;

const GST_NUMBER_PATTERN =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const optionalText = (maxLength: number, message: string) =>
  z.string().trim().max(maxLength, message).nullable().optional();

const optionalEmail = z
  .string()
  .trim()
  .email("Enter a valid email address.")
  .nullable()
  .optional();

const optionalGstNumber = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .nullable()
  .optional()
  .refine((value) => value == null || GST_NUMBER_PATTERN.test(value), {
    message: "Enter a valid GST number.",
  });

export const supplierFormSchema = z.object({
  address: optionalText(1000, "Address must be 1000 characters or fewer."),
  contact_person: optionalText(
    160,
    "Contact person must be 160 characters or fewer.",
  ),
  email: optionalEmail,
  gst_number: optionalGstNumber,
  name: z
    .string()
    .trim()
    .min(2, "Supplier name must be at least 2 characters.")
    .max(160, "Supplier name must be 160 characters or fewer."),
  notes: optionalText(2000, "Notes must be 2000 characters or fewer."),
  phone: optionalText(32, "Phone must be 32 characters or fewer.").refine(
    (value) => value == null || value.length >= 7,
    "Phone must be at least 7 characters.",
  ),
  status: z.enum(supplierStatusOptions),
});

export const supplierFilterSchema = z.object({
  search: z.string().trim().max(120).optional(),
  status: z.enum(supplierStatusOptions).optional(),
});

export type SupplierFilterInput = z.infer<typeof supplierFilterSchema>;
export type SupplierFormInput = z.input<typeof supplierFormSchema>;
export type SupplierInput = z.infer<typeof supplierFormSchema>;

export function normalizeOptionalText(value: unknown) {
  if (value == null) return null;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeOptionalUuid(value: unknown) {
  return normalizeOptionalText(value);
}

export function normalizeSupplierFormInput(
  values: SupplierFormInput,
): SupplierInput {
  return {
    address: normalizeOptionalText(values.address),
    contact_person: normalizeOptionalText(values.contact_person),
    email: normalizeOptionalText(values.email),
    gst_number: normalizeOptionalText(values.gst_number),
    name: values.name,
    notes: normalizeOptionalText(values.notes),
    phone: normalizeOptionalText(values.phone),
    status: values.status,
  };
}
