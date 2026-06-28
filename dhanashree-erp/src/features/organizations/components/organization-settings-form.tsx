"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormError } from "@/components/shared/form-error";
import { FormSuccess } from "@/components/shared/form-success";
import { LoadingButton } from "@/components/shared/loading-button";
import { Input } from "@/components/ui/input";
import { updateOrganization } from "@/features/organizations/actions";
import type { CurrentOrganization } from "@/features/organizations/queries";
import {
  currencyOptions,
  normalizeOptionalOrganizationText,
  timezoneOptions,
  type UpdateOrganizationFormInput,
  type UpdateOrganizationInput,
  updateOrganizationSchema,
} from "@/features/organizations/schemas";

type OrganizationSettingsFormProps = {
  canManage: boolean;
  organization: CurrentOrganization;
};

export function OrganizationSettingsForm({
  canManage,
  organization,
}: OrganizationSettingsFormProps) {
  const selectedCurrency =
    currencyOptions.find((currency) => currency === organization.currency) ??
    "INR";
  const selectedTimezone =
    timezoneOptions.find((timezone) => timezone === organization.timezone) ??
    "Asia/Kolkata";
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<UpdateOrganizationFormInput, unknown, UpdateOrganizationInput>({
    defaultValues: {
      currency: selectedCurrency,
      gstin: organization.gstin ?? "",
      logo_url: organization.logo_url ?? "",
      name: organization.name,
      pan: organization.pan ?? "",
      timezone: selectedTimezone,
    },
    resolver: zodResolver(updateOrganizationSchema),
  });

  const onSubmit = (values: UpdateOrganizationInput) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      const response = await updateOrganization(values);

      if (!response.success) {
        setError(response.message);
        toast.error(response.message);
        return;
      }

      setSuccess(response.message);
      toast.success(response.message);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="settings-name" className="text-sm font-medium">
            Organization name
          </label>
          <Input
            id="settings-name"
            disabled={isPending || !canManage}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-destructive text-xs font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="settings-gstin" className="text-sm font-medium">
            GSTIN
          </label>
          <Input
            id="settings-gstin"
            autoCapitalize="characters"
            disabled={isPending || !canManage}
            {...register("gstin", {
              setValueAs: normalizeOptionalOrganizationText,
            })}
          />
          {errors.gstin && (
            <p className="text-destructive text-xs font-medium">
              {errors.gstin.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="settings-pan" className="text-sm font-medium">
            PAN
          </label>
          <Input
            id="settings-pan"
            autoCapitalize="characters"
            disabled={isPending || !canManage}
            {...register("pan", {
              setValueAs: normalizeOptionalOrganizationText,
            })}
          />
          {errors.pan && (
            <p className="text-destructive text-xs font-medium">
              {errors.pan.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="settings-currency" className="text-sm font-medium">
            Currency
          </label>
          <select
            id="settings-currency"
            disabled={isPending || !canManage}
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm shadow-sm disabled:opacity-50"
            {...register("currency")}
          >
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="settings-timezone" className="text-sm font-medium">
            Timezone
          </label>
          <select
            id="settings-timezone"
            disabled={isPending || !canManage}
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm shadow-sm disabled:opacity-50"
            {...register("timezone")}
          >
            {timezoneOptions.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="settings-logo-url" className="text-sm font-medium">
            Logo URL
          </label>
          <Input
            id="settings-logo-url"
            disabled={isPending || !canManage}
            {...register("logo_url", {
              setValueAs: normalizeOptionalOrganizationText,
            })}
          />
          {errors.logo_url && (
            <p className="text-destructive text-xs font-medium">
              {errors.logo_url.message}
            </p>
          )}
        </div>
      </div>

      {!canManage && (
        <p className="text-muted-foreground rounded-md border p-3 text-sm">
          Only owners and admins can update organization settings.
        </p>
      )}

      <FormError message={error} />
      <FormSuccess message={success} />

      <LoadingButton type="submit" isLoading={isPending} disabled={!canManage}>
        <Save />
        Save settings
      </LoadingButton>
    </form>
  );
}
