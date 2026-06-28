"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentOrganization } from "@/features/organizations/queries";
import { createClient } from "@/lib/supabase/server";

import {
  normalizePartyFormInput,
  type PartyFormInput,
  partyFormSchema,
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

export async function createParty(data: PartyFormInput): Promise<ActionResult> {
  const parsed = partyFormSchema.safeParse(normalizePartyFormInput(data));

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
  const supabase = await createClient();

  const { data: party, error } = await supabase
    .from("parties")
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

  revalidatePath("/app/parties");

  return {
    id: party.id,
    message: "Party created.",
    success: true,
  };
}

export async function updateParty(
  partyId: string,
  data: PartyFormInput,
): Promise<ActionResult> {
  const parsed = partyFormSchema.safeParse(normalizePartyFormInput(data));

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
      success: false,
    };
  }

  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();

  const { data: party, error } = await supabase
    .from("parties")
    .update(parsed.data)
    .eq("id", partyId)
    .eq("organization_id", currentOrganization.id)
    .select("id")
    .single();

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  }

  revalidatePath("/app/parties");
  revalidatePath(`/app/parties/${party.id}`);

  return {
    id: party.id,
    message: "Party updated.",
    success: true,
  };
}
