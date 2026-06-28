import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const CURRENT_ORGANIZATION_COOKIE = "dhanashree-current-organization";

export const currentOrganizationCookieOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30,
  path: "/app",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};
