import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata = {
  title: "Reset Password",
  description: "Reset your account password",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
