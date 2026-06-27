"use server";

import { cookies } from "next/headers";

import { serverEnv } from "@/config/env";
import { createClient } from "@/lib/supabase/server";
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
  type LoginInput,
  loginSchema,
  type ResetPasswordInput,
  resetPasswordSchema,
  type SignupInput,
  signupSchema,
} from "@/lib/validations/auth";

export async function loginAction(data: LoginInput) {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password, remember } = parsed.data;
  const supabase = await createClient();
  const cookieStore = await cookies();

  // Set the remember-me cookie first so setAll handles it during sign in
  cookieStore.set("sb-remember-me", remember ? "true" : "false", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: remember ? 60 * 60 * 24 * 30 : undefined, // 30 days
  });

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    cookieStore.delete("sb-remember-me");
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Logged in successfully.",
  };
}

export async function signupAction(data: SignupInput) {
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();
  const env = serverEnv();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/api/auth/confirm?next=/app`,
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message:
      "Registration successful! Please check your email for a verification link.",
  };
}

export async function forgotPasswordAction(data: ForgotPasswordInput) {
  const parsed = forgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email } = parsed.data;
  const supabase = await createClient();
  const env = serverEnv();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/api/auth/confirm?next=/reset-password`,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message:
      "If an account exists, a password reset link has been sent to your email.",
  };
}

export async function resetPasswordAction(data: ResetPasswordInput) {
  const parsed = resetPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Password reset successful! You can now log in.",
  };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete("sb-remember-me");

  return {
    success: true,
    message: "Logged out successfully.",
  };
}
