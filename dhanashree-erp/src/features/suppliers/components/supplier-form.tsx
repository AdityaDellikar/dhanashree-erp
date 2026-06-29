"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormError } from "@/components/shared/form-error";
import { LoadingButton } from "@/components/shared/loading-button";
import { Input } from "@/components/ui/input";
import { createSupplier, updateSupplier } from "@/features/suppliers/actions";
import type { Supplier } from "@/features/suppliers/queries";
import {
  normalizeOptionalText,
  type SupplierFormInput,
  supplierFormSchema,
  supplierStatusOptions,
} from "@/features/suppliers/schemas";

type SupplierFormProps = {
  mode: "create" | "edit";
  supplier?: Supplier;
};

function fieldError(message?: string) {
  if (!message) return null;

  return <p className="text-destructive text-xs font-medium">{message}</p>;
}

export function SupplierForm({ mode, supplier }: SupplierFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<SupplierFormInput>({
    defaultValues: {
      address: supplier?.address ?? "",
      contact_person: supplier?.contact_person ?? "",
      email: supplier?.email ?? "",
      gst_number: supplier?.gst_number ?? "",
      name: supplier?.name ?? "",
      notes: supplier?.notes ?? "",
      phone: supplier?.phone ?? "",
      status: supplier?.status ?? "active",
    },
    resolver: zodResolver(supplierFormSchema),
  });

  const onSubmit = (values: SupplierFormInput) => {
    setError(undefined);

    startTransition(async () => {
      const response =
        mode === "create"
          ? await createSupplier(values)
          : await updateSupplier(supplier?.id ?? "", values);

      if (!response.success) {
        setError(response.message);
        toast.error(response.message);
        return;
      }

      toast.success(response.message);

      if (mode === "create") {
        reset();
      }

      if (response.id) {
        router.push(`/app/suppliers/${response.id}` as Route);
      }

      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="supplier-name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="supplier-name"
            disabled={isPending}
            {...register("name")}
          />
          {fieldError(errors.name?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="supplier-status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="supplier-status"
            disabled={isPending}
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm capitalize shadow-sm disabled:opacity-50"
            {...register("status")}
          >
            {supplierStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {fieldError(errors.status?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="supplier-contact" className="text-sm font-medium">
            Contact person
          </label>
          <Input
            id="supplier-contact"
            disabled={isPending}
            {...register("contact_person", {
              setValueAs: normalizeOptionalText,
            })}
          />
          {fieldError(errors.contact_person?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="supplier-phone" className="text-sm font-medium">
            Phone
          </label>
          <Input
            id="supplier-phone"
            disabled={isPending}
            {...register("phone", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.phone?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="supplier-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="supplier-email"
            disabled={isPending}
            type="email"
            {...register("email", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.email?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="supplier-gst" className="text-sm font-medium">
            GST number
          </label>
          <Input
            id="supplier-gst"
            autoCapitalize="characters"
            disabled={isPending}
            {...register("gst_number", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.gst_number?.message)}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="supplier-address" className="text-sm font-medium">
            Address
          </label>
          <textarea
            id="supplier-address"
            disabled={isPending}
            rows={3}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...register("address", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.address?.message)}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="supplier-notes" className="text-sm font-medium">
            Notes
          </label>
          <textarea
            id="supplier-notes"
            disabled={isPending}
            rows={4}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...register("notes", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.notes?.message)}
        </div>
      </div>

      <FormError message={error} />

      <LoadingButton type="submit" isLoading={isPending}>
        <Save />
        {mode === "create" ? "Create supplier" : "Save supplier"}
      </LoadingButton>
    </form>
  );
}
