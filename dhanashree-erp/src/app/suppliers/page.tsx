import { ModulePage } from "@/components/layout/module-page";

export const metadata = {
  title: "Suppliers",
};

export default function SuppliersPage() {
  return (
    <ModulePage
      description="Supplier balances are calculated from transactions and payments rather than stored totals."
      title="Suppliers"
    />
  );
}
