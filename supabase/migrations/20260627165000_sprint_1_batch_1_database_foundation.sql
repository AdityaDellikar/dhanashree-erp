-- Sprint 1 Batch 1: production database foundation for organization-based tenancy.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

do $$
begin
  create type public.organization_role as enum (
    'owner',
    'admin',
    'manager',
    'staff',
    'viewer'
  );
exception
  when duplicate_object then null;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email citext not null unique,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_format_check check (position('@' in email::text) > 1),
  constraint profiles_full_name_length_check check (full_name is null or char_length(trim(full_name)) between 1 and 160),
  constraint profiles_avatar_url_length_check check (avatar_url is null or char_length(avatar_url) <= 2048),
  constraint profiles_phone_length_check check (phone is null or char_length(trim(phone)) between 7 and 32)
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  gstin text,
  pan text,
  logo_url text,
  currency char(3) not null default 'INR',
  timezone text not null default 'Asia/Kolkata',
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_name_length_check check (char_length(trim(name)) between 2 and 160),
  constraint organizations_slug_format_check check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint organizations_gstin_format_check check (gstin is null or gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'),
  constraint organizations_pan_format_check check (pan is null or pan ~ '^[A-Z]{5}[0-9]{4}[A-Z]$'),
  constraint organizations_logo_url_length_check check (logo_url is null or char_length(logo_url) <= 2048),
  constraint organizations_currency_format_check check (currency ~ '^[A-Z]{3}$'),
  constraint organizations_timezone_length_check check (char_length(trim(timezone)) between 1 and 64)
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.organization_role not null default 'staff',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  constraint organization_members_pkey primary key (organization_id, user_id),
  constraint organization_members_status_check check (status in ('active', 'suspended'))
);

create table if not exists public.organization_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  email citext not null,
  role public.organization_role not null default 'staff',
  token text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint organization_invitations_email_format_check check (position('@' in email::text) > 1),
  constraint organization_invitations_token_length_check check (char_length(token) >= 32),
  constraint organization_invitations_expiry_check check (expires_at > created_at),
  constraint organization_invitations_acceptance_check check (accepted_at is null or accepted_at >= created_at)
);

create index if not exists profiles_created_at_idx on public.profiles (created_at desc);
create index if not exists profiles_email_idx on public.profiles (email);

create index if not exists organizations_created_by_idx on public.organizations (created_by);
create index if not exists organizations_created_at_idx on public.organizations (created_at desc);
create index if not exists organizations_slug_idx on public.organizations (slug);

create index if not exists organization_members_organization_id_idx on public.organization_members (organization_id);
create index if not exists organization_members_user_id_idx on public.organization_members (user_id);
create index if not exists organization_members_role_idx on public.organization_members (organization_id, role);
create index if not exists organization_members_created_at_idx on public.organization_members (created_at desc);

create index if not exists organization_invitations_organization_id_idx on public.organization_invitations (organization_id);
create index if not exists organization_invitations_email_idx on public.organization_invitations (email);
create index if not exists organization_invitations_created_by_idx on public.organization_invitations (created_by);
create index if not exists organization_invitations_created_at_idx on public.organization_invitations (created_at desc);
create index if not exists organization_invitations_expires_at_idx on public.organization_invitations (expires_at);
create unique index if not exists organization_invitations_active_email_key
  on public.organization_invitations (organization_id, email)
  where accepted_at is null;

comment on table public.profiles is 'One profile row per Supabase auth user. User-owned personal data is isolated with RLS.';
comment on table public.organizations is 'Tenant root table. Every business record in later sprints will belong to an organization.';
comment on table public.organization_members is 'Join table assigning authenticated users to organizations with a tenant-scoped role.';
comment on table public.organization_invitations is 'Organization invitation records. Tokens are accepted through accept_invitation and never trusted without email and expiry checks.';

