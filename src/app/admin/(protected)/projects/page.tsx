import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminProjectsPage() {
  const supabase = getSupabaseServerClient();
  const { data: projects } = supabase
    ? await supabase.from("projects").select("id, slug, name, status, progress, updated_at").order("updated_at", { ascending: false })
    : { data: [] };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-muted">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Progress</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {(projects ?? []).map((p) => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.status}</td>
                <td className="px-4 py-3">{p.progress}%</td>
                <td className="px-4 py-3">{new Date(p.updated_at).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <Link className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs" href={`/admin/projects/${p.id}/edit`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

