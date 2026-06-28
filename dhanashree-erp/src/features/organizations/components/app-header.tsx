import Link from "next/link";

import { Button } from "@/components/ui/button";
import { OrganizationSwitcher } from "@/features/organizations/components/organization-switcher";
import type { UserOrganization } from "@/features/organizations/queries";

type AppHeaderProps = {
  currentOrganization: UserOrganization;
  organizations: UserOrganization[];
};

export function AppHeader({
  currentOrganization,
  organizations,
}: AppHeaderProps) {
  return (
    <header className="bg-background/95 border-b">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/app/dashboard" className="min-w-0">
          <span className="text-sm font-semibold">Dhanashree ERP</span>
          <span className="text-muted-foreground block truncate text-xs">
            {currentOrganization.name}
          </span>
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <OrganizationSwitcher
            currentOrganization={currentOrganization}
            organizations={organizations}
          />
          <Button asChild size="sm" variant="outline">
            <Link href="/app/settings/organization">Settings</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
