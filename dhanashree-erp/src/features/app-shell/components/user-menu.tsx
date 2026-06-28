"use client";

import { LogOut, Settings, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";
import type { OrganizationRole } from "@/features/organizations/queries";

type UserMenuProps = {
  email: string;
  fullName: string | null;
  role: OrganizationRole;
};

function formatRole(role: OrganizationRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function UserMenu({ email, fullName, role }: UserMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <details className="relative">
      <summary className="focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground flex h-10 cursor-pointer list-none items-center gap-2 rounded-md px-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none">
        <UserCircle className="size-5" />
        <span className="hidden max-w-32 truncate sm:block">
          {fullName ?? email}
        </span>
      </summary>
      <div className="bg-popover text-popover-foreground absolute right-0 z-50 mt-2 w-72 rounded-md border p-2 shadow-md">
        <div className="border-b px-3 py-2">
          <p className="truncate text-sm font-medium">{fullName ?? email}</p>
          <p className="text-muted-foreground truncate text-xs">{email}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Role: {formatRole(role)}
          </p>
        </div>
        <div className="py-2">
          <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/app/settings/organization">
              <Settings />
              Settings
            </Link>
          </Button>
          <Button
            className="w-full justify-start"
            disabled={isPending}
            type="button"
            variant="ghost"
            onClick={() => {
              startTransition(async () => {
                const response = await logoutAction();
                toast.success(response.message);
                router.push("/login");
                router.refresh();
              });
            }}
          >
            <LogOut />
            Logout
          </Button>
        </div>
      </div>
    </details>
  );
}
