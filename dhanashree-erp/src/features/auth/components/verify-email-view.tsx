"use client";

import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AuthCard } from "@/components/shared/auth-card";
import { Button } from "@/components/ui/button";

export function VerifyEmailView() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const verified = searchParams.get("verified") === "true";
  const error = searchParams.get("error");

  let title = "Check Your Email";
  let description = "We sent a verification link to your email address.";
  let statusIcon = (
    <Mail className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
  );
  let bodyContent = (
    <div className="space-y-4 text-center">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Please click the link in the email to activate your account.
        {email && (
          <>
            {" "}
            We sent it to{" "}
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {email}
            </span>
            .
          </>
        )}
      </p>
      <div className="pt-4">
        <Button asChild className="w-full">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    </div>
  );

  if (verified) {
    title = "Email Verified!";
    description = "Your email has been successfully verified.";
    statusIcon = (
      <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
    );
    bodyContent = (
      <div className="space-y-4 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Thank you for verifying your email. You can now access your dashboard.
        </p>
        <div className="pt-4">
          <Button asChild className="w-full">
            <Link href="/app">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  } else if (error) {
    title = "Verification Failed";
    description = "There was a problem verifying your email address.";
    statusIcon = (
      <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
    );

    let errorMessage = "The verification token is invalid or has expired.";
    if (error === "expired") {
      errorMessage =
        "The verification link has expired. Please sign up again or request another verification link.";
    }

    bodyContent = (
      <div className="space-y-4 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {errorMessage}
        </p>
        <div className="space-y-2 pt-4">
          <Button asChild className="w-full" variant="default">
            <Link href="/signup">Sign Up Again</Link>
          </Button>
          <Button asChild className="w-full" variant="outline">
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AuthCard title={title} description={description}>
      <div className="flex flex-col items-center justify-center space-y-6 py-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          {statusIcon}
        </div>
        <div className="w-full">{bodyContent}</div>
      </div>
    </AuthCard>
  );
}
