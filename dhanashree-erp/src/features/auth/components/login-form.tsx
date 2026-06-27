"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthCard } from "@/components/shared/auth-card";
import { FormError } from "@/components/shared/form-error";
import { FormSuccess } from "@/components/shared/form-success";
import { LoadingButton } from "@/components/shared/loading-button";
import { PasswordInput } from "@/components/shared/password-input";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/features/auth/actions";
import { type LoginInput, loginSchema } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const nextRedirect = searchParams.get("next") || "/app";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = (values: LoginInput) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const response = await loginAction(values);
        if (response.success) {
          setSuccess(response.message);
          toast.success(response.message);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          router.push(nextRedirect as any);
          router.refresh();
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
      Don&apos;t have an account?{" "}
      <Link
        href="/signup"
        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        Sign up
      </Link>
    </div>
  );

  return (
    <AuthCard
      title="Welcome Back"
      description="Enter your credentials to log in to your account"
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm leading-none font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Forgot password?
            </Link>
          </div>
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

        <div className="flex items-center space-x-2 py-1">
          <input
            id="remember"
            type="checkbox"
            disabled={isPending}
            {...register("remember")}
            className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
          <label
            htmlFor="remember"
            className="cursor-pointer text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            Remember my session
          </label>
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <LoadingButton type="submit" className="w-full" isLoading={isPending}>
          Log in
        </LoadingButton>
      </form>
    </AuthCard>
  );
}
