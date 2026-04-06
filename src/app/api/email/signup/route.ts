import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { takeRateLimit } from "@/lib/security/rateLimit";
import { getRequestIp } from "@/lib/security/requestMeta";
import { verifyTurnstile } from "@/lib/security/captcha";
import { trackEvent } from "@/lib/analytics/events";
import { sendOpsAlert } from "@/lib/ops/alerts";

const EmailSignupBodySchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(200),
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
  if (!supabase) {
    await sendOpsAlert({
      title: "Supabase missing",
      message: "Email signup route called without Supabase env.",
    });
    return new Response("Supabase not configured", { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const parsed = EmailSignupBodySchema.safeParse(body);
  if (!parsed.success) return new Response(parsed.error.message, { status: 400 });

  const { name, email } = parsed.data;
  if (parsed.data.honeypot) return new Response("Invalid request", { status: 400 });
  const ip = await getRequestIp();
  const rl = await takeRateLimit(`email:${ip}:${parsed.data.fingerprint ?? "unknown"}`);
  if (!rl.allowed) return new Response("Too many requests", { status: 429 });

  const captchaOk = await verifyTurnstile(parsed.data.captchaToken);
  if (!captchaOk) return new Response("Captcha verification failed", { status: 400 });

  const { error } = await supabase.from("email_signups").insert({ name, email });

  function isDuplicateKeyError(err: unknown) {
    if (!err || typeof err !== "object") return false;
    const code = (err as { code?: string }).code;
    return code === "23505";
  }

  // If the email is already signed up, treat it as success (idempotent signup).
  if (error) {
    if (isDuplicateKeyError(error)) {
      return new Response("OK", { status: 200 });
    }
    return new Response(error.message, { status: 400 });
  }

  await trackEvent({
    eventName: "email_signup",
    source: "landing_email_capture",
    fingerprint: parsed.data.fingerprint,
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

