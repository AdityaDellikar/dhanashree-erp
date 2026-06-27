import { ModulePage } from "@/components/layout/module-page";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <ModulePage
      description="Cashflow, action center, analytics and reports will read from calculated service outputs."
      title="Dashboard"
    />
  );
}
