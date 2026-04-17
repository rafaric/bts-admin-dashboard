import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const db = createSupabaseAdmin();

  const { data: profiles, error } = await db
    .from("profiles")
    .select("id, name, avatar, cover, about, army_since, bias, bias_wrecker, fav_song, fav_album, is_admin, is_banned")
    .order("id", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch emails from auth.users via admin API
  const { data: authUsers } = await db.auth.admin.listUsers({ perPage: 1000 });
  type AuthUserEntry = { id: string; email: string | null; last_sign_in_at: string | null };
  const emailMap = new Map<string, AuthUserEntry>(
    (authUsers?.users ?? []).map((u: { id: string; email?: string; last_sign_in_at?: string }) => [
      u.id,
      { id: u.id, email: u.email ?? null, last_sign_in_at: u.last_sign_in_at ?? null },
    ]),
  );

  const enriched = profiles?.map((p: { id: string; [key: string]: unknown }) => ({
    ...p,
    email:           emailMap.get(p.id)?.email            ?? null,
    last_sign_in_at: emailMap.get(p.id)?.last_sign_in_at  ?? null,
  }));

  return NextResponse.json(enriched);
}
