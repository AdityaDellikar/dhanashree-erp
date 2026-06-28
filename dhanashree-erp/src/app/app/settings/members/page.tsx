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
import { InviteMemberForm } from "@/features/organizations/components/invite-member-form";
import { MembersList } from "@/features/organizations/components/members-list";
import {
  currentUserCanManageOrganization,
  getOrganizationInvitations,
  getOrganizationMembers,
  getUserOrganizations,
  requireCurrentOrganization,
} from "@/features/organizations/queries";

export const metadata = {
  title: "Organization Members",
};

export default async function OrganizationMembersPage() {
  const [currentOrganization, organizations] = await Promise.all([
    requireCurrentOrganization(),
    getUserOrganizations(),
  ]);
  const [canManage, members, invitations] = await Promise.all([
    currentUserCanManageOrganization(currentOrganization.id),
    getOrganizationMembers(),
    getOrganizationInvitations(),
  ]);

  return (
    <main className="bg-background min-h-dvh">
      <AppHeader
        currentOrganization={currentOrganization}
        organizations={organizations}
      />
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">Members</h1>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Membership is loaded only from the active organization context.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/app/settings/organization">Organization settings</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invite member</CardTitle>
            <CardDescription>
              Create a pending invitation for this organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteMemberForm canManage={canManage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization access</CardTitle>
            <CardDescription>
              Active members and pending invitations for{" "}
              {currentOrganization.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MembersList members={members} invitations={invitations} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
