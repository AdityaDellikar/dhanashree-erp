import { Building2, Settings, UsersRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppHeader } from "@/features/organizations/components/app-header";
import {
  getUserOrganizations,
  requireCurrentOrganization,
} from "@/features/organizations/queries";

export const metadata = {
  title: "Dashboard",
};

export default async function AppDashboardPage() {
  const [currentOrganization, organizations] = await Promise.all([
    requireCurrentOrganization(),
    getUserOrganizations(),
  ]);

  return (
    <main className="bg-background min-h-dvh">
      <AppHeader
        currentOrganization={currentOrganization}
        organizations={organizations}
      />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-muted-foreground text-sm">Current organization</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">
            {currentOrganization.name}
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Building2 className="text-primary size-5" />
              <CardTitle>Tenant context</CardTitle>
              <CardDescription>
                Organization-scoped pages read from this active tenant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {currentOrganization.currency} · {currentOrganization.timezone}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="text-primary size-5" />
              <CardTitle>Organization settings</CardTitle>
              <CardDescription>
                Manage basic company details with owner/admin authorization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm" variant="outline">
                <Link href="/app/settings/organization">Open settings</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <UsersRound className="text-primary size-5" />
              <CardTitle>Members</CardTitle>
              <CardDescription>
                View tenant-aware membership and pending invitations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm" variant="outline">
                <Link href="/app/settings/members">View members</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
