-- Create tenant_themes table
create table if not exists public.tenant_themes (
  id uuid default gen_random_uuid() primary key,
  tenant_id text not null unique,
  theme jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index automatically created for unique constraint on tenant_id

-- Create updated_at trigger function if it doesn't exist
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
drop trigger if exists tenant_themes_updated_at on public.tenant_themes;
create trigger tenant_themes_updated_at
  before update on public.tenant_themes
  for each row
  execute procedure public.handle_updated_at();

-- Enable RLS on the table
alter table public.tenant_themes enable row level security;

-- Create public read policy for themes
create policy public_read_themes on public.tenant_themes
  for select to anon, authenticated using (true);