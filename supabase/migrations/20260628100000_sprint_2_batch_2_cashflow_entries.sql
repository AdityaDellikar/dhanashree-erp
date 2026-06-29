-- Sprint 2 Batch 2: MVP cashflow engine.

do $$
begin
  create type public.cashflow_entry_type as enum (
    'income',
    'expense'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.cashflow_status as enum (
    'pending',
    'completed',
    'cancelled'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.payment_mode as enum (
    'cash',
    'bank',
    'upi',
    'cheque',
    'other'
  );
exception
  when duplicate_object then null;
end;
$$;

create table if not exists public.cashflow_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete restrict,
  party_id uuid references public.parties (id) on delete set null,
  entry_type public.cashflow_entry_type not null,
  category text not null,
  description text,
  amount numeric(14,2) not null,
  transaction_date date not null,
  payment_mode public.payment_mode not null,
  reference_number text,
  status public.cashflow_status not null default 'completed',
  notes text,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cashflow_entries_category_length_check check (char_length(trim(category)) between 2 and 120),
  constraint cashflow_entries_description_length_check check (description is null or char_length(description) <= 1000),
  constraint cashflow_entries_amount_positive_check check (amount > 0),
  constraint cashflow_entries_reference_number_length_check check (reference_number is null or char_length(trim(reference_number)) between 1 and 120),
  constraint cashflow_entries_notes_length_check check (notes is null or char_length(notes) <= 2000)
);

create index if not exists cashflow_entries_organization_id_idx on public.cashflow_entries (organization_id);
create index if not exists cashflow_entries_project_id_idx on public.cashflow_entries (project_id);
create index if not exists cashflow_entries_party_id_idx on public.cashflow_entries (party_id);
create index if not exists cashflow_entries_transaction_date_idx on public.cashflow_entries (organization_id, transaction_date desc);
create index if not exists cashflow_entries_status_idx on public.cashflow_entries (organization_id, status);
create index if not exists cashflow_entries_entry_type_idx on public.cashflow_entries (organization_id, entry_type);
create index if not exists cashflow_entries_created_at_idx on public.cashflow_entries (created_at desc);

comment on table public.cashflow_entries is 'Organization-scoped cash inflow and outflow records attached to projects and optionally parties.';

drop trigger if exists set_cashflow_entries_updated_at on public.cashflow_entries;
create trigger set_cashflow_entries_updated_at
before update on public.cashflow_entries
for each row
execute function public.set_updated_at();

alter table public.cashflow_entries enable row level security;

drop policy if exists "cashflow_entries_select_member" on public.cashflow_entries;
create policy "cashflow_entries_select_member"
on public.cashflow_entries
for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "cashflow_entries_insert_member" on public.cashflow_entries;
create policy "cashflow_entries_insert_member"
on public.cashflow_entries
for insert
to authenticated
with check (
  public.is_org_member(organization_id)
  and created_by = auth.uid()
);

drop policy if exists "cashflow_entries_update_member" on public.cashflow_entries;
create policy "cashflow_entries_update_member"
on public.cashflow_entries
for update
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

revoke all on table public.cashflow_entries from anon, authenticated;

grant select on table public.cashflow_entries to authenticated;
grant insert (
  organization_id,
  project_id,
  party_id,
  entry_type,
  category,
  description,
  amount,
  transaction_date,
  payment_mode,
  reference_number,
  status,
  notes,
  created_by
) on table public.cashflow_entries to authenticated;
grant update (
  project_id,
  party_id,
  entry_type,
  category,
  description,
  amount,
  transaction_date,
  payment_mode,
  reference_number,
  status,
  notes
) on table public.cashflow_entries to authenticated;
