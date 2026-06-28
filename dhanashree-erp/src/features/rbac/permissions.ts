import "server-only";

import { redirect } from "next/navigation";

import {
  type CurrentOrganization,
  type OrganizationRole,
  requireCurrentOrganization,
} from "@/features/organizations/queries";
import {
  canInviteMembers,
  canManageMembers,
  canManageOrganization,
  canViewMembers,
  hasAnyRole,
  hasRole,
} from "@/features/rbac/rules";

export type PermissionContext = {
  organizationId: string;
  role: OrganizationRole;
};

export async function requireCurrentOrganizationRole(): Promise<PermissionContext> {
  const currentOrganization = await requireCurrentOrganization();

  return {
    organizationId: currentOrganization.id,
    role: currentOrganization.memberRole,
  };
}

export async function requireRole(
  requiredRole: OrganizationRole,
): Promise<CurrentOrganization> {
  const currentOrganization = await requireCurrentOrganization();

  if (!hasRole(currentOrganization.memberRole, requiredRole)) {
    redirect("/app/access-denied");
  }

  return currentOrganization;
}

export {
  canInviteMembers,
  canManageMembers,
  canManageOrganization,
  canViewMembers,
  hasAnyRole,
  hasRole,
};

export async function requireAnyRole(
  allowedRoles: readonly OrganizationRole[],
): Promise<CurrentOrganization> {
  const currentOrganization = await requireCurrentOrganization();

  if (!hasAnyRole(currentOrganization.memberRole, allowedRoles)) {
    redirect("/app/access-denied");
  }

  return currentOrganization;
}
