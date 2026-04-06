import { z } from "zod";
import { trackEvent } from "@/lib/analytics/events";
import { takeRateLimit } from "@/lib/security/rateLimit";
import { getRequestIp } from "@/lib/security/requestMeta";

const EventSchema = z.object({
  eventName: z.string().min(3).max(80),
  projectSlug: z.string().max(120).optional(),
  category: z.string().max(80).optional(),
  fingerprint: z.string().max(200).optional(),
  source: z.string().max(80).optional(),
  utm_source: z.string().max(120).optional(),
  utm_medium: z.string().max(120).optional(),
  utm_campaign: z.string().max(160).optional(),
  utm_content: z.string().max(200).optional(),
  referrer: z.string().max(500).optional(),
  landing_path: z.string().max(200).optional(),
  session_id: z.string().max(120).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null);
  const parsed = EventSchema.safeParse(payload);
  if (!parsed.success) return new Response(parsed.error.message, { status: 400 });

  const ip = await getRequestIp();
  const rl = await takeRateLimit(`analytics:${ip}:${parsed.data.fingerprint ?? "unknown"}`);
  if (!rl.allowed) return new Response("Too many requests", { status: 429 });

  await trackEvent(parsed.data);
  return new Response("OK");
}

