import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const db = createSupabaseAdmin();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    { count: total },
    { count: opened },
    { count: pending },
    { count: simple },
    { count: superPacks },
    { data: byRarity },
    { data: recent },
  ] = await Promise.all([
    db.from("pack_log").select("id", { count: "exact", head: true }),
    db.from("pack_log").select("id", { count: "exact", head: true }).eq("opened", true),
    db.from("pack_log").select("id", { count: "exact", head: true }).eq("opened", false),
    db.from("pack_log").select("id", { count: "exact", head: true }).eq("pack_type", "simple"),
    db.from("pack_log").select("id", { count: "exact", head: true }).eq("pack_type", "super"),
    db.from("user_cards").select("cards(rarity)"),
    db.from("pack_log")
      .select("created_at, pack_type, activity, profiles!pack_log_user_id_fkey(name)")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const cards = (byRarity ?? []).reduce<Record<string, number>>((acc, row) => {
    const rarity = (row.cards as { rarity: string } | null)?.rarity;
    if (rarity) acc[rarity] = (acc[rarity] ?? 0) + 1;
    return acc;
  }, {});

  const recentMapped = (recent ?? []).map((r) => ({
    created_at: r.created_at,
    pack_type:  r.pack_type,
    activity:   r.activity,
    user_name:  (r.profiles as { name: string } | null)?.name ?? "—",
  }));

  return NextResponse.json({
    packs: { total, opened, pending, simple, super: superPacks },
    cards,
    recent: recentMapped,
  });
}
