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
import { Input } from "@/components/ui/input";
import { signupAction } from "@/features/auth/actions";
import { type SignupInput, signupSchema } from "@/lib/validations/auth";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: SignupInput) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const response = await signupAction(values);
        if (response.success) {
          setSuccess(response.message);
          toast.success(response.message);
          router.push(
            `/verify-email?email=${encodeURIComponent(values.email)}`,
          );
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
      Already have an account?{" "}
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
      title="Create an Account"
      description="Enter your email to sign up for an account"
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm leading-none font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={isPending}
            {...register("email")}
            className={
              errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm leading-none font-medium text-zinc-700 dark:text-zinc-300"
          >
            Password
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
          Sign up
        </LoadingButton>
      </form>
    </AuthCard>
  );
}
