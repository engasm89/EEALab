-- V2 analytics reporting views

create or replace view public.v_event_counts_by_project as
select
  coalesce(project_slug, 'unknown') as project_slug,
  event_name,
  count(*)::bigint as total_events
from public.analytics_events
group by 1, 2;

create or replace view public.v_conversion_by_category as
select
  coalesce(category, 'unknown') as category,
  count(*) filter (where event_name = 'project_open_click')::bigint as project_opens,
  count(*) filter (where event_name = 'email_signup')::bigint as email_signups,
  count(*) filter (where event_name = 'lead_submit')::bigint as lead_submits
from public.analytics_events
group by 1;

