import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return new Response("Supabase not configured", { status: 503 });

  await supabase.auth.signOut();
  return new Response("OK");
}

