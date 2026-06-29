"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentOrganization } from "@/features/organizations/queries";
import { createClient } from "@/lib/supabase/server";

import {
  normalizeSupplierFormInput,
  type SupplierFormInput,
  supplierFormSchema,
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

export async function createSupplier(
  data: SupplierFormInput,
): Promise<ActionResult> {
  const parsed = supplierFormSchema.safeParse(normalizeSupplierFormInput(data));

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

  const { data: supplier, error } = await supabase
    .from("suppliers")
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

  revalidatePath("/app/suppliers");

  return {
    id: supplier.id,
    message: "Supplier created.",
    success: true,
  };
}

export async function updateSupplier(
  supplierId: string,
  data: SupplierFormInput,
): Promise<ActionResult> {
  const parsed = supplierFormSchema.safeParse(normalizeSupplierFormInput(data));

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
      success: false,
    };
  }

  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();

  const { data: supplier, error } = await supabase
    .from("suppliers")
    .update(parsed.data)
    .eq("id", supplierId)
    .eq("organization_id", currentOrganization.id)
    .select("id")
    .single();

  if (error) {
    return {
      message: error.message,
      success: false,
    };
  }

  revalidatePath("/app/suppliers");
  revalidatePath(`/app/suppliers/${supplier.id}`);

  return {
    id: supplier.id,
    message: "Supplier updated.",
    success: true,
  };
}
