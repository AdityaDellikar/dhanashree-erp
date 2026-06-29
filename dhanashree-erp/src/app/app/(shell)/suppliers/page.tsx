import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SupplierFilters } from "@/features/suppliers/components/supplier-filters";
import { SupplierList } from "@/features/suppliers/components/supplier-list";
import { getSuppliers } from "@/features/suppliers/queries";

export const metadata = {
  title: "Suppliers",
};

type SuppliersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SuppliersPage({
  searchParams,
}: SuppliersPageProps) {
  const rawSearchParams = await searchParams;
  const filters = {
    search: firstValue(rawSearchParams.search),
    status: firstValue(rawSearchParams.status),
  };
  const suppliers = await getSuppliers(filters);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Suppliers</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Manage procurement contacts and link supplier expenses to cashflow.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/suppliers/new">Create supplier</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter suppliers by status or search across contact fields.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierFilters filters={filters} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supplier list</CardTitle>
          <CardDescription>
            Only suppliers from the active organization are shown.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierList suppliers={suppliers} />
        </CardContent>
      </Card>
    </div>
  );
}
