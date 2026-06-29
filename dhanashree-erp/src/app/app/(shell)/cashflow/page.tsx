import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CashflowEntryList } from "@/features/cashflow/components/cashflow-entry-list";
import { CashflowFilters } from "@/features/cashflow/components/cashflow-filters";
import { getCashflowEntries } from "@/features/cashflow/queries";
import { getProjects } from "@/features/projects/queries";

export const metadata = {
  title: "Cashflow",
};

type CashflowPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CashflowPage({
  searchParams,
}: CashflowPageProps) {
  const rawSearchParams = await searchParams;
  const filters = {
    dateFrom: firstValue(rawSearchParams.dateFrom),
    dateTo: firstValue(rawSearchParams.dateTo),
    entryType: firstValue(rawSearchParams.entryType),
    projectId: firstValue(rawSearchParams.projectId),
    search: firstValue(rawSearchParams.search),
    status: firstValue(rawSearchParams.status),
  };
  const [entries, projects] = await Promise.all([
    getCashflowEntries(filters),
    getProjects(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Cashflow</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Record every project income and expense for the active organization.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/cashflow/new">Create entry</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter entries by project, type, status, date range, or search text.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CashflowFilters filters={filters} projects={projects} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entries</CardTitle>
          <CardDescription>
            Pagination and sorting controls can be added to this table
            structure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CashflowEntryList entries={entries} />
        </CardContent>
      </Card>
    </div>
  );
}
