import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import type { CashflowEntryWithRelations } from "@/features/cashflow/queries";

type RecentCashflowListProps = {
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

export function RecentCashflowList({ entries }: RecentCashflowListProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        className="min-h-36"
        description="No cashflow entries have been recorded here yet."
        title="No recent entries"
      />
    );
  }

  return (
    <div className="divide-y rounded-lg border">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{entry.category}</p>
            <p className="text-muted-foreground mt-1 truncate text-xs">
              {entry.transaction_date} · {entry.project.code}
              {entry.party ? ` · ${entry.party.name}` : ""}
              {entry.supplier ? ` · ${entry.supplier.name}` : ""}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span
              className={
                entry.entry_type === "income"
                  ? "text-sm font-medium text-emerald-600"
                  : "text-destructive text-sm font-medium"
              }
            >
              {formatMoney(entry.amount, entry.entry_type)}
            </span>
            <Button asChild size="sm" variant="outline">
              <Link href={`/app/cashflow/${entry.id}`}>Open</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
