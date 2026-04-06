import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = getSupabaseServerClient();
  let counts = {
    projects: 0,
    feedbackPending: 0,
    featureSubmitted: 0,
    leads: 0,
  };

  if (supabase) {
    const [projects, feedbackPending, featureSubmitted, leads] = await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("feedback").select("id", { count: "exact", head: true }).eq("visibility_status", "pending"),
      supabase.from("feature_requests").select("id", { count: "exact", head: true }).eq("status", "submitted"),
      supabase.from("project_leads").select("id", { count: "exact", head: true }),
    ]);
    counts = {
      projects: projects.count ?? 0,
      feedbackPending: feedbackPending.count ?? 0,
      featureSubmitted: featureSubmitted.count ?? 0,
      leads: leads.count ?? 0,
    };
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">V2 Operations Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Projects" value={counts.projects} />
        <Metric title="Pending feedback" value={counts.feedbackPending} />
        <Metric title="Submitted requests" value={counts.featureSubmitted} />
        <Metric title="Captured leads" value={counts.leads} />
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-muted-foreground">
        Next steps: update project media links, moderate feedback, and move feature requests across lifecycle.
        <div className="mt-4">
          <Link href="/admin/projects" className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-background">
            Manage projects
          </Link>
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}

