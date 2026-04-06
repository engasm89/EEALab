import { z } from "zod";
import { requireAdminPermission } from "@/lib/auth/adminApi";
import { ACTIONS } from "@/lib/auth/permissions";

const ProjectCreateSchema = z.object({
  slug: z.string().min(3).max(120),
  name: z.string().min(3).max(180),
  status: z.enum(["idea", "building", "testing", "live"]),
  category: z.enum(["SaaS", "Embedded Systems", "AI Tools", "Courses", "Experiments"]),
  progress: z.number().min(0).max(100),
  description: z.string().min(3),
  problem: z.string().min(3),
  why: z.string().min(3),
  next_step: z.string().min(3),
  monetization_stage: z.enum(["Free", "Paid", "MVP", "Scaled"]),
  tech_stack: z.array(z.string()).default([]),
  demo_type: z.enum(["iframe", "screenshots", "external"]).default("external"),
  demo_url: z.string().optional(),
  demo_embed_url: z.string().optional(),
  screenshot_urls: z.array(z.string()).default([]),
  repo_url: z.string().optional(),
  course_waitlist_url: z.string().optional(),
  beta_url: z.string().optional(),
  client_inquiry_url: z.string().optional(),
});

export async function GET() {
  const auth = await requireAdminPermission(ACTIONS.PROJECT_WRITE);
  if (!auth.ok) return new Response(auth.message, { status: auth.status });

  const { data, error } = await auth.supabase.from("projects").select("*").order("updated_at", { ascending: false });
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data ?? []);
}

export async function POST(req: Request) {
  const auth = await requireAdminPermission(ACTIONS.PROJECT_WRITE);
  if (!auth.ok) return new Response(auth.message, { status: auth.status });

  const payload = await req.json().catch(() => null);
  const parsed = ProjectCreateSchema.safeParse(payload);
  if (!parsed.success) return new Response(parsed.error.message, { status: 400 });

  const { error, data } = await auth.supabase.from("projects").insert(parsed.data).select("*").single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data, { status: 201 });
}

