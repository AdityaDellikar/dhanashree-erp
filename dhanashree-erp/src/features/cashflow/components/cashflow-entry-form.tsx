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
import {
  createCashflowEntry,
  updateCashflowEntry,
} from "@/features/cashflow/actions";
import type { CashflowEntryWithRelations } from "@/features/cashflow/queries";
import {
  cashflowCategoryOptions,
  type CashflowEntryFormInput,
  cashflowEntryFormSchema,
  cashflowEntryTypeOptions,
  cashflowStatusOptions,
  normalizeAmount,
  normalizeOptionalText,
  normalizeOptionalUuid,
  paymentModeOptions,
} from "@/features/cashflow/schemas";
import type { Party } from "@/features/parties/queries";
import type { Project } from "@/features/projects/queries";
import type { Supplier } from "@/features/suppliers/queries";

type CashflowEntryFormProps = {
  entry?: CashflowEntryWithRelations;
  mode: "create" | "edit";
  parties: Party[];
  projects: Project[];
  suppliers: Supplier[];
};

function fieldError(message?: string) {
  if (!message) return null;

  return <p className="text-destructive text-xs font-medium">{message}</p>;
}

function formatOption(value: string) {
  return value.replace("_", " ");
}

export function CashflowEntryForm({
  entry,
  mode,
  parties,
  projects,
  suppliers,
}: CashflowEntryFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CashflowEntryFormInput>({
    defaultValues: {
      amount: entry?.amount ?? undefined,
      category: entry?.category ?? "Material",
      description: entry?.description ?? "",
      entry_type: entry?.entry_type ?? "expense",
      notes: entry?.notes ?? "",
      party_id: entry?.party_id ?? "",
      payment_mode: entry?.payment_mode ?? "cash",
      project_id: entry?.project_id ?? projects[0]?.id ?? "",
      reference_number: entry?.reference_number ?? "",
      status: entry?.status ?? "completed",
      supplier_id: entry?.supplier_id ?? "",
      transaction_date:
        entry?.transaction_date ?? new Date().toISOString().slice(0, 10),
    },
    resolver: zodResolver(cashflowEntryFormSchema),
  });

  const onSubmit = (values: CashflowEntryFormInput) => {
    setError(undefined);

    startTransition(async () => {
      const response =
        mode === "create"
          ? await createCashflowEntry(values)
          : await updateCashflowEntry(entry?.id ?? "", values);

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
        router.push(`/app/cashflow/${response.id}` as Route);
      }

      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="cashflow-project" className="text-sm font-medium">
            Project
          </label>
          <select
            id="cashflow-project"
            disabled={isPending || projects.length === 0}
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm shadow-sm disabled:opacity-50"
            {...register("project_id")}
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.code} - {project.name}
              </option>
            ))}
          </select>
          {fieldError(errors.project_id?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="cashflow-party" className="text-sm font-medium">
            Party
          </label>
          <select
            id="cashflow-party"
            disabled={isPending}
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm shadow-sm disabled:opacity-50"
            {...register("party_id", { setValueAs: normalizeOptionalUuid })}
          >
            <option value="">No party</option>
            {parties.map((party) => (
              <option key={party.id} value={party.id}>
                {party.name}
              </option>
            ))}
          </select>
          {fieldError(errors.party_id?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="cashflow-supplier" className="text-sm font-medium">
            Supplier
          </label>
          <select
            id="cashflow-supplier"
            disabled={isPending}
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm shadow-sm disabled:opacity-50"
            {...register("supplier_id", {
              setValueAs: normalizeOptionalUuid,
            })}
          >
            <option value="">No supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
          {fieldError(errors.supplier_id?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="cashflow-entry-type" className="text-sm font-medium">
            Entry type
          </label>
          <select
            id="cashflow-entry-type"
            disabled={isPending}
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm capitalize shadow-sm disabled:opacity-50"
            {...register("entry_type")}
          >
            {cashflowEntryTypeOptions.map((type) => (
              <option key={type} value={type}>
                {formatOption(type)}
              </option>
            ))}
          </select>
          {fieldError(errors.entry_type?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="cashflow-category" className="text-sm font-medium">
            Category
          </label>
          <Input
            id="cashflow-category"
            disabled={isPending}
            list="cashflow-category-options"
            {...register("category")}
          />
          <datalist id="cashflow-category-options">
            {cashflowCategoryOptions.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          {fieldError(errors.category?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="cashflow-amount" className="text-sm font-medium">
            Amount
          </label>
          <Input
            id="cashflow-amount"
            disabled={isPending}
            min="0"
            step="0.01"
            type="number"
            {...register("amount", { setValueAs: normalizeAmount })}
          />
          {fieldError(errors.amount?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="cashflow-date" className="text-sm font-medium">
            Transaction date
          </label>
          <Input
            id="cashflow-date"
            disabled={isPending}
            type="date"
            {...register("transaction_date")}
          />
          {fieldError(errors.transaction_date?.message)}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="cashflow-payment-mode"
            className="text-sm font-medium"
          >
            Payment mode
          </label>
          <select
            id="cashflow-payment-mode"
            disabled={isPending}
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm capitalize shadow-sm disabled:opacity-50"
            {...register("payment_mode")}
          >
            {paymentModeOptions.map((modeOption) => (
              <option key={modeOption} value={modeOption}>
                {formatOption(modeOption)}
              </option>
            ))}
          </select>
          {fieldError(errors.payment_mode?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="cashflow-status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="cashflow-status"
            disabled={isPending}
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm capitalize shadow-sm disabled:opacity-50"
            {...register("status")}
          >
            {cashflowStatusOptions.map((status) => (
              <option key={status} value={status}>
                {formatOption(status)}
              </option>
            ))}
          </select>
          {fieldError(errors.status?.message)}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="cashflow-reference" className="text-sm font-medium">
            Reference number
          </label>
          <Input
            id="cashflow-reference"
            disabled={isPending}
            {...register("reference_number", {
              setValueAs: normalizeOptionalText,
            })}
          />
          {fieldError(errors.reference_number?.message)}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="cashflow-description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="cashflow-description"
            disabled={isPending}
            rows={3}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...register("description", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.description?.message)}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="cashflow-notes" className="text-sm font-medium">
            Notes
          </label>
          <textarea
            id="cashflow-notes"
            disabled={isPending}
            rows={4}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...register("notes", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.notes?.message)}
        </div>
      </div>

      <FormError message={error} />

      <LoadingButton
        type="submit"
        isLoading={isPending}
        disabled={projects.length === 0}
      >
        <Save />
        {mode === "create" ? "Create entry" : "Save entry"}
      </LoadingButton>
    </form>
  );
}
