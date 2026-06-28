import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import type { Party } from "@/features/parties/queries";

type PartyListProps = {
  parties: Party[];
};

function formatType(type: string) {
  return type.replace("_", " ");
}

export function PartyList({ parties }: PartyListProps) {
  if (parties.length === 0) {
    return (
      <EmptyState
        description="Add suppliers, customers, subcontractors, or other parties before cashflow entries arrive."
        title="No parties yet"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="bg-muted/40 grid grid-cols-2 gap-3 px-4 py-3 text-xs font-medium md:grid-cols-[1.2fr_0.8fr_1fr_1fr_auto]">
        <span>Party</span>
        <span className="hidden md:block">Type</span>
        <span className="hidden md:block">Contact</span>
        <span className="hidden md:block">Email</span>
        <span className="text-right">Action</span>
      </div>
      {parties.map((party) => (
        <div
          key={party.id}
          className="grid grid-cols-2 items-center gap-3 border-t px-4 py-4 text-sm md:grid-cols-[1.2fr_0.8fr_1fr_1fr_auto]"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{party.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              {party.phone ?? "No phone"}
            </p>
          </div>
          <p className="hidden capitalize md:block">{formatType(party.type)}</p>
          <p className="text-muted-foreground hidden truncate md:block">
            {party.contact_person ?? "Not set"}
          </p>
          <p className="text-muted-foreground hidden truncate md:block">
            {party.email ?? "Not set"}
          </p>
          <div className="text-right">
            <Button asChild size="sm" variant="outline">
              <Link href={`/app/parties/${party.id}`}>Open</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
