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
import { getSupplier } from "@/features/suppliers/queries";

type EditSupplierPageProps = {
  params: Promise<{
    supplierId: string;
  }>;
};

export async function generateMetadata({ params }: EditSupplierPageProps) {
  const { supplierId } = await params;
  const supplier = await getSupplier(supplierId);

  return {
    title: `Edit ${supplier.name}`,
  };
}

export default async function EditSupplierPage({
  params,
}: EditSupplierPageProps) {
  const { supplierId } = await params;
  const supplier = await getSupplier(supplierId);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">
            Edit supplier
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Update contact, GST, notes, and active status.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/app/suppliers/${supplier.id}`}>Back to supplier</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{supplier.name}</CardTitle>
          <CardDescription>
            Changes stay scoped to the active organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierForm mode="edit" supplier={supplier} />
        </CardContent>
      </Card>
    </div>
  );
}
