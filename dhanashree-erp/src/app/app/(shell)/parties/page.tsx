import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PartyForm } from "@/features/parties/components/party-form";
import { PartyList } from "@/features/parties/components/party-list";
import { getParties } from "@/features/parties/queries";

export const metadata = {
  title: "Parties",
};

export default async function PartiesPage() {
  const parties = await getParties();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Parties</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Shared suppliers, customers, subcontractors, and other parties for the
          active organization.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create party</CardTitle>
          <CardDescription>
            Add a party that future cashflow entries can reference.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PartyForm mode="create" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Party list</CardTitle>
          <CardDescription>
            Only parties from the active organization are shown.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PartyList parties={parties} />
        </CardContent>
      </Card>
    </div>
  );
}
