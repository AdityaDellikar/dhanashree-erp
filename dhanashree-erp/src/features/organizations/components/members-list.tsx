import { BadgeCheck, ShieldAlert } from "lucide-react";

import type {
  OrganizationInvitation,
  OrganizationMember,
} from "@/features/organizations/queries";

type MembersListProps = {
  invitations: OrganizationInvitation[];
  members: OrganizationMember[];
};

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function MembersList({ invitations, members }: MembersListProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border">
        <div className="bg-muted/40 grid grid-cols-2 gap-3 px-4 py-3 text-xs font-medium sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <span>Member</span>
          <span className="hidden sm:block">Role</span>
          <span>Status</span>
          <span className="hidden sm:block">Joined</span>
        </div>
        {members.length === 0 ? (
          <div className="text-muted-foreground px-4 py-6 text-sm">
            No members are visible for this organization.
          </div>
        ) : (
          members.map((member) => (
            <div
              key={`${member.organization_id}-${member.user_id}`}
              className="grid grid-cols-2 gap-3 border-t px-4 py-4 text-sm sm:grid-cols-[1.4fr_1fr_1fr_1fr]"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {member.fullName ?? "Organization member"}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {member.email ??
                    "Profile details restricted by current database policy"}
                </p>
              </div>
              <p className="hidden sm:block">{formatRole(member.role)}</p>
              <div className="flex items-center gap-2">
                {member.status === "active" ? (
                  <BadgeCheck className="size-4 text-emerald-600" />
                ) : (
                  <ShieldAlert className="text-destructive size-4" />
                )}
                <span>{formatRole(member.status)}</span>
              </div>
              <p className="text-muted-foreground hidden sm:block">
                {formatDate(member.created_at)}
              </p>
            </div>
          ))
        )}
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold tracking-normal">
          Pending invitations
        </h2>
        <div className="overflow-hidden rounded-lg border">
          {invitations.length === 0 ? (
            <div className="text-muted-foreground px-4 py-6 text-sm">
              No pending invitations.
            </div>
          ) : (
            invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="grid gap-2 border-t px-4 py-4 text-sm first:border-t-0 sm:grid-cols-[1.4fr_1fr_1fr]"
              >
                <p className="min-w-0 truncate font-medium">
                  {invitation.email}
                </p>
                <p>{formatRole(invitation.role)}</p>
                <p className="text-muted-foreground">
                  Expires {formatDate(invitation.expires_at)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
