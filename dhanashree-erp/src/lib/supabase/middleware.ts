import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { isSupabaseConfigured, serverEnv } from "@/config/env";
import type { Database } from "@/types/database";

export async function updateSession(
  request: NextRequest,
): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const env = serverEnv();
  const rememberMe = request.cookies.get("sb-remember-me")?.value;
  const isSessionOnly = rememberMe === "false";

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, options, value }) => {
            const finalOptions = isSessionOnly
              ? { ...options, maxAge: undefined, expires: undefined }
              : options;
            response.cookies.set(name, value, finalOptions);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/verify-email";

  const isProtectedRoute = pathname === "/app" || pathname.startsWith("/app/");

  if (user && isAuthRoute) {
    const redirectUrl = new URL("/app", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
