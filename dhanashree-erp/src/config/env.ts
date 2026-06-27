import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
});

const serverSchema = clientSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

const supabasePublicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
});

type ClientEnv = z.infer<typeof clientSchema>;
type ServerEnv = z.infer<typeof serverSchema>;

function formatEnvError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
}

function parseClientEnv(): ClientEnv {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid client environment: ${formatEnvError(parsed.error)}`,
    );
  }

  return parsed.data;
}

function parseServerEnv(): ServerEnv {
  const parsed = serverSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid server environment: ${formatEnvError(parsed.error)}`,
    );
  }

  return parsed.data;
}

export function isSupabaseConfigured(): boolean {
  return supabasePublicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  }).success;
}

export const clientEnv = parseClientEnv;
export const serverEnv = parseServerEnv;
