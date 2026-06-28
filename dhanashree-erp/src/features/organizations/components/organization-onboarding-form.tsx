"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormError } from "@/components/shared/form-error";
import { FormSuccess } from "@/components/shared/form-success";
import { LoadingButton } from "@/components/shared/loading-button";
import { Input } from "@/components/ui/input";
import { createOrganization } from "@/features/organizations/actions";
import {
  type CreateOrganizationFormInput,
  type CreateOrganizationInput,
  createOrganizationSchema,
  currencyOptions,
  normalizeOptionalOrganizationText,
  timezoneOptions,
} from "@/features/organizations/schemas";

export function OrganizationOnboardingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<CreateOrganizationFormInput, unknown, CreateOrganizationInput>({
    defaultValues: {
      currency: "INR",
      gstin: "",
      logo_url: "",
      name: "",
      pan: "",
      timezone: "Asia/Kolkata",
    },
    resolver: zodResolver(createOrganizationSchema),
  });

  const onSubmit = (values: CreateOrganizationInput) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      const response = await createOrganization(values);

      if (!response.success) {
        setError(response.message);
        toast.error(response.message);
        return;
      }

      setSuccess(response.message);
      toast.success(response.message);
      router.push("/app/dashboard");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 text-primary rounded-md p-2">
          <Building2 className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-normal">
            Set up your organization
          </h1>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            This becomes the tenant boundary for projects, users and settings.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="name" className="text-sm font-medium">
            Organization name
          </label>
          <Input
            id="name"
            autoComplete="organization"
            disabled={isPending}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-destructive text-xs font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="gstin" className="text-sm font-medium">
            GSTIN
          </label>
          <Input
            id="gstin"
            autoCapitalize="characters"
            disabled={isPending}
            placeholder="27ABCDE1234F1Z5"
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
          <label htmlFor="pan" className="text-sm font-medium">
            PAN
          </label>
          <Input
            id="pan"
            autoCapitalize="characters"
            disabled={isPending}
            placeholder="ABCDE1234F"
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
          <label htmlFor="currency" className="text-sm font-medium">
            Currency
          </label>
          <select
            id="currency"
            disabled={isPending}
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
          <label htmlFor="timezone" className="text-sm font-medium">
            Timezone
          </label>
          <select
            id="timezone"
            disabled={isPending}
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
          <label htmlFor="logo_url" className="text-sm font-medium">
            Logo URL
          </label>
          <Input
            id="logo_url"
            disabled={isPending}
            placeholder="https://example.com/logo.png"
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

      <FormError message={error} />
      <FormSuccess message={success} />

      <LoadingButton type="submit" isLoading={isPending} className="w-full">
        Create organization
      </LoadingButton>
    </form>
  );
}
