import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecentCashflowList } from "@/features/cashflow/components/recent-cashflow-list";
import { getSupplierCashflowEntries } from "@/features/cashflow/queries";
import { getSupplier } from "@/features/suppliers/queries";

type SupplierDetailPageProps = {
  params: Promise<{
    supplierId: string;
  }>;
};

export async function generateMetadata({ params }: SupplierDetailPageProps) {
  const { supplierId } = await params;
  const supplier = await getSupplier(supplierId);

  return {
    title: supplier.name,
  };
}

export default async function SupplierDetailPage({
  params,
}: SupplierDetailPageProps) {
  const { supplierId } = await params;
  const [supplier, recentEntries] = await Promise.all([
    getSupplier(supplierId),
    getSupplierCashflowEntries(supplierId),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm capitalize">
            {supplier.status}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">
            {supplier.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/app/suppliers">Back</Link>
          </Button>
          <Button asChild>
            <Link href={`/app/suppliers/${supplier.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier details</CardTitle>
          <CardDescription>
            Contact and tax information for this organization supplier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">Contact person</dt>
              <dd className="mt-1 font-medium">
                {supplier.contact_person ?? "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="mt-1 font-medium">
                {supplier.phone ?? "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="mt-1 font-medium">
                {supplier.email ?? "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">GST number</dt>
              <dd className="mt-1 font-medium">
                {supplier.gst_number ?? "Not set"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Address</dt>
              <dd className="mt-1 font-medium">
                {supplier.address ?? "Not set"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Notes</dt>
              <dd className="mt-1 font-medium">
                {supplier.notes ?? "Not set"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Recent supplier cashflow</CardTitle>
              <CardDescription>
                Latest cashflow records linked to this supplier.
              </CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href="/app/cashflow/new">Create entry</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <RecentCashflowList entries={recentEntries} />
        </CardContent>
      </Card>
    </div>
  );
}
