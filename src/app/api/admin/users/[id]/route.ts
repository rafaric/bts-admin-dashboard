import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createSupabaseAdmin } from "@/lib/supabase/server";

/** PATCH { action: "ban" | "unban" } */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const { action } = await request.json() as { action: "ban" | "unban" };

  const db = createSupabaseAdmin();
  const is_banned = action === "ban";

  const { error } = await db.from("profiles").update({ is_banned }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Record in audit log
  await db.from("audit_logs").insert({
    admin_id:      guard.adminId,
    admin_username: guard.adminUsername,
    action:        is_banned ? "ban_user" : "unban_user",
    target_id:     id,
    target_label:  id,
  });

  return NextResponse.json({ ok: true });
}

/** DELETE — permanently removes user from auth + profiles */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const db = createSupabaseAdmin();

  // Get username before deleting for audit trail
  const { data: profile } = await db.from("profiles").select("username").eq("id", id).single();

  const { error } = await db.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("audit_logs").insert({
    admin_id:       guard.adminId,
    admin_username: guard.adminUsername,
    action:         "ban_user",
    target_id:      id,
    target_label:   profile?.username ?? id,
    metadata:       { deleted: true },
  });

  return NextResponse.json({ ok: true });
}
