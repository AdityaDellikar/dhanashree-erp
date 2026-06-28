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
import { OrganizationSettingsForm } from "@/features/organizations/components/organization-settings-form";
import {
  currentUserCanManageOrganization,
  getUserOrganizations,
  requireCurrentOrganization,
} from "@/features/organizations/queries";

export const metadata = {
  title: "Organization Settings",
};

export default async function OrganizationSettingsPage() {
  const [currentOrganization, organizations] = await Promise.all([
    requireCurrentOrganization(),
    getUserOrganizations(),
  ]);
  const canManage = await currentUserCanManageOrganization(
    currentOrganization.id,
  );

  return (
    <main className="bg-background min-h-dvh">
      <AppHeader
        currentOrganization={currentOrganization}
        organizations={organizations}
      />
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">
              Organization settings
            </h1>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Basic tenant details used across the app.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/app/settings/members">Members</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{currentOrganization.name}</CardTitle>
            <CardDescription>
              Your role: {currentOrganization.memberRole}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizationSettingsForm
              canManage={canManage}
              organization={currentOrganization}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
