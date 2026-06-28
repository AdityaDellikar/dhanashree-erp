"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentOrganization } from "@/features/organizations/queries";
import { createClient } from "@/lib/supabase/server";

import {
  normalizeProjectFormInput,
  type ProjectFormInput,
  projectFormSchema,
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

export async function createProject(
  data: ProjectFormInput,
): Promise<ActionResult> {
  const parsed = projectFormSchema.safeParse(normalizeProjectFormInput(data));

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

  const { data: project, error } = await supabase
    .from("projects")
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

  revalidatePath("/app/projects");

  return {
    id: project.id,
    message: "Project created.",
    success: true,
  };
}

export async function updateProject(
  projectId: string,
  data: ProjectFormInput,
): Promise<ActionResult> {
  const parsed = projectFormSchema.safeParse(normalizeProjectFormInput(data));

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
      success: false,
    };
  }

  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .update(parsed.data)
    .eq("id", projectId)
    .eq("organization_id", currentOrganization.id)
    .select("id")
    .single();

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  }

  revalidatePath("/app/projects");
  revalidatePath(`/app/projects/${project.id}`);

  return {
    id: project.id,
    message: "Project updated.",
    success: true,
  };
}
