import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/auth/permissions";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";

export type AdminRole = "admin" | "editor";

function allowedEmails() {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAdminSession() {
  const supabase = await getSupabaseServerAuthClient();
  if (!supabase) return { user: null, role: null as AdminRole | null };

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { user: null, role: null as AdminRole | null };

  const email = user.email?.toLowerCase() ?? "";
  let role: AdminRole | null = null;

  const { data: row } = await supabase.from("admin_users").select("role").eq("user_id", user.id).maybeSingle();
  if (row?.role === "admin" || row?.role === "editor") {
    role = row.role;
  } else if (allowedEmails().includes(email)) {
    role = "admin";
  }

  return { user, role };
}

export async function requireAdminRole() {
  const session = await getAdminSession();
  if (!session.user) redirect("/admin/login");
  if (!session.role) redirect("/");
  return {
    user: session.user,
    role: session.role as AdminRole,
  };
}

export async function requireAdminAction(action: string) {
  const session = await requireAdminRole();
  const supabase = await getSupabaseServerAuthClient();
  if (!supabase) redirect("/");
  const allowed = await checkPermission(supabase, session.user, session.role, action);
  if (!allowed) redirect("/admin");
  return session;
}

