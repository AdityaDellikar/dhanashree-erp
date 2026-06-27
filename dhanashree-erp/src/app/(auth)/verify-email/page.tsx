import { Suspense } from "react";

import { VerifyEmailView } from "@/features/auth/components/verify-email-view";

export const metadata = {
  title: "Verify Email",
  description: "Confirm your email address to activate your account",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-4">Loading verification...</div>}>
      <VerifyEmailView />
    </Suspense>
  );
}
