import Link from "next/link";
import { requireAdminAction } from "@/lib/auth/admin";
import { ACTIONS } from "@/lib/auth/permissions";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; source?: string; event?: string }>;
}) {
  await requireAdminAction(ACTIONS.ANALYTICS_READ);
  const params = await searchParams;
  const supabase = getSupabaseServerClient();
  if (!supabase) return <div className="text-sm text-muted">Supabase not configured.</div>;

  let eventsQuery = supabase
    .from("analytics_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (params.project) eventsQuery = eventsQuery.eq("project_slug", params.project);
  if (params.source) eventsQuery = eventsQuery.eq("source", params.source);
  if (params.event) eventsQuery = eventsQuery.eq("event_name", params.event);

  const [{ data: projectCounts }, { data: categoryConversion }, { data: sourceConversion }, { data: events }] = await Promise.all([
    supabase.from("v_event_counts_by_project").select("*").limit(200),
    supabase.from("v_conversion_by_category").select("*").limit(50),
    supabase.from("v_conversion_by_source").select("*").limit(100),
    eventsQuery,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytics</h1>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-muted">
        <div className="flex flex-wrap gap-2">
          <FilterLink label="All" href="/admin/analytics" />
          <FilterLink label="Email signups" href="/admin/analytics?event=email_signup" />
          <FilterLink label="Lead submits" href="/admin/analytics?event=lead_submit" />
          <FilterLink label="Project opens" href="/admin/analytics?event=project_open_click" />
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Top Project Event Counts</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {(projectCounts ?? []).slice(0, 10).map((row, idx) => (
            <div key={`${row.project_slug}-${row.event_name}-${idx}`} className="rounded-xl border border-white/10 bg-background/20 p-3">
              <div className="text-sm font-semibold">{row.project_slug}</div>
              <div className="text-xs text-muted">{row.event_name}</div>
              <div className="mt-1 text-xl font-semibold">{row.total_events}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Conversion by Category</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-muted">
              <tr>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Project Opens</th>
                <th className="px-3 py-2 text-left">Email Signups</th>
                <th className="px-3 py-2 text-left">Lead Submits</th>
              </tr>
            </thead>
            <tbody>
              {(categoryConversion ?? []).map((row) => (
                <tr key={row.category} className="border-t border-white/10">
                  <td className="px-3 py-2">{row.category}</td>
                  <td className="px-3 py-2">{row.project_opens}</td>
                  <td className="px-3 py-2">{row.email_signups}</td>
                  <td className="px-3 py-2">{row.lead_submits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Conversion by Source/Campaign</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-muted">
              <tr>
                <th className="px-3 py-2 text-left">Source</th>
                <th className="px-3 py-2 text-left">Medium</th>
                <th className="px-3 py-2 text-left">Campaign</th>
                <th className="px-3 py-2 text-left">Opens</th>
                <th className="px-3 py-2 text-left">Signups</th>
                <th className="px-3 py-2 text-left">Leads</th>
              </tr>
            </thead>
            <tbody>
              {(sourceConversion ?? []).map((row, idx) => (
                <tr key={`${row.utm_source}-${row.utm_campaign}-${idx}`} className="border-t border-white/10">
                  <td className="px-3 py-2">{row.utm_source}</td>
                  <td className="px-3 py-2">{row.utm_medium}</td>
                  <td className="px-3 py-2">{row.utm_campaign}</td>
                  <td className="px-3 py-2">{row.project_opens}</td>
                  <td className="px-3 py-2">{row.email_signups}</td>
                  <td className="px-3 py-2">{row.lead_submits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Recent Event Stream</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-xs">
            <thead className="bg-white/5 text-muted">
              <tr>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">Event</th>
                <th className="px-3 py-2 text-left">Project</th>
                <th className="px-3 py-2 text-left">Source</th>
                <th className="px-3 py-2 text-left">Campaign</th>
              </tr>
            </thead>
            <tbody>
              {(events ?? []).map((e) => (
                <tr key={e.id} className="border-t border-white/10">
                  <td className="px-3 py-2">{new Date(e.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">{e.event_name}</td>
                  <td className="px-3 py-2">{e.project_slug ?? "-"}</td>
                  <td className="px-3 py-2">{e.source ?? "-"}</td>
                  <td className="px-3 py-2">{e.utm_campaign ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function FilterLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
      {label}
    </Link>
  );
}

