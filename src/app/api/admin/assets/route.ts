import { z } from "zod";
import { requireAdminPermission } from "@/lib/auth/adminApi";
import { ACTIONS } from "@/lib/auth/permissions";

const AssetCreateSchema = z.object({
  project_id: z.string().uuid(),
  asset_type: z.enum(["screenshot", "video", "link"]),
  url: z.string().url(),
  caption: z.string().max(200).optional(),
  sort_order: z.number().int().min(0).default(0),
});

const AssetDeleteSchema = z.object({
  id: z.string().uuid(),
});

export async function POST(req: Request) {
  const auth = await requireAdminPermission(ACTIONS.ASSETS_UPLOAD);
  if (!auth.ok) return new Response(auth.message, { status: auth.status });
  const payload = await req.json().catch(() => null);
  const parsed = AssetCreateSchema.safeParse(payload);
  if (!parsed.success) return new Response(parsed.error.message, { status: 400 });

  const { data, error } = await auth.supabase.from("project_assets").insert(parsed.data).select("*").single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data, { status: 201 });
}

export async function DELETE(req: Request) {
  const auth = await requireAdminPermission(ACTIONS.ASSETS_UPLOAD);
  if (!auth.ok) return new Response(auth.message, { status: auth.status });
  const payload = await req.json().catch(() => null);
  const parsed = AssetDeleteSchema.safeParse(payload);
  if (!parsed.success) return new Response(parsed.error.message, { status: 400 });

  const { error } = await auth.supabase.from("project_assets").delete().eq("id", parsed.data.id);
  if (error) return new Response(error.message, { status: 400 });
  return new Response(null, { status: 204 });
}

