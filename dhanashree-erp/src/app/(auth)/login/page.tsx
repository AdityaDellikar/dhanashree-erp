import { Suspense } from "react";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Login",
  description: "Log in to your account",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="py-4 text-center">Loading login form...</div>}
    >
      <LoginForm />
    </Suspense>
  );
}
