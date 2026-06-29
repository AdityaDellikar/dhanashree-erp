"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentOrganization } from "@/features/organizations/queries";
import { createClient } from "@/lib/supabase/server";

import {
  type CashflowEntryFormInput,
  cashflowEntryFormSchema,
  normalizeCashflowEntryFormInput,
} from "./schemas";

type ActionResult = {
  errors?: Record<string, string[] | undefined>;
  id?: string;
  message: string;
  success: boolean;
};

async function requireAuthenticatedUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication is required.");
  }

  return user.id;
}

async function validateProjectAndParty(
  organizationId: string,
  projectId: string,
  partyId: string | null | undefined,
) {
  const supabase = await createClient();
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (projectError) {
    throw new Error(projectError.message);
  }

  if (!project) {
    return "Selected project does not belong to the active organization.";
  }

  if (!partyId) {
    return null;
  }

  const { data: party, error: partyError } = await supabase
    .from("parties")
    .select("id")
    .eq("id", partyId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (partyError) {
    throw new Error(partyError.message);
  }

  if (!party) {
    return "Selected party does not belong to the active organization.";
  }

  return null;
}

export async function createCashflowEntry(
  data: CashflowEntryFormInput,
): Promise<ActionResult> {
  const parsed = cashflowEntryFormSchema.safeParse(
    normalizeCashflowEntryFormInput(data),
  );

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
      success: false,
    };
  }

  const [currentOrganization, userId] = await Promise.all([
    requireCurrentOrganization(),
    requireAuthenticatedUserId(),
  ]);
  const validationError = await validateProjectAndParty(
    currentOrganization.id,
    parsed.data.project_id,
    parsed.data.party_id,
  );

  if (validationError) {
    return {
      message: validationError,
      success: false,
    };
  }

  const supabase = await createClient();
  const { data: entry, error } = await supabase
    .from("cashflow_entries")
    .insert({
      ...parsed.data,
      created_by: userId,
      organization_id: currentOrganization.id,
    })
    .select("id")
    .single();

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  }

  revalidatePath("/app/cashflow");
  revalidatePath("/app/dashboard");
  revalidatePath(`/app/projects/${parsed.data.project_id}`);

  if (parsed.data.party_id) {
    revalidatePath(`/app/parties/${parsed.data.party_id}`);
  }

  return {
    id: entry.id,
    message: "Cashflow entry created.",
    success: true,
  };
}

export async function updateCashflowEntry(
  entryId: string,
  data: CashflowEntryFormInput,
): Promise<ActionResult> {
  const parsed = cashflowEntryFormSchema.safeParse(
    normalizeCashflowEntryFormInput(data),
  );

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
      success: false,
    };
  }

  const currentOrganization = await requireCurrentOrganization();
  const validationError = await validateProjectAndParty(
    currentOrganization.id,
    parsed.data.project_id,
    parsed.data.party_id,
  );

  if (validationError) {
    return {
      message: validationError,
      success: false,
    };
  }

  const supabase = await createClient();
  const { data: entry, error } = await supabase
    .from("cashflow_entries")
    .update(parsed.data)
    .eq("id", entryId)
    .eq("organization_id", currentOrganization.id)
    .select("id")
    .single();

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  }

  revalidatePath("/app/cashflow");
  revalidatePath(`/app/cashflow/${entry.id}`);
  revalidatePath("/app/dashboard");
  revalidatePath(`/app/projects/${parsed.data.project_id}`);

  if (parsed.data.party_id) {
    revalidatePath(`/app/parties/${parsed.data.party_id}`);
  }

  return {
    id: entry.id,
    message: "Cashflow entry updated.",
    success: true,
  };
}
