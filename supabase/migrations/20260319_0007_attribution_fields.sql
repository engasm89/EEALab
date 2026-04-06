-- Attribution fields for analytics + leads

alter table public.analytics_events
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists referrer text,
  add column if not exists landing_path text,
  add column if not exists session_id text;

alter table public.project_leads
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists referrer text,
  add column if not exists landing_path text,
  add column if not exists session_id text;

create index if not exists analytics_events_campaign_idx
on public.analytics_events(utm_source, utm_medium, utm_campaign);

create index if not exists project_leads_campaign_idx
on public.project_leads(utm_source, utm_medium, utm_campaign);

