import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const db = createSupabaseAdmin();

  const { data: post } = await db.from("posts").select("user_id, content").eq("id", id).single();
  const { error } = await db.from("posts").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("audit_logs").insert({
    admin_id:       guard.adminId,
    admin_username: guard.adminUsername,
    action:         "delete_post",
    target_id:      id,
    target_label:   (post?.content ?? "").slice(0, 60),
  });

  return NextResponse.json({ ok: true });
}
