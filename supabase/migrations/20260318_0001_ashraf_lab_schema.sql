-- Ashraf Engineering Lab schema (V1)
-- Run with Supabase CLI: `supabase db reset` or `supabase migration up`

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'project_status') then
    create type project_status as enum ('idea', 'building', 'testing', 'live');
  end if;

  if not exists (select 1 from pg_type where typname = 'project_category') then
    create type project_category as enum ('SaaS', 'Embedded Systems', 'AI Tools', 'Courses', 'Experiments');
  end if;

  if not exists (select 1 from pg_type where typname = 'monetization_stage') then
    create type monetization_stage as enum ('Free', 'Paid', 'MVP', 'Scaled');
  end if;
end $$;

-- Projects: the core object for active builds
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  status project_status not null default 'idea',
  category project_category not null,
  progress smallint not null default 0 check (progress >= 0 and progress <= 100),
  description text not null,
  problem text not null,
  why text not null,
  next_step text not null,
  monetization_stage monetization_stage not null default 'Free',
  tech_stack text[] not null default '{}',
  demo_url text,
  github_url text,
  course_url text,
  preview_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_category_idx on public.projects(category);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

-- Build logs: chronological dev updates per project
create table if not exists public.build_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_at timestamptz not null default now(),
  phase text,
  message text not null
);

create index if not exists build_logs_project_created_at_idx
  on public.build_logs(project_id, created_at);

-- Upvotes (per anonymous fingerprint)
create table if not exists public.upvotes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  fingerprint text not null,
  created_at timestamptz not null default now(),
  unique(project_id, fingerprint)
);

create index if not exists upvotes_project_idx on public.upvotes(project_id);

-- Feature requests (per anonymous fingerprint)
create table if not exists public.feature_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  fingerprint text not null,
  request_text text not null,
  created_at timestamptz not null default now(),
  unique(project_id, fingerprint)
);

create index if not exists feature_requests_project_idx on public.feature_requests(project_id);

-- Feedback/comments (write-only for anon; internal visibility for authenticated)
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  fingerprint text,
  comment text not null,
  created_at timestamptz not null default now()
);

create index if not exists feedback_project_idx on public.feedback(project_id);

-- Email capture (unique by email)
create table if not exists public.email_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.projects enable row level security;
alter table public.build_logs enable row level security;
alter table public.upvotes enable row level security;
alter table public.feature_requests enable row level security;
alter table public.feedback enable row level security;
alter table public.email_signups enable row level security;

-- Read: public can browse projects and build logs
create policy projects_select_public
on public.projects for select
using (true);

create policy build_logs_select_public
on public.build_logs for select
using (true);

-- Upvotes: allow anon inserts + public reads for counting
create policy upvotes_insert_public
on public.upvotes for insert
with check (fingerprint is not null and length(fingerprint) >= 8);

create policy upvotes_select_public
on public.upvotes for select
using (true);

-- Feature requests: allow anon inserts + public reads for counting
create policy feature_requests_insert_public
on public.feature_requests for insert
with check (fingerprint is not null and length(fingerprint) >= 8 and length(request_text) >= 3);

create policy feature_requests_select_public
on public.feature_requests for select
using (true);

-- Feedback: anon can insert, authenticated can read internally (V1: don't display publicly)
create policy feedback_insert_public
on public.feedback for insert
with check (length(comment) >= 3);

create policy feedback_select_authenticated
on public.feedback for select
to authenticated
using (true);

-- Email signup: allow anon inserts, authenticated can read internally
create policy email_signups_insert_public
on public.email_signups for insert
with check (email is not null and length(email) >= 5);

create policy email_signups_select_authenticated
on public.email_signups for select
to authenticated
using (true);

-- Writes to projects/build_logs should happen from authenticated admin flows.
-- (Supabase UI and your backend calls will run as authenticated.)
create policy projects_write_authenticated
on public.projects for all
to authenticated
using (true)
with check (true);

create policy build_logs_write_authenticated
on public.build_logs for all
to authenticated
using (true)
with check (true);

