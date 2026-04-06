import type {
  BuildLogEntry,
  FeatureRequest,
  FeedbackItem,
  Project,
  ProjectAsset,
  ProjectCategory,
} from "@/lib/types";
import { seedBuildLogs, seedProjects } from "@/lib/seed/seedData";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const allCategories: ProjectCategory[] = ["SaaS", "Embedded Systems", "AI Tools", "Courses", "Experiments"];

export async function listProjects(params?: { category?: ProjectCategory }) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    const projects = [...seedProjects];
    return params?.category ? projects.filter((p) => p.category === params.category) : projects;
  }

  // Keep V1 simple: read from `projects` ordered by newest update.
  let query = supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(5);

  if (params?.category) query = query.eq("category", params.category);

  const { data, error } = await query;
  if (error) return params?.category ? seedProjects.filter((p) => p.category === params.category) : seedProjects;

  return (data ?? []) as Project[];
}

export async function getProjectBySlug(slug: string) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return seedProjects.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).single();
  if (error || !data) return null;
  return data as Project;
}

export async function getBuildLogForProject(projectId: string) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return seedBuildLogs
      .filter((l) => l.project_id === projectId)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  }

  const { data, error } = await supabase
    .from("build_logs")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) return seedBuildLogs.filter((l) => l.project_id === projectId);
  return (data ?? []) as BuildLogEntry[];
}

export async function getProjectCounts(projectId: string) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    // Seed placeholder numbers so the UI still feels alive.
    return { upvotes: 0, featureRequests: 0 };
  }

  // Use `head:true` to only return a count and avoid pulling full rows.
  const upvoteRes = await supabase
    .from("upvotes")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId);

  const featureRes = await supabase
    .from("feature_requests")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId);

  return {
    upvotes: upvoteRes.count ?? 0,
    featureRequests: featureRes.count ?? 0,
  };
}

export async function getProjectAssets(projectId: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const project = seedProjects.find((p) => p.id === projectId);
    return (project?.screenshot_urls ?? []).map((url, idx) => ({
      id: `${projectId}-${idx}`,
      project_id: projectId,
      asset_type: "screenshot",
      url,
      caption: "Screenshot",
      sort_order: idx,
      created_at: new Date().toISOString(),
    })) as ProjectAsset[];
  }

  const { data, error } = await supabase
    .from("project_assets")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data ?? []) as ProjectAsset[];
}

export async function getPublicFeedback(projectId: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [] as FeedbackItem[];

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("project_id", projectId)
    .eq("visibility_status", "approved")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) return [];
  return (data ?? []) as FeedbackItem[];
}

export async function getFeatureRequestsByProject(projectId: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [] as FeatureRequest[];

  const { data, error } = await supabase
    .from("feature_requests")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) return [];
  return (data ?? []) as FeatureRequest[];
}

export async function getRecentlyShippedFeatureRequests(limit = 5) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [] as Array<FeatureRequest & { project_slug?: string; project_name?: string }>;

  const { data, error } = await supabase
    .from("feature_requests")
    .select("*, projects!inner(slug,name)")
    .eq("status", "shipped")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];

  return (data ?? []).map((row) => {
    const typed = row as FeatureRequest & { projects?: { slug?: string; name?: string } };
    return {
      ...typed,
      project_slug: typed.projects?.slug,
      project_name: typed.projects?.name,
    };
  }) as Array<FeatureRequest & { project_slug?: string; project_name?: string }>;
}

export function getAllCategories(): ProjectCategory[] {
  return allCategories;
}

