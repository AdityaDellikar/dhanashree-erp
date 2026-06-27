import { type Permission, rolePermissions } from "@/types/permissions";
import type { UserRole } from "@/types/roles";

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function assertPermission(role: UserRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Role "${role}" does not have "${permission}" permission.`);
  }
}
