import "server-only";

import { notFound } from "next/navigation";

import { requireCurrentOrganization } from "@/features/organizations/queries";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type Party = Tables<"parties">;

export async function getParties(): Promise<Party[]> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("parties")
    .select("*")
    .eq("organization_id", currentOrganization.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getParty(partyId: string): Promise<Party> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("parties")
    .select("*")
    .eq("id", partyId)
    .eq("organization_id", currentOrganization.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    notFound();
  }

  return data;
}
