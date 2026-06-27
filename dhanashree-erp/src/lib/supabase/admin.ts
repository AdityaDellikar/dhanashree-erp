import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { serverEnv } from "@/config/env";
import type { Database } from "@/types/database";

export function createAdminClient() {
  const env = serverEnv();

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for admin Supabase access.",
    );
  }

  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