comment on column public.organizations.slug is 'Stable URL-safe organization identifier. Globally unique and lowercase.';
comment on column public.organization_members.status is 'Membership lifecycle flag. Suspended users remain auditable but lose tenant access.';
comment on column public.organization_invitations.token is 'High-entropy invitation secret. Application code must generate at least 32 characters of entropy.';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is 'Trigger helper that maintains updated_at timestamps immediately before row updates.';

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    updated_at = now();

  return new;
end;
$$;

comment on function public.handle_new_auth_user() is 'Security definer trigger that creates a profile for each auth.users row. It only copies trusted auth metadata into public.profiles.';

create or replace function public.current_organization()
returns uuid
language plpgsql
stable
security definer
set search_path = public, auth
as $$
declare
  requested_organization_id text;
  parsed_organization_id uuid;
begin
  requested_organization_id := nullif(auth.jwt() -> 'app_metadata' ->> 'current_organization_id', '');

  if requested_organization_id is null then
    return null;
  end if;

  if requested_organization_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return null;
  end if;

  parsed_organization_id := requested_organization_id::uuid;

  if public.is_org_member(parsed_organization_id, auth.uid()) then
    return parsed_organization_id;
  end if;

  return null;
end;
$$;

comment on function public.current_organization() is 'Returns the current organization UUID from JWT app_metadata.current_organization_id only when the caller is an active member. Security definer avoids RLS recursion while validating tenant access.';

create or replace function public.is_org_member(target_organization_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_organization_id
      and om.user_id = target_user_id
      and om.status = 'active'
  );
$$;

comment on function public.is_org_member(uuid, uuid) is 'Checks active organization membership for RLS policies. Security definer prevents membership policies from recursively querying themselves.';

create or replace function public.is_org_admin(target_organization_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_organization_id
      and om.user_id = target_user_id
      and om.status = 'active'
      and om.role in ('owner', 'admin')
  );
$$;

comment on function public.is_org_admin(uuid, uuid) is 'Checks whether a user can administer tenant membership and invitations for an organization.';

create or replace function public.is_org_owner(target_organization_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_organization_id
      and om.user_id = target_user_id
      and om.status = 'active'
      and om.role = 'owner'
  );
$$;

comment on function public.is_org_owner(uuid, uuid) is 'Checks whether a user is an active owner of an organization. Used to protect owner-only membership changes.';

create or replace function public.create_organization(
  organization_name text,
  organization_slug text,
  organization_gstin text default null,
  organization_pan text default null,
  organization_logo_url text default null,
  organization_currency text default 'INR',
  organization_timezone text default 'Asia/Kolkata'
)
returns public.organizations
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  actor_id uuid := auth.uid();
  created_organization public.organizations;
begin
  if actor_id is null then
    raise exception 'Authentication is required to create an organization'
      using errcode = '28000';
  end if;

  insert into public.organizations (
    name,
    slug,
    gstin,
    pan,
    logo_url,
    currency,
    timezone,
    created_by
  )
  values (
    trim(organization_name),
    lower(trim(organization_slug)),
    nullif(upper(trim(organization_gstin)), ''),
    nullif(upper(trim(organization_pan)), ''),
    nullif(trim(organization_logo_url), ''),
    upper(coalesce(organization_currency, 'INR')),
    coalesce(nullif(trim(organization_timezone), ''), 'Asia/Kolkata'),
    actor_id
  )
  returning * into created_organization;

  insert into public.organization_members (
    organization_id,
    user_id,
    role,
    status
  )
  values (
    created_organization.id,
    actor_id,
    'owner',
    'active'
  );

  return created_organization;
end;
$$;

comment on function public.create_organization(text, text, text, text, text, text, text) is 'Creates an organization and atomically assigns the authenticated caller as owner. Security definer is required so organization creation is mediated through one audited path.';

