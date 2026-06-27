import type { ReactNode } from "react";

import { AuthLayout } from "@/components/shared/auth-layout";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthPagesLayout({ children }: AuthLayoutProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
