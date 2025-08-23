-- Create ui_schemas table for SDUI (Server-Driven UI) schemas
create table if not exists public.ui_schemas (
  id uuid default gen_random_uuid() primary key,
  tenant_id text not null,
  screen_name text not null,
  schema_content jsonb not null,
  version integer not null default 1,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure unique version numbers per tenant/screen combination
  constraint unique_tenant_screen_version unique (tenant_id, screen_name, version)
);

-- Create indexes for common access patterns
create index ui_schemas_tenant_screen_idx on public.ui_schemas (tenant_id, screen_name);

-- Partial unique index: only one active schema per tenant/screen combination
-- This also covers queries for active schemas (tenant_id, screen_name, is_active=true)
create unique index ui_schemas_active_unique_idx on public.ui_schemas (tenant_id, screen_name) where is_active = true;

-- Index for version history queries
create index ui_schemas_version_idx on public.ui_schemas (tenant_id, screen_name, version desc);

-- Create trigger for updated_at (reuse existing function)
drop trigger if exists ui_schemas_updated_at on public.ui_schemas;
create trigger ui_schemas_updated_at
  before update on public.ui_schemas
  for each row
  execute procedure public.handle_updated_at();

-- Enable RLS on the table
alter table public.ui_schemas enable row level security;

-- Create public read policy for UI schemas (similar to themes)
create policy public_read_ui_schemas on public.ui_schemas
  for select to anon, authenticated using (true);

-- Create policy for service role to manage schemas
create policy service_manage_ui_schemas on public.ui_schemas
  for all to service_role using (true);

-- Function to insert/update schema with versioning (race-condition safe)
create or replace function public.upsert_ui_schema(
  p_tenant_id text,
  p_screen_name text,
  p_schema_content jsonb
) returns uuid as $$
declare
  schema_id uuid;
  next_version integer;
begin
  -- Lock the tenant/screen combination to prevent race conditions
  perform 1 from public.ui_schemas 
  where tenant_id = p_tenant_id and screen_name = p_screen_name 
  for update;
  
  -- Get next version number with lock
  select coalesce(max(version), 0) + 1
  into next_version
  from public.ui_schemas
  where tenant_id = p_tenant_id and screen_name = p_screen_name;
  
  -- Deactivate current active schema
  update public.ui_schemas
  set is_active = false
  where tenant_id = p_tenant_id 
    and screen_name = p_screen_name 
    and is_active = true;
  
  -- Insert new schema version
  insert into public.ui_schemas (tenant_id, screen_name, schema_content, version, is_active)
  values (p_tenant_id, p_screen_name, p_schema_content, next_version, true)
  returning id into schema_id;
  
  return schema_id;
exception
  when unique_violation then
    -- Retry logic could be added here or handle at application level
    raise exception 'Concurrent modification detected for tenant % screen %', p_tenant_id, p_screen_name;
end;
$$ language plpgsql security definer;