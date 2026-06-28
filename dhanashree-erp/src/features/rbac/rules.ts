import type { OrganizationRole } from "@/features/organizations/queries";

export function hasRole(
  role: OrganizationRole,
  requiredRole: OrganizationRole,
): boolean {
  return role === requiredRole;
}

export function hasAnyRole(
  role: OrganizationRole,
  allowedRoles: readonly OrganizationRole[],
): boolean {
  return allowedRoles.includes(role);
}

export function canManageOrganization(role: OrganizationRole): boolean {
  return hasAnyRole(role, ["owner", "admin"]);
}

export function canManageMembers(role: OrganizationRole): boolean {
  return hasAnyRole(role, ["owner", "admin"]);
}

export function canInviteMembers(role: OrganizationRole): boolean {
  return hasAnyRole(role, ["owner", "admin"]);
}

export function canViewMembers(role: OrganizationRole): boolean {
  return hasAnyRole(role, ["owner", "admin", "manager", "staff", "viewer"]);
}
