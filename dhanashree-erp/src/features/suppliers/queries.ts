import "server-only";

import { notFound } from "next/navigation";

import { requireCurrentOrganization } from "@/features/organizations/queries";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

import {
  type SupplierFilterInput,
  supplierFilterSchema,
} from "./schemas";

export type Supplier = Tables<"suppliers">;

type RawSupplierFilters = Partial<Record<keyof SupplierFilterInput, string>>;

function cleanFilters(filters?: RawSupplierFilters) {
  const parsed = supplierFilterSchema.safeParse(filters ?? {});

  return parsed.success ? parsed.data : {};
}

export async function getSuppliers(
  filters?: RawSupplierFilters,
): Promise<Supplier[]> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();
  const safeFilters = cleanFilters(filters);

  let query = supabase
    .from("suppliers")
    .select("*")
    .eq("organization_id", currentOrganization.id)
    .order("created_at", { ascending: false });

  if (safeFilters.status) {
    query = query.eq("status", safeFilters.status);
  }

  if (safeFilters.search) {
    const pattern = `%${safeFilters.search}%`;
    query = query.or(
      `name.ilike.${pattern},contact_person.ilike.${pattern},phone.ilike.${pattern},email.ilike.${pattern},gst_number.ilike.${pattern}`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getSupplier(supplierId: string): Promise<Supplier> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", supplierId)
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
