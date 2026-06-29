import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CashflowEntryForm } from "@/features/cashflow/components/cashflow-entry-form";
import { getParties } from "@/features/parties/queries";
import { getProjects } from "@/features/projects/queries";
import { getSuppliers } from "@/features/suppliers/queries";

export const metadata = {
  title: "New Cashflow Entry",
};

export default async function NewCashflowEntryPage() {
  const [projects, parties, suppliers] = await Promise.all([
    getProjects(),
    getParties(),
    getSuppliers(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">
            New cashflow entry
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Add income or expense against a project.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/app/cashflow">Back to cashflow</Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          action={
            <Button asChild>
              <Link href="/app/projects">Create project</Link>
            </Button>
          }
          description="A cashflow entry must belong to a project. Create a project first."
          title="Project required"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Entry details</CardTitle>
            <CardDescription>
              All entries are scoped to the active organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CashflowEntryForm
              mode="create"
              parties={parties}
              projects={projects}
              suppliers={suppliers}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
