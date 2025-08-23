-- Add name column to tenant_themes table
alter table public.tenant_themes add column name text;

-- Update existing data with proper app names
update public.tenant_themes 
set name = 'Tenant A name'
where tenant_id = 'tenantA';

update public.tenant_themes 
set name = 'Tenant B name'
where tenant_id = 'tenantB';

-- Make name column not null after updating existing data
alter table public.tenant_themes alter column name set not null;