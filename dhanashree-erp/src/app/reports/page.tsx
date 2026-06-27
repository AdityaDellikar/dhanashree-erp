import { ModulePage } from "@/components/layout/module-page";

export const metadata = {
  title: "Reports",
};

export default function ReportsPage() {
  return (
    <ModulePage
      description="Reports consume calculated project, transaction, supplier and workforce service outputs."
      title="Reports"
    />
  );
}
