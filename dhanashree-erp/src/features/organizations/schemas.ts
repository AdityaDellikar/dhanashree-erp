import { z } from "zod";

const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export const currencyOptions = ["INR", "USD", "EUR", "GBP", "AED"] as const;

export const timezoneOptions = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "UTC",
  "Europe/London",
  "America/New_York",
] as const;

export const organizationRoleOptions = [
  "admin",
  "manager",
  "staff",
  "viewer",
] as const;

const optionalUppercaseIdentifier = (pattern: RegExp, message: string) =>
  z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .nullable()
    .optional()
    .refine((value) => value == null || pattern.test(value), message);

const optionalLogoUrl = z
  .string()
  .trim()
  .max(500, "Logo URL must be 500 characters or fewer.")
  .nullable()
  .optional()
  .refine((value) => value == null || z.url().safeParse(value).success, {
    message: "Enter a valid logo URL.",
  });

export const organizationBaseSchema = z.object({
  currency: z.enum(currencyOptions),
  gstin: optionalUppercaseIdentifier(GSTIN_PATTERN, "Enter a valid GSTIN."),
  logo_url: optionalLogoUrl,
  name: z
    .string()
    .trim()
    .min(2, "Organization name must be at least 2 characters.")
    .max(120, "Organization name must be 120 characters or fewer."),
  pan: optionalUppercaseIdentifier(PAN_PATTERN, "Enter a valid PAN."),
  timezone: z.enum(timezoneOptions),
});

export const createOrganizationSchema = organizationBaseSchema;

export const updateOrganizationSchema = organizationBaseSchema;

export const setCurrentOrganizationSchema = z.object({
  organizationId: z.string().uuid("Select a valid organization."),
});

export const inviteMemberSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  role: z.enum(organizationRoleOptions),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type CreateOrganizationFormInput = z.input<
  typeof createOrganizationSchema
>;
export type InviteMemberFormInput = z.input<typeof inviteMemberSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type SetCurrentOrganizationInput = z.infer<
  typeof setCurrentOrganizationSchema
>;
export type UpdateOrganizationFormInput = z.input<
  typeof updateOrganizationSchema
>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

export function normalizeOptionalOrganizationText(value: unknown) {
  if (value == null) return null;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeOrganizationFormInput(
  values: CreateOrganizationFormInput,
): CreateOrganizationInput {
  return {
    currency: values.currency,
    gstin: normalizeOptionalOrganizationText(values.gstin),
    logo_url: normalizeOptionalOrganizationText(values.logo_url),
    name: values.name,
    pan: normalizeOptionalOrganizationText(values.pan),
    timezone: values.timezone,
  };
}
