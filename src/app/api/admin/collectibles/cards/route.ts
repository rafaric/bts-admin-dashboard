import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const db = createSupabaseAdmin();
  const { data, error } = await db.from("cards").select("*").order("era").order("member").order("rarity");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const { name, member, era, rarity, image_url } = await req.json().catch(() => ({}));
  if (!name || !member || !era || !rarity) {
    return NextResponse.json({ error: "name, member, era y rarity son requeridos" }, { status: 400 });
  }

  const db = createSupabaseAdmin();
  const { data, error } = await db
    .from("cards")
    .insert({ name, member, era, rarity, image_url: image_url ?? null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
