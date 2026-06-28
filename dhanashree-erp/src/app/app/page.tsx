import { redirect } from "next/navigation";

import { getCurrentOrganization } from "@/features/organizations/queries";

export default async function AppPage() {
  const organization = await getCurrentOrganization();

  if (!organization) {
    redirect("/app/onboarding/organization");
  }

  redirect("/app/dashboard");
}
