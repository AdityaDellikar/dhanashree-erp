"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailPlus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormError } from "@/components/shared/form-error";
import { FormSuccess } from "@/components/shared/form-success";
import { LoadingButton } from "@/components/shared/loading-button";
import { Input } from "@/components/ui/input";
import { inviteMember } from "@/features/organizations/actions";
import {
  type InviteMemberFormInput,
  type InviteMemberInput,
  inviteMemberSchema,
  organizationRoleOptions,
} from "@/features/organizations/schemas";

type InviteMemberFormProps = {
  canManage: boolean;
};

export function InviteMemberForm({ canManage }: InviteMemberFormProps) {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<InviteMemberFormInput, unknown, InviteMemberInput>({
    defaultValues: {
      email: "",
      role: "staff",
    },
    resolver: zodResolver(inviteMemberSchema),
  });

  const onSubmit = (values: InviteMemberInput) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      const response = await inviteMember(values);

      if (!response.success) {
        setError(response.message);
        toast.error(response.message);
        return;
      }

      setSuccess(response.message);
      toast.success(response.message);
      reset();
    });
  };

  if (!canManage) {
    return (
      <p className="text-muted-foreground rounded-md border p-3 text-sm">
        Only owners and admins can create invitations.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
        <div className="space-y-2">
          <label htmlFor="invite-email" className="text-sm font-medium">
            Email address
          </label>
          <Input
            id="invite-email"
            type="email"
            autoComplete="email"
            disabled={isPending}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-xs font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="invite-role" className="text-sm font-medium">
            Role
          </label>
          <select
            id="invite-role"
            disabled={isPending}
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm shadow-sm disabled:opacity-50"
            {...register("role")}
          >
            {organizationRoleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      <LoadingButton type="submit" isLoading={isPending}>
        <MailPlus />
        Save invitation
      </LoadingButton>
    </form>
  );
}
