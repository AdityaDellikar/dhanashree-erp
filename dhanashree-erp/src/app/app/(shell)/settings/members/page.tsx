import Link from "next/link";

import { AccessDeniedState } from "@/components/shared/access-denied-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InviteMemberForm } from "@/features/organizations/components/invite-member-form";
import { MembersList } from "@/features/organizations/components/members-list";
import {
  getOrganizationInvitations,
  getOrganizationMembers,
  requireCurrentOrganization,
} from "@/features/organizations/queries";
import { canInviteMembers, canViewMembers } from "@/features/rbac/rules";

export const metadata = {
  title: "Organization Members",
};

export default async function OrganizationMembersPage() {
  const currentOrganization = await requireCurrentOrganization();

  if (!canViewMembers(currentOrganization.memberRole)) {
    return <AccessDeniedState />;
  }

  const [members, invitations] = await Promise.all([
    getOrganizationMembers(),
    getOrganizationInvitations(),
  ]);
  const canInvite = canInviteMembers(currentOrganization.memberRole);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
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

      {canInvite ? (
        <Card>
          <CardHeader>
            <CardTitle>Invite member</CardTitle>
            <CardDescription>
              Create a pending invitation for this organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteMemberForm canManage={canInvite} />
          </CardContent>
        </Card>
      ) : null}

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
    </div>
  );
}
