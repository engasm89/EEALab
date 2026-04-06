import type { SupabaseClient, User } from "@supabase/supabase-js";

export const ACTIONS = {
  PROJECT_WRITE: "project.write",
  FEEDBACK_MODERATE: "moderation.feedback.update",
  REQUEST_LIFECYCLE: "lifecycle.request.update",
  ANALYTICS_READ: "analytics.read",
  ASSETS_UPLOAD: "assets.upload",
} as const;

export async function checkPermission(
  supabase: SupabaseClient,
  user: User,
  role: "admin" | "editor",
  action: string
) {
  if (role === "admin") return true;

  const { data } = await supabase
    .from("role_permissions")
    .select("allowed")
    .eq("role", role)
    .eq("action", action)
    .maybeSingle();

  if (data?.allowed === true) return true;
  return false;
}

