import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { takeRateLimit } from "@/lib/security/rateLimit";
import { verifyTurnstile } from "@/lib/security/captcha";
import { getRequestIp } from "@/lib/security/requestMeta";
import { trackEvent } from "@/lib/analytics/events";

const LeadSchema = z.object({
  slug: z.string().min(3),
  leadType: z.enum(["course_waitlist", "paid_beta", "client_inquiry"]),
  name: z.string().max(120).optional(),
  email: z.string().email(),
  note: z.string().max(1000).optional(),
  source: z.string().max(80).optional(),
  fingerprint: z.string().optional(),
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

  const payload = await req.json().catch(() => null);
  const parsed = LeadSchema.safeParse(payload);
  if (!parsed.success) return new Response(parsed.error.message, { status: 400 });
  if (parsed.data.honeypot) return new Response("Invalid request", { status: 400 });

  const ip = await getRequestIp();
  const rl = await takeRateLimit(`lead:${ip}:${parsed.data.fingerprint ?? "unknown"}`);
  if (!rl.allowed) return new Response("Too many requests", { status: 429 });

  const captchaOk = await verifyTurnstile(parsed.data.captchaToken);
  if (!captchaOk) return new Response("Captcha verification failed", { status: 400 });

  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .select("id, slug, category")
    .eq("slug", parsed.data.slug)
    .single();
  if (projectErr || !project) return new Response("Project not found", { status: 404 });

  const { error } = await supabase.from("project_leads").insert({
    project_id: project.id,
    lead_type: parsed.data.leadType,
    name: parsed.data.name,
    email: parsed.data.email,
    note: parsed.data.note,
    source: parsed.data.source ?? "project_detail",
    utm_source: parsed.data.utm_source,
    utm_medium: parsed.data.utm_medium,
    utm_campaign: parsed.data.utm_campaign,
    utm_content: parsed.data.utm_content,
    referrer: parsed.data.referrer,
    landing_path: parsed.data.landing_path,
    session_id: parsed.data.session_id,
  });
  if (error) return new Response(error.message, { status: 400 });

  await trackEvent({
    eventName: "lead_submit",
    projectSlug: project.slug,
    category: project.category,
    fingerprint: parsed.data.fingerprint,
    source: parsed.data.source ?? "project_detail",
    metadata: { leadType: parsed.data.leadType },
    utm_source: parsed.data.utm_source,
    utm_medium: parsed.data.utm_medium,
    utm_campaign: parsed.data.utm_campaign,
    utm_content: parsed.data.utm_content,
    referrer: parsed.data.referrer,
    landing_path: parsed.data.landing_path,
    session_id: parsed.data.session_id,
  });

  return new Response("OK");
}

