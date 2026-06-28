import type { ReactNode } from "react";

import { AppShell } from "@/features/app-shell/components/app-shell";
import {
  getUserOrganizations,
  requireCurrentOrganization,
} from "@/features/organizations/queries";
import { createClient } from "@/lib/supabase/server";

type AppShellLayoutProps = {
  children: ReactNode;
};

export default async function AppShellLayout({
  children,
}: AppShellLayoutProps) {
  const [currentOrganization, organizations] = await Promise.all([
    requireCurrentOrganization(),
    getUserOrganizations(),
  ]);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  return (
    <AppShell
      currentOrganization={currentOrganization}
      organizations={organizations}
      user={{
        email: profile?.email ?? user?.email ?? "Signed in user",
        fullName: profile?.full_name ?? null,
      }}
    >
      {children}
    </AppShell>
  );
}
