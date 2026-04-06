import { z } from "zod";
import { requireAdminPermission } from "@/lib/auth/adminApi";
import { ACTIONS } from "@/lib/auth/permissions";

const ProjectPatchSchema = z.object({
  name: z.string().min(3).max(180).optional(),
  slug: z.string().min(3).max(120).optional(),
  status: z.enum(["idea", "building", "testing", "live"]).optional(),
  category: z.enum(["SaaS", "Embedded Systems", "AI Tools", "Courses", "Experiments"]).optional(),
  progress: z.number().min(0).max(100).optional(),
  description: z.string().min(3).optional(),
  problem: z.string().min(3).optional(),
  why: z.string().min(3).optional(),
  next_step: z.string().min(3).optional(),
  monetization_stage: z.enum(["Free", "Paid", "MVP", "Scaled"]).optional(),
  tech_stack: z.array(z.string()).optional(),
  demo_type: z.enum(["iframe", "screenshots", "external"]).optional(),
  demo_url: z.string().nullable().optional(),
  demo_embed_url: z.string().nullable().optional(),
  screenshot_urls: z.array(z.string()).optional(),
  repo_url: z.string().nullable().optional(),
  course_waitlist_url: z.string().nullable().optional(),
  beta_url: z.string().nullable().optional(),
  client_inquiry_url: z.string().nullable().optional(),
});

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminPermission(ACTIONS.PROJECT_WRITE);
  if (!auth.ok) return new Response(auth.message, { status: auth.status });
  const { id } = await context.params;

  const payload = await req.json().catch(() => null);
  const parsed = ProjectPatchSchema.safeParse(payload);
  if (!parsed.success) return new Response(parsed.error.message, { status: 400 });

  const { data, error } = await auth.supabase
    .from("projects")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminPermission(ACTIONS.PROJECT_WRITE);
  if (!auth.ok) return new Response(auth.message, { status: auth.status });
  const { id } = await context.params;

  const { error } = await auth.supabase.from("projects").delete().eq("id", id);
  if (error) return new Response(error.message, { status: 400 });
  return new Response(null, { status: 204 });
}

