import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SupplierForm } from "@/features/suppliers/components/supplier-form";

export const metadata = {
  title: "New Supplier",
};

export default function NewSupplierPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">
            New supplier
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Add supplier contact, GST, and status details.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/app/suppliers">Back to suppliers</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier details</CardTitle>
          <CardDescription>
            All suppliers are scoped to the active organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
