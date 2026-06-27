export const userRoles = ["owner", "manager", "accountant"] as const;

export type UserRole = (typeof userRoles)[number];
