import { notFound } from "next/navigation";
import { AdminProjectEditor } from "@/components/admin/AdminProjectEditor";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();
  if (!supabase) return <div className="text-sm text-muted">Supabase not configured.</div>;

  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error || !data) notFound();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Edit project</h1>
      <AdminProjectEditor project={data} />
    </div>
  );
}

