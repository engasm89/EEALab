-- Fine-grained RBAC permissions for admin APIs

create table if not exists public.role_permissions (
  role text not null check (role in ('admin', 'editor')),
  action text not null,
  allowed boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (role, action)
);

alter table public.role_permissions enable row level security;

create policy if not exists role_permissions_select_authenticated
on public.role_permissions for select to authenticated
using (true);

create policy if not exists role_permissions_write_authenticated
on public.role_permissions for all to authenticated
using (true) with check (true);

insert into public.role_permissions (role, action, allowed) values
  ('admin', 'project.write', true),
  ('admin', 'moderation.feedback.update', true),
  ('admin', 'lifecycle.request.update', true),
  ('admin', 'analytics.read', true),
  ('admin', 'assets.upload', true),
  ('editor', 'project.write', true),
  ('editor', 'moderation.feedback.update', true),
  ('editor', 'lifecycle.request.update', true),
  ('editor', 'analytics.read', true),
  ('editor', 'assets.upload', false)
on conflict (role, action) do update set allowed = excluded.allowed;