create or replace function public.enforce_organization_owner_integrity()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  remaining_owner_count integer;
begin
  if tg_op = 'DELETE' then
    if old.role = 'owner' and old.status = 'active' then
      select count(*)
      into remaining_owner_count
      from public.organization_members om
      where om.organization_id = old.organization_id
        and om.user_id <> old.user_id
        and om.role = 'owner'
        and om.status = 'active';

      if remaining_owner_count = 0 then
        raise exception 'Organization must retain at least one active owner'
          using errcode = '23514';
      end if;
    end if;

    return old;
  end if;

  if old.role = 'owner'
    and old.status = 'active'
    and (new.role <> 'owner' or new.status <> 'active')
  then
    select count(*)
    into remaining_owner_count
    from public.organization_members om
    where om.organization_id = old.organization_id
      and om.user_id <> old.user_id
      and om.role = 'owner'
      and om.status = 'active';

    if remaining_owner_count = 0 then
      raise exception 'Organization must retain at least one active owner'
        using errcode = '23514';
    end if;
  end if;

  return new;
end;
$$;

comment on function public.enforce_organization_owner_integrity() is 'Trigger helper that prevents updates or deletes from leaving an organization without an active owner.';

create or replace function public.accept_invitation(invitation_token text)
returns public.organization_members
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  actor_id uuid := auth.uid();
  actor_email citext := nullif(auth.jwt() ->> 'email', '')::citext;
  invitation public.organization_invitations;
  accepted_membership public.organization_members;
begin
  if actor_id is null or actor_email is null then
    raise exception 'Authentication with an email address is required to accept an invitation'
      using errcode = '28000';
  end if;

  select *
  into invitation
  from public.organization_invitations oi
  where oi.token = invitation_token
  for update;

  if not found then
    raise exception 'Invitation was not found'
      using errcode = 'P0002';
  end if;

  if invitation.accepted_at is not null then
    raise exception 'Invitation has already been accepted'
      using errcode = '23505';
  end if;

  if invitation.expires_at <= now() then
    raise exception 'Invitation has expired'
      using errcode = '22023';
  end if;

  if invitation.email <> actor_email then
    raise exception 'Invitation email does not match the authenticated user'
      using errcode = '28000';
  end if;

  insert into public.organization_members (
    organization_id,
    user_id,
    role,
    status
  )
  values (
    invitation.organization_id,
    actor_id,
    invitation.role,
    'active'
  )
  on conflict (organization_id, user_id) do update
  set
    role = excluded.role,
    status = 'active'
  returning * into accepted_membership;

  update public.organization_invitations
  set accepted_at = now()
  where id = invitation.id;

  return accepted_membership;
end;
$$;

comment on function public.accept_invitation(text) is 'Accepts an invitation only when token, authenticated email, expiry, and unused state all match. Security definer allows safe membership creation without exposing cross-tenant rows.';

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

comment on trigger set_profiles_updated_at on public.profiles is 'Maintains profiles.updated_at on every profile update.';

drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at
before update on public.organizations
for each row
execute function public.set_updated_at();

comment on trigger set_organizations_updated_at on public.organizations is 'Maintains organizations.updated_at on every organization update.';

drop trigger if exists enforce_organization_owner_integrity on public.organization_members;
create trigger enforce_organization_owner_integrity
before update or delete on public.organization_members
for each row
execute function public.enforce_organization_owner_integrity();

comment on trigger enforce_organization_owner_integrity on public.organization_members is 'Prevents member changes from removing the final active owner of an organization.';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();


alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_invitations enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "organizations_select_member" on public.organizations;
create policy "organizations_select_member"
on public.organizations
for select
to authenticated
using (public.is_org_member(id));

drop policy if exists "organizations_update_admin" on public.organizations;
create policy "organizations_update_admin"
on public.organizations
for update
to authenticated
using (public.is_org_admin(id))
with check (public.is_org_admin(id));

