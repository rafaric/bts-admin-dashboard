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
      id, author, content, created_at, era, now_playing, bts_members, photos, tagged, parent,
      profiles:author ( id, name, avatar ),
      likes(count)
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const posts = data?.map((p: Record<string, unknown>) => ({
    ...p,
    likes_count: Array.isArray(p.likes) ? (p.likes[0] as { count: number })?.count ?? 0 : 0,
  }));

  return NextResponse.json(posts);
}
