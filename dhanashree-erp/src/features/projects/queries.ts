import "server-only";

import { notFound } from "next/navigation";

import { requireCurrentOrganization } from "@/features/organizations/queries";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type Project = Tables<"projects">;

export async function getProjects(): Promise<Project[]> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("organization_id", currentOrganization.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getProject(projectId: string): Promise<Project> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
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
