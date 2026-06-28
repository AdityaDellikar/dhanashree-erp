import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CURRENT_ORGANIZATION_COOKIE } from "@/lib/organizations/cookies";
import { createClient } from "@/lib/supabase/server";
import type { Enums, Tables } from "@/types/database";

import { setCurrentOrganizationSchema } from "./schemas";

export type Organization = Tables<"organizations">;
export type OrganizationRole = Enums<"organization_role">;

export type UserOrganization = Organization & {
  memberRole: OrganizationRole;
  memberStatus: string;
};

export type CurrentOrganization = UserOrganization;

export type OrganizationMember = Tables<"organization_members"> & {
  email: string | null;
  fullName: string | null;
};

export type OrganizationInvitation = Pick<
  Tables<"organization_invitations">,
  "created_at" | "email" | "expires_at" | "id" | "role"
>;

function requireAuthenticatedUserId(userId?: string) {
  if (!userId) {
    redirect("/login");
  }

  return userId;
}

export async function getUserOrganizations(): Promise<UserOrganization[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = requireAuthenticatedUserId(user?.id);

  const [organizationsResponse, membershipsResponse] = await Promise.all([
    supabase.from("organizations").select("*").order("name"),
    supabase
      .from("organization_members")
      .select("organization_id, role, status")
      .eq("user_id", userId)
      .eq("status", "active"),
  ]);

  if (organizationsResponse.error) {
    throw new Error(organizationsResponse.error.message);
  }

  if (membershipsResponse.error) {
    throw new Error(membershipsResponse.error.message);
  }

  const membershipsByOrganization = new Map(
    (membershipsResponse.data ?? []).map((membership) => [
      membership.organization_id,
      membership,
    ]),
  );

  return (organizationsResponse.data ?? [])
    .map((organization) => {
      const membership = membershipsByOrganization.get(organization.id);

      if (!membership) return null;

      return {
        ...organization,
        memberRole: membership.role,
        memberStatus: membership.status,
      };
    })
    .filter((organization): organization is UserOrganization =>
      Boolean(organization),
    );
}

export async function getCurrentOrganization(): Promise<CurrentOrganization | null> {
  const organizations = await getUserOrganizations();

  if (organizations.length === 0) {
    return null;
  }

  const cookieStore = await cookies();
  const parsed = setCurrentOrganizationSchema.safeParse({
    organizationId: cookieStore.get(CURRENT_ORGANIZATION_COOKIE)?.value,
  });

  if (!parsed.success) {
    return organizations[0];
  }

  return (
    organizations.find(
      (organization) => organization.id === parsed.data.organizationId,
    ) ?? organizations[0]
  );
}

export async function requireCurrentOrganization(): Promise<CurrentOrganization> {
  const organization = await getCurrentOrganization();

  if (!organization) {
    redirect("/app/onboarding/organization");
  }

  return organization;
}

export async function getOrganizationMembers(): Promise<OrganizationMember[]> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = requireAuthenticatedUserId(user?.id);

  const { data: members, error: membersError } = await supabase
    .from("organization_members")
    .select("*")
    .eq("organization_id", currentOrganization.id)
    .order("created_at");

  if (membersError) {
    throw new Error(membersError.message);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  return (members ?? []).map((member) => ({
    ...member,
    email: member.user_id === userId ? (profile?.email ?? null) : null,
    fullName: member.user_id === userId ? (profile?.full_name ?? null) : null,
  }));
}

export async function getOrganizationInvitations(): Promise<
  OrganizationInvitation[]
> {
  const currentOrganization = await requireCurrentOrganization();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organization_invitations")
    .select("id, email, role, expires_at, created_at")
    .eq("organization_id", currentOrganization.id)
    .is("accepted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function currentUserCanManageOrganization(
  organizationId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_org_admin", {
    target_organization_id: organizationId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
