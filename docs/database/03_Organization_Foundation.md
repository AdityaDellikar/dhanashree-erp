# Organization Database Foundation

Version: 1.0

Scope: Sprint 1 Batch 1

Database: Supabase PostgreSQL

## Purpose

This foundation establishes the production multi-tenant boundary for Dhanashree ERP. Every future business table should attach to `public.organizations.id` and use organization-aware RLS policies.

## Extensions

- `pgcrypto`: provides `gen_random_uuid()` for UUID primary keys.
- `citext`: stores case-insensitive email values for profiles and invitations.

## Enums

### `organization_role`

- `owner`
- `admin`
- `manager`
- `staff`
- `viewer`

`owner` and `admin` are administrative roles. Only `owner` can create or preserve owner-level membership changes.

## Tables

### `profiles`

One public profile per Supabase Auth user.

Columns:

- `id uuid primary key references auth.users(id) on delete cascade`
- `email citext not null unique`
- `full_name text`
- `avatar_url text`
- `phone text`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Security model:

- Users can select only their own profile.
- Users can update only their own profile fields.
- Profile rows are created automatically by the `on_auth_user_created` trigger.

### `organizations`

Tenant root table.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `name text not null`
- `slug text not null unique`
- `gstin text`
- `pan text`
- `logo_url text`
- `currency char(3) not null default 'INR'`
- `timezone text not null default 'Asia/Kolkata'`
- `created_by uuid not null references auth.users(id) on delete restrict`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Important constraints:

- `slug` must be lowercase URL-safe text.
- `gstin`, `pan`, and `currency` are format checked.
- `name`, `logo_url`, and `timezone` have bounded lengths.

### `organization_members`

Connects users to organizations.

Columns:

- `organization_id uuid not null references organizations(id) on delete cascade`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `role organization_role not null default 'staff'`
- `status text not null default 'active'`
- `created_at timestamptz not null default now()`

Primary key:

- `(organization_id, user_id)`

Status values:

- `active`
- `suspended`

Owner integrity:

- A trigger prevents updates or deletes that would leave an organization without at least one active owner.

### `organization_invitations`

Stores pending and accepted invitations.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null references organizations(id) on delete cascade`
- `email citext not null`
- `role organization_role not null default 'staff'`
- `token text not null unique`
- `expires_at timestamptz not null`
- `accepted_at timestamptz`
- `created_by uuid not null references auth.users(id) on delete restrict`
- `created_at timestamptz not null default now()`

Important constraints:

- Invitation tokens must be at least 32 characters.
- `expires_at` must be later than `created_at`.
- Only one unaccepted invitation can exist for an organization and email pair.

## Relationships

- `auth.users` 1:1 `profiles`
- `auth.users` 1:N `organizations.created_by`
- `organizations` 1:N `organization_members`
- `auth.users` 1:N `organization_members`
- `organizations` 1:N `organization_invitations`
- `auth.users` 1:N `organization_invitations.created_by`

Future business modules should reference `organizations.id` directly. Project, finance, workforce, supplier, and document records should all use organization membership helper functions in their RLS policies.

## Index Strategy

Indexes are created for:

- Foreign keys: `created_by`, `organization_id`, `user_id`
- Tenant lookups: `organization_members.organization_id`, `organization_members.user_id`
- User lookup fields: `profiles.email`, `organization_invitations.email`
- Public routing: `organizations.slug`
- Operational sorting: `created_at desc`
- Invitation expiry checks: `organization_invitations.expires_at`

The unique active invitation index prevents duplicate pending invitations without blocking historical accepted invitations.

## Helper Functions

### `current_organization()`

Returns the UUID stored in `auth.jwt().app_metadata.current_organization_id` only when the authenticated user is an active member of that organization. It returns `null` when the claim is missing, malformed, or unauthorized.

Security:

- `security definer`
- Fixed `search_path`
- Validates UUID format before casting
- Verifies active membership before returning a tenant id

### `is_org_member(target_organization_id uuid, target_user_id uuid default auth.uid())`

Returns whether a user has an active membership in an organization.

Security:

- `security definer`
- Used by RLS policies to avoid recursive reads on `organization_members`

### `is_org_admin(target_organization_id uuid, target_user_id uuid default auth.uid())`

Returns whether a user is an active `owner` or `admin`.

Usage:

- Organization updates
- Membership management
- Invitation management

### `is_org_owner(target_organization_id uuid, target_user_id uuid default auth.uid())`

Returns whether a user is an active owner.

Usage:

- Protects owner-level role changes.
- Prevents admins from creating, changing, or deleting owner memberships.

### `create_organization(...)`

Creates an organization and atomically inserts the authenticated caller as `owner`.

Security:

- Requires `auth.uid()`.
- Normalizes slug, GSTIN, PAN, currency, and optional text inputs.
- Relies on table constraints for final validation.
- Uses `security definer` so organization creation goes through one controlled path.

### `accept_invitation(invitation_token text)`

Accepts a pending invitation and creates or reactivates the authenticated user's membership.

Security:

- Requires authenticated user and email claim.
- Locks the invitation row during acceptance.
- Validates token, expiry, accepted state, and email match.
- Marks the invitation accepted only after membership is written.

## Trigger Strategy

### `set_updated_at`

Maintains `updated_at` for:

- `profiles`
- `organizations`

### `handle_new_auth_user`

Runs after insert on `auth.users` and creates the matching profile row.

### `enforce_organization_owner_integrity`

Runs before update or delete on `organization_members` and prevents the last active owner from being removed, demoted, or suspended.

## RLS Strategy

RLS is enabled on every public table in this batch.

### Profiles

- `profiles_select_own`: user can read only `profiles.id = auth.uid()`.
- `profiles_update_own`: user can update only their own profile.

### Organizations

- `organizations_select_member`: active members can read their organizations.
- `organizations_update_admin`: active owners/admins can update organization settings.

### Organization Members

- `organization_members_select_member`: members can read members in their own organization.
- `organization_members_insert_admin`: owners/admins can add members, but only owners can create owner memberships.
- `organization_members_update_admin`: owners/admins can update memberships, but only owners can update owner memberships.
- `organization_members_delete_admin`: owners/admins can remove memberships, but only owners can remove owners.

The owner-integrity trigger adds a second database-level guarantee that an organization always retains one active owner.

### Organization Invitations

- `organization_invitations_select_authorized`: owners/admins can read organization invitations; invited users can read invitations for their own email.
- `organization_invitations_insert_admin`: owners/admins can create invitations for their organization.
- `organization_invitations_update_admin`: owners/admins can update invitations.
- `organization_invitations_delete_admin`: owners/admins can delete invitations.

## Permissions

Anonymous access is revoked for all tables and functions in this batch.

Authenticated users receive:

- Narrow profile read/update access, filtered by RLS.
- Organization read/update access, filtered by RLS.
- Membership and invitation access, filtered by RLS and column-level grants.
- Invitation acceptance writes `accepted_at` only through `accept_invitation`.
- Execute access only on reusable helper functions intended for application use.

Trigger-only functions are not granted for direct execution.

## TypeScript Types

The shared Supabase database type is located at:

`dhanashree-erp/src/types/database.ts`

It includes:

- Table row, insert, and update shapes
- `organization_role`
- RPC function arguments and return types
- Relationship metadata

Regenerate this file from the linked Supabase project after applying migrations to confirm the generated output exactly matches the remote database.
