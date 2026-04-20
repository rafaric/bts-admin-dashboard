import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const db = createSupabaseAdmin();
  const { data } = await db
    .from("profiles")
    .select("id, name, avatar")
    .ilike("name", `%${q}%`)
    .limit(8);

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const { recipient_id, pack_type, reason } = await req.json().catch(() => ({}));
  if (!recipient_id || !pack_type) {
    return NextResponse.json({ error: "recipient_id y pack_type requeridos" }, { status: 400 });
  }
  if (pack_type !== "simple" && pack_type !== "super") {
    return NextResponse.json({ error: "pack_type inválido" }, { status: 400 });
  }

  const db = createSupabaseAdmin();
  const { data: pack, error } = await db.from("pack_log").insert({
    user_id:   recipient_id,
    pack_type,
    activity:  `gift_${reason ?? "event"}`,
    opened:    false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pack });
}
