"use client";

import type { ReactNode } from "react";

import { AccessDeniedState } from "@/components/shared/access-denied-state";
import type { OrganizationRole } from "@/features/organizations/queries";
import { hasAnyRole } from "@/features/rbac/rules";

type RequireRoleProps = {
  children: ReactNode;
  role: OrganizationRole;
  roles: readonly OrganizationRole[];
};

export function RequireRole({ children, role, roles }: RequireRoleProps) {
  if (!hasAnyRole(role, roles)) {
    return <AccessDeniedState />;
  }

  return children;
}
