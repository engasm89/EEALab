import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { takeRateLimit } from "@/lib/security/rateLimit";
import { getRequestIp } from "@/lib/security/requestMeta";
import { verifyTurnstile } from "@/lib/security/captcha";
import { trackEvent } from "@/lib/analytics/events";

const FeedbackBodySchema = z.object({
  slug: z.string().min(3).max(120),
  fingerprint: z.string().min(8).max(200),
  comment: z.string().min(5).max(5000),
  captchaToken: z.string().optional(),
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
  const parsed = FeedbackBodySchema.safeParse(body);
  if (!parsed.success) return new Response(parsed.error.message, { status: 400 });

  const { slug, fingerprint, comment } = parsed.data;
  if (parsed.data.honeypot) return new Response("Invalid request", { status: 400 });
  const ip = await getRequestIp();
  const rl = await takeRateLimit(`feedback:${ip}:${fingerprint}`);
  if (!rl.allowed) return new Response("Too many requests", { status: 429 });

  const captchaOk = await verifyTurnstile(parsed.data.captchaToken);
  if (!captchaOk) return new Response("Captcha verification failed", { status: 400 });

  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .single();

  if (projectErr || !project) return new Response("Project not found", { status: 404 });

  const { error } = await supabase.from("feedback").insert({
    project_id: project.id,
    fingerprint,
    comment,
  });

  if (error) return new Response(error.message, { status: 400 });

  await trackEvent({
    eventName: "feedback_submit",
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

