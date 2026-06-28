import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrganizationSettingsForm } from "@/features/organizations/components/organization-settings-form";
import { requireCurrentOrganization } from "@/features/organizations/queries";
import { canManageOrganization } from "@/features/rbac/rules";

export const metadata = {
  title: "Organization Settings",
};

export default async function OrganizationSettingsPage() {
  const currentOrganization = await requireCurrentOrganization();
  const canManage = canManageOrganization(currentOrganization.memberRole);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
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
    </div>
  );
}
