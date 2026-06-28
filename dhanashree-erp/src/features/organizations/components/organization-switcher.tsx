"use client";

import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { setCurrentOrganization } from "@/features/organizations/actions";
import { useOrganizationOptions } from "@/features/organizations/hooks/use-organization-options";
import type { UserOrganization } from "@/features/organizations/queries";

type OrganizationSwitcherProps = {
  currentOrganization: UserOrganization;
  organizations: UserOrganization[];
};

export function OrganizationSwitcher({
  currentOrganization,
  organizations,
}: OrganizationSwitcherProps) {
  const router = useRouter();
  const options = useOrganizationOptions(organizations);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(
    currentOrganization.id,
  );
  const [isPending, startTransition] = useTransition();

  return (
    <label className="flex min-w-0 items-center gap-2 text-sm">
      <span className="sr-only">Current organization</span>
      <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
      <select
        aria-label="Current organization"
        className="border-input bg-background h-10 w-full min-w-0 rounded-md border px-3 text-sm shadow-sm disabled:opacity-50 sm:w-64"
        disabled={isPending || organizations.length <= 1}
        value={selectedOrganizationId}
        onChange={(event) => {
          const organizationId = event.target.value;
          setSelectedOrganizationId(organizationId);

          startTransition(async () => {
            const response = await setCurrentOrganization({ organizationId });

            if (!response.success) {
              setSelectedOrganizationId(currentOrganization.id);
              toast.error(response.message);
              return;
            }

            toast.success(response.message);
            router.refresh();
          });
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
