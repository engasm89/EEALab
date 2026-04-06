import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import { checkPermission } from "@/lib/auth/permissions";

function allowedEmails() {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdminForApi() {
  const supabase = await getSupabaseServerAuthClient();
  if (!supabase) return { ok: false as const, status: 503, message: "Supabase not configured" };

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { ok: false as const, status: 401, message: "Unauthorized" };

  const { data: row } = await supabase.from("admin_users").select("role").eq("user_id", user.id).maybeSingle();
  const emailAllowed = allowedEmails().includes((user.email ?? "").toLowerCase());
  const role = row?.role;
  if (!emailAllowed && role !== "admin" && role !== "editor") {
    return { ok: false as const, status: 403, message: "Forbidden" };
  }

  return { ok: true as const, supabase, user, role: (role ?? "admin") as "admin" | "editor" };
}

export async function requireAdminPermission(action: string) {
  const auth = await requireAdminForApi();
  if (!auth.ok) return auth;

  const allowed = await checkPermission(auth.supabase, auth.user, auth.role, action);
  if (!allowed) return { ok: false as const, status: 403, message: "Forbidden: missing permission" };

  return auth;
}

