import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const db = createSupabaseAdmin();

  const { data, error } = await db
    .from("posts")
    .select(`
      id, user_id, content, image_url, tagged_members, era, created_at,
      profiles:user_id ( id, name, avatar ),
      likes:likes(count)
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const posts = data?.map((p: Record<string, unknown>) => ({
    ...p,
    author:      Array.isArray(p.profiles) ? p.profiles[0] : p.profiles,
    likes_count: Array.isArray(p.likes) ? (p.likes[0] as { count: number })?.count ?? 0 : 0,
  }));

  return NextResponse.json(posts);
}
