import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import type { Supplier } from "@/features/suppliers/queries";

type SupplierListProps = {
  suppliers: Supplier[];
};

export function SupplierList({ suppliers }: SupplierListProps) {
  if (suppliers.length === 0) {
    return (
      <EmptyState
        action={
          <Button asChild>
            <Link href="/app/suppliers/new">Create supplier</Link>
          </Button>
        }
        description="Add suppliers before linking procurement expenses or payable cashflow entries."
        title="No suppliers found"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="bg-muted/40 grid grid-cols-2 gap-3 px-4 py-3 text-xs font-medium md:grid-cols-[1.2fr_0.7fr_1fr_1fr_auto]">
        <span>Supplier</span>
        <span className="hidden md:block">Status</span>
        <span className="hidden md:block">Contact</span>
        <span className="hidden md:block">Email</span>
        <span className="text-right">Action</span>
      </div>
      {suppliers.map((supplier) => (
        <div
          key={supplier.id}
          className="grid grid-cols-2 items-center gap-3 border-t px-4 py-4 text-sm md:grid-cols-[1.2fr_0.7fr_1fr_1fr_auto]"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{supplier.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              {supplier.phone ?? "No phone"}
            </p>
          </div>
          <p className="hidden capitalize md:block">{supplier.status}</p>
          <p className="text-muted-foreground hidden truncate md:block">
            {supplier.contact_person ?? "Not set"}
          </p>
          <p className="text-muted-foreground hidden truncate md:block">
            {supplier.email ?? "Not set"}
          </p>
          <div className="text-right">
            <Button asChild size="sm" variant="outline">
              <Link href={`/app/suppliers/${supplier.id}`}>Open</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