drop policy if exists "organization_members_select_member" on public.organization_members;
create policy "organization_members_select_member"
on public.organization_members
for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "organization_members_insert_admin" on public.organization_members;
create policy "organization_members_insert_admin"
on public.organization_members
for insert
to authenticated
with check (
  public.is_org_admin(organization_id)
  and (role <> 'owner' or public.is_org_owner(organization_id))
);

drop policy if exists "organization_members_update_admin" on public.organization_members;
create policy "organization_members_update_admin"
on public.organization_members
for update
to authenticated
using (
  public.is_org_admin(organization_id)
  and (role <> 'owner' or public.is_org_owner(organization_id))
)
with check (
  public.is_org_admin(organization_id)
  and (role <> 'owner' or public.is_org_owner(organization_id))
);

drop policy if exists "organization_members_delete_admin" on public.organization_members;
create policy "organization_members_delete_admin"
on public.organization_members
for delete
to authenticated
using (
  public.is_org_admin(organization_id)
  and (role <> 'owner' or public.is_org_owner(organization_id))
);

drop policy if exists "organization_invitations_select_authorized" on public.organization_invitations;
create policy "organization_invitations_select_authorized"
on public.organization_invitations
for select
to authenticated
using (
  public.is_org_admin(organization_id)
  or email = nullif(auth.jwt() ->> 'email', '')::citext
);

drop policy if exists "organization_invitations_insert_admin" on public.organization_invitations;
create policy "organization_invitations_insert_admin"
on public.organization_invitations
for insert
to authenticated
with check (
  public.is_org_admin(organization_id)
  and created_by = auth.uid()
  and accepted_at is null
);

drop policy if exists "organization_invitations_update_admin" on public.organization_invitations;
create policy "organization_invitations_update_admin"
on public.organization_invitations
for update
to authenticated
using (public.is_org_admin(organization_id))
with check (public.is_org_admin(organization_id));

drop policy if exists "organization_invitations_delete_admin" on public.organization_invitations;
create policy "organization_invitations_delete_admin"
on public.organization_invitations
for delete
to authenticated
using (public.is_org_admin(organization_id));

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.organizations from anon, authenticated;
revoke all on table public.organization_members from anon, authenticated;
revoke all on table public.organization_invitations from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (full_name, avatar_url, phone) on table public.profiles to authenticated;

grant select on table public.organizations to authenticated;
grant update (name, gstin, pan, logo_url, currency, timezone) on table public.organizations to authenticated;

grant select on table public.organization_members to authenticated;
grant insert (organization_id, user_id, role, status) on table public.organization_members to authenticated;
grant update (role, status) on table public.organization_members to authenticated;
grant delete on table public.organization_members to authenticated;

grant select on table public.organization_invitations to authenticated;
grant insert (organization_id, email, role, token, expires_at, created_by) on table public.organization_invitations to authenticated;
grant update (role, expires_at) on table public.organization_invitations to authenticated;
grant delete on table public.organization_invitations to authenticated;

revoke all on function public.set_updated_at() from public;
revoke all on function public.handle_new_auth_user() from public;
revoke all on function public.current_organization() from public;
revoke all on function public.is_org_member(uuid, uuid) from public;
revoke all on function public.is_org_admin(uuid, uuid) from public;
revoke all on function public.is_org_owner(uuid, uuid) from public;
revoke all on function public.create_organization(text, text, text, text, text, text, text) from public;
revoke all on function public.accept_invitation(text) from public;
revoke all on function public.enforce_organization_owner_integrity() from public;

grant execute on function public.current_organization() to authenticated;
grant execute on function public.is_org_member(uuid, uuid) to authenticated;
grant execute on function public.is_org_admin(uuid, uuid) to authenticated;
grant execute on function public.is_org_owner(uuid, uuid) to authenticated;
grant execute on function public.create_organization(text, text, text, text, text, text, text) to authenticated;
grant execute on function public.accept_invitation(text) to authenticated;
