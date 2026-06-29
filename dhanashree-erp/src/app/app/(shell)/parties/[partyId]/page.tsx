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
import { getPartyCashflowEntries } from "@/features/cashflow/queries";
import { PartyForm } from "@/features/parties/components/party-form";
import { getParty } from "@/features/parties/queries";

type PartyDetailPageProps = {
  params: Promise<{
    partyId: string;
  }>;
};

function formatType(type: string) {
  return type.replace("_", " ");
}

export async function generateMetadata({ params }: PartyDetailPageProps) {
  const { partyId } = await params;
  const party = await getParty(partyId);

  return {
    title: party.name,
  };
}

export default async function PartyDetailPage({
  params,
}: PartyDetailPageProps) {
  const { partyId } = await params;
  const [party, recentEntries] = await Promise.all([
    getParty(partyId),
    getPartyCashflowEntries(partyId),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm capitalize">
            {formatType(party.type)}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">
            {party.name}
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/app/parties">Back to parties</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Party details</CardTitle>
          <CardDescription>
            Basic contact and tax information for this organization party.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">Contact person</dt>
              <dd className="mt-1 font-medium">
                {party.contact_person ?? "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="mt-1 font-medium">{party.phone ?? "Not set"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="mt-1 font-medium">{party.email ?? "Not set"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">GSTIN</dt>
              <dd className="mt-1 font-medium">{party.gstin ?? "Not set"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Address</dt>
              <dd className="mt-1 font-medium">{party.address ?? "Not set"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Notes</dt>
              <dd className="mt-1 font-medium">{party.notes ?? "Not set"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit party</CardTitle>
          <CardDescription>
            Update party foundation fields before cashflow entries are
            introduced.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PartyForm mode="edit" party={party} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Recent transactions</CardTitle>
              <CardDescription>
                Latest cashflow records linked to this party.
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
