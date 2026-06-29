import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CashflowEntryForm } from "@/features/cashflow/components/cashflow-entry-form";
import { getCashflowEntry } from "@/features/cashflow/queries";
import { getParties } from "@/features/parties/queries";
import { getProjects } from "@/features/projects/queries";
import { getSuppliers } from "@/features/suppliers/queries";

type CashflowDetailPageProps = {
  params: Promise<{
    entryId: string;
  }>;
};

function formatLabel(value: string) {
  return value.replace("_", " ");
}

function formatMoney(value: number, type: string) {
  const formatted = new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);

  return type === "income" ? `+${formatted}` : `-${formatted}`;
}

export async function generateMetadata({ params }: CashflowDetailPageProps) {
  const { entryId } = await params;
  const entry = await getCashflowEntry(entryId);

  return {
    title: `${entry.category} - Cashflow`,
  };
}

export default async function CashflowDetailPage({
  params,
}: CashflowDetailPageProps) {
  const { entryId } = await params;
  const [entry, projects, parties, suppliers] = await Promise.all([
    getCashflowEntry(entryId),
    getProjects(),
    getParties(),
    getSuppliers(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm capitalize">
            {formatLabel(entry.entry_type)} · {entry.transaction_date}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">
            {entry.category}
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/app/cashflow">Back to cashflow</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entry information</CardTitle>
          <CardDescription>
            Full cashflow record with linked project, party, and supplier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">Amount</dt>
              <dd
                className={
                  entry.entry_type === "income"
                    ? "mt-1 font-medium text-emerald-600"
                    : "text-destructive mt-1 font-medium"
                }
              >
                {formatMoney(entry.amount, entry.entry_type)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="mt-1 font-medium capitalize">
                {formatLabel(entry.status)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Payment mode</dt>
              <dd className="mt-1 font-medium capitalize">
                {formatLabel(entry.payment_mode)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Reference</dt>
              <dd className="mt-1 font-medium">
                {entry.reference_number ?? "Not set"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Project</dt>
              <dd className="mt-1 font-medium">
                <Link
                  className="hover:underline"
                  href={`/app/projects/${entry.project.id}`}
                >
                  {entry.project.code} - {entry.project.name}
                </Link>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Party</dt>
              <dd className="mt-1 font-medium">
                {entry.party ? (
                  <Link
                    className="hover:underline"
                    href={`/app/parties/${entry.party.id}`}
                  >
                    {entry.party.name}
                  </Link>
                ) : (
                  "Not set"
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Supplier</dt>
              <dd className="mt-1 font-medium">
                {entry.supplier ? (
                  <Link
                    className="hover:underline"
                    href={`/app/suppliers/${entry.supplier.id}`}
                  >
                    {entry.supplier.name}
                  </Link>
                ) : (
                  "Not set"
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Description</dt>
              <dd className="mt-1 font-medium">
                {entry.description ?? "Not set"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Notes</dt>
              <dd className="mt-1 font-medium">{entry.notes ?? "Not set"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit entry</CardTitle>
          <CardDescription>
            Update this income or expense record without changing tenant scope.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CashflowEntryForm
            entry={entry}
            mode="edit"
            parties={parties}
            projects={projects}
            suppliers={suppliers}
          />
        </CardContent>
      </Card>
    </div>
  );
}
