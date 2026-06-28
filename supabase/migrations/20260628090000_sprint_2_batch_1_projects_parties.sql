-- Sprint 2 Batch 1: projects and parties foundation.

do $$
begin
  create type public.project_status as enum (
    'planned',
    'active',
    'on_hold',
    'completed',
    'cancelled'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.party_type as enum (
    'supplier',
    'customer',
    'subcontractor',
    'other'
  );
exception
  when duplicate_object then null;
end;
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  code text not null,
  description text,
  status public.project_status not null default 'planned',
  start_date date,
  end_date date,
  budget_amount numeric(14,2),
  location text,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_name_length_check check (char_length(trim(name)) between 2 and 160),
  constraint projects_code_length_check check (char_length(trim(code)) between 1 and 40),
  constraint projects_code_format_check check (code ~ '^[A-Za-z0-9][A-Za-z0-9_-]*$'),
  constraint projects_description_length_check check (description is null or char_length(description) <= 2000),
  constraint projects_date_order_check check (end_date is null or start_date is null or end_date >= start_date),
  constraint projects_budget_amount_check check (budget_amount is null or budget_amount >= 0),
  constraint projects_location_length_check check (location is null or char_length(trim(location)) between 1 and 240),
  constraint projects_organization_code_key unique (organization_id, code)
);

create table if not exists public.parties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  type public.party_type not null,
  contact_person text,
  phone text,
  email citext,
  address text,
  gstin text,
  notes text,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint parties_name_length_check check (char_length(trim(name)) between 2 and 160),
  constraint parties_contact_person_length_check check (contact_person is null or char_length(trim(contact_person)) between 1 and 160),
  constraint parties_phone_length_check check (phone is null or char_length(trim(phone)) between 7 and 32),
  constraint parties_email_format_check check (email is null or position('@' in email::text) > 1),
  constraint parties_address_length_check check (address is null or char_length(address) <= 1000),
  constraint parties_gstin_format_check check (gstin is null or gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'),
  constraint parties_notes_length_check check (notes is null or char_length(notes) <= 2000)
);

create index if not exists projects_organization_id_idx on public.projects (organization_id);
create index if not exists projects_created_by_idx on public.projects (created_by);
create index if not exists projects_status_idx on public.projects (organization_id, status);
create index if not exists projects_created_at_idx on public.projects (created_at desc);

create index if not exists parties_organization_id_idx on public.parties (organization_id);
create index if not exists parties_created_by_idx on public.parties (created_by);
create index if not exists parties_type_idx on public.parties (organization_id, type);
create index if not exists parties_name_idx on public.parties (organization_id, name);
create index if not exists parties_created_at_idx on public.parties (created_at desc);

comment on table public.projects is 'Project foundation records scoped to an organization. Cashflow entries will attach to projects in later batches.';
comment on table public.parties is 'Shared organization-scoped parties for suppliers, customers, subcontractors, and other contacts.';

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

drop trigger if exists set_parties_updated_at on public.parties;
create trigger set_parties_updated_at
before update on public.parties
for each row
execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.parties enable row level security;

drop policy if exists "projects_select_member" on public.projects;
create policy "projects_select_member"
on public.projects
for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "projects_insert_member" on public.projects;
create policy "projects_insert_member"
on public.projects
for insert
to authenticated
with check (
  public.is_org_member(organization_id)
  and created_by = auth.uid()
);

drop policy if exists "projects_update_member" on public.projects;
create policy "projects_update_member"
on public.projects
for update
to authenticated
using (public.is_org_member(organization_id))
with check (
  public.is_org_member(organization_id)
);

drop policy if exists "parties_select_member" on public.parties;
create policy "parties_select_member"
on public.parties
for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "parties_insert_member" on public.parties;
create policy "parties_insert_member"
on public.parties
for insert
to authenticated
with check (
  public.is_org_member(organization_id)
  and created_by = auth.uid()
);

drop policy if exists "parties_update_member" on public.parties;
create policy "parties_update_member"
on public.parties
for update
to authenticated
using (public.is_org_member(organization_id))
with check (
  public.is_org_member(organization_id)
);

revoke all on table public.projects from anon, authenticated;
revoke all on table public.parties from anon, authenticated;

grant select on table public.projects to authenticated;
grant insert (organization_id, name, code, description, status, start_date, end_date, budget_amount, location, created_by) on table public.projects to authenticated;
grant update (name, code, description, status, start_date, end_date, budget_amount, location) on table public.projects to authenticated;

grant select on table public.parties to authenticated;
grant insert (organization_id, name, type, contact_person, phone, email, address, gstin, notes, created_by) on table public.parties to authenticated;
grant update (name, type, contact_person, phone, email, address, gstin, notes) on table public.parties to authenticated;
