import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminModerationBoard } from "@/components/admin/AdminModerationBoard";

export default async function AdminModerationPage() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return <div className="text-sm text-muted">Supabase not configured.</div>;

  const [{ data: feedbackRows }, { data: requestRows }] = await Promise.all([
    supabase.from("feedback").select("id, comment, created_at, visibility_status, is_featured").order("created_at", { ascending: false }).limit(100),
    supabase.from("feature_requests").select("id, request_text, status, created_at").order("created_at", { ascending: false }).limit(20),
  ]);
  const { data: eventRows } = await supabase
    .from("project_events")
    .select("id, event_type, created_at, payload")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Moderation & Lifecycle</h1>
      <AdminModerationBoard feedbackRows={feedbackRows ?? []} requestRows={requestRows ?? []} eventRows={eventRows ?? []} />
    </div>
  );
}

