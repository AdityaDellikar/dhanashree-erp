import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { serverEnv } from "@/config/env";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();
  const env = serverEnv();

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
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
}
