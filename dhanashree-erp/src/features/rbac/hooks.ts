"use client";

import { useMemo } from "react";

import type { OrganizationRole } from "@/features/organizations/queries";
import {
  canInviteMembers,
  canManageMembers,
  canManageOrganization,
  canViewMembers,
  hasAnyRole,
  hasRole,
} from "@/features/rbac/rules";

type UsePermissionsInput = {
  role: OrganizationRole;
};

export function usePermissions({ role }: UsePermissionsInput) {
  return useMemo(
    () => ({
      canInviteMembers: canInviteMembers(role),
      canManageMembers: canManageMembers(role),
      canManageOrganization: canManageOrganization(role),
      canViewMembers: canViewMembers(role),
      hasAnyRole: (roles: readonly OrganizationRole[]) =>
        hasAnyRole(role, roles),
      hasRole: (requiredRole: OrganizationRole) => hasRole(role, requiredRole),
      role,
    }),
    [role],
  );
}
