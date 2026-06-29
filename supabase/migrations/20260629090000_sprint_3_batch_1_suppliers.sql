-- Sprint 3 Batch 1: supplier management foundation.

do $$
begin
  create type public.supplier_status as enum (
    'active',
    'inactive'
  );
exception
  when duplicate_object then null;
end;
$$;

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  contact_person text,
  phone text,
  email citext,
  address text,
  gst_number text,
  notes text,
  status public.supplier_status not null default 'active',
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint suppliers_name_length_check check (char_length(trim(name)) between 2 and 160),
  constraint suppliers_contact_person_length_check check (contact_person is null or char_length(trim(contact_person)) between 1 and 160),
  constraint suppliers_phone_length_check check (phone is null or char_length(trim(phone)) between 7 and 32),
  constraint suppliers_email_format_check check (email is null or position('@' in email::text) > 1),
  constraint suppliers_address_length_check check (address is null or char_length(address) <= 1000),
  constraint suppliers_gst_number_format_check check (gst_number is null or gst_number ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'),
  constraint suppliers_notes_length_check check (notes is null or char_length(notes) <= 2000)
);

alter table public.cashflow_entries
add column if not exists supplier_id uuid references public.suppliers (id) on delete set null;

create index if not exists suppliers_organization_id_idx on public.suppliers (organization_id);
create index if not exists suppliers_created_by_idx on public.suppliers (created_by);
create index if not exists suppliers_status_idx on public.suppliers (organization_id, status);
create index if not exists suppliers_name_idx on public.suppliers (organization_id, name);
create index if not exists suppliers_created_at_idx on public.suppliers (created_at desc);
create index if not exists cashflow_entries_supplier_id_idx on public.cashflow_entries (supplier_id);

comment on table public.suppliers is 'Dedicated organization-scoped supplier records for procurement and supplier payables.';
comment on column public.cashflow_entries.supplier_id is 'Optional supplier link for procurement and payable-related cashflow entries.';

drop trigger if exists set_suppliers_updated_at on public.suppliers;
create trigger set_suppliers_updated_at
before update on public.suppliers
for each row
execute function public.set_updated_at();

create or replace function public.validate_cashflow_supplier_scope()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.supplier_id is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.suppliers
    where suppliers.id = new.supplier_id
      and suppliers.organization_id = new.organization_id
  ) then
    raise exception 'Selected supplier does not belong to this organization.';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_cashflow_entries_supplier_scope on public.cashflow_entries;
create trigger validate_cashflow_entries_supplier_scope
before insert or update of supplier_id, organization_id on public.cashflow_entries
for each row
execute function public.validate_cashflow_supplier_scope();

alter table public.suppliers enable row level security;

drop policy if exists "suppliers_select_member" on public.suppliers;
create policy "suppliers_select_member"
on public.suppliers
for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "suppliers_insert_member" on public.suppliers;
create policy "suppliers_insert_member"
on public.suppliers
for insert
to authenticated
with check (
  public.is_org_member(organization_id)
  and created_by = auth.uid()
);

drop policy if exists "suppliers_update_member" on public.suppliers;
create policy "suppliers_update_member"
on public.suppliers
for update
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

revoke all on table public.suppliers from anon, authenticated;

grant select on table public.suppliers to authenticated;
grant insert (
  organization_id,
  name,
  contact_person,
  phone,
  email,
  address,
  gst_number,
  notes,
  status,
  created_by
) on table public.suppliers to authenticated;
grant update (
  name,
  contact_person,
  phone,
  email,
  address,
  gst_number,
  notes,
  status
) on table public.suppliers to authenticated;

grant insert (supplier_id) on table public.cashflow_entries to authenticated;
grant update (supplier_id) on table public.cashflow_entries to authenticated;
