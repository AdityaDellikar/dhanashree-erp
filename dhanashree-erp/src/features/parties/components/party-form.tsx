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
import { createParty, updateParty } from "@/features/parties/actions";
import type { Party } from "@/features/parties/queries";
import {
  normalizeOptionalText,
  type PartyFormInput,
  partyFormSchema,
  partyTypeOptions,
} from "@/features/parties/schemas";

type PartyFormProps = {
  mode: "create" | "edit";
  party?: Party;
};

function fieldError(message?: string) {
  if (!message) return null;

  return <p className="text-destructive text-xs font-medium">{message}</p>;
}

function formatType(type: string) {
  return type.replace("_", " ");
}

export function PartyForm({ mode, party }: PartyFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<PartyFormInput>({
    defaultValues: {
      address: party?.address ?? "",
      contact_person: party?.contact_person ?? "",
      email: party?.email ?? "",
      gstin: party?.gstin ?? "",
      name: party?.name ?? "",
      notes: party?.notes ?? "",
      phone: party?.phone ?? "",
      type: party?.type ?? "supplier",
    },
    resolver: zodResolver(partyFormSchema),
  });

  const onSubmit = (values: PartyFormInput) => {
    setError(undefined);

    startTransition(async () => {
      const response =
        mode === "create"
          ? await createParty(values)
          : await updateParty(party?.id ?? "", values);

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
        router.push(`/app/parties/${response.id}` as Route);
      }

      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="party-name" className="text-sm font-medium">
            Name
          </label>
          <Input id="party-name" disabled={isPending} {...register("name")} />
          {fieldError(errors.name?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="party-type" className="text-sm font-medium">
            Type
          </label>
          <select
            id="party-type"
            disabled={isPending}
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm shadow-sm disabled:opacity-50"
            {...register("type")}
          >
            {partyTypeOptions.map((type) => (
              <option key={type} value={type}>
                {formatType(type)}
              </option>
            ))}
          </select>
          {fieldError(errors.type?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="party-contact" className="text-sm font-medium">
            Contact person
          </label>
          <Input
            id="party-contact"
            disabled={isPending}
            {...register("contact_person", {
              setValueAs: normalizeOptionalText,
            })}
          />
          {fieldError(errors.contact_person?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="party-phone" className="text-sm font-medium">
            Phone
          </label>
          <Input
            id="party-phone"
            disabled={isPending}
            {...register("phone", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.phone?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="party-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="party-email"
            disabled={isPending}
            type="email"
            {...register("email", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.email?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="party-gstin" className="text-sm font-medium">
            GSTIN
          </label>
          <Input
            id="party-gstin"
            autoCapitalize="characters"
            disabled={isPending}
            {...register("gstin", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.gstin?.message)}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="party-address" className="text-sm font-medium">
            Address
          </label>
          <textarea
            id="party-address"
            disabled={isPending}
            rows={3}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...register("address", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.address?.message)}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="party-notes" className="text-sm font-medium">
            Notes
          </label>
          <textarea
            id="party-notes"
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
        {mode === "create" ? "Create party" : "Save party"}
      </LoadingButton>
    </form>
  );
}
