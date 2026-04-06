import { z } from "zod";
import { requireAdminPermission } from "@/lib/auth/adminApi";
import { ACTIONS } from "@/lib/auth/permissions";

const FeatureStatusSchema = z.object({
  status: z.enum(["submitted", "planned", "in_progress", "shipped", "rejected"]),
  public_note: z.string().max(400).optional(),
  target_release: z.string().max(40).optional(),
});

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminPermission(ACTIONS.REQUEST_LIFECYCLE);
  if (!auth.ok) return new Response(auth.message, { status: auth.status });
  const { id } = await context.params;
  const payload = await req.json().catch(() => null);
  const parsed = FeatureStatusSchema.safeParse(payload);
  if (!parsed.success) return new Response(parsed.error.message, { status: 400 });

  const { data: row, error } = await auth.supabase
    .from("feature_requests")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return new Response(error.message, { status: 400 });

  await auth.supabase.from("project_events").insert({
    project_id: row.project_id,
    event_type: "feature_request_status_changed",
    actor_id: auth.user.id,
    payload: { feature_request_id: id, ...parsed.data },
  });

  return Response.json(row);
}

