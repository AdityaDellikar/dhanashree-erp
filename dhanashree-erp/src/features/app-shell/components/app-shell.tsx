import { Bell } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/features/app-shell/components/breadcrumbs";
import { MobileNavigation } from "@/features/app-shell/components/mobile-navigation";
import { SidebarNav } from "@/features/app-shell/components/sidebar-nav";
import { ThemeSwitcher } from "@/features/app-shell/components/theme-switcher";
import { UserMenu } from "@/features/app-shell/components/user-menu";
import { OrganizationSwitcher } from "@/features/organizations/components/organization-switcher";
import type {
  CurrentOrganization,
  UserOrganization,
} from "@/features/organizations/queries";

type AppShellProps = {
  children: ReactNode;
  currentOrganization: CurrentOrganization;
  organizations: UserOrganization[];
  user: {
    email: string;
    fullName: string | null;
  };
};

export function AppShell({
  children,
  currentOrganization,
  organizations,
  user,
}: AppShellProps) {
  return (
    <div className="bg-background min-h-dvh">
      <aside className="bg-card fixed inset-y-0 left-0 z-40 hidden w-72 border-r lg:flex lg:flex-col">
        <div className="border-b p-5">
          <p className="text-sm font-semibold">Dhanashree ERP</p>
          <p className="text-muted-foreground mt-1 truncate text-xs">
            {currentOrganization.name}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <SidebarNav />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="bg-background/95 sticky top-0 z-30 border-b backdrop-blur">
          <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <MobileNavigation organizationName={currentOrganization.name} />
            <div className="min-w-0 flex-1">
              <Breadcrumbs />
            </div>
            <div className="hidden min-w-0 md:block">
              <OrganizationSwitcher
                currentOrganization={currentOrganization}
                organizations={organizations}
              />
            </div>
            <Button
              aria-label="Notifications"
              title="Notifications coming soon"
              size="icon"
              type="button"
              variant="ghost"
            >
              <Bell />
            </Button>
            <ThemeSwitcher />
            <UserMenu
              email={user.email}
              fullName={user.fullName}
              role={currentOrganization.memberRole}
            />
          </div>
          <div className="border-t px-4 py-3 md:hidden">
            <OrganizationSwitcher
              currentOrganization={currentOrganization}
              organizations={organizations}
            />
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
