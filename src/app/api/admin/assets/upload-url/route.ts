import { z } from "zod";
import { requireAdminPermission } from "@/lib/auth/adminApi";
import { ACTIONS } from "@/lib/auth/permissions";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

const UploadSchema = z.object({
  filename: z.string().min(3).max(200),
  projectId: z.string().uuid(),
  contentType: z.string().min(3).max(120),
});

export async function POST(req: Request) {
  const auth = await requireAdminPermission(ACTIONS.ASSETS_UPLOAD);
  if (!auth.ok) return new Response(auth.message, { status: auth.status });

  const admin = getSupabaseAdminClient();
  if (!admin) return new Response("Supabase service role missing", { status: 503 });

  const payload = await req.json().catch(() => null);
  const parsed = UploadSchema.safeParse(payload);
  if (!parsed.success) return new Response(parsed.error.message, { status: 400 });

  const safeName = parsed.data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${parsed.data.projectId}/${Date.now()}-${safeName}`;

  const { data, error } = await admin.storage.from("project-assets").createSignedUploadUrl(path);
  if (error || !data) return new Response(error?.message ?? "Failed to create upload url", { status: 400 });

  const { data: publicData } = admin.storage.from("project-assets").getPublicUrl(path);
  return Response.json({
    path,
    token: data.token,
    signedUrl: data.signedUrl,
    publicUrl: publicData.publicUrl,
  });
}

