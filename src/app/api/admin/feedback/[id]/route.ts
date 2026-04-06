import { z } from "zod";
import { requireAdminPermission } from "@/lib/auth/adminApi";
import { ACTIONS } from "@/lib/auth/permissions";

const FeedbackModerationSchema = z.object({
  visibility_status: z.enum(["pending", "approved", "rejected"]),
  is_featured: z.boolean().optional(),
  moderation_note: z.string().max(400).optional(),
});

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminPermission(ACTIONS.FEEDBACK_MODERATE);
  if (!auth.ok) return new Response(auth.message, { status: auth.status });
  const { id } = await context.params;

  const payload = await req.json().catch(() => null);
  const parsed = FeedbackModerationSchema.safeParse(payload);
  if (!parsed.success) return new Response(parsed.error.message, { status: 400 });

  const { data, error } = await auth.supabase
    .from("feedback")
    .update({
      ...parsed.data,
      moderated_by: auth.user.id,
      moderated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data);
}

