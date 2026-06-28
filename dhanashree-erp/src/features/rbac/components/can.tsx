"use client";

import type { ReactNode } from "react";

import type { OrganizationRole } from "@/features/organizations/queries";
import { hasAnyRole } from "@/features/rbac/rules";

type CanProps = {
  children: ReactNode;
  fallback?: ReactNode;
  role: OrganizationRole;
  roles: readonly OrganizationRole[];
};

export function Can({ children, fallback = null, role, roles }: CanProps) {
  if (!hasAnyRole(role, roles)) {
    return fallback;
  }

  return children;
}
