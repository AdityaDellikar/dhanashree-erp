"use server";

import { randomBytes } from "node:crypto";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  CURRENT_ORGANIZATION_COOKIE,
  currentOrganizationCookieOptions,
} from "@/lib/organizations/cookies";
import { createClient } from "@/lib/supabase/server";

import {
  currentUserCanManageOrganization,
  getUserOrganizations,
  requireCurrentOrganization,
} from "./queries";
import {
  type CreateOrganizationFormInput,
  type CreateOrganizationInput,
  createOrganizationSchema,
  type InviteMemberInput,
  inviteMemberSchema,
  normalizeOrganizationFormInput,
  type SetCurrentOrganizationInput,
  setCurrentOrganizationSchema,
  type UpdateOrganizationFormInput,
  updateOrganizationSchema,
} from "./schemas";

type ActionResult = {
  errors?: Record<string, string[] | undefined>;
  message: string;
  success: boolean;
};

function createSlug(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `organization-${Date.now()}`;
}

function normalizeOrganizationInput(values: CreateOrganizationInput) {
  return {
    ...values,
    gstin: values.gstin?.toUpperCase() ?? null,
    logo_url: values.logo_url ?? null,
    pan: values.pan?.toUpperCase() ?? null,
  };
}

export async function createOrganization(
  data: CreateOrganizationFormInput,
): Promise<ActionResult> {
  const parsed = createOrganizationSchema.safeParse(
    normalizeOrganizationFormInput(data),
  );

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
      success: false,
    };
  }

  const values = normalizeOrganizationInput(parsed.data);
  const supabase = await createClient();

  const { data: organization, error } = await supabase.rpc(
    "create_organization",
    {
      organization_currency: values.currency,
      organization_gstin: values.gstin,
      organization_logo_url: values.logo_url,
      organization_name: values.name,
      organization_pan: values.pan,
      organization_slug: createSlug(values.name),
      organization_timezone: values.timezone,
    },
  );

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    CURRENT_ORGANIZATION_COOKIE,
    organization.id,
    currentOrganizationCookieOptions,
  );

  revalidatePath("/app");

  return {
    message: "Organization created successfully.",
    success: true,
  };
}

export async function setCurrentOrganization(
  data: SetCurrentOrganizationInput,
): Promise<ActionResult> {
  const parsed = setCurrentOrganizationSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Select a valid organization.",
      success: false,
    };
  }

  const organizations = await getUserOrganizations();
  const organization = organizations.find(
    (item) => item.id === parsed.data.organizationId,
  );

  if (!organization) {
    return {
      message: "You do not have access to that organization.",
      success: false,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    CURRENT_ORGANIZATION_COOKIE,
    organization.id,
    currentOrganizationCookieOptions,
  );

  revalidatePath("/app");

  return {
    message: `Switched to ${organization.name}.`,
    success: true,
  };
}

export async function updateOrganization(
  data: UpdateOrganizationFormInput,
): Promise<ActionResult> {
  const parsed = updateOrganizationSchema.safeParse(
    normalizeOrganizationFormInput(data),
  );

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
      success: false,
    };
  }

  const currentOrganization = await requireCurrentOrganization();
  const canManage = await currentUserCanManageOrganization(
    currentOrganization.id,
  );

  if (!canManage) {
    return {
      message: "Only organization owners and admins can update settings.",
      success: false,
    };
  }

  const values = normalizeOrganizationInput(parsed.data);
  const supabase = await createClient();
  const { error } = await supabase
    .from("organizations")
    .update({
      currency: values.currency,
      gstin: values.gstin,
      logo_url: values.logo_url,
      name: values.name,
      pan: values.pan,
      timezone: values.timezone,
    })
    .eq("id", currentOrganization.id);

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  }

  revalidatePath("/app/settings/organization");

  return {
    message: "Organization settings updated.",
    success: true,
  };
}

export async function inviteMember(
  data: InviteMemberInput,
): Promise<ActionResult> {
  const parsed = inviteMemberSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
      success: false,
    };
  }

  const currentOrganization = await requireCurrentOrganization();
  const canManage = await currentUserCanManageOrganization(
    currentOrganization.id,
  );

  if (!canManage) {
    return {
      message: "Only organization owners and admins can invite members.",
      success: false,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "Authentication is required.",
      success: false,
    };
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error } = await supabase.from("organization_invitations").insert({
    created_by: user.id,
    email: parsed.data.email.toLowerCase(),
    expires_at: expiresAt.toISOString(),
    organization_id: currentOrganization.id,
    role: parsed.data.role,
    token: randomBytes(32).toString("hex"),
  });

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  }

  revalidatePath("/app/settings/members");

  return {
    message: "Invitation saved.",
    success: true,
  };
}
