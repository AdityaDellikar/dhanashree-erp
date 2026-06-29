import "server-only";

import { notFound } from "next/navigation";

import { requireCurrentOrganization } from "@/features/organizations/queries";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

import {
  type CashflowEntryFilterInput,
  cashflowEntryFilterSchema,
} from "./schemas";

export type CashflowEntry = Tables<"cashflow_entries">;
export type CashflowEntryWithRelations = CashflowEntry & {
  party: Pick<Tables<"parties">, "id" | "name" | "type"> | null;
  project: Pick<Tables<"projects">, "code" | "id" | "name">;
  supplier: Pick<Tables<"suppliers">, "id" | "name" | "status"> | null;
};

export type CashflowSummary = {
  netCashflow: number;
  totalExpense: number;
  totalIncome: number;
  totalProjects: number;
};

export type CashflowByProject = {
  expense: number;
  income: number;
  net: number;
  projectCode: string;
  projectId: string;
  projectName: string;
};

type RawCashflowFilters = Partial<
  Record<keyof CashflowEntryFilterInput, string>
>;

function cleanFilters(filters?: RawCashflowFilters) {
  const parsed = cashflowEntryFilterSchema.safeParse(filters ?? {});

  return parsed.success ? parsed.data : {};
}

export async function getCashflowEntries(
  filters?: RawCashflowFilters,
): Promise<CashflowEntryWithRelations[]> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();
  const safeFilters = cleanFilters(filters);

  let query = supabase
    .from("cashflow_entries")
    .select(
      "*, project:projects(id, name, code), party:parties(id, name, type), supplier:suppliers(id, name, status)",
    )
    .eq("organization_id", currentOrganization.id)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (safeFilters.projectId) {
    query = query.eq("project_id", safeFilters.projectId);
  }

  if (safeFilters.entryType) {
    query = query.eq("entry_type", safeFilters.entryType);
  }

  if (safeFilters.status) {
    query = query.eq("status", safeFilters.status);
  }

  if (safeFilters.dateFrom) {
    query = query.gte("transaction_date", safeFilters.dateFrom);
  }

  if (safeFilters.dateTo) {
    query = query.lte("transaction_date", safeFilters.dateTo);
  }

  if (safeFilters.search) {
    const pattern = `%${safeFilters.search}%`;
    query = query.or(
      `category.ilike.${pattern},description.ilike.${pattern},reference_number.ilike.${pattern},notes.ilike.${pattern}`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CashflowEntryWithRelations[];
}

export async function getCashflowEntry(
  entryId: string,
): Promise<CashflowEntryWithRelations> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cashflow_entries")
    .select(
      "*, project:projects(id, name, code), party:parties(id, name, type), supplier:suppliers(id, name, status)",
    )
    .eq("id", entryId)
    .eq("organization_id", currentOrganization.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    notFound();
  }

  return data as CashflowEntryWithRelations;
}

export async function getLatestCashflowEntries(
  limit = 5,
): Promise<CashflowEntryWithRelations[]> {
  const entries = await getCashflowEntries();

  return entries.slice(0, limit);
}

export async function getProjectCashflowEntries(
  projectId: string,
  limit = 5,
): Promise<CashflowEntryWithRelations[]> {
  const entries = await getCashflowEntries({ projectId });

  return entries.slice(0, limit);
}

export async function getPartyCashflowEntries(
  partyId: string,
  limit = 5,
): Promise<CashflowEntryWithRelations[]> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cashflow_entries")
    .select(
      "*, project:projects(id, name, code), party:parties(id, name, type), supplier:suppliers(id, name, status)",
    )
    .eq("organization_id", currentOrganization.id)
    .eq("party_id", partyId)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CashflowEntryWithRelations[];
}

export async function getSupplierCashflowEntries(
  supplierId: string,
  limit = 5,
): Promise<CashflowEntryWithRelations[]> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cashflow_entries")
    .select(
      "*, project:projects(id, name, code), party:parties(id, name, type), supplier:suppliers(id, name, status)",
    )
    .eq("organization_id", currentOrganization.id)
    .eq("supplier_id", supplierId)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CashflowEntryWithRelations[];
}

export async function getCashflowSummary(): Promise<CashflowSummary> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();
  const [cashflowResponse, projectsResponse] = await Promise.all([
    supabase
      .from("cashflow_entries")
      .select("amount, entry_type, status")
      .eq("organization_id", currentOrganization.id)
      .neq("status", "cancelled"),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", currentOrganization.id),
  ]);

  if (cashflowResponse.error) {
    throw new Error(cashflowResponse.error.message);
  }

  if (projectsResponse.error) {
    throw new Error(projectsResponse.error.message);
  }

  const totals = (cashflowResponse.data ?? []).reduce(
    (summary, entry) => {
      if (entry.entry_type === "income") {
        summary.totalIncome += entry.amount;
      } else {
        summary.totalExpense += entry.amount;
      }

      return summary;
    },
    { totalExpense: 0, totalIncome: 0 },
  );

  return {
    netCashflow: totals.totalIncome - totals.totalExpense,
    totalExpense: totals.totalExpense,
    totalIncome: totals.totalIncome,
    totalProjects: projectsResponse.count ?? 0,
  };
}

export async function getCashflowByProject(): Promise<CashflowByProject[]> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cashflow_entries")
    .select("amount, entry_type, status, project:projects(id, name, code)")
    .eq("organization_id", currentOrganization.id)
    .neq("status", "cancelled");

  if (error) {
    throw new Error(error.message);
  }

  const projects = new Map<string, CashflowByProject>();

  for (const entry of data ?? []) {
    const project = Array.isArray(entry.project)
      ? entry.project[0]
      : entry.project;

    if (!project) continue;

    const existing =
      projects.get(project.id) ??
      ({
        expense: 0,
        income: 0,
        net: 0,
        projectCode: project.code,
        projectId: project.id,
        projectName: project.name,
      } satisfies CashflowByProject);

    if (entry.entry_type === "income") {
      existing.income += entry.amount;
    } else {
      existing.expense += entry.amount;
    }

    existing.net = existing.income - existing.expense;
    projects.set(project.id, existing);
  }

  return Array.from(projects.values()).sort((a, b) =>
    a.projectName.localeCompare(b.projectName),
  );
}
