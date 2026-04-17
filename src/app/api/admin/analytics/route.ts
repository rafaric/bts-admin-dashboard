import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { MEMBER_KEY_TO_NAME, ERA_KEY_TO_LABEL } from "@/lib/constants";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const db = createSupabaseAdmin();
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();

  const [postsRaw, usersRaw, likesRaw] = await Promise.all([
    db.from("posts").select("created_at, bts_members, era").gte("created_at", since),
    db.from("profiles").select("created_at").gte("created_at", since),
    db.from("likes").select("created_at").gte("created_at", since),
  ]);

  // Build daily metrics map
  const dailyMap = new Map<string, { new_posts: number; new_users: number; interactions: number; logins: number }>();

  function getOrCreate(date: string) {
    if (!dailyMap.has(date)) {
      dailyMap.set(date, { new_posts: 0, new_users: 0, interactions: 0, logins: 0 });
    }
    return dailyMap.get(date)!;
  }

  postsRaw.data?.forEach((p: { created_at: string; bts_members: string[] | null; era: string | null }) => {
    const d = p.created_at.slice(0, 10);
    getOrCreate(d).new_posts++;
  });

  usersRaw.data?.forEach((u: { created_at: string }) => {
    const d = u.created_at.slice(0, 10);
    getOrCreate(d).new_users++;
  });

  likesRaw.data?.forEach((l: { created_at: string }) => {
    const d = l.created_at.slice(0, 10);
    getOrCreate(d).interactions++;
  });

  const daily = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }));

  // Member stats — normalize DB keys (e.g. "jhope") to display names (e.g. "J-Hope")
  const memberMap = new Map<string, number>();
  postsRaw.data?.forEach((p: { created_at: string; bts_members: string[] | null; era: string | null }) => {
    (p.bts_members ?? []).forEach((m: string) => {
      const name = MEMBER_KEY_TO_NAME[m] ?? m;
      memberMap.set(name, (memberMap.get(name) ?? 0) + 1);
    });
  });

  // Era stats — normalize DB keys (e.g. "hyyh") to display labels (e.g. "화양연화")
  const eraMap = new Map<string, number>();
  postsRaw.data?.forEach((p: { created_at: string; bts_members: string[] | null; era: string | null }) => {
    if (p.era) {
      const label = ERA_KEY_TO_LABEL[p.era] ?? p.era;
      eraMap.set(label, (eraMap.get(label) ?? 0) + 1);
    }
  });

  return NextResponse.json({
    daily,
    members: Array.from(memberMap.entries()).map(([member, posts]) => ({ member, posts })),
    eras:    Array.from(eraMap.entries()).map(([era, posts]) => ({ era, posts })),
  });
}
