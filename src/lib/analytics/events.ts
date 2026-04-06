import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AnalyticsEventInput = {
  eventName: string;
  projectSlug?: string;
  category?: string;
  fingerprint?: string;
  source?: string;
  metadata?: Record<string, unknown>;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referrer?: string;
  landing_path?: string;
  session_id?: string;
};

export async function trackEvent(input: AnalyticsEventInput) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  await supabase.from("analytics_events").insert({
    event_name: input.eventName,
    project_slug: input.projectSlug,
    category: input.category,
    fingerprint: input.fingerprint,
    source: input.source,
    utm_source: input.utm_source,
    utm_medium: input.utm_medium,
    utm_campaign: input.utm_campaign,
    utm_content: input.utm_content,
    referrer: input.referrer,
    landing_path: input.landing_path,
    session_id: input.session_id,
    metadata: input.metadata ?? {},
  });
}

