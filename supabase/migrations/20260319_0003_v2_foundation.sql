-- V2 foundation: admin auth roles, moderation, lifecycle, assets, leads, analytics

do $$
begin
  if not exists (select 1 from pg_type where typname = 'demo_type') then
    create type demo_type as enum ('iframe', 'screenshots', 'external');
  end if;

  if not exists (select 1 from pg_type where typname = 'feedback_visibility') then
    create type feedback_visibility as enum ('pending', 'approved', 'rejected');
  end if;

  if not exists (select 1 from pg_type where typname = 'request_status') then
    create type request_status as enum ('submitted', 'planned', 'in_progress', 'shipped', 'rejected');
  end if;

  if not exists (select 1 from pg_type where typname = 'lead_type') then
    create type lead_type as enum ('course_waitlist', 'paid_beta', 'client_inquiry');
  end if;
end $$;

alter table public.projects
  add column if not exists demo_type demo_type default 'external',
  add column if not exists demo_embed_url text,
  add column if not exists screenshot_urls text[] not null default '{}',
  add column if not exists repo_url text,
  add column if not exists course_waitlist_url text,
  add column if not exists beta_url text,
  add column if not exists client_inquiry_url text;

alter table public.feature_requests
  add column if not exists status request_status not null default 'submitted',
  add column if not exists public_note text,
  add column if not exists target_release text;

alter table public.feedback
  add column if not exists visibility_status feedback_visibility not null default 'pending',
  add column if not exists is_featured boolean not null default false,
  add column if not exists moderated_by uuid,
  add column if not exists moderated_at timestamptz,
  add column if not exists moderation_note text;

create table if not exists public.project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  asset_type text not null, -- screenshot | video | link
  url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists project_assets_project_idx on public.project_assets(project_id, sort_order);

create table if not exists public.project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  event_type text not null,
  actor_id uuid,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists project_events_project_idx on public.project_events(project_id, created_at desc);

create table if not exists public.project_leads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  lead_type lead_type not null,
  name text,
  email text not null,
  note text,
  source text,
  created_at timestamptz not null default now()
);

create index if not exists project_leads_project_idx on public.project_leads(project_id, lead_type);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  project_slug text,
  category text,
  fingerprint text,
  source text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_name_idx on public.analytics_events(event_name, created_at desc);

-- Admin role mapping to auth.users
create table if not exists public.admin_users (
  user_id uuid primary key,
  role text not null check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.project_assets enable row level security;
alter table public.project_events enable row level security;
alter table public.project_leads enable row level security;
alter table public.analytics_events enable row level security;
alter table public.admin_users enable row level security;

-- Public read where needed
create policy if not exists project_assets_select_public
on public.project_assets for select
using (true);

create policy if not exists feature_requests_select_public_v2
on public.feature_requests for select
using (true);

create policy if not exists feedback_select_public_approved
on public.feedback for select
using (visibility_status = 'approved');

-- Public inserts (funnels + analytics)
create policy if not exists project_leads_insert_public
on public.project_leads for insert
with check (email is not null and length(email) >= 5);

create policy if not exists analytics_insert_public
on public.analytics_events for insert
with check (length(event_name) >= 3);

-- Authenticated moderation/editor controls
create policy if not exists project_assets_write_authenticated
on public.project_assets for all to authenticated
using (true) with check (true);

create policy if not exists project_events_write_authenticated
on public.project_events for all to authenticated
using (true) with check (true);

create policy if not exists project_leads_select_authenticated
on public.project_leads for select to authenticated
using (true);

create policy if not exists analytics_select_authenticated
on public.analytics_events for select to authenticated
using (true);

create policy if not exists admin_users_select_authenticated
on public.admin_users for select to authenticated
using (true);

create policy if not exists admin_users_write_authenticated
on public.admin_users for all to authenticated
using (true) with check (true);

-- Allow authenticated editors/admins to update moderation/lifecycle fields
create policy if not exists feature_requests_write_authenticated_v2
on public.feature_requests for update to authenticated
using (true) with check (true);

create policy if not exists feedback_write_authenticated_v2
on public.feedback for update to authenticated
using (true) with check (true);

