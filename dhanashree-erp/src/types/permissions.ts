import type { UserRole } from "@/types/roles";

export const permissions = [
  "dashboard:read",
  "projects:read",
  "projects:write",
  "transactions:read",
  "transactions:write",
  "workforce:read",
  "workforce:write",
  "suppliers:read",
  "suppliers:write",
  "documents:read",
  "documents:write",
  "reports:read",
  "settings:manage",
] as const;

export type Permission = (typeof permissions)[number];

export const rolePermissions: Record<UserRole, readonly Permission[]> = {
  accountant: [
    "dashboard:read",
    "projects:read",
    "transactions:read",
    "transactions:write",
    "suppliers:read",
    "documents:read",
    "reports:read",
  ],
  manager: [
    "dashboard:read",
    "projects:read",
    "projects:write",
    "transactions:read",
    "workforce:read",
    "workforce:write",
    "suppliers:read",
    "suppliers:write",
    "documents:read",
    "documents:write",
    "reports:read",
  ],
  owner: permissions,
};
