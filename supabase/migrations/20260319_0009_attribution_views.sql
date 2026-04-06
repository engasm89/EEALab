create or replace view public.v_conversion_by_source as
select
  coalesce(utm_source, 'direct') as utm_source,
  coalesce(utm_medium, 'none') as utm_medium,
  coalesce(utm_campaign, 'none') as utm_campaign,
  count(*) filter (where event_name = 'project_open_click')::bigint as project_opens,
  count(*) filter (where event_name = 'email_signup')::bigint as email_signups,
  count(*) filter (where event_name = 'lead_submit')::bigint as lead_submits
from public.analytics_events
group by 1, 2, 3;

