import { z } from "zod";
import { requireAdminPermission } from "@/lib/auth/adminApi";
import { ACTIONS } from "@/lib/auth/permissions";

const BulkSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(200),
  action: z.enum(["approve", "reject"]),
});

export async function PATCH(req: Request) {
  const auth = await requireAdminPermission(ACTIONS.FEEDBACK_MODERATE);
  if (!auth.ok) return new Response(auth.message, { status: auth.status });

  const payload = await req.json().catch(() => null);
  const parsed = BulkSchema.safeParse(payload);
  if (!parsed.success) return new Response(parsed.error.message, { status: 400 });

  const visibility = parsed.data.action === "approve" ? "approved" : "rejected";
  const { error } = await auth.supabase
    .from("feedback")
    .update({
      visibility_status: visibility,
      moderated_by: auth.user.id,
      moderated_at: new Date().toISOString(),
    })
    .in("id", parsed.data.ids);
  if (error) return new Response(error.message, { status: 400 });

  return new Response("OK");
}

