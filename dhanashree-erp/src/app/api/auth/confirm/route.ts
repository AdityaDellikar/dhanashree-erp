import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") || "/app";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // If verifying email from signup, redirect to stateful success page
      if (type === "signup" || type === "invite") {
        const verifyRedirect = new URL("/verify-email", request.url);
        verifyRedirect.searchParams.set("verified", "true");
        return NextResponse.redirect(verifyRedirect);
      }

      // Otherwise, redirect to the target page (e.g. /reset-password)
      return NextResponse.redirect(redirectTo);
    }

    // Redirect to stateful error page on verification failure
    const errorRedirect = new URL("/verify-email", request.url);
    const errorCode = error.message.includes("expired") ? "expired" : "invalid";
    errorRedirect.searchParams.set("error", errorCode);
    return NextResponse.redirect(errorRedirect);
  }

  // Fallback redirect on missing parameters
  const fallbackRedirect = new URL("/verify-email", request.url);
  fallbackRedirect.searchParams.set("error", "invalid");
  return NextResponse.redirect(fallbackRedirect);
}
