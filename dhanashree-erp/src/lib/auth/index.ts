import { createClient } from "@/lib/supabase/server";

/**
 * Retrieves the active Supabase session.
 * Safe to call from server components, actions, or route handlers.
 */
export async function getSession() {
  const supabase = await createClient();
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) return null;
    return session;
  } catch {
    return null;
  }
}

/**
 * Retrieves the currently authenticated Supabase user.
 * Performs a secure request to the Supabase API to validate the JWT.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Retrieves the public profile matching the user ID from the database profiles table.
 */
export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}
