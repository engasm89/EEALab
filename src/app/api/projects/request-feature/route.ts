import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { takeRateLimit } from "@/lib/security/rateLimit";
import { getRequestIp } from "@/lib/security/requestMeta";
import { trackEvent } from "@/lib/analytics/events";

const RequestFeatureBodySchema = z.object({
  slug: z.string().min(3).max(120),
  fingerprint: z.string().min(8).max(200),
  requestText: z.string().min(10).max(2000),
  honeypot: z.string().optional(),
  utm_source: z.string().max(120).optional(),
  utm_medium: z.string().max(120).optional(),
  utm_campaign: z.string().max(160).optional(),
  utm_content: z.string().max(200).optional(),
  referrer: z.string().max(500).optional(),
  landing_path: z.string().max(200).optional(),
  session_id: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return new Response("Supabase not configured", { status: 503 });

  const body = await req.json().catch(() => null);
  const parsed = RequestFeatureBodySchema.safeParse(body);
  if (!parsed.success) return new Response(parsed.error.message, { status: 400 });

  const { slug, fingerprint, requestText } = parsed.data;
  if (parsed.data.honeypot) return new Response("Invalid request", { status: 400 });
  const ip = await getRequestIp();
  const rl = await takeRateLimit(`feature:${ip}:${fingerprint}`);
  if (!rl.allowed) return new Response("Too many requests", { status: 429 });

  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .single();

  if (projectErr || !project) return new Response("Project not found", { status: 404 });

  const { error } = await supabase.from("feature_requests").insert({
    project_id: project.id,
    fingerprint,
    request_text: requestText,
  });

  if (error) {
    // Unique constraint hit: already requested by this fingerprint.
    function isDuplicateKeyError(err: unknown) {
      if (!err || typeof err !== "object") return false;
      const code = (err as { code?: string }).code;
      return code === "23505";
    }

    if (isDuplicateKeyError(error)) return new Response("OK", { status: 200 });
    return new Response(error.message, { status: 400 });
  }

  await trackEvent({
    eventName: "feature_request_submit",
    projectSlug: slug,
    fingerprint,
    source: "project_detail",
    utm_source: parsed.data.utm_source,
    utm_medium: parsed.data.utm_medium,
    utm_campaign: parsed.data.utm_campaign,
    utm_content: parsed.data.utm_content,
    referrer: parsed.data.referrer,
    landing_path: parsed.data.landing_path,
    session_id: parsed.data.session_id,
  });

  return new Response("OK", { status: 200 });
}

