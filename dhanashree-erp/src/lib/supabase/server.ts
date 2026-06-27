import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { serverEnv } from "@/config/env";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();
  const env = serverEnv();
  const rememberMe = cookieStore.get("sb-remember-me")?.value;
  const isSessionOnly = rememberMe === "false";

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, options, value }) => {
            const finalOptions = isSessionOnly
              ? { ...options, maxAge: undefined, expires: undefined }
              : options;
            cookieStore.set(name, value, finalOptions);
          });
        },
      },
    },
  );
}
