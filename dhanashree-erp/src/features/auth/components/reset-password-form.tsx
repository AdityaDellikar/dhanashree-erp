"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthCard } from "@/components/shared/auth-card";
import { FormError } from "@/components/shared/form-error";
import { FormSuccess } from "@/components/shared/form-success";
import { LoadingButton } from "@/components/shared/loading-button";
import { PasswordInput } from "@/components/shared/password-input";
import { resetPasswordAction } from "@/features/auth/actions";
import {
  type ResetPasswordInput,
  resetPasswordSchema,
} from "@/lib/validations/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordInput) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const response = await resetPasswordAction(values);
        if (response.success) {
          setSuccess(response.message);
          toast.success(response.message);
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          setError(response.message);
          toast.error(response.message);
        }
      } catch {
        setError("An unexpected error occurred. Please try again.");
        toast.error("An unexpected error occurred.");
      }
    });
  };

  const footer = (
    <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
      Back to{" "}
      <Link
        href="/login"
        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        Log in
      </Link>
    </div>
  );

  return (
    <AuthCard
      title="Reset Password"
      description="Enter your new password to secure your account"
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm leading-none font-medium text-zinc-700 dark:text-zinc-300"
          >
            New Password
          </label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            disabled={isPending}
            {...register("password")}
            className={
              errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {errors.password && (
            <p className="text-xs font-medium text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm leading-none font-medium text-zinc-700 dark:text-zinc-300"
          >
            Confirm Password
          </label>
          <PasswordInput
            id="confirmPassword"
            placeholder="••••••••"
            disabled={isPending}
            {...register("confirmPassword")}
            className={
              errors.confirmPassword
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }
          />
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <LoadingButton type="submit" className="w-full" isLoading={isPending}>
          Reset Password
        </LoadingButton>
      </form>
    </AuthCard>
  );
}
