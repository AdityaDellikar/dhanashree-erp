import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { OrganizationOnboardingForm } from "@/features/organizations/components/organization-onboarding-form";
import { getUserOrganizations } from "@/features/organizations/queries";

export const metadata = {
  title: "Organization Setup",
};

export default async function OrganizationOnboardingPage() {
  const organizations = await getUserOrganizations();

  if (organizations.length > 0) {
    redirect("/app/dashboard");
  }

  return (
    <main className="bg-background min-h-dvh">
      <section className="mx-auto flex min-h-dvh w-full max-w-2xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <Card className="w-full">
          <CardContent className="p-6 sm:p-8">
            <OrganizationOnboardingForm />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
