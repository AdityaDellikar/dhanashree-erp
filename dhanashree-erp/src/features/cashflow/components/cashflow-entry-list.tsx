import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import type { CashflowEntryWithRelations } from "@/features/cashflow/queries";

type CashflowEntryListProps = {
  entries: CashflowEntryWithRelations[];
};

function formatMoney(value: number, type: string) {
  const formatted = new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);

  return type === "income" ? `+${formatted}` : `-${formatted}`;
}

function formatLabel(value: string) {
  return value.replace("_", " ");
}

export function CashflowEntryList({ entries }: CashflowEntryListProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        description="Record income or expenses against projects to build the cashflow ledger."
        title="No cashflow entries found"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="bg-muted/40 grid grid-cols-2 gap-3 px-4 py-3 text-xs font-medium lg:grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.7fr_0.8fr_auto]">
        <span>Entry</span>
        <span className="hidden lg:block">Project</span>
        <span className="hidden lg:block">Party</span>
        <span className="hidden lg:block">Supplier</span>
        <span className="hidden lg:block">Status</span>
        <span className="hidden lg:block">Amount</span>
        <span className="text-right">Action</span>
      </div>
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="grid grid-cols-2 items-center gap-3 border-t px-4 py-4 text-sm lg:grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.7fr_0.8fr_auto]"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{entry.category}</p>
            <p className="text-muted-foreground truncate text-xs">
              {entry.transaction_date} · {formatLabel(entry.entry_type)}
            </p>
          </div>
          <p className="text-muted-foreground hidden truncate lg:block">
            {entry.project.code} - {entry.project.name}
          </p>
          <p className="text-muted-foreground hidden truncate lg:block">
            {entry.party?.name ?? "No party"}
          </p>
          <p className="text-muted-foreground hidden truncate lg:block">
            {entry.supplier?.name ?? "No supplier"}
          </p>
          <p className="hidden capitalize lg:block">
            {formatLabel(entry.status)}
          </p>
          <p
            className={
              entry.entry_type === "income"
                ? "hidden font-medium text-emerald-600 lg:block"
                : "text-destructive hidden font-medium lg:block"
            }
          >
            {formatMoney(entry.amount, entry.entry_type)}
          </p>
          <div className="text-right">
            <Button asChild size="sm" variant="outline">
              <Link href={`/app/cashflow/${entry.id}`}>Open</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
