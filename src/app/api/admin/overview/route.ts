import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const db = createSupabaseAdmin();

  const [users, posts, banned, activePosts, postsToday] = await Promise.all([
    db.from("profiles").select("id", { count: "exact", head: true }),
    db.from("posts").select("id", { count: "exact", head: true }),
    db.from("profiles").select("id", { count: "exact", head: true }).eq("is_banned", true),
    db.from("posts")
      .select("user_id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 86_400_000).toISOString()),
    db.from("posts")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date().toISOString().slice(0, 10)),
  ]);

  return NextResponse.json({
    total_users:         users.count    ?? 0,
    active_users_today:  activePosts.count ?? 0,
    total_posts:         posts.count    ?? 0,
    posts_today:         postsToday.count  ?? 0,
    banned_users:        banned.count   ?? 0,
    avg_session_minutes: 0,
  });
}
