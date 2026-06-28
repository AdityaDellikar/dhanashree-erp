import {
  BarChart3,
  Building2,
  FileText,
  Handshake,
  Settings,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireCurrentOrganization } from "@/features/organizations/queries";

const moduleCards = [
  {
    description: "Project workspace foundation for site operations.",
    href: "/app/projects",
    icon: Building2,
    title: "Projects",
  },
  {
    description: "Shared suppliers, customers, and subcontractors.",
    href: "/app/parties",
    icon: Handshake,
    title: "Parties",
  },
  {
    description: "Labour attendance and workforce history foundation.",
    href: "/app/workforce",
    icon: UsersRound,
    title: "Workforce",
  },
  {
    description: "Document evidence and OCR review entry point.",
    href: "/app/documents",
    icon: FileText,
    title: "Documents",
  },
  {
    description: "Calculated reports and analytics destination.",
    href: "/app/reports",
    icon: BarChart3,
    title: "Reports",
  },
] as const;

export const metadata = {
  title: "Dashboard",
};

export default async function AppDashboardPage() {
  const currentOrganization = await requireCurrentOrganization();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-muted-foreground text-sm">Current organization</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal">
          {currentOrganization.name}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Your role: {currentOrganization.memberRole}
        </p>
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {moduleCards.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="text-primary size-5" />
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm" variant="ghost">
                <Link href={item.href}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
