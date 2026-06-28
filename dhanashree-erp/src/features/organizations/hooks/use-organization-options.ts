"use client";

import type { UserOrganization } from "@/features/organizations/queries";

export function useOrganizationOptions(organizations: UserOrganization[]) {
  return organizations.map((organization) => ({
    label: organization.name,
    value: organization.id,
  }));
}
